export interface Ingredients {
  name: string;
  weight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbohydratesPer100g: number;
}

export interface TotalCPFC {
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}
