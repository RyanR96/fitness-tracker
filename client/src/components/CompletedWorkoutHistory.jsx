import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

function CompletedWorkoutHistory() {
  //const location = useLocation(); old way, keeping it in as reminder lol
  const { id } = useParams();
  const [completedWorkout, setCompletedWorkouts] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/completedworkouts/${id}`,
          {
            headers: {
              method: "GET",
              Authorization: `bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setError("Workout not found");
            return;
          }

          throw new Error("Error fetching completed workout");
        }

        const data = await res.json();
        console.log("Fetched:", data);
        setCompletedWorkouts(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p>Loading workout</p>;

  if (error) return <NotFound message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
      <h1 className="text-lg font-bold mb-2 text-center">Workout History</h1>
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-gray-200 p-6 rounded shadow">
          <h2 className="text-base font-semibold mb-4 text-center">
            {completedWorkout.workout?.name || "Deleted Workout"}
            <br></br>
            {new Date(completedWorkout.date).toLocaleDateString()}
          </h2>

          {completedWorkout.exercises.map(exercise => (
            <div
              key={exercise.id}
              className="mb-6 max-h-80 overflow-y-auto custom-scrollbar"
            >
              <h2 className="text-lg font-semibold mb-2 text-center p-5">
                {exercise.exerciseTemplateName}:
              </h2>
              <ul className="space-y-1">
                {exercise.set.map((set, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-2 sm:grid-cols-4 text-center items-center bg-gray-100 px-2 mr-6 "
                  >
                    {/**gap-1 mb-1 items-center bg-white px-2 rounded-xl shadow-sm border border-gray-200  Either this or the one above, both look nice imo*/}
                    <span className="p-2 ">
                      <strong>Set {i + 1}:</strong>
                    </span>
                    <span className="p-2 font-mono">
                      {set.weight}kg x {set.reps} reps
                    </span>
                    <span className="p-2 font-mono">
                      Form: {set.formRating}
                    </span>
                    <span className="p-2 font-mono">
                      {set.dropset ? "Dropset" : "Normal"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompletedWorkoutHistory;
