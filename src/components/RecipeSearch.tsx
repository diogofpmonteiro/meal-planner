import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Flame, Beef, Clock, Plus, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Recipe } from "@/lib/types";
import { toast } from "sonner";
import { useRecipeStore } from "@/lib/stores/recipeStore";

// Mock API recipes (in real app, this would come from an external API)
const mockApiRecipes: Omit<Recipe, "id" | "createdAt">[] = [
  {
    name: "Mediterranean Quinoa Bowl",
    description: "A nutritious bowl with quinoa, chickpeas, vegetables, and feta cheese.",
    ingredients: [
      { id: "1", name: "Quinoa", quantity: 150, unit: "g", category: "pantry" },
      { id: "2", name: "Chickpeas", quantity: 200, unit: "g", category: "pantry" },
      { id: "3", name: "Cherry Tomatoes", quantity: 100, unit: "g", category: "produce" },
      { id: "4", name: "Cucumber", quantity: 1, unit: "medium", category: "produce" },
      { id: "5", name: "Feta Cheese", quantity: 75, unit: "g", category: "dairy" },
      { id: "6", name: "Olive Oil", quantity: 2, unit: "tbsp", category: "pantry" },
      { id: "7", name: "Lemon Juice", quantity: 2, unit: "tbsp", category: "produce" },
    ],
    instructions: [
      "Cook quinoa according to package directions",
      "Drain and rinse chickpeas",
      "Chop tomatoes and cucumber",
      "Combine all ingredients in a bowl",
      "Drizzle with olive oil and lemon juice",
      "Top with crumbled feta cheese",
    ],
    macros: { calories: 480, protein: 18, carbs: 52, fats: 22 },
    tags: ["vegetarian", "high-protein", "meal-prep"],
    servings: 2,
    prepTime: 15,
    cookTime: 20,
  },
  {
    name: "Asian Glazed Salmon",
    description: "Tender salmon fillet with a sweet and savory Asian-inspired glaze.",
    ingredients: [
      { id: "1", name: "Salmon Fillet", quantity: 200, unit: "g", category: "meat" },
      { id: "2", name: "Soy Sauce", quantity: 3, unit: "tbsp", category: "pantry" },
      { id: "3", name: "Honey", quantity: 2, unit: "tbsp", category: "pantry" },
      { id: "4", name: "Ginger", quantity: 1, unit: "tbsp", category: "produce" },
      { id: "5", name: "Garlic", quantity: 2, unit: "cloves", category: "produce" },
      { id: "6", name: "Sesame Seeds", quantity: 1, unit: "tbsp", category: "pantry" },
    ],
    instructions: [
      "Mix soy sauce, honey, ginger, and minced garlic",
      "Place salmon in a baking dish",
      "Pour glaze over salmon",
      "Marinate for 15 minutes",
      "Bake at 400°F for 15-18 minutes",
      "Garnish with sesame seeds",
    ],
    macros: { calories: 380, protein: 35, carbs: 18, fats: 18 },
    tags: ["high-protein", "gluten-free", "quick"],
    servings: 1,
    prepTime: 20,
    cookTime: 18,
  },
  {
    name: "Thai Peanut Noodles",
    description: "Creamy peanut sauce over rice noodles with crisp vegetables.",
    ingredients: [
      { id: "1", name: "Rice Noodles", quantity: 200, unit: "g", category: "pantry" },
      { id: "2", name: "Peanut Butter", quantity: 4, unit: "tbsp", category: "pantry" },
      { id: "3", name: "Soy Sauce", quantity: 3, unit: "tbsp", category: "pantry" },
      { id: "4", name: "Lime Juice", quantity: 2, unit: "tbsp", category: "produce" },
      { id: "5", name: "Red Bell Pepper", quantity: 1, unit: "whole", category: "produce" },
      { id: "6", name: "Edamame", quantity: 100, unit: "g", category: "frozen" },
      { id: "7", name: "Green Onions", quantity: 3, unit: "stalks", category: "produce" },
    ],
    instructions: [
      "Cook rice noodles according to package",
      "Whisk peanut butter, soy sauce, and lime juice",
      "Slice bell pepper and green onions",
      "Cook edamame briefly",
      "Toss noodles with peanut sauce",
      "Top with vegetables and serve",
    ],
    macros: { calories: 520, protein: 22, carbs: 58, fats: 24 },
    tags: ["vegan", "quick"],
    servings: 2,
    prepTime: 10,
    cookTime: 15,
  },
  {
    name: "Protein Power Breakfast",
    description: "High-protein breakfast with eggs, turkey bacon, and avocado.",
    ingredients: [
      { id: "1", name: "Eggs", quantity: 3, unit: "large", category: "dairy" },
      { id: "2", name: "Turkey Bacon", quantity: 3, unit: "strips", category: "meat" },
      { id: "3", name: "Avocado", quantity: 0.5, unit: "whole", category: "produce" },
      { id: "4", name: "Cherry Tomatoes", quantity: 6, unit: "whole", category: "produce" },
      { id: "5", name: "Whole Wheat Toast", quantity: 1, unit: "slice", category: "bakery" },
    ],
    instructions: [
      "Cook turkey bacon until crispy",
      "Scramble or fry eggs to preference",
      "Slice avocado and halve tomatoes",
      "Toast bread",
      "Plate everything together",
      "Season with salt and pepper",
    ],
    macros: { calories: 420, protein: 32, carbs: 18, fats: 28 },
    tags: ["high-protein", "low-carb", "quick"],
    servings: 1,
    prepTime: 5,
    cookTime: 10,
  },
  {
    name: "Vegetable Curry",
    description: "Aromatic vegetable curry with coconut milk and warm spices.",
    ingredients: [
      { id: "1", name: "Coconut Milk", quantity: 400, unit: "ml", category: "pantry" },
      { id: "2", name: "Curry Paste", quantity: 3, unit: "tbsp", category: "pantry" },
      { id: "3", name: "Sweet Potato", quantity: 1, unit: "large", category: "produce" },
      { id: "4", name: "Chickpeas", quantity: 400, unit: "g", category: "pantry" },
      { id: "5", name: "Spinach", quantity: 100, unit: "g", category: "produce" },
      { id: "6", name: "Basmati Rice", quantity: 200, unit: "g", category: "pantry" },
    ],
    instructions: [
      "Cook rice according to package directions",
      "Cube sweet potato and cook until tender",
      "Sauté curry paste in a pan",
      "Add coconut milk and chickpeas",
      "Simmer until heated through",
      "Stir in spinach until wilted",
      "Serve over rice",
    ],
    macros: { calories: 550, protein: 16, carbs: 68, fats: 26 },
    tags: ["vegan", "gluten-free", "meal-prep"],
    servings: 4,
    prepTime: 15,
    cookTime: 30,
  },
];

