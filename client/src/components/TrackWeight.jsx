import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ConfirmFinishModal from "./ConfirmFinishModal";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { toast } from "sonner";

function TrackWeight() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [weightData, setWeightData] = useState([]);

  const [newDate, setNewData] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [entryToDelete, setEntryToDelete] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/weightTracker/", {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch weight history:${res.status}`);
        }

        const data = await res.json();
        console.log(data);
        const formattedData = data.map(entry => ({
          id: entry.id,
          weight: entry.weight,
          date: new Date(entry.date).getTime(),
        }));
        console.log("Formatted data", formattedData);

        setWeightData(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWeight();
  }, []); //Probably needs to be when new weight is added, maybe the state newWeight?

  const handleEntry = async () => {
    if (!newDate || !newWeight) {
      setError("");
      requestAnimationFrame(() => {
        setError("Please enter both date and weight");
      });
      return;
    }

    const duplicate = weightData.some(
      entry =>
        entry.date === new Date(newDate).getTime() &&
        entry.weight === parseFloat(newWeight)
    );

    if (duplicate) {
      setError("");
      requestAnimationFrame(() => {
        setError("You have already entered this weight entry");
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/weightTracker/", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          date: newDate,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add weight");
      }
      /** Could do another fetch call instead of all this... but I think this is more efficient? Maybe buggy if two devices at once */
      const newEntry = await res.json();
      const formattedEntry = {
        ...newEntry,
        date: new Date(newEntry.date).getTime(),
      };
      console.log("Pushing this data", formattedEntry);
      console.log("Pushing that into", weightData);
      const updatedData = [...weightData, formattedEntry].sort(
        (a, b) => a.date - b.date
      );
      console.log("Post pushing data", updatedData);
      setWeightData(updatedData);
      setNewData("");
      setNewWeight("");
      setError("");
      toast.success("Weight entry succesfully added");
    } catch (err) {
      console.error(err);
      setError("");
      requestAnimationFrame(() => {
        if (err.message === "Failed to fetch") {
          setError("Server did not respond. Please try again later.");
        } else {
          setError(err.message);
        }
      });
    }
  };

  const handleDelete = async id => {
    console.log(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/weightTracker/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete entry, status: ${res.status}`);
      }

      setWeightData(prev => prev.filter(entry => entry.id !== id));
      toast.success("Weight entry succesfully removed");
    } catch (err) {
      console.error(err.message);
      toast.error(
        err.message === "Failed to fetch"
          ? "Server did not respond. Please try again later"
          : err.message
      );
    }
  };

  return (
    <div className="max-w-4x1 mx-auto p-6 ">
      <h1 className="text-2x1 font-bold mb-6 text-center">Track weight</h1>
      <div className="p-4 rounded-lg shadow mb-6 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weightData}>
            {/**Not sure about this yet <CartesianGrid strokeDasharray="3 3" />*/}

            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={["auto", "auto"]}
              allowDuplicatedCategory={false}
              tickFormatter={timestamp =>
                new Date(timestamp).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })
              }
            />
            <YAxis
              domain={["dataMin -1", "dataMax +1"]}
              tickFormatter={val => `${val}kg`}
            />
            <Tooltip
              labelFormatter={timestamp =>
                new Date(timestamp).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  /**{ hour: "2-digit",
                  minute: "2-digit",} For if I use proper timestamps*/
                })
              }
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#82ca9d"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[42vh]">
        <div className="p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-6 text-center">Add new weight</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 justify-self-center">
            <input
              type="date"
              className="border px-3 py-2 rounded w-full md:w-auto"
              value={newDate}
              onChange={e => setNewData(e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight(KG)"
              value={newWeight}
              className="border px-3 py-2 rounded w-full md:w-auto"
              onChange={e => setNewWeight(e.target.value)}
            />

            <button
              className="bg-green-500 text-black px-6 py-2 rounded-full font-semibold hover:bg-green-300 md:col-span-2 justify-self-center"
              onClick={handleEntry}
            >
              Add weight
            </button>
          </div>
          <motion.p
            className="text-red-500 text-sm mt-1 min-h-[18px] font-bold text-center mt-10"
            key={error}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeInOut }}
          >
            {error || ""}
          </motion.p>
        </div>
        <div className="p-2 rounded-lg shadow">
          <h2 className="text-lg font-bold mb-6 text-center">Weight Entries</h2>
          {weightData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">No weight entries added yet.</p>
              <p className="text-gray-500 mb-25">
                Please create an entry to see it appear here and in the graph.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 max-h-[310px] overflow-y-auto custom-scrollbar ">
              {weightData.map(entry => (
                <li
                  key={entry.id}
                  className="grid grid-cols-3 py-3 items-center hover:bg-green-200 transitions-colors duration-182"
                >
                  <span className="text-left">
                    {new Date(entry.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text-center">
                    <strong>{entry.weight}KG</strong>
                  </span>

                  <button
                    className=" text-red-500 hover:text-red-700 font-semibold justify-self-end mr-5"
                    onClick={() => {
                      setIsConfirmOpen(true);
                      setEntryToDelete(entry);
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
          {weightData.length === 1 && (
            <div className="flex items-center justify-center">
              <p className="text-gray-500 mt-15">
                Add one more weight entry for the chart to generate.
              </p>
            </div>
          )}
        </div>
        <ConfirmFinishModal
          isOpen={isConfirmOpen}
          onConfirm={() => {
            handleDelete(entryToDelete.id);
            setIsConfirmOpen(false);
          }}
          onCancel={() => setIsConfirmOpen(false)}
          title="Delete weight entry?"
          message={
            <>
              Are you sure you want to <strong>permanently </strong>delete the
              entry dated on{" "}
              <strong>
                {entryToDelete?.date &&
                  new Date(entryToDelete.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "2-digit",
                  })}
                ?{" "}
              </strong>
            </>
          }
          action="Delete"
        />
      </div>
    </div>
  );
}

export default TrackWeight;
