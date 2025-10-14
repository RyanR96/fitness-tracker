import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmFinishModal from "./ConfirmFinishModal";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function StartWorkout() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercise, setExercise] = useState(null);

  /**
   *  const workout = {
    id: 1,
    name: "Push Day",
    exercises: [
      {
        exerciseTemplateName: "Push Ups",
        sets: [{ weight: "", reps: "", formRating: 1, dropSet: false }],
      },
      {
        exerciseTemplateName: "Bench Press",
        sets: [{ weight: "", reps: "", formRating: 1, dropSet: false }],
      },
    ],
  };
   */

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/api/workouts/${id}`, {
          headers: {
            method: "GET",
            Authorization: `bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch workout, response: ${res.status}`);
        }

        const data = await res.json();
        console.log("Pre formatted Data:", data);

        const formattedWorkout = {
          ...data,
          exercises: data.exercises.map(exercise => ({
            ...exercise,
            sets: [{ weight: "", reps: "", formRating: 1, dropSet: false }],
          })),
        };
        console.log("Post formatted data", formattedWorkout);
        setWorkout(formattedWorkout);
        setExercise(formattedWorkout.exercises);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchWorkout();
    console.log("Hmm");
  }, [id]);

  if (!exercise) return <p>Loading workout</p>;
  const currentExercise = exercise[currentExerciseIndex];

  const handleSetChange = (setIndex, field, value) => {
    setExercise(prev => {
      const newData = [...prev];
      newData[currentExerciseIndex].sets[setIndex][field] = value;
      return newData;
    });
  };

  const addSet = () => {
    if (currentExercise.sets.length >= 10) {
      alert("Too many sets!");
      return;
    }

    console.log("exercise", exercise);
    console.log("current exercise", currentExercise);
    console.log("current exercise index", currentExerciseIndex);
    console.log("exercise length", exercise.length);
    setExercise(prev => {
      const newData = [...prev];

      const exercise = { ...newData[currentExerciseIndex] };

      exercise.sets = [
        ...exercise.sets,
        { weight: "", reps: "", formRating: 1, dropSet: false },
      ];
      newData[currentExerciseIndex] = exercise;

      return newData;
    });
  };

  const handleNext = () => {
    setCurrentExerciseIndex(currentExerciseIndex + 1);
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0)
      setCurrentExerciseIndex(currentExerciseIndex - 1);
  };

  const handleFinish = async () => {
    console.log(exercise);

    const completedExercise = exercise.map(ex => ({
      exerciseTemplateName: ex.exerciseTemplateName,
      sets: ex.sets.map(s => ({
        weight: parseFloat(s.weight),
        reps: parseFloat(s.reps),
        formRating: parseInt(s.formRating),
        dropSet: s.dropSet ?? false,
      })),
    }));

    console.log("Data to send:", {
      workoutId: workout.id,
      completedExercise,
    });

    setExercise(workout.exercises);
    navigate("/dashboard");

    //* This is where the data should be sent off to the API!! currently everything is being mocked
  };

  const confirmFinish = () => setIsConfirmOpen(true);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text 3x1 font-bold mb-2 text-center">{workout.name}</h1>
      <p className="text-center mb-4">
        Exercise {currentExerciseIndex + 1} of {exercise.length}
      </p>

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
                  min={1}
                  max={10}
                  value={s.formRating}
                  onChange={e => {
                    const value = Math.max(
                      1,
                      Math.min(10, Number(e.target.value))
                    );
                    handleSetChange(i, "formRating", value);
                  }}
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

          <div className="flex justify-between items-center mt-12 ">
            <button
              className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
              onClick={addSet}
            >
              Add set
            </button>
            <div className="border-2 border-black">
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={handlePrev}
              >
                Prev
              </button>

              {currentExerciseIndex === exercise.length - 1 ? (
                <button
                  className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                  onClick={confirmFinish}
                >
                  Finish
                </button>
              ) : (
                <button
                  className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                  onClick={handleNext}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmFinishModal
        isOpen={isConfirmOpen}
        onConfirm={handleFinish}
        onCancel={() => setIsConfirmOpen(false)}
        title="Finish Workout?"
        message="Are you sure you want to finish the workout? You won't be able to edit it."
        action="Finish"
      />
    </div>
  );
}

export default StartWorkout;
