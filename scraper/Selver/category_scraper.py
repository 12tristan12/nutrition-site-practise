import requests
import xml.etree.ElementTree as ET
from typing import List, Dict
from pathlib import Path
import json
from datetime import datetime
from urllib.parse import urlparse


SITEMAP_URL = "https://www.selver.ee/sitemap.xml"


def fetch_sitemap() -> str:
    response = requests.get(SITEMAP_URL, timeout=10)
    response.raise_for_status()
    return response.text


def extract_categories(xml_data: str):
    root = ET.fromstring(xml_data)
    ns = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    categories = []

    for url in root.findall("ns:url", ns):
        loc = url.find("ns:loc", ns)
        if loc is None:
            continue

        raw_url = loc.text.strip()

        if "/tooted/" not in raw_url:
            continue

        if raw_url.endswith("/tooted"):
            continue

        categories.append({
            "url": normalize_category_url(raw_url)
        })

    unique = {c["url"]: c for c in categories}
    return list(unique.values())



def save_categories(categories: List[Dict], filename="selver_categories.json"):
    
    Path("output").mkdir(exist_ok=True)

    payload = {
        "generated_at": datetime.utcnow().isoformat(),
        "category_count": len(categories),
        "categories": categories
    }

    path = Path("output") / filename

    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(categories)} categories to {path}")

def normalize_category_url(url: str) -> str:
    parsed = urlparse(url)
    path = parsed.path

    if path.startswith("//tooted/"):
        path = path.replace("//tooted/", "/", 1)
    elif path.startswith("/tooted/"):
        path = path.replace("/tooted/", "/", 1)
    elif path == "/tooted":
        path = "/"

    while "//" in path:
        path = path.replace("//", "/")

    return f"{parsed.scheme}://{parsed.netloc}{path}"




def main():
    print("Fetching Selver sitemap...")
    xml_data = fetch_sitemap()

    print("Extracting category URLs...")
    categories = extract_categories(xml_data)

    print(f"Found {len(categories)} categories")

    for c in categories[:10]:
        print("-", c["url"])

    save_categories(categories)


if __name__ == "__main__":
    main()
