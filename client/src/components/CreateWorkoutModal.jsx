import { useState, useEffect } from "react";

function CreateWorkoutModal(props) {
  const { isOpen, onClose } = props;
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState([]);
  const [workoutName, setWorkoutName] = useState("Enter workout name");

  useEffect(() => {
    setAllExercises(["Bench Press", "Overhead Press", "Push ups"]);
  }, []);

  if (!isOpen) return null;

  const addExercise = ex => {
    if (!selectedExercise.includes(ex)) {
      setSelectedExercise([...selectedExercise, ex]);
    }
  };

  const removeExercise = ex => {
    setSelectedExercise(selectedExercise.filter(exercise => exercise !== ex));
  };

  const handleCreate = () => {
    if (selectedExercise.length === 0) {
      alert("Please select at least one exercise");
      return;
    }
    console.log("Create working:", workoutName, selectedExercise);
    setWorkoutName("Enter workout name");
    setSelectedExercise([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Create Workout
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/**Left side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <input
              type="text"
              value={workoutName}
              onChange={e => setWorkoutName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
            />
            {selectedExercise.length === 0 ? (
              <p className="text-gray-500">No exercises selected</p>
            ) : (
              <ul>
                {selectedExercise.map(ex => (
                  <li
                    key={ex}
                    className="flex justify-between items-center py-1"
                  >
                    {ex}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeExercise(ex)}
                    >
                      X
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/**Right side of the column */}
          <div className="border p-4 rounded overflow-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Exercises
            </h2>
            <ul>
              {allExercises.map(ex => (
                <li
                  className="cursor-pointer py-1 hover:bg-gray-100 rounded px-2"
                  key={ex}
                  onClick={() => addExercise(ex)}
                >
                  {ex}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex justify-between gap-4">
          <button
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            onClick={handleCreate}
          >
            Create
          </button>

          <button
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkoutModal;
