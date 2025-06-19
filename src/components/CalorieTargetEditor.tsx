
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CalorieTargetEditorProps {
  currentTarget: number;
  onTargetUpdate: (newTarget: number) => void;
  remainingCalories: number;
}

const CalorieTargetEditor = ({ currentTarget, onTargetUpdate, remainingCalories }: CalorieTargetEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(currentTarget.toString());

  const handleSave = () => {
    const target = parseInt(newTarget);
    if (target && target > 0 && target <= 5000) {
      onTargetUpdate(target);
      setIsEditing(false);
      toast({
        title: "Calorie Target Updated! 🎯",
        description: `Your daily calorie target is now ${target} calories.`,
      });
    } else {
      toast({
        title: "Invalid Target",
        description: "Please enter a valid calorie target between 1 and 5000.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setNewTarget(currentTarget.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
              <Target className="h-4 w-4" />
              Edit Daily Calorie Target
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                placeholder="Enter calorie target"
                min="1"
                max="5000"
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg relative group">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
      >
        <Edit className="h-3 w-3" />
      </Button>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Target className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-gray-600">Daily Target: {currentTarget} cal</span>
      </div>
      <div className="text-3xl font-bold text-blue-600">
        {remainingCalories > 0 ? remainingCalories : 0}
      </div>
      <div className="text-sm text-gray-600">Calories Remaining</div>
      {remainingCalories <= 0 && (
        <div className="text-xs text-green-600 font-medium mt-1">Goal Achieved! 🎉</div>
      )}
    </div>
  );
};

export default CalorieTargetEditor;
