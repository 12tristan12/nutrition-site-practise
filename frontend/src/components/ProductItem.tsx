import type { Product } from "../types/Food";
import {useState} from "react";

interface Props {
    food: Product;
    onAddFood: (food: Product, servings: number) => void;
}

const ProductItem = ({food, onAddFood}: Props ) => {
    const [servings, setServings] = useState<string>("1");

    const handleServingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setServings(e.target.value)
    }


    const handleAddFood = () => {
        const numericServings = Number(servings);
        if (numericServings > 0) {
            onAddFood(food, numericServings); 
        }
    }

    return (
        <div className="product-container">
        <h3>{food.name}</h3>   
        <div className = "product-nutrition">
            <div>Calories: {food.caloriesPer100g} kcal </div>
            <div>Protein: {food.proteinPer100g} g</div>
            <div>Fat: {food.fatPer100g} g</div>
            <div>Carbs: {food.carbsPer100g} g</div>
            <div>Sugar: {food.sugarPer100g} g</div>
            <div>{food.allergies}</div>
        </div>

        <div className="food-cart-action">
            <input 
                type="number"
                min="1"
                step="1"
                value={servings}
                onChange={handleServingsChange}
                className="servings-input" />
            <span>  x 100g</span>
            <button onClick={handleAddFood} disabled={Number(servings) <= 0}>Add to tracker</button>
        </div>
        </div>
    );
}

export default ProductItem;