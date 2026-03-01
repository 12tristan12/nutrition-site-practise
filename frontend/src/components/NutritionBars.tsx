import MacroBar from "./MacroBars";
import type {Product} from "../types/Food";
import { calculateGoals } from "../components/MacroCalculator";

interface NutritionBarsProps {
    consumedFoods: {food: Product; servings: number}[];
    weight: string;
    height: string;
    age: string;


}

const NutritionBars = ({consumedFoods, weight, height, age}: NutritionBarsProps) => {

    const totalCalories = consumedFoods.reduce((sum, item) => 
    sum + (item.food.caloriesPer100g * item.servings), 0
    );

    const totalProtein = consumedFoods.reduce((sum, item) => 
        sum + (item.food.proteinPer100g * item.servings), 0
    );

    const totalFat = consumedFoods.reduce((sum, item) => 
        sum + (item.food.fatPer100g * item.servings), 0
    );

    const totalCarbs = consumedFoods.reduce((sum, item) => 
        sum + (item.food.carbsPer100g * item.servings), 0
    );

    const totalSugar = consumedFoods.reduce((sum, item) => 
        sum + (item.food.sugarPer100g * item.servings), 0
    );
    const goals = calculateGoals(weight, height, age);
    const pct = (amount: number, goal: number) => Math.min((amount / goal) * 100, 100);

    return(

    <div className="nutrition-bars">      
        <div className="calories-display">
            <span className="calories-label">Calories</span>
            <span className="calories-amount">{totalCalories.toFixed(0)} kcal / {goals.calories} kcal</span>
        </div>

        <div className="macro-bars">
            <MacroBar label="Protein" amount={totalProtein} color="#e64b4b" width={pct(totalProtein, goals.protein)}/>
            <MacroBar label="Fat" amount={totalFat} color="#ffe867" width={pct(totalFat, goals.fat)} />
            <MacroBar label="Carbs" amount={totalCarbs} color="#71ff7f" width={pct(totalCarbs, goals.carbs)}/>
            <MacroBar label="Sugar" amount={totalSugar} color="#6adcff" width={pct(totalSugar,50)} />
        </div>
    </div>
    );
};

export default NutritionBars;
