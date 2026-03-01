import React from "react";

interface MacroCalculatorProps {
  weight: string;
  height: string;
  age: string;
  onWeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHeightChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAgeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const MacroCalculator = ({ weight, height, age, onWeightChange, onHeightChange, onAgeChange }: MacroCalculatorProps) => {
  return (
    <div className="macro-calculator-container">
      <h3></h3>
      <div className="macro-calculator">
        <span>Weight
          <input type="number" min="1" value={weight} onChange={onWeightChange} className="input-stats"/>
        </span>
        <span>Height
          <input type="number" min="1" value={height} onChange={onHeightChange} className="input-stats" />
        </span>
        <span>Age
          <input type="number" min="1" value={age} onChange={onAgeChange} className="input-stats" />
        </span>
      </div>
    </div>
  );
};

export const calculateGoals = (weight: string, height: string, age: string) => {
  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  if (!w || !h || !a) {
    return { calories: 0, protein: 0, fat: 0, carbs: 0 };
  }

  const calories = (w * 10 + 6.25 * h - 5 * a + 5) * 1.6;
  return {
    calories,
    protein: w * 2,
    fat: (calories * 0.25) / 9,
    carbs: (calories * 0.5) / 4,
  };
};

export default MacroCalculator;