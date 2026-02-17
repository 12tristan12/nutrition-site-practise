import type { Product } from "../types/Food";

interface Props {
    product: Product;
}

export function ProductItem ({ product }: Props) {
    return (
        <div className="product-container">
        <h3>{product.name}</h3>   
        <div className = "product-nutrition">
            <div>Calories: {product.caloriesPer100g} kcal </div>
            <div>Protein: {product.proteinPer100g} g</div>
            <div>Fat: {product.fatPer100g} g</div>
            <div>Carbs: {product.carbsPer100g} g</div>
            <div>Sugar: {product.sugarPer100g} g</div>
            <div>{product.allergies}</div>
        </div>
        </div>
    );
}