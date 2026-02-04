import type { Product } from "../types/Product";

interface Props {
    product: Product;
}

export function ProductItem ({ product }: Props) {
    return (
        <li>
            <strong>{product.name}</strong>
            <br />
            <span>{product.caloriesPer100g} kcal / 100g</span>
            <br />
            <span>Protein: {product.proteinPer100g} g</span>
            <br />
            <span>Fat: {product.fatPer100g} g</span>
            <br />
            <span>Carbs: {product.carbsPer100g} g</span>
            <br />
            <span>Sugar: {product.sugarPer100g} g</span>
            <br />
            <span>{product.allergies}</span>
        </li>
    );
}