import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Clock, Users, Flame, Beef, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecipeForm } from "./RecipeForm";
import type { Recipe, RecipeTag } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRecipeStore } from "@/lib/stores/recipeStore";

const tagColors: Record<RecipeTag, string> = {
  "high-protein": "bg-red-100 text-red-700 border-red-200",
  "low-carb": "bg-amber-100 text-amber-700 border-amber-200",
  vegetarian: "bg-green-100 text-green-700 border-green-200",
  vegan: "bg-emerald-100 text-emerald-700 border-emerald-200",
  quick: "bg-blue-100 text-blue-700 border-blue-200",
  "meal-prep": "bg-purple-100 text-purple-700 border-purple-200",
  "gluten-free": "bg-orange-100 text-orange-700 border-orange-200",
  "dairy-free": "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const allTags: RecipeTag[] = [
  "high-protein",
  "low-carb",
  "vegetarian",
  "vegan",
  "quick",
  "meal-prep",
  "gluten-free",
  "dairy-free",
];

export function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { recipes, deleteRecipe } = useRecipeStore();

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => recipe.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: RecipeTag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      deleteRecipe(id);
      setSelectedRecipe(null);
    }
  };

  return (
    <div className='space-y-6 md:ml-48'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-2xl md:text-3xl font-bold text-foreground'>Recipes</h1>
          <p className='text-muted-foreground'>{recipes.length} recipes in your collection</p>
        </div>

        <Button onClick={() => setIsCreating(true)} className='bg-primary hover:bg-primary/90'>
          <Plus className='w-4 h-4 mr-2' />
          New Recipe
        </Button>
      </div>

      {/* Search and Filters */}
      <div className='space-y-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
          <Input
            placeholder='Search recipes...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10 h-12 rounded-xl'
          />
        </div>

        <div className='flex flex-wrap gap-2'>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all capitalize",
                selectedTags.includes(tag)
                  ? tagColors[tag]
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
              )}>
              {tag.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <motion.div layout className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <AnimatePresence>
          {filteredRecipes.map((recipe) => (
            <motion.div
              key={recipe.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}>
              <Card
                className='transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer overflow-hidden group'
                onClick={() => setSelectedRecipe(recipe)}>
                {recipe.imageUrl ? (
                  <div className='aspect-video w-full overflow-hidden bg-muted'>
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className='w-full h-full object-cover transition-transform group-hover:scale-105'
                    />
                  </div>
                ) : (
                  <div className='aspect-video w-full bg-linear-to-br from-sage-100 to-cream-100 flex items-center justify-center'>
                    <span className='text-5xl'>🍽️</span>
                  </div>
                )}
                <CardContent className='p-4'>
                  <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors'>
                    {recipe.name}
                  </h3>
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
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant='outline' className={cn("text-xs capitalize", tagColors[tag])}>
                        {tag.replace("-", " ")}
                      </Badge>
                    ))}
                    {recipe.tags.length > 3 && (
                      <Badge variant='outline' className='text-xs'>
                        +{recipe.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredRecipes.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>No recipes found</p>
          <Button
            variant='outline'
            className='mt-4'
            onClick={() => {
              setSearchQuery("");
              setSelectedTags([]);
            }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          {selectedRecipe && (
            <>
              <DialogHeader>
                <div className='flex items-start justify-between'>
                  <DialogTitle className='text-2xl pr-8'>{selectedRecipe.name}</DialogTitle>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => {
                        setIsEditing(true);
                      }}>
                      <Edit className='w-4 h-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-destructive hover:text-destructive'
                      onClick={() => handleDeleteRecipe(selectedRecipe.id)}>
                      <Trash2 className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className='space-y-6'>
                {selectedRecipe.description && <p className='text-muted-foreground'>{selectedRecipe.description}</p>}

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
                    <Badge key={tag} className={cn("capitalize", tagColors[tag])}>
                      {tag.replace("-", " ")}
                    </Badge>
                  ))}
                </div>

                {/* Info */}
                <div className='flex items-center gap-6 text-muted-foreground'>
                  <span className='flex items-center gap-2'>
                    <Users className='w-5 h-5' />
                    {selectedRecipe.servings} servings
                  </span>
                  {selectedRecipe.prepTime && (
                    <span className='flex items-center gap-2'>
                      <Clock className='w-5 h-5' />
                      {selectedRecipe.prepTime}m prep
                    </span>
                  )}
                  {selectedRecipe.cookTime && (
                    <span className='flex items-center gap-2'>
                      <Clock className='w-5 h-5' />
                      {selectedRecipe.cookTime}m cook
                    </span>
                  )}
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <span className='text-lg'>🥗</span>
                    Ingredients
                  </h4>
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
                  <h4 className='font-semibold mb-3 flex items-center gap-2'>
                    <span className='text-lg'>📝</span>
                    Instructions
                  </h4>
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Recipe Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={() => {
          setIsCreating(false);
          setIsEditing(false);
        }}>
        <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Recipe" : "Create New Recipe"}</DialogTitle>
          </DialogHeader>
          <RecipeForm
            recipe={isEditing ? selectedRecipe : undefined}
            onComplete={() => {
              setIsCreating(false);
              setIsEditing(false);
              setSelectedRecipe(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
