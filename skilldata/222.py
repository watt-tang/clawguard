import asyncio
import csv
import json
import os
import re
import time
from urllib.parse import urlparse

from playwright.async_api import async_playwright
from tqdm import tqdm


OUT_DIR = os.path.dirname(os.path.abspath(__file__))
IN_CSV = os.path.join(OUT_DIR, "skills.csv")
OUT_CSV = os.path.join(OUT_DIR, "skills_enriched_222.csv")
OUT_JSON = os.path.join(OUT_DIR, "skills_enriched_222.json")
DEBUG_DIR = os.path.join(OUT_DIR, "debug_skill_pages222")

DOWNLOAD_HREF_RE = re.compile(
    r"https?://[^\"'> ]+/api/v1/download\?slug=[^\"'>& ]+",
    re.I,
)
GITHUB_REPO_RE = re.compile(r"^https?://github\.com/[^/]+/[^/#?]+/?$", re.I)

# -----------------------------
# 可调参数
# -----------------------------
CONCURRENCY = int(os.environ.get("CONCURRENCY", "200"))   # 并发数，先试 8，稳定后可升到 12/16
PAGE_TIMEOUT_MS = int(os.environ.get("PAGE_TIMEOUT_MS", "30000"))
SAVE_EVERY = int(os.environ.get("SAVE_EVERY", "1000"))   # 每处理多少条保存一次
HEADFUL = os.environ.get("HEADFUL", "").lower() in {"1", "true", "yes"}
SAVE_DEBUG_HTML = os.environ.get("SAVE_DEBUG_HTML", "").lower() in {"1", "true", "yes"}

# root / 容器里跑 chromium 常用参数
CHROMIUM_ARGS = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
]


def ensure_debug_dir():
    os.makedirs(DEBUG_DIR, exist_ok=True)


def read_input_csv(path: str):
    rows = []
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            url = (row.get("url") or "").strip()
            name = (row.get("name") or "").strip()
            if not url:
                continue
            rows.append({"name": name, "url": url})
    return rows


def safe_text(value):
    if value is None:
        return ""
    return " ".join(str(value).split()).strip()


def parse_owner_slug(url: str):
    """
    https://clawhub.ai/domjeff/key-guard -> owner=domjeff, slug=key-guard
    """
    try:
        path = urlparse(url).path.strip("/")
        parts = path.split("/")
        if len(parts) >= 2:
            return parts[0], parts[1]
    except Exception:
        pass
    return "", ""


def find_first_download_url_from_html(html: str):
    if not html:
        return ""
    m = DOWNLOAD_HREF_RE.search(html)
    return m.group(0) if m else ""


async def extract_meta_description(page):
    try:
        value = await page.locator("meta[name='description']").get_attribute(
            "content",
            timeout=1500,
        )
        return safe_text(value)
    except Exception:
        return ""


async def extract_page_title(page):
    try:
        title = await page.title()
        return safe_text(title)
    except Exception:
        return ""


async def extract_h1(page):
    selectors = [
        "h1",
        "[data-testid='skill-title']",
        ".skill-title",
        ".page-title",
    ]
    for sel in selectors:
        try:
            loc = page.locator(sel).first
            text = safe_text(await loc.inner_text(timeout=1500))
            if text:
                return text
        except Exception:
            pass
    return ""


async def extract_description(page):
    candidates = [
        "meta[name='description']",
        "[data-testid='skill-description']",
        ".skill-description",
        ".description",
        "article p",
        "main p",
    ]

    for sel in candidates:
        try:
            if sel.startswith("meta"):
                value = await page.locator(sel).get_attribute("content", timeout=1200)
                value = safe_text(value)
                if value:
                    return value
            else:
                loc = page.locator(sel).first
                text = safe_text(await loc.inner_text(timeout=1500))
                if text and len(text) >= 20:
                    return text
        except Exception:
            pass
    return ""


async def extract_download_url(page, html: str):
    selectors = [
        "a[href*='/api/v1/download']",
        "a.btn[href*='download']",
        "a:has-text('Download zip')",
        "a:has-text('Download')",
    ]

    for sel in selectors:
        try:
            loc = page.locator(sel).first
            href = await loc.get_attribute("href", timeout=1500)
            href = safe_text(href)
            if href and "/api/v1/download" in href:
                return href
        except Exception:
            pass

    return find_first_download_url_from_html(html)


async def extract_github_repo(page):
    try:
        links = await page.locator("a").evaluate_all(
            """
            (els) => els.map(a => a.href).filter(Boolean)
            """
        )
        for href in links:
            href = safe_text(href)
            if GITHUB_REPO_RE.match(href):
                return href
    except Exception:
        pass
    return ""


async def extract_author_text(page):
    possible_selectors = [
        "[data-testid='author']",
        ".author",
        ".creator",
        ".owner",
    ]
    for sel in possible_selectors:
        try:
            loc = page.locator(sel).first
            text = safe_text(await loc.inner_text(timeout=1200))
            if text:
                return text
        except Exception:
            pass
    return ""


