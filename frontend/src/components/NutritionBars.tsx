import MacroBar from "./MacroBars";
import type {Product} from "../types/Food";

interface NutritionBarsProps {
    consumedFoods: {food: Product; servings: number}[];

}

const NutritionBars = ({consumedFoods}: NutritionBarsProps) => {

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

  return(

  <div className="nutrition-bars">      
      <div className="calories-display">
        <span className="calories-label">Calories</span>
        <span className="calories-amount">{totalCalories.toFixed(0)} kcal</span>
      </div>

      <div className="macro-bars">
        <MacroBar label="Protein" amount={totalProtein} color="#e64b4b" />
        <MacroBar label="Fat" amount={totalFat} color="#ffe867" />
        <MacroBar label="Carbs" amount={totalCarbs} color="#71ff7f" />
        <MacroBar label="Sugar" amount={totalSugar} color="#6adcff" />
      </div>
    </div>
  );
};

export default NutritionBars;
