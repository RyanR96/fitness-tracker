import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmFinishModal from "./ConfirmFinishModal";

function StartWorkoutModal(props) {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return; // Prevent needless fetch when close
    /**    setWorkouts([
      { id: 1, name: "Push day", exercises: ["Bench press", "overhead Press"] },
      { id: 2, name: "Leg day", exercises: ["Dips", "overhead Press"] },
      {
        id: 3,
        name: "Pull day",
        exercises: ["Tricep", "overhead Press", "test"],
      },
    ]); */
    const fetchWorkouts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/workouts/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("failed to get exercises");

        const data = await res.json();

        console.log(data);
        const formattedData = data.map(w => ({
          id: w.id,
          name: w.name,
          exercises: w.exercises.map(e => e.exerciseTemplateName),
        }));
        console.log(formattedData);
        setWorkouts(formattedData);
      } catch (err) {
        console.error("Error fetching workouts");
      }
    };

    fetchWorkouts();
  }, [isOpen]);

  //if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    setSelectedWorkout(null);
  };

  const handleStart = () => {
    if (!selectedWorkout) return alert("Please select a workout");
    navigate(`/workout/${selectedWorkout.id}`);
    onClose();
  };

  const handleDelete = async () => {
    //alert("Placeholder");
    console.log("workout to delete is :", selectedWorkout);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/workouts/${selectedWorkout.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to delete workout");

      setWorkouts(prev =>
        prev.filter(workout => workout.id !== selectedWorkout.id)
      );
      setSelectedWorkout(null);
      setIsConfirmOpen(false);
    } catch (err) {
      console.error(err);
    }
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
            className="bg-white p-6 rounded shadow-lg max-w-lg w-full"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Start Workout
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/**Left side of the column */}
              <div className="border p-4 rounded overflow-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Select Workout
                </h2>
                {workouts.length === 0 ? (
                  <p>No workouts created, please create a workout</p>
                ) : (
                  <ul className="space-y-2">
                    {workouts.map(workout => (
                      <li key={workout.id}>
                        <button
                          onClick={() => setSelectedWorkout(workout)}
                          className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                            selectedWorkout?.id === workout.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                        >
                          {workout.name}
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
                {selectedWorkout ? (
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedWorkout.exercises.map(ex => (
                      <li
                        key={ex}
                        className="p-2 bg-gray-100 rounded-md shadow-sm"
                      >
                        {ex}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Select a workout to see it's exercises
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-between gap-4">
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={handleStart}
              >
                Start Workout
              </button>

              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={() => setIsConfirmOpen(true)}
                disabled={!selectedWorkout}
              >
                Delete Workout
              </button>

              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </motion.div>
          <ConfirmFinishModal
            isOpen={isConfirmOpen}
            onConfirm={handleDelete}
            onCancel={() => setIsConfirmOpen(false)}
            title="Delete workout?"
            message={
              <>
                Are you sure you want to <strong>permanently </strong>delete the
                workout <strong>"{selectedWorkout?.name}"? </strong>
              </>
            }
            action="Delete"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StartWorkoutModal;
