import { useState, useEffect } from "react";

function CreateWorkoutModal(props) {
  const { isOpen, onClose } = props;
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState([]);

  useEffect(() => {
    setAllExercises(["Bench Press", "Overhead Press", "Push ups"]);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">Create Workout</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/**Left side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <p>sdffdsfsdsfdfsd</p>
          </div>

          {/**Right side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Exercises</h2>
            <ul>
              {allExercises.map(ex => (
                <li
                  className="cursor-pointer py-1 hover:bg-gray-100 rounded px-2"
                  key={ex}
                >
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CreateWorkoutModal;