def extract_text_excerpt(html: str, max_len: int = 400):
    if not html:
        return ""
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = safe_text(text)
    return text[:max_len]


async def dismiss_cookie_banner(page):
    labels = ["Accept", "I agree", "Agree", "OK", "Got it"]
    for label in labels:
        try:
            await page.get_by_role("button", name=label).click(timeout=800)
            await page.wait_for_timeout(200)
            break
        except Exception:
            pass


def write_csv(rows, path):
    fieldnames = [
        "name",
        "url",
        "owner",
        "slug",
        "title",
        "description",
        "download_url",
        "repo_url",
        "author_text",
        "page_title",
        "meta_description",
        "raw_html_excerpt",
        "status",
        "error",
    ]
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def write_json(rows, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)


async def block_unnecessary_resources(route):
    request = route.request
    resource_type = request.resource_type

    if resource_type in {"image", "media", "font"}:
        await route.abort()
        return

    await route.continue_()


async def scrape_detail(browser, item, save_debug=False):
    url = item["url"]
    input_name = item["name"]

    result = {
        "name": input_name,
        "url": url,
        "owner": "",
        "slug": "",
        "title": "",
        "description": "",
        "download_url": "",
        "repo_url": "",
        "author_text": "",
        "page_title": "",
        "meta_description": "",
        "raw_html_excerpt": "",
        "status": "ok",
        "error": "",
    }

    owner, slug = parse_owner_slug(url)
    result["owner"] = owner
    result["slug"] = slug

    context = None
    page = None

    try:
        context = await browser.new_context()
        await context.route("**/*", block_unnecessary_resources)

        page = await context.new_page()
        page.set_default_timeout(PAGE_TIMEOUT_MS)

        await page.goto(
            url,
            wait_until="domcontentloaded",
            timeout=PAGE_TIMEOUT_MS,
        )

        # 只给页面很短的“喘息”时间，不再像以前那样固定等 2.5 秒
        await page.wait_for_timeout(300)

        await dismiss_cookie_banner(page)

        # 尝试等待 body 存在，代替昂贵的 networkidle
        try:
            await page.locator("body").wait_for(timeout=2000)
        except Exception:
            pass

        html = await page.content()

        result["page_title"] = await extract_page_title(page)
        result["meta_description"] = await extract_meta_description(page)
        result["title"] = await extract_h1(page) or input_name or slug
        result["description"] = await extract_description(page) or result["meta_description"]
        result["download_url"] = await extract_download_url(page, html)
        result["repo_url"] = await extract_github_repo(page)
        result["author_text"] = await extract_author_text(page)
        result["raw_html_excerpt"] = extract_text_excerpt(html)

        if save_debug:
            safe_slug = slug or re.sub(r"[^a-zA-Z0-9_-]+", "_", owner + "_" + str(int(time.time())))
            debug_path = os.path.join(DEBUG_DIR, f"{safe_slug}.html")
            with open(debug_path, "w", encoding="utf-8") as f:
                f.write(html)

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)

    finally:
        if page is not None:
            try:
                await page.close()
            except Exception:
                pass
        if context is not None:
            try:
                await context.close()
            except Exception:
                pass

    return result


async def run_all(items):
    results = [None] * len(items)
    semaphore = asyncio.Semaphore(CONCURRENCY)
    pbar = tqdm(total=len(items), desc="Enriching skill detail pages", unit="skill")
    lock = asyncio.Lock()

    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=not HEADFUL,
            args=CHROMIUM_ARGS,
        )

        async def worker(idx, item):
            async with semaphore:
                row = await scrape_detail(browser, item, save_debug=SAVE_DEBUG_HTML)
                results[idx] = row

                async with lock:
                    pbar.update(1)

                    done_count = sum(1 for x in results if x is not None)
                    if done_count % SAVE_EVERY == 0:
                        partial_rows = [x for x in results if x is not None]
                        write_csv(partial_rows, OUT_CSV)
                        write_json(partial_rows, OUT_JSON)

        tasks = [asyncio.create_task(worker(i, item)) for i, item in enumerate(items)]
        await asyncio.gather(*tasks)

        await browser.close()
        pbar.close()

    return [x for x in results if x is not None]


async def main():
    ensure_debug_dir()

    items = read_input_csv(IN_CSV)
    if not items:
        print(f"No input rows found in {IN_CSV}")
        return

    start = time.time()
    results = await run_all(items)

    write_csv(results, OUT_CSV)
    write_json(results, OUT_JSON)

    ok_count = sum(1 for x in results if x["status"] == "ok")
    download_count = sum(1 for x in results if x["download_url"])
    elapsed = time.time() - start

    print(f"Done. Total: {len(results)}")
    print(f"OK: {ok_count}")
    print(f"Found download_url: {download_count}")
    print(f"Elapsed seconds: {elapsed:.2f}")
    print(f"Saved CSV: {OUT_CSV}")
    print(f"Saved JSON: {OUT_JSON}")


if __name__ == "__main__":
    asyncio.run(main())