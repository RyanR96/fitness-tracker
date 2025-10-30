import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CreateWorkoutModal(props) {
  const { isOpen, onClose } = props;
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState([]);
  const [workoutName, setWorkoutName] = useState("");
  const [error, setError] = useState("");
  const [searchExercises, setSearchExercises] = useState("");

  useEffect(() => {
    //setAllExercises(["Bench Press", "Overhead Press", "Push ups"]);

    const fetchExercises = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/workouts/exerciseName",
          {
            method: "GET",
            headers: { Authorization: `bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("failed to get exercises");

        const data = await res.json();
        console.log("data is :", data);
        setAllExercises(data);
        console.log("All exercises state is:", allExercises);
      } catch (err) {
        console.error("Error fetching exercises", err);

        //maybe set a state with the message and render it?
      }
    };
    fetchExercises();
  }, []);

  //if (!isOpen) return null;

  const searchedExercises = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(searchExercises.toLowerCase())
  );

  const addExercise = ex => {
    if (!selectedExercise.includes(ex)) {
      setSelectedExercise([...selectedExercise, ex]);
    }
  };

  const removeExercise = ex => {
    setSelectedExercise(selectedExercise.filter(exercise => exercise !== ex));
  };

  const handleCreate = async () => {
    if (selectedExercise.length === 0) {
      alert("Please select at least one exercise");
      return;
    }

    if (workoutName.length <= 0) {
      alert("Please enter a workout name");
      return;
    }

    try {
      const workoutData = {
        name: workoutName,
        exerciseTemplateName: selectedExercise.map(ex => ex.name),
      };
      console.log(JSON.stringify(workoutData, null, 2));
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/workouts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          name: workoutName,
          exerciseTemplateName: selectedExercise.map(ex => ex.name),
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create workout");
      }

      const data = await res.json();
      setWorkoutName("");
      setSelectedExercise([]);
      onClose();
      setError("");
      setSearchExercises("");
      console.log("Workout created with data:", data);
    } catch (err) {
      console.error("Error creating workout", err.message);
      setError(err.message);

      console.log(error);
    }

    //console.log("Create workout:", workoutName, selectedExercise);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="bg-white p-6 rounded shadow-lg max-w-3xl w-full h-[80vh] sm:h-[500px] overflow-hidden flex flex-col"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Create Workout
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 overflow-hidden justify-center">
              {/**Left side of the column */}
              <div className="border p-4 rounded overflow-auto sm:col-span-1">
                <input
                  placeholder="Enter workout name"
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
                        key={ex.id}
                        className="flex justify-between items-center py-1"
                      >
                        {ex.name}
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
              <div className="border p-4 rounded overflow-y-auto sm:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Exercises
                </h2>
                <input
                  type="text"
                  placeholder="Search exercise"
                  value={searchExercises}
                  onChange={e => setSearchExercises(e.target.value)}
                  className="w-full px-3 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2"
                />
                <ul className="grid grid-cols-2 gap-2 overflow-y">
                  {searchedExercises.map(ex => (
                    <li
                      className="cursor-pointer py-1 hover:bg-gray-100 rounded px-2"
                      key={ex.id}
                      onClick={() => addExercise(ex)}
                    >
                      {ex.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-red-500 text-sm mt-1 h-2">{error || " "}</p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateWorkoutModal;
