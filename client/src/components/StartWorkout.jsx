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

  const handleSetChange = (setIndex, field, value) => {
    setExercise(prev => {
      const newData = [...prev];
      newData[currentExerciseIndex].sets[setIndex][field] = value;
      return newData;
    });
  };

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

          {currentExercise.sets.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-2 gap-4 mb-4 items-center"
            >
              <div className="flex items-center justify-center font-semibold sm:col-span-2 lg:col-span-1">
                Set {i + 1}:
              </div>
              <div className="flex items-center space-x-3">
                <label className="block mb-1">Weight:</label>
                <input
                  className="w-20 border rounded px-3 py-2"
                  type="number"
                  value={s.weight}
                  onChange={e => handleSetChange(i, "weight", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-7">
                <label className="block mb-1">Reps:</label>
                <input
                  className="w-20 border rounded px-3 py-2"
                  type="number"
                  value={s.reps}
                  onChange={e => handleSetChange(i, "reps", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-6 space-x-0.5">
                <label className="block mb-1">Form:</label>
                <input
                  className="w-20 border rounded px-3 py-2"
                  type="number"
                  value={s.formRating}
                  onChange={e =>
                    handleSetChange(i, "formRating", e.target.value)
                  }
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="mr-1">Dropset:</label>
                <input
                  className="w-20 h-10"
                  type="checkbox"
                  checked={s.dropSet}
                  onChange={e =>
                    handleSetChange(i, "dropSet", e.target.checked)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StartWorkout;
