import productsData from "./data/products.json"
import type { Product } from "./types/Product"
import { ProductItem } from "./components/ProductItem"


function App() {
    const products: Product[] = productsData;
  return (
    <div>
      <h1>Nutrition Tracker</h1>
      <ul>
        {products.map((p) => (
            <ProductItem key={p.id} product={p} />
        ))}
      </ul>
    </div>
  );
}

export default App;
