import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import ConfirmFinishModal from "./ConfirmFinishModal";
import { toast } from "sonner";

function StartWorkoutModal(props) {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();

  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [error, setError] = useState("");

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
        setError("");
      } catch (err) {
        console.error("Error retrieving workouts", err.message);
        setError(err.message);
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
    setError("");
    if (!selectedWorkout) {
      requestAnimationFrame(() => {
        setError("Please select a workout");
      });

      return;
    }
    navigate(`/workout/${selectedWorkout.id}`);
    onClose();
  };

  const handleDelete = async () => {
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
      setError("");
      toast.success("Workout succesfully deleted");
    } catch (err) {
      console.error(err);
      setError(err.message);
      toast.error(
        err.message === "Failed to fetch"
          ? "Server did not respond. Please try again later"
          : err.message
      );
      setIsConfirmOpen(false);
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
          {/**Breaks if I don't have flex-col here, I want to learn more about the why, so make sure to look it up later! */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl h-[80vh] sm:h-[505px] max-w-3xl w-full flex flex-col"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4 text-center">
              Start Workout
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden h-full">
              {/**Left side of the column */}
              <div className="border p-4 rounded overflow-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Select Workout
                </h2>
                {workouts.length === 0 ? (
                  <p className="text-gray-500">
                    No workouts created, please create a workout
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {workouts.map(workout => (
                      <li key={workout.id}>
                        <button
                          onClick={() => setSelectedWorkout(workout)}
                          className={`w-full text-left px-4 py-2 rounded-lg hover:shadow-lg transitions-colors duration-182 ${
                            selectedWorkout?.id === workout.id
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 hover:bg-green-200"
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
              <div className="border p-4 rounded overflow-y-auto custom-scrollbar">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Exercises
                </h2>
                {selectedWorkout ? (
                  <ul className="space-y-2">
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
            <motion.p
              className="text-red-500 text-sm mt-1 min-h-[18px] font-bold"
              key={error}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: easeInOut }}
            >
              {error || ""}
            </motion.p>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
              <button
                className="w-full sm:w-auto bg-green-500 text-black px-6 py-1 rounded-full font-semibold hover:bg-green-300"
                onClick={handleStart}
              >
                Start Workout
              </button>

              <button
                className="w-full sm:w-auto bg-green-500 text-black px-6 py-1  rounded-full font-semibold hover:bg-green-300"
                onClick={() => {
                  setError("");
                  if (!selectedWorkout) {
                    requestAnimationFrame(() => {
                      setError("Please select a workout");
                    });

                    return;
                  }
                  setIsConfirmOpen(true);
                }}
              >
                Delete Workout
              </button>

              <button
                className="w-full sm:w-auto bg-green-500 text-black px-6 py-1  rounded-full font-semibold hover:bg-green-300"
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
