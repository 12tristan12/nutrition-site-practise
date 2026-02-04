export interface Product{
    id: number;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    fatPer100g: number;
    carbsPer100g: number;
    sugarPer100g: number;
    allergies: string[];
}