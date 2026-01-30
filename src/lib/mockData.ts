import type { Recipe, MealSlot, User } from "./types.ts";
import { format, addDays, startOfWeek } from "date-fns";
import { generateId } from "./utils.ts";

// Mock Users
export const mockUsers: User[] = [
  { id: "1", email: "alex@example.com" },
  { id: "2", email: "jordan@example.com" },
];

// Mock Recipes
export const mockRecipes: Recipe[] = [
  {
    id: generateId(),
    name: "Greek Yogurt Parfait",
    description: "A quick and healthy breakfast with layers of creamy yogurt, fresh berries, and crunchy granola.",
    ingredients: [
      { id: generateId(), name: "Greek Yogurt", quantity: 200, unit: "g", category: "dairy" },
      { id: generateId(), name: "Mixed Berries", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Granola", quantity: 50, unit: "g", category: "pantry" },
      { id: generateId(), name: "Honey", quantity: 1, unit: "tbsp", category: "pantry" },
    ],
    instructions: [
      "Layer half of the Greek yogurt in a glass or bowl",
      "Add half of the mixed berries",
      "Add remaining yogurt and berries",
      "Top with granola and drizzle with honey",
    ],
    macros: { calories: 320, protein: 18, carbs: 42, fats: 8 },
    tags: ["quick", "high-protein", "vegetarian"],
    servings: 1,
    prepTime: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Grilled Chicken Salad",
    description: "Fresh and filling salad with perfectly grilled chicken breast and mixed greens.",
    ingredients: [
      { id: generateId(), name: "Chicken Breast", quantity: 200, unit: "g", category: "meat" },
      { id: generateId(), name: "Mixed Greens", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Cherry Tomatoes", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Cucumber", quantity: 1, unit: "medium", category: "produce" },
      { id: generateId(), name: "Feta Cheese", quantity: 50, unit: "g", category: "dairy" },
      { id: generateId(), name: "Olive Oil", quantity: 2, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Lemon", quantity: 1, unit: "whole", category: "produce" },
    ],
    instructions: [
      "Season chicken breast with salt, pepper, and herbs",
      "Grill chicken for 6-7 minutes per side until cooked through",
      "Let chicken rest for 5 minutes, then slice",
      "Arrange mixed greens in a bowl",
      "Top with sliced chicken, tomatoes, cucumber, and feta",
      "Drizzle with olive oil and lemon juice",
    ],
    macros: { calories: 450, protein: 42, carbs: 12, fats: 26 },
    tags: ["high-protein", "low-carb", "gluten-free"],
    servings: 1,
    prepTime: 10,
    cookTime: 15,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Salmon with Roasted Vegetables",
    description: "Omega-rich salmon fillet served with colorful roasted seasonal vegetables.",
    ingredients: [
      { id: generateId(), name: "Salmon Fillet", quantity: 180, unit: "g", category: "meat" },
      { id: generateId(), name: "Broccoli", quantity: 150, unit: "g", category: "produce" },
      { id: generateId(), name: "Bell Peppers", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Zucchini", quantity: 1, unit: "medium", category: "produce" },
      { id: generateId(), name: "Olive Oil", quantity: 2, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Garlic", quantity: 3, unit: "cloves", category: "produce" },
    ],
    instructions: [
      "Preheat oven to 400°F (200°C)",
      "Cut vegetables into bite-sized pieces",
      "Toss vegetables with olive oil and minced garlic",
      "Spread vegetables on a baking sheet and roast for 15 minutes",
      "Season salmon with salt, pepper, and herbs",
      "Add salmon to the baking sheet and roast for 12-15 minutes",
      "Serve salmon on top of roasted vegetables",
    ],
    macros: { calories: 520, protein: 38, carbs: 18, fats: 32 },
    tags: ["high-protein", "low-carb", "gluten-free", "meal-prep"],
    servings: 1,
    prepTime: 15,
    cookTime: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Overnight Oats",
    description: "Creamy overnight oats with banana, peanut butter, and a touch of maple syrup.",
    ingredients: [
      { id: generateId(), name: "Rolled Oats", quantity: 80, unit: "g", category: "pantry" },
      { id: generateId(), name: "Almond Milk", quantity: 200, unit: "ml", category: "dairy" },
      { id: generateId(), name: "Banana", quantity: 1, unit: "medium", category: "produce" },
      { id: generateId(), name: "Peanut Butter", quantity: 2, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Chia Seeds", quantity: 1, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Maple Syrup", quantity: 1, unit: "tbsp", category: "pantry" },
    ],
    instructions: [
      "Combine oats, almond milk, and chia seeds in a jar",
      "Stir well and refrigerate overnight",
      "In the morning, top with sliced banana",
      "Add peanut butter and drizzle with maple syrup",
    ],
    macros: { calories: 410, protein: 14, carbs: 58, fats: 16 },
    tags: ["quick", "vegetarian", "meal-prep"],
    servings: 1,
    prepTime: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Turkey & Veggie Wrap",
    description: "Protein-packed turkey wrap with hummus and fresh vegetables.",
    ingredients: [
      { id: generateId(), name: "Whole Wheat Tortilla", quantity: 1, unit: "large", category: "bakery" },
      { id: generateId(), name: "Turkey Breast", quantity: 100, unit: "g", category: "meat" },
      { id: generateId(), name: "Hummus", quantity: 3, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Spinach", quantity: 30, unit: "g", category: "produce" },
      { id: generateId(), name: "Tomato", quantity: 1, unit: "medium", category: "produce" },
      { id: generateId(), name: "Red Onion", quantity: 0.25, unit: "medium", category: "produce" },
    ],
    instructions: [
      "Warm the tortilla in a pan for 30 seconds each side",
      "Spread hummus evenly across the tortilla",
      "Layer spinach, sliced turkey, tomato, and red onion",
      "Roll tightly, tucking in the sides",
      "Cut in half diagonally and serve",
    ],
    macros: { calories: 380, protein: 28, carbs: 35, fats: 14 },
    tags: ["quick", "high-protein", "meal-prep"],
    servings: 1,
    prepTime: 10,
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Vegetable Stir Fry with Tofu",
    description: "Colorful vegetable stir fry with crispy tofu in a savory sauce.",
    ingredients: [
      { id: generateId(), name: "Firm Tofu", quantity: 200, unit: "g", category: "dairy" },
      { id: generateId(), name: "Broccoli", quantity: 150, unit: "g", category: "produce" },
      { id: generateId(), name: "Bell Peppers", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Snap Peas", quantity: 100, unit: "g", category: "produce" },
      { id: generateId(), name: "Soy Sauce", quantity: 3, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Sesame Oil", quantity: 1, unit: "tbsp", category: "pantry" },
      { id: generateId(), name: "Ginger", quantity: 1, unit: "tbsp", category: "produce" },
      { id: generateId(), name: "Garlic", quantity: 3, unit: "cloves", category: "produce" },
    ],
    instructions: [
      "Press tofu and cut into cubes",
      "Fry tofu in sesame oil until golden and crispy",
      "Remove tofu and set aside",
      "Stir fry vegetables with garlic and ginger",
      "Add soy sauce and tofu back to the pan",
      "Toss everything together and serve",
    ],
    macros: { calories: 340, protein: 22, carbs: 24, fats: 18 },
    tags: ["vegan", "high-protein", "quick"],
    servings: 2,
    prepTime: 15,
    cookTime: 15,
    createdAt: new Date().toISOString(),
  },
];

// Generate mock meal plan for current week
const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
// const mealTypes: ("breakfast" | "lunch" | "dinner")[] = ["breakfast", "lunch", "dinner"];

export const mockMealPlan: MealSlot[] = [];

// Add some meals to the week
for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
  const date = format(addDays(weekStart, dayOffset), "yyyy-MM-dd");

  // Add breakfast (70% chance)
  if (Math.random() > 0.3) {
    const breakfastRecipes = mockRecipes.filter(
      (r) => r.tags.includes("quick") || r.name.includes("Oat") || r.name.includes("Yogurt")
    );
    const recipe = breakfastRecipes[Math.floor(Math.random() * breakfastRecipes.length)];
    mockMealPlan.push({
      id: generateId(),
      date,
      mealType: "breakfast",
      recipeId: recipe.id,
      servings: 1,
    });
  }

  // Add lunch (80% chance)
  if (Math.random() > 0.2) {
    const lunchRecipes = mockRecipes.filter((r) => r.name.includes("Salad") || r.name.includes("Wrap"));
    const recipe = lunchRecipes[Math.floor(Math.random() * lunchRecipes.length)] || mockRecipes[0];
    mockMealPlan.push({
      id: generateId(),
      date,
      mealType: "lunch",
      recipeId: recipe.id,
      servings: 2,
    });
  }

  // Add dinner (90% chance)
  if (Math.random() > 0.1) {
    const dinnerRecipes = mockRecipes.filter(
      (r) => r.name.includes("Salmon") || r.name.includes("Stir Fry") || r.name.includes("Chicken")
    );
    const recipe = dinnerRecipes[Math.floor(Math.random() * dinnerRecipes.length)] || mockRecipes[2];
    mockMealPlan.push({
      id: generateId(),
      date,
      mealType: "dinner",
      recipeId: recipe.id,
      servings: 2,
    });
  }
}
