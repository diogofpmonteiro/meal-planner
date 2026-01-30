import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Recipe, Ingredient, RecipeTag, IngredientCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useRecipeStore } from "@/lib/stores/recipeStore";

interface RecipeFormProps {
  recipe?: Recipe | null;
  onComplete: () => void;
}

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

const categories: IngredientCategory[] = [
  "produce",
  "meat",
  "dairy",
  "pantry",
  "frozen",
  "beverages",
  "bakery",
  "other",
];

const generateId = () => Math.random().toString(36).substr(2, 9);

export function RecipeForm({ recipe, onComplete }: RecipeFormProps) {
  const { addRecipe, updateRecipe } = useRecipeStore();

  const [name, setName] = useState(recipe?.name || "");
  const [description, setDescription] = useState(recipe?.description || "");
  const [servings, setServings] = useState(recipe?.servings || 2);
  const [prepTime, setPrepTime] = useState(recipe?.prepTime || 0);
  const [cookTime, setCookTime] = useState(recipe?.cookTime || 0);
  const [calories, setCalories] = useState(recipe?.macros.calories || 0);
  const [protein, setProtein] = useState(recipe?.macros.protein || 0);
  const [carbs, setCarbs] = useState(recipe?.macros.carbs || 0);
  const [fats, setFats] = useState(recipe?.macros.fats || 0);
  const [selectedTags, setSelectedTags] = useState<RecipeTag[]>(recipe?.tags || []);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    recipe?.ingredients || [{ id: generateId(), name: "", quantity: 1, unit: "", category: "other" }],
  );
  const [instructions, setInstructions] = useState<string[]>(recipe?.instructions || [""]);

  const toggleTag = (tag: RecipeTag) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: unknown) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing)));
  };

  const addIngredient = () => {
    setIngredients((prev) => [...prev, { id: generateId(), name: "", quantity: 1, unit: "", category: "other" }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions((prev) => prev.map((step, i) => (i === index ? value : step)));
  };

  const addInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const recipeData: Recipe = {
      id: recipe?.id || generateId(),
      name,
      description,
      servings,
      prepTime,
      cookTime,
      macros: { calories, protein, carbs, fats },
      tags: selectedTags,
      ingredients: ingredients.filter((ing) => ing.name.trim() !== ""),
      instructions: instructions.filter((step) => step.trim() !== ""),
      createdAt: recipe?.createdAt || new Date().toISOString(),
    };

    if (recipe) {
      updateRecipe(recipe.id, recipeData);
    } else {
      addRecipe(recipeData);
    }

    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Basic Info */}
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='name'>Recipe Name *</Label>
          <Input
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='e.g., Grilled Chicken Salad'
            required
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='description'>Description</Label>
          <Textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='A brief description of the recipe...'
            rows={2}
          />
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='servings'>Servings</Label>
            <Input
              id='servings'
              type='number'
              min={1}
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='prepTime'>Prep (min)</Label>
            <Input
              id='prepTime'
              type='number'
              min={0}
              value={prepTime}
              onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='cookTime'>Cook (min)</Label>
            <Input
              id='cookTime'
              type='number'
              min={0}
              value={cookTime}
              onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Macros */}
      <div className='space-y-3'>
        <Label>Nutrition (per serving)</Label>
        <div className='grid grid-cols-4 gap-3'>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>Calories</Label>
            <Input
              type='number'
              min={0}
              value={calories}
              onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>Protein (g)</Label>
            <Input type='number' min={0} value={protein} onChange={(e) => setProtein(parseInt(e.target.value) || 0)} />
          </div>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>Carbs (g)</Label>
            <Input type='number' min={0} value={carbs} onChange={(e) => setCarbs(parseInt(e.target.value) || 0)} />
          </div>
          <div className='space-y-1'>
            <Label className='text-xs text-muted-foreground'>Fats (g)</Label>
            <Input type='number' min={0} value={fats} onChange={(e) => setFats(parseInt(e.target.value) || 0)} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className='space-y-3'>
        <Label>Tags</Label>
        <div className='flex flex-wrap gap-2'>
          {allTags.map((tag) => (
            <button
              key={tag}
              type='button'
              onClick={() => toggleTag(tag)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full border transition-all capitalize",
                selectedTags.includes(tag)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted",
              )}>
              {tag.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredients */}
      <div className='space-y-3'>
        <Label>Ingredients</Label>
        <div className='space-y-2'>
          {ingredients.map((ing, index) => (
            <div key={ing.id} className='flex gap-2 items-start'>
              <div className='flex-1 grid grid-cols-4 gap-2'>
                <Input
                  placeholder='Name'
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, "name", e.target.value)}
                  className='col-span-2'
                />
                <Input
                  type='number'
                  placeholder='Qty'
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)}
                />
                <Input
                  placeholder='Unit'
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                />
              </div>
              <Select value={ing.category} onValueChange={(v) => updateIngredient(index, "category", v)}>
                <SelectTrigger className='w-28'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className='capitalize'>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => removeIngredient(index)}
                className='text-muted-foreground hover:text-destructive'>
                <X className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
        <Button type='button' variant='outline' size='sm' onClick={addIngredient}>
          <Plus className='w-4 h-4 mr-2' />
          Add Ingredient
        </Button>
      </div>

      {/* Instructions */}
      <div className='space-y-3'>
        <Label>Instructions</Label>
        <div className='space-y-2'>
          {instructions.map((step, index) => (
            <div key={index} className='flex gap-2 items-start'>
              <span className='shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium mt-2'>
                {index + 1}
              </span>
              <Textarea
                placeholder={`Step ${index + 1}...`}
                value={step}
                onChange={(e) => updateInstruction(index, e.target.value)}
                rows={2}
                className='flex-1'
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => removeInstruction(index)}
                className='text-muted-foreground hover:text-destructive mt-2'>
                <X className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
        <Button type='button' variant='outline' size='sm' onClick={addInstruction}>
          <Plus className='w-4 h-4 mr-2' />
          Add Step
        </Button>
      </div>

      {/* Submit */}
      <div className='flex gap-3 pt-4'>
        <Button type='submit' className='flex-1 bg-primary hover:bg-primary/90'>
          {recipe ? "Save Changes" : "Create Recipe"}
        </Button>
      </div>
    </form>
  );
}
