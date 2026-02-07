from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import time


options = Options()
options.headless = True
driver = webdriver.Chrome(options=options)

def get_product_urls_from_category(category_url):
    driver.get(category_url)
    wait = WebDriverWait(driver, 10)

    product_urls = set()
    while True:
        wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'a.ProductCard__link[data-testid="productLink"]')))

        products = driver.find_elements(By.CSS_SELECTOR, 'a.ProductCard__link[data-testid="productLink"]')
        for product in products:
            url = product.get_attribute('href')
            if url:
                product_urls.add(url)

        try:
            next_button = driver.find_element(By.CSS_SELECTOR, 'button.pagination__next')
            if not next_button.is_enabled():
                break
            next_button.click()
            time.sleep(2) 
        except:
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

    # Find accordion by checking the heading text inside the button
    accordion_containers = driver.find_elements(By.CSS_SELECTOR, "div.Accordion.AttributeAccordion")

    nutrition_btn = None
    for container in accordion_containers:
        try:
            # Look for the heading div inside the button
            heading = container.find_element(By.CSS_SELECTOR, "div.AttributeAccordion__heading")
            txt = heading.text.lower()
            if "toitu" in txt:  # Matches "Toitumisalane teave"
                nutrition_btn = container.find_element(By.CSS_SELECTOR, "button.Accordion__trigger")
                break
        except:
            continue

    if nutrition_btn:
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", nutrition_btn)
        time.sleep(0.5)
        driver.execute_script("arguments[0].click();", nutrition_btn)
        time.sleep(1)  # Wait for accordion to expand
    else:
        print(f"⚠️ Nutrition accordion not found for {name}!")
        return {
            "id": None,
            "name": name,
            **nutrition,
            "allergies": []
        }

    # Wait for the nutrition table to be visible
    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "table.ProductNutrition")))

    rows = driver.find_elements(By.CSS_SELECTOR, "table.ProductNutrition tbody tr")

    for row in rows:
        try:
            th = row.find_element(By.TAG_NAME, "th").text.lower()
            td = row.find_element(By.TAG_NAME, "td").text.lower()

            import re
            def num(s):
                m = re.search(r"\d+[.,]?\d*", s)
                return float(m.group().replace(",", ".")) if m else 0.0

            # Check for calories (energiasisaldus)
            if "kcal" in td or "kcal" in th:
                # Extract the per 100g value (typically after "/")
                if "/" in td:
                    nutrition["caloriesPer100g"] = num(td.split("/")[-1])
                else:
                    nutrition["caloriesPer100g"] = num(td)
            elif "valk" in th:  # "valgud" = protein
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
    category_url = "https://www.selver.ee/kuivained-hoidised"
    product_urls = get_product_urls_from_category(category_url)
    print(f"Found {len(product_urls)} products")

    products = []
    for i, url in enumerate(product_urls, 1):
        try:
            product = scrape_product_page(url)
            product["id"] = i
            print(f"Scraped product {i}: {product['name']}")
            products.append(product)
        except Exception as e:
            print(f"Error scraping {url}: {e}")

    with open("scraper/output/foods_selver.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    driver.quit()