export function RecipeSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockApiRecipes>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [maxCalories, setMaxCalories] = useState([800]);
  const [minProtein, setMinProtein] = useState([0]);
  const [selectedRecipe, setSelectedRecipe] = useState<(typeof mockApiRecipes)[0] | null>(null);

  const { addRecipe } = useRecipeStore();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Filter mock recipes based on search
    const filtered = mockApiRecipes.filter((recipe) => {
      const matchesSearch =
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some((tag) => tag.includes(searchQuery.toLowerCase()));

      const matchesCalories = recipe.macros.calories <= maxCalories[0];
      const matchesProtein = recipe.macros.protein >= minProtein[0];

      return matchesSearch && matchesCalories && matchesProtein;
    });

    setResults(filtered);
    setIsSearching(false);
  };

  const handleImportRecipe = (recipe: (typeof mockApiRecipes)[0]) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    addRecipe(newRecipe);
    toast.success(`${recipe.name} has been added to your recipes.`);
    setSelectedRecipe(null);
  };

  return (
    <div className='space-y-6 md:ml-48'>
      {/* Header */}
      <div>
        <h1 className='font-display text-2xl md:text-3xl font-bold text-foreground'>Search Recipes</h1>
        <p className='text-muted-foreground'>Discover new recipes and import them to your collection</p>
      </div>

      {/* Search Bar */}
      <div className='space-y-4'>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
            <Input
              placeholder='Search for recipes (e.g., chicken, vegetarian, quick...)'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className='pl-10 h-12 rounded-xl'
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className='h-12 px-6 bg-primary hover:bg-primary/90'>
            {isSearching ? <Loader2 className='w-5 h-5 animate-spin' /> : "Search"}
          </Button>
          <Button variant='outline' className='h-12' onClick={() => setShowFilters(!showFilters)}>
            <Filter className='w-5 h-5' />
          </Button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className='overflow-hidden'>
              <Card className='p-4'>
                <div className='grid sm:grid-cols-2 gap-6'>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium'>Max Calories</label>
                      <span className='text-sm text-primary font-semibold'>{maxCalories[0]} cal</span>
                    </div>
                    <Slider value={maxCalories} onValueChange={setMaxCalories} min={100} max={1000} step={50} />
                  </div>
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <label className='text-sm font-medium'>Min Protein</label>
                      <span className='text-sm text-terracotta-500 font-semibold'>{minProtein[0]}g</span>
                    </div>
                    <Slider value={minProtein} onValueChange={setMinProtein} min={0} max={50} step={5} />
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      {isSearching ? (
        <div className='flex items-center justify-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-primary' />
          <span className='ml-3 text-muted-foreground'>Searching recipes...</span>
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>No recipes found for "{searchQuery}"</p>
          <p className='text-sm text-muted-foreground mt-2'>Try different keywords or adjust your filters</p>
        </div>
      ) : (
        <motion.div layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          <AnimatePresence>
            {results.map((recipe, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>
                <Card
                  className='transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden group'
                  onClick={() => setSelectedRecipe(recipe)}>
                  <div className='aspect-video w-full bg-linear-to-br from-terracotta-100 to-cream-100 flex items-center justify-center'>
                    <span className='text-5xl'>🍽️</span>
                  </div>
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between gap-2'>
                      <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                        {recipe.name}
                      </h3>
                      <ExternalLink className='w-4 h-4 text-muted-foreground shrink-0' />
                    </div>
                    <p className='text-sm text-muted-foreground line-clamp-2 mt-1'>{recipe.description}</p>

                    <div className='flex items-center gap-4 mt-3 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-1'>
                        <Clock className='w-4 h-4' />
                        {(recipe.prepTime || 0) + (recipe.cookTime || 0)}m
                      </span>
                      <span className='flex items-center gap-1'>
                        <Flame className='w-4 h-4' />
                        {recipe.macros.calories}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Beef className='w-4 h-4' />
                        {recipe.macros.protein}g
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-1 mt-3'>
                      {recipe.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant='outline' className='text-xs capitalize'>
                          {tag.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!hasSearched && (
        <div className='text-center py-12'>
          <div className='text-6xl mb-4'>🔍</div>
          <p className='text-muted-foreground'>Search for recipes to get started</p>
          <div className='flex flex-wrap justify-center gap-2 mt-4'>
            {["chicken", "vegetarian", "quick", "healthy"].map((term) => (
              <Button
                key={term}
                variant='outline'
                size='sm'
                onClick={() => {
                  setSearchQuery(term);
                  setTimeout(handleSearch, 100);
                }}>
                {term}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          {selectedRecipe && (
            <>
              <DialogHeader>
                <DialogTitle className='text-2xl'>{selectedRecipe.name}</DialogTitle>
              </DialogHeader>

              <div className='space-y-6'>
                <p className='text-muted-foreground'>{selectedRecipe.description}</p>

                {/* Macros */}
                <div className='grid grid-cols-4 gap-4'>
                  <div className='text-center p-3 bg-muted rounded-xl'>
                    <p className='text-2xl font-bold text-primary'>{selectedRecipe.macros.calories}</p>
                    <p className='text-xs text-muted-foreground'>Calories</p>
                  </div>
                  <div className='text-center p-3 bg-muted rounded-xl'>
                    <p className='text-2xl font-bold text-terracotta-500'>{selectedRecipe.macros.protein}g</p>
                    <p className='text-xs text-muted-foreground'>Protein</p>
                  </div>
                  <div className='text-center p-3 bg-muted rounded-xl'>
                    <p className='text-2xl font-bold text-amber-500'>{selectedRecipe.macros.carbs}g</p>
                    <p className='text-xs text-muted-foreground'>Carbs</p>
                  </div>
                  <div className='text-center p-3 bg-muted rounded-xl'>
                    <p className='text-2xl font-bold text-sage-500'>{selectedRecipe.macros.fats}g</p>
                    <p className='text-xs text-muted-foreground'>Fats</p>
                  </div>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2'>
                  {selectedRecipe.tags.map((tag) => (
                    <Badge key={tag} variant='outline' className='capitalize'>
                      {tag.replace("-", " ")}
                    </Badge>
                  ))}
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className='font-semibold mb-3'>Ingredients</h4>
                  <ul className='space-y-2'>
                    {selectedRecipe.ingredients.map((ing) => (
                      <li key={ing.id} className='flex items-center gap-3 p-2 bg-muted/50 rounded-lg'>
                        <div className='w-2 h-2 rounded-full bg-primary' />
                        <span className='flex-1'>{ing.name}</span>
                        <span className='text-muted-foreground'>
                          {ing.quantity} {ing.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className='font-semibold mb-3'>Instructions</h4>
                  <ol className='space-y-3'>
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className='flex gap-3'>
                        <span className='shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium'>
                          {i + 1}
                        </span>
                        <span className='text-muted-foreground'>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Import Button */}
                <Button
                  onClick={() => handleImportRecipe(selectedRecipe)}
                  className='w-full bg-primary hover:bg-primary/90'>
                  <Plus className='w-4 h-4 mr-2' />
                  Import to My Recipes
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
