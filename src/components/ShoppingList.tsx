import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp, Package } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IngredientCategory, ShoppingItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useShoppingStore } from "@/lib/stores/shoppingStore";

const categoryLabels: Record<IngredientCategory, { label: string; icon: string; color: string }> = {
  produce: { label: "Produce", icon: "🥬", color: "bg-green-100 border-green-200" },
  meat: { label: "Meat & Seafood", icon: "🥩", color: "bg-red-100 border-red-200" },
  dairy: { label: "Dairy", icon: "🧀", color: "bg-yellow-100 border-yellow-200" },
  pantry: { label: "Pantry", icon: "🥫", color: "bg-amber-100 border-amber-200" },
  frozen: { label: "Frozen", icon: "🧊", color: "bg-blue-100 border-blue-200" },
  beverages: { label: "Beverages", icon: "🥤", color: "bg-cyan-100 border-cyan-200" },
  bakery: { label: "Bakery", icon: "🍞", color: "bg-orange-100 border-orange-200" },
  other: { label: "Other", icon: "📦", color: "bg-gray-100 border-gray-200" },
};

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

export function ShoppingList() {
  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(new Set(categories));
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState("1");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>("other");

  const {
    shoppingList,
    generateShoppingList,
    toggleItemPurchased,
    addManualItem,
    removeShoppingItem,
    clearPurchasedItems,
    // recipes,
  } = useShoppingStore();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const groupedItems = useMemo(() => {
    const groups: Record<IngredientCategory, ShoppingItem[]> = {
      produce: [],
      meat: [],
      dairy: [],
      pantry: [],
      frozen: [],
      beverages: [],
      bakery: [],
      other: [],
    };

    shoppingList.forEach((item) => {
      groups[item.category].push(item);
    });

    return groups;
  }, [shoppingList]);

  const toggleCategory = (category: IngredientCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const handleGenerateList = () => {
    generateShoppingList(format(weekStart, "yyyy-MM-dd"), format(weekEnd, "yyyy-MM-dd"));
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) return;

    addManualItem({
      name: newItemName.trim(),
      quantity: parseFloat(newItemQty) || 1,
      unit: newItemUnit.trim(),
      category: newItemCategory,
    });

    setNewItemName("");
    setNewItemQty("1");
    setNewItemUnit("");
    setNewItemCategory("other");
    setIsAddingItem(false);
  };

  const totalItems = shoppingList.length;
  const purchasedItems = shoppingList.filter((i) => i.purchased).length;
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

  return (
    <div className='space-y-6 md:ml-48'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='font-display text-2xl md:text-3xl font-bold text-foreground'>Shopping List</h1>
          <p className='text-muted-foreground'>
            Week of {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d")}
          </p>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' onClick={handleGenerateList}>
            <RefreshCw className='w-4 h-4 mr-2' />
            Regenerate
          </Button>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button className='bg-primary hover:bg-primary/90'>
                <Plus className='w-4 h-4 mr-2' />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Shopping Item</DialogTitle>
              </DialogHeader>
              <div className='space-y-4 pt-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Item Name</label>
                  <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder='e.g., Apples'
                  />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Quantity</label>
                    <Input
                      type='number'
                      value={newItemQty}
                      onChange={(e) => setNewItemQty(e.target.value)}
                      placeholder='1'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium'>Unit</label>
                    <Input
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      placeholder='e.g., kg, pieces'
                    />
                  </div>
                </div>
                <div className='space-y-2'>
                  <label className='text-sm font-medium'>Category</label>
                  <Select value={newItemCategory} onValueChange={(v) => setNewItemCategory(v as IngredientCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          <span className='flex items-center gap-2'>
                            <span>{categoryLabels[cat].icon}</span>
                            {categoryLabels[cat].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddItem} className='w-full'>
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress */}
      {totalItems > 0 && (
        <Card>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium'>Shopping Progress</span>
              <span className='text-sm text-primary font-semibold'>
                {purchasedItems}/{totalItems} items
              </span>
            </div>
            <div className='h-3 bg-muted rounded-full overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className='h-full bg-linear-to-r from-primary to-sage-500 rounded-full'
              />
            </div>
            {purchasedItems > 0 && (
              <Button
                variant='ghost'
                size='sm'
                className='mt-3 text-muted-foreground hover:text-destructive'
                onClick={clearPurchasedItems}>
                <Trash2 className='w-4 h-4 mr-2' />
                Clear Purchased Items
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shopping List */}
      {shoppingList.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <Package className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
            <h3 className='font-semibold text-lg mb-2'>No items in your list</h3>
            <p className='text-muted-foreground mb-4'>
              Generate a shopping list from your meal plan or add items manually
            </p>
            <div className='flex gap-3 justify-center'>
              <Button onClick={handleGenerateList} className='bg-primary hover:bg-primary/90'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Generate from Meals
              </Button>
              <Button variant='outline' onClick={() => setIsAddingItem(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Add Manually
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {categories.map((category) => {
            const items = groupedItems[category];
            if (items.length === 0) return null;

            const catInfo = categoryLabels[category];
            const isExpanded = expandedCategories.has(category);
            const purchasedCount = items.filter((i) => i.purchased).length;

            return (
              <Card key={category} className={cn("overflow-hidden", catInfo.color)}>
                <CardHeader
                  className='py-3 cursor-pointer hover:bg-muted/50 transition-colors'
                  onClick={() => toggleCategory(category)}>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base flex items-center gap-2'>
                      <span className='text-xl'>{catInfo.icon}</span>
                      {catInfo.label}
                      <span className='text-sm font-normal text-muted-foreground'>
                        ({purchasedCount}/{items.length})
                      </span>
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className='w-5 h-5 text-muted-foreground' />
                    ) : (
                      <ChevronDown className='w-5 h-5 text-muted-foreground' />
                    )}
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <CardContent className='pt-0 pb-3 space-y-2'>
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                              "flex items-center gap-3 p-3 bg-card rounded-xl transition-all group",
                              item.purchased && "opacity-60",
                            )}>
                            <button
                              onClick={() => toggleItemPurchased(item.id)}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                item.purchased
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-muted-foreground/30 hover:border-primary",
                              )}>
                              {item.purchased && <Check className='w-4 h-4' />}
                            </button>

                            <span
                              className={cn(
                                "flex-1 font-medium transition-all",
                                item.purchased && "line-through text-muted-foreground",
                              )}>
                              {item.name}
                            </span>

                            <span className='text-sm text-muted-foreground'>
                              {item.quantity} {item.unit}
                            </span>

                            {item.recipeIds.length > 0 && (
                              <span className='text-xs text-muted-foreground hidden sm:inline'>
                                ({item.recipeIds.length} recipe{item.recipeIds.length > 1 ? "s" : ""})
                              </span>
                            )}

                            <button
                              onClick={() => removeShoppingItem(item.id)}
                              className='opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all'>
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </motion.div>
                        ))}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
