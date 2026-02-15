from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException
import json
import time
from pathlib import Path

options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def get_product_urls_from_category(category_url):
    driver.get(category_url)
    wait = WebDriverWait(driver, 10)

    product_urls = set()
    page_num = 1
    
    while True:
        print(f"  Page {page_num}...", end=" ")
        
        try:
            wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'a.ProductCard__link[data-testid="productLink"]')))
            time.sleep(1)
        except:
            print(f"No products found")
            break

        products = driver.find_elements(By.CSS_SELECTOR, 'a.ProductCard__link[data-testid="productLink"]')
        
        for product in products:
            url = product.get_attribute('href')
            if url:
                product_urls.add(url)
        
        print(f"{len(products)} products (total: {len(product_urls)})")
        
        try:
            next_button = driver.find_element(By.CSS_SELECTOR, 'div.sf-pagination__item--next a')
            
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", next_button)
            time.sleep(0.3)
            driver.execute_script("arguments[0].click();", next_button)
            time.sleep(2)
            page_num += 1
            
        except NoSuchElementException:
            print(f"  ✓ Reached last page")
            break
        except Exception as e:
            break

    return list(product_urls)

def scrape_product_page(product_url):
    driver.get(product_url)
    wait = WebDriverWait(driver, 15)

    name = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.ProductName'))).text.strip()

    nutrition = {
        "caloriesPer100g": 0.0,
        "proteinPer100g": 0.0,
        "fatPer100g": 0.0,
        "carbsPer100g": 0.0,
        "sugarPer100g": 0.0,
    }

    accordion_containers = driver.find_elements(By.CSS_SELECTOR, "div.Accordion.AttributeAccordion")

    nutrition_btn = None
    for container in accordion_containers:
        try:
            heading = container.find_element(By.CSS_SELECTOR, "div.AttributeAccordion__heading")
            txt = heading.text.lower()
            if "toitu" in txt:
                nutrition_btn = container.find_element(By.CSS_SELECTOR, "button.Accordion__trigger")
                break
        except:
            continue

    if nutrition_btn:
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", nutrition_btn)
        time.sleep(0.3)
        driver.execute_script("arguments[0].click();", nutrition_btn)
        time.sleep(0.5)
    else:
        return {
            "id": None,
            "name": name,
            **nutrition,
            "allergies": []
        }

    try:
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table.ProductNutrition")))
    except TimeoutException:
        return {
            "id": None,
            "name": name,
            **nutrition,
            "allergies": []
        }

    rows = driver.find_elements(By.CSS_SELECTOR, "table.ProductNutrition tbody tr")

    for row in rows:
        try:
            th = row.find_element(By.TAG_NAME, "th").text.lower()
            td = row.find_element(By.TAG_NAME, "td").text.lower()

            import re
            def num(s):
                m = re.search(r"\d+[.,]?\d*", s)
                return float(m.group().replace(",", ".")) if m else 0.0

            if "kcal" in td or "kcal" in th:
                if "/" in td:
                    nutrition["caloriesPer100g"] = num(td.split("/")[-1])
                else:
                    nutrition["caloriesPer100g"] = num(td)
            elif "valk" in th:
                nutrition["proteinPer100g"] = num(td)
            elif "rasv" in th and "küll" not in th:
                nutrition["fatPer100g"] = num(td)
            elif "süsivesik" in th and "sh" not in th:
                nutrition["carbsPer100g"] = num(td)
            elif "suhkr" in th or "sh suhkr" in th:
                nutrition["sugarPer100g"] = num(td)
        except:
            continue

    return {
        "id": None,
        "name": name,
        **nutrition,
        "allergies": []
    }


if __name__ == "__main__":
    input_file = "scraper/output/food_categories_filtered.json"
    output_file = "scraper/output/foods_selver.json"
    
    Path(output_file).parent.mkdir(parents=True, exist_ok=True)
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"Could not find '{input_file}'")
        driver.quit()
        exit(1)
    
    all_products = []
    product_id_counter = 1
    
    total_categories = len(data["categories"])
    
    print(f"Selver Product Scraper")
    print(f"Categories: {total_categories}")

    
    try:
        for cat_idx, category in enumerate(data["categories"], 1):
            category_url = category["url"]
            category_name = category_url.split('/')[-1]
            
            print(f"\n[{cat_idx}/{total_categories}] {category_name}")
            
            try:
                product_urls = get_product_urls_from_category(category_url)
                print(f"{len(product_urls)} products to scrape")
            except Exception as e:
                print(f"Error: {e}")
                continue

            for i, url in enumerate(product_urls, 1):
                try:
                    product = scrape_product_page(url)
                    product["id"] = product_id_counter
                    product["category"] = category_url
                    product["categoryName"] = category_name
                    all_products.append(product)
                    product_id_counter += 1
                    
                    if i % 10 == 0 or i == len(product_urls):
                        print(f"[{i}/{len(product_urls)}] {product['name'][:50]}")
                except Exception as e:
                    print(f"[{i}/{len(product_urls)}] ❌ {str(e)[:50]}")
                    continue
            
            print(f"Saved (total: {len(all_products)} products)")
            
            with open(output_file, "w", encoding="utf-8") as f:
                json.dump(all_products, f, ensure_ascii=False, indent=2)
    
    except KeyboardInterrupt:
        print(f"Interrupted by user")
    except Exception as e:
        print(f"Fatal error: {e}")
    finally:
        driver.quit()
        print(f"Complete! {len(all_products)} products")
        print(f"Saved to: {output_file}")