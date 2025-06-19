
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Apple, Search } from "lucide-react";

interface MealModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMealLogged: (name: string, calories: number, mealType: string) => void;
}

const MealModal = ({ open, onOpenChange, onMealLogged }: MealModalProps) => {
  const [mealType, setMealType] = useState('');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedQuickFood, setSelectedQuickFood] = useState<any>(null);

  const mealTypes = [
    { name: 'Breakfast', icon: '🌅', color: 'bg-orange-100 text-orange-700' },
    { name: 'Lunch', icon: '☀️', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Dinner', icon: '🌙', color: 'bg-purple-100 text-purple-700' },
    { name: 'Snack', icon: '🍎', color: 'bg-green-100 text-green-700' },
  ];

  const quickFoods = [
    { name: 'Banana', calories: 105 },
    { name: 'Apple', calories: 80 },
    { name: 'Chicken Breast (100g)', calories: 165 },
    { name: 'Brown Rice (1 cup)', calories: 220 },
    { name: 'Greek Yogurt', calories: 130 },
    { name: 'Almonds (30g)', calories: 170 },
  ];

  const handleQuickFood = (food: any) => {
    setSelectedQuickFood(food);
    setFoodName(food.name);
    setCalories(food.calories.toString());
  };

  const handleLogMeal = () => {
    if (!mealType || !foodName || !calories) return;
    
    onMealLogged(foodName, parseInt(calories), mealType);
    setMealType('');
    setFoodName('');
    setCalories('');
    setSelectedQuickFood(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Apple className="h-5 w-5" />
            Log Meal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Meal Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((meal) => (
                <Card 
                  key={meal.name}
                  className={`cursor-pointer transition-all ${
                    mealType === meal.name 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setMealType(meal.name)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{meal.icon}</div>
                    <div className="text-sm font-medium">{meal.name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-3 block">Quick Add</Label>
            <div className="grid gap-2">
              {quickFoods.map((food) => (
                <Card 
                  key={food.name}
                  className={`cursor-pointer transition-all ${
                    selectedQuickFood?.name === food.name 
                      ? 'ring-2 ring-green-500 bg-green-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleQuickFood(food)}
                >
                  <CardContent className="p-3 flex justify-between items-center">
                    <span className="text-sm font-medium">{food.name}</span>
                    <span className="text-sm text-gray-600">{food.calories} cal</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-3 block">Or Add Custom Food</Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="foodName">Food Name</Label>
                <Input
                  id="foodName"
                  placeholder="e.g., Grilled Salmon"
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 250"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
            </div>
          </div>

          {mealType && foodName && calories && (
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Adding to {mealType}:</div>
              <div className="font-medium">{foodName}</div>
              <div className="text-lg font-bold text-green-600">{calories} calories</div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleLogMeal}
              disabled={!mealType || !foodName || !calories}
              className="flex-1"
            >
              Log Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MealModal;
