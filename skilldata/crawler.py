import csv
import json
import os
import re
import time
from html.parser import HTMLParser
from urllib.parse import urljoin

from playwright.sync_api import sync_playwright
from tqdm import tqdm

URL = "https://clawhub.ai/skills?sort=downloads&dir=desc"
OUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUT_JSON = os.path.join(OUT_DIR, "skills.json")
OUT_CSV = os.path.join(OUT_DIR, "skills.csv")

# Skill detail links look like /owner/skill-slug
SKILL_HREF_RE = re.compile(r"^/[^/]+/[^/?#]+$")
COUNT_RE = re.compile(r"\((\d[\d,]*)\)")


def _normalize_name(text: str, href: str) -> str:
    text = (text or "").strip()
    if text:
        return " ".join(text.split())
    slug = href.rstrip("/").split("/")[-1]
    return slug.replace("-", " ")


def _format_seconds(seconds: float) -> str:
    if seconds is None or seconds < 0:
        return "unknown"
    seconds = int(seconds)
    h, rem = divmod(seconds, 3600)
    m, s = divmod(rem, 60)
    if h > 0:
        return f"{h:d}:{m:02d}:{s:02d}"
    return f"{m:02d}:{s:02d}"


class _SkillsHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = {}
        self._in_skill_a = False
        self._current_href = ""
        self._text_buf = []

    def handle_starttag(self, tag, attrs):
        if tag != "a":
            return
        attr = dict(attrs)
        href = attr.get("href", "")
        if SKILL_HREF_RE.search(href):
            self._in_skill_a = True
            self._current_href = href
            self._text_buf = []

    def handle_data(self, data):
        if self._in_skill_a and data:
            self._text_buf.append(data)

    def handle_endtag(self, tag):
        if tag != "a" or not self._in_skill_a:
            return
        href = self._current_href
        text = " ".join(" ".join(self._text_buf).split())
        name = _normalize_name(text, href)
        abs_url = urljoin(URL, href)
        self.items[abs_url] = {"name": name, "url": abs_url}
        self._in_skill_a = False
        self._current_href = ""
        self._text_buf = []


def _extract_skills_from_html(html: str):
    parser = _SkillsHTMLParser()
    parser.feed(html)
    return list(parser.items.values())


def _extract_skills_from_dom(page):
    # Traverse shadow roots to find anchors in client-rendered UIs.
    raw = page.evaluate(
        """
        () => {
          const results = [];
          const visit = (root) => {
            const anchors = root.querySelectorAll ? root.querySelectorAll("a.skills-row") : [];
            anchors.forEach(a => {
              const href = a.getAttribute("href") || "";
              if (!href) return;
              const title = a.querySelector(".skills-row-title span");
              const name = title ? title.textContent || "" : "";
              results.push({ href, name });
            });
            const nodes = root.querySelectorAll ? root.querySelectorAll("*") : [];
            nodes.forEach(n => { if (n.shadowRoot) visit(n.shadowRoot); });
          };
          visit(document);
          return results;
        }
        """
    )

    items = {}
    for a in raw:
        href = a.get("href") or ""
        if not SKILL_HREF_RE.search(href):
            continue
        abs_url = urljoin(URL, href)
        name = _normalize_name(a.get("name", ""), href)
        items[abs_url] = {"name": name, "url": abs_url}
    return list(items.values())


def _scroll_page(page):
    # Scroll window and any scrollable containers.
    page.evaluate(
        """
        () => {
          const scrollables = [];
          const nodes = Array.from(document.querySelectorAll("*"));
          for (const n of nodes) {
            const style = window.getComputedStyle(n);
            const canScroll = /(auto|scroll)/.test(style.overflowY);
            if (canScroll && n.scrollHeight > n.clientHeight) scrollables.push(n);
          }
          window.scrollTo(0, document.body.scrollHeight);
          for (const n of scrollables) n.scrollBy(0, n.clientHeight * 0.9);
        }
        """
    )


def _get_target_total(page):
    try:
        text = page.evaluate(
            """
            () => {
              const h1 = document.querySelector(".section-title");
              return h1 ? h1.textContent || "" : "";
            }
            """
        )
        m = COUNT_RE.search(text or "")
        if m:
            return int(m.group(1).replace(",", ""))
    except Exception:
        pass
    return None


def scrape(max_scrolls: int = 2000, stable_rounds: int = 8):
    with sync_playwright() as p:
        headless = os.environ.get("HEADFUL", "").lower() not in {"1", "true", "yes"}
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)

        # Allow client-side app to render.
        page.wait_for_timeout(3000)
        try:
            page.wait_for_selector("a.skills-row", timeout=20000)
        except Exception:
            pass

        # Try to dismiss common cookie banners without failing if not present.
        for label in ["Accept", "I agree", "Agree", "OK"]:
            try:
                page.get_by_role("button", name=label).click(timeout=1000)
                break
            except Exception:
                pass

        target_total = _get_target_total(page)

        last_count = 0
        stable = 0
        skills = []

        start_time = time.time()
        progress_total = target_total if target_total else max_scrolls

        with tqdm(
            total=progress_total,
            desc="Scraping skills",
            unit="skill" if target_total else "scroll",
            dynamic_ncols=True,
        ) as pbar:
            for i in range(max_scrolls):
                iter_start = time.time()

                _scroll_page(page)
                page.wait_for_timeout(1200)

                skills = _extract_skills_from_dom(page)
                if not skills:
                    skills = _extract_skills_from_html(page.content())

                current_count = len(skills)

                if current_count == last_count:
                    stable += 1
                else:
                    stable = 0

                # 更新进度条
                if target_total:
                    # 以技能数作为进度
                    delta = max(0, current_count - pbar.n)
                    if delta:
                        pbar.update(delta)
                    elapsed = time.time() - start_time
                    speed = current_count / elapsed if elapsed > 0 else 0
                    remaining_items = max(0, target_total - current_count)
                    eta_seconds = remaining_items / speed if speed > 0 else -1

                    pbar.set_postfix(
                        found=current_count,
                        target=target_total,
                        stable=f"{stable}/{stable_rounds}",
                        scroll=i + 1,
                        eta=_format_seconds(eta_seconds),
                    )
                else:
                    # 不知道总数时，以滚动轮数作为进度
                    pbar.update(1)
                    elapsed = time.time() - start_time
                    avg_iter = elapsed / (i + 1)
                    remaining_iters = max_scrolls - (i + 1)
                    eta_seconds = remaining_iters * avg_iter

                    pbar.set_postfix(
                        found=current_count,
                        stable=f"{stable}/{stable_rounds}",
                        eta=_format_seconds(eta_seconds),
                    )

                last_count = current_count

                if target_total and current_count >= target_total:
                    break
                if stable >= stable_rounds:
                    break

        if not skills:
            # Save debug artifacts to inspect what rendered.
            page.screenshot(path=os.path.join(OUT_DIR, "debug.png"), full_page=True)
            with open(os.path.join(OUT_DIR, "debug.html"), "w", encoding="utf-8") as f:
                f.write(page.content())

        browser.close()
        return skills


def main():
    skills = scrape()
    skills_sorted = sorted(skills, key=lambda x: x["name"].lower())

    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(skills_sorted, f, ensure_ascii=False, indent=2)

    with open(OUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "url"])
        writer.writeheader()
        writer.writerows(skills_sorted)

    print(f"Saved {len(skills_sorted)} skills to {OUT_JSON} and {OUT_CSV}")


if __name__ == "__main__":
    main()