import { useState } from "react";

function StartWorkout() {
  const workout = {
    id: 1,
    name: "Push Day",
    exercises: [
      {
        exerciseTemplateName: "Push Ups",
        sets: [{ weight: "", reps: "", formRating: "", dropSet: false }],
      },
      {
        exerciseTemplateName: "Bench Press",
        sets: [{ weight: "", reps: "", formRating: "", dropSet: false }],
      },
    ],
  };

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercise, setExercise] = useState(workout.exercises);

  const currentExercise = exercise[currentExerciseIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text 3x1 font-bold mb-2 text-center">
        Workout name - change to dynamic later
      </h1>
      <p className="text-center mb-4">Exercise 1 of 3 - change to dynamic</p>

      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-200 p-6 rounded shadow">
          <h2 className="text-2x1 font-semibold mb-4 text-center">
            {currentExercise.exerciseTemplateName}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default StartWorkout;
