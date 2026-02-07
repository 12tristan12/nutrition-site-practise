import json
from pathlib import Path
from urllib.parse import urlparse

def categories(file):
    path = Path(file)
    categoriesUniq = []

    with open(path, "r", encoding="utf-8") as fileopen:
        data = json.load(fileopen)

        for item in data["categories"]:
            url = item["url"]
            parsed = urlparse(url)
            first_category = parsed.path.strip("/").split("/")[0]

            if first_category not in categoriesUniq:
                categoriesUniq.append(first_category)

    # This writes the uniq categories into a new ffile
    output_path = path.parent / "unique_categories.json"
    with open(output_path, "w", encoding="utf-8") as outfile:
        json.dump(categoriesUniq, outfile, ensure_ascii=False, indent=2)

    return categoriesUniq


categories("scraper/output/selver_categories.json")

