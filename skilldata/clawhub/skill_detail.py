import csv
import json
import os
import re
import time
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright
from tqdm import tqdm


OUT_DIR = os.path.dirname(os.path.abspath(__file__))
IN_CSV = os.path.join(OUT_DIR, "skills.csv")
OUT_CSV = os.path.join(OUT_DIR, "skills_enriched.csv")
OUT_JSON = os.path.join(OUT_DIR, "skills_enriched.json")
DEBUG_DIR = os.path.join(OUT_DIR, "debug_skill_pages")


DOWNLOAD_HREF_RE = re.compile(r"https?://[^\"'> ]+/api/v1/download\?slug=[^\"'>& ]+", re.I)
GITHUB_REPO_RE = re.compile(r"^https?://github\.com/[^/]+/[^/#?]+/?$", re.I)


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


def extract_meta_description(page):
    try:
        return safe_text(
            page.locator("meta[name='description']").get_attribute("content", timeout=2000)
        )
    except Exception:
        return ""


def extract_page_title(page):
    try:
        return safe_text(page.title())
    except Exception:
        return ""


def extract_h1(page):
    selectors = [
        "h1",
        "[data-testid='skill-title']",
        ".skill-title",
        ".page-title",
    ]
    for sel in selectors:
        try:
            loc = page.locator(sel).first
            if loc.count() > 0:
                text = safe_text(loc.inner_text(timeout=2000))
                if text:
                    return text
        except Exception:
            pass
    return ""


def extract_description(page):
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
                value = page.locator(sel).get_attribute("content", timeout=1500)
                value = safe_text(value)
                if value:
                    return value
            else:
                loc = page.locator(sel).first
                if loc.count() > 0:
                    text = safe_text(loc.inner_text(timeout=2000))
                    if text and len(text) >= 20:
                        return text
        except Exception:
            pass
    return ""


def extract_download_url(page, html: str):
    # 1) 直接找 href 包含 /api/v1/download
    selectors = [
        "a[href*='/api/v1/download']",
        "a.btn[href*='download']",
        "a:has-text('Download zip')",
        "a:has-text('Download')",
    ]

    for sel in selectors:
        try:
            loc = page.locator(sel).first
            if loc.count() > 0:
                href = loc.get_attribute("href", timeout=2000)
                href = safe_text(href)
                if href and "/api/v1/download" in href:
                    return href
        except Exception:
            pass

    # 2) 从整页 HTML 正则兜底
    return find_first_download_url_from_html(html)


def extract_github_repo(page):
    try:
        links = page.locator("a").evaluate_all(
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


def extract_author_text(page):
    possible_selectors = [
        "[data-testid='author']",
        ".author",
        ".creator",
        ".owner",
    ]
    for sel in possible_selectors:
        try:
            loc = page.locator(sel).first
            if loc.count() > 0:
                text = safe_text(loc.inner_text(timeout=1500))
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


def scrape_detail(page, item, save_debug=False):
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

    try:
        page.goto(url, wait_until="domcontentloaded", timeout=60000)
        page.wait_for_timeout(2500)

        # 尝试处理 cookie/banner
        for label in ["Accept", "I agree", "Agree", "OK", "Got it"]:
            try:
                page.get_by_role("button", name=label).click(timeout=1000)
                page.wait_for_timeout(500)
                break
            except Exception:
                pass

        # 等页面稳定一点
        try:
            page.wait_for_load_state("networkidle", timeout=8000)
        except Exception:
            pass

        html = page.content()

        result["page_title"] = extract_page_title(page)
        result["meta_description"] = extract_meta_description(page)
        result["title"] = extract_h1(page) or input_name or slug
        result["description"] = extract_description(page) or result["meta_description"]
        result["download_url"] = extract_download_url(page, html)
        result["repo_url"] = extract_github_repo(page)
        result["author_text"] = extract_author_text(page)
        result["raw_html_excerpt"] = extract_text_excerpt(html)

        if save_debug:
            safe_slug = slug or re.sub(r"[^a-zA-Z0-9_-]+", "_", owner + "_" + str(int(time.time())))
            with open(
                os.path.join(DEBUG_DIR, f"{safe_slug}.html"),
                "w",
                encoding="utf-8",
            ) as f:
                f.write(html)

    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)

    return result


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


def main():
    ensure_debug_dir()

    items = read_input_csv(IN_CSV)
    if not items:
        print(f"No input rows found in {IN_CSV}")
        return

    results = []

    with sync_playwright() as p:
        headless = os.environ.get("HEADFUL", "").lower() not in {"1", "true", "yes"}
        browser = p.chromium.launch(headless=headless)
        context = browser.new_context()
        page = context.new_page()

        for item in tqdm(items, desc="Enriching skill detail pages", unit="skill"):
            row = scrape_detail(page, item, save_debug=False)
            results.append(row)

        browser.close()

    write_csv(results, OUT_CSV)
    write_json(results, OUT_JSON)

    ok_count = sum(1 for x in results if x["status"] == "ok")
    download_count = sum(1 for x in results if x["download_url"])

    print(f"Done. Total: {len(results)}")
    print(f"OK: {ok_count}")
    print(f"Found download_url: {download_count}")
    print(f"Saved CSV: {OUT_CSV}")
    print(f"Saved JSON: {OUT_JSON}")


if __name__ == "__main__":
    main()