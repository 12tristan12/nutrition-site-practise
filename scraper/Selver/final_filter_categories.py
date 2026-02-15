import json
import sys
from typing import List, Dict, Set
from pathlib import Path


FOOD_CATEGORIES = {
    "kuivained-hoidised",
    "joogid",
    "puu-ja-koogiviljad",
    "liha-ja-kalatooted",
    "piimatooted-munad-void",
    "juustud",
    "leivad-saiad-kondiitritooted",
    "valmistoidud",
    "maitseained-ja-puljongid",
    "kastmed-olid",
    "maiustused-kupsised-naksid",
    "kulmutatud-toidukaubad",
    "selveri-pagarid",
    "selver-gurmee",
    "peolauatooted",
    "kupsised",
}


def parse_url_to_path(url: str) -> List[str]:
    path = url.replace("https://www.selver.ee/", "").replace("http://www.selver.ee/", "")
    path = path.rstrip("/")
    return path.split("/") if path else []


def is_food_category(url: str, food_categories: Set[str]) -> bool:
    path = parse_url_to_path(url)
    if not path:
        return False
    return path[0] in food_categories


def get_category_depth(url: str) -> int:
    path = parse_url_to_path(url)
    return len(path)


def is_leaf_category(url: str, all_urls: List[str]) -> bool:
    url_normalized = url.rstrip("/")
    
    for other_url in all_urls:
        other_normalized = other_url.rstrip("/")
        if other_normalized != url_normalized and other_normalized.startswith(url_normalized + "/"):
            return False
    
    return True


def filter_to_leaf_categories(categories: List[Dict[str, str]]) -> List[Dict[str, str]]:
    all_urls = [cat["url"] for cat in categories]
    
    leaf_categories = []
    
    for category in categories:
        url = category["url"]
        if is_leaf_category(url, all_urls):
            leaf_categories.append(category)
    
    return leaf_categories


def analyze_categories(categories: List[Dict[str, str]], food_categories: Set[str]):
    
    root_counts = {}
    for cat in categories:
        path = parse_url_to_path(cat["url"])
        if path:
            root = path[0]
            root_counts[root] = root_counts.get(root, 0) + 1
    

    food_count = 0
    for root, count in sorted(root_counts.items()):
        if root in food_categories:
        
            food_count += count
    
    for root, count in sorted(root_counts.items()):
        if root not in food_categories:
            print(f"  ✗ {root}: {count} subcategories")


def main():
    if len(sys.argv) > 2:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
    elif len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_file = "scraper/output/food_categories_filtered.json"
    else:
        input_file = "scraper/output/selver_categories.json"
        output_file = "food_categories_filtered.json"

    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: Could not find '{input_file}'")
       
    
    categories = data.get("categories", [])
    
    if not categories:
        print(f"No 'categories' field found in {input_file}")
        sys.exit(1)
    
    
    analyze_categories(categories, FOOD_CATEGORIES)
    
    food_categories = [
        cat for cat in categories 
        if is_food_category(cat["url"], FOOD_CATEGORIES)
    ]

    
    leaf_food_categories = filter_to_leaf_categories(food_categories)
    
    
    output_data = {
        "generated_at": data.get("generated_at"),
        "category_count": len(leaf_food_categories),
        "description": "Food-related leaf categories only (deepest subcategories to avoid duplicate scraping)",
        "categories": leaf_food_categories
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    for i, cat in enumerate(leaf_food_categories[:15], 1):
        path = parse_url_to_path(cat["url"])
        depth = len(path)
        indent = "  " * (depth - 1)
        print(f"{i:2}. {indent}└─ {path[-1]}")
        print(f"    {cat['url']}")
    
    if len(leaf_food_categories) > 15:
        print(f"\n... and {len(leaf_food_categories) - 15} more categories")



if __name__ == "__main__":
    main()