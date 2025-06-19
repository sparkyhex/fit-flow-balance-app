
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface WorkoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutLogged: (calories: number) => void;
}

const WorkoutModal = ({ open, onOpenChange, onWorkoutLogged }: WorkoutModalProps) => {
  const [selectedWorkout, setSelectedWorkout] = useState('');
  const [duration, setDuration] = useState('');

  const workoutTypes = [
    { name: 'Walking', met: 3.5, icon: '🚶‍♂️' },
    { name: 'Running', met: 8.0, icon: '🏃‍♂️' },
    { name: 'Cycling', met: 6.0, icon: '🚴‍♂️' },
    { name: 'Strength Training', met: 6.0, icon: '💪' },
    { name: 'Yoga', met: 3.0, icon: '🧘‍♂️' },
    { name: 'HIIT', met: 8.5, icon: '🔥' },
  ];

  const calculateCalories = (met: number, durationMin: number) => {
    // Simplified calculation: MET * weight(kg) * time(hours)
    // Using average weight of 70kg for demo
    const weightKg = 70;
    const hours = durationMin / 60;
    return Math.round(met * weightKg * hours);
  };

  const handleLogWorkout = () => {
    if (!selectedWorkout || !duration) return;
    
    const workout = workoutTypes.find(w => w.name === selectedWorkout);
    if (workout) {
      const calories = calculateCalories(workout.met, parseInt(duration));
      onWorkoutLogged(calories);
      setSelectedWorkout('');
      setDuration('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Log Workout
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Label className="text-sm font-medium mb-3 block">Select Workout Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {workoutTypes.map((workout) => (
                <Card 
                  key={workout.name}
                  className={`cursor-pointer transition-all ${
                    selectedWorkout === workout.name 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedWorkout(workout.name)}
                >
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl mb-1">{workout.icon}</div>
                    <div className="text-sm font-medium">{workout.name}</div>
                    <div className="text-xs text-gray-500">{workout.met} MET</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="e.g., 30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          {selectedWorkout && duration && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600">Estimated calories burned:</div>
              <div className="text-2xl font-bold text-blue-600">
                {calculateCalories(
                  workoutTypes.find(w => w.name === selectedWorkout)?.met || 0,
                  parseInt(duration) || 0
                )} cal
              </div>
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
              onClick={handleLogWorkout}
              disabled={!selectedWorkout || !duration}
              className="flex-1"
            >
              Log Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkoutModal;
