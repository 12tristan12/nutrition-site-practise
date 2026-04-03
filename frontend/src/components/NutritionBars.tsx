import MacroBar from "./MacroBars";
import type {Product} from "../types/Food";
import { calculateGoals } from "../components/MacroCalculator";


interface NutritionBarsProps {
    consumedFoods: { logId: number; food: Product; servings: number }[];
    weight: string;
    height: string;
    age: string;
    activitylevel: string;
    intakelevel: string;
    onRemoveFood: (logId: number) => void;

}

const NutritionBars = ({consumedFoods, weight, height, age, activitylevel, intakelevel, onRemoveFood}: NutritionBarsProps) => {

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
    const goals = calculateGoals(weight, height, age, activitylevel, intakelevel);
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
        <div className="consumed-list">
            {consumedFoods.map((item) => (
                <div key={item.logId} className="consumed-item">
                    <span className="consumed-name">{item.food.name}</span>
                    <span className="consumed-servings">{item.servings} x 100g</span>
                    <button className="remove-button" onClick={() => onRemoveFood(item.logId)}>X</button>
                </div>
            ))}
            
        </div>
    </div>
    );
};

export default NutritionBars;
