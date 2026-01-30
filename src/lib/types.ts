export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
}

export type IngredientCategory = "produce" | "meat" | "dairy" | "pantry" | "frozen" | "beverages" | "bakery" | "other";

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export type RecipeTag =
  | "high-protein"
  | "low-carb"
  | "vegetarian"
  | "vegan"
  | "quick"
  | "meal-prep"
  | "gluten-free"
  | "dairy-free";

export interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string[];
  macros: Macros;
  tags: RecipeTag[];
  servings: number;
  prepTime?: number; // minutes
  cookTime?: number; // minutes
  imageUrl?: string;
  createdAt: string;
}

export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealSlot {
  id: string;
  date: string; // YYYY-MM-DD
  mealType: MealType;
  recipeId: string;
  servings: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: IngredientCategory;
  purchased: boolean;
  recipeIds: string[]; // Which recipes this item is from
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AppState {
  recipes: Recipe[];
  mealPlan: MealSlot[];
  shoppingList: ShoppingItem[];
  currentUser: User | null;
}

// View types
export type CalendarView = "day" | "week" | "month";
