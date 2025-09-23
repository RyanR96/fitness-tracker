import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function TrackWeight() {
  const [weightData, setWeightData] = useState([
    { date: new Date("2025-09-01").getTime(), weight: 75 },
    { date: new Date("2025-09-08").getTime(), weight: 73 },
    { date: new Date("2025-09-10").getTime(), weight: 74 },
    { date: new Date("2025-09-15").getTime(), weight: 71 },
  ]);

  const [newDate, setNewData] = useState("");
  const [newWeight, setNewWeight] = useState("");

  const handleEntry = () => {
    if (!newDate || !newWeight) return;

    const newEntry = {
      date: new Date(newDate).getTime(),
      weight: parseFloat(newWeight),
    };

    const updatedData = [...weightData, newEntry].sort(
      (a, b) => a.date - b.date
    );
    setWeightData(updatedData);
    setNewData("");
    setNewWeight("");
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
      <div className="p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-6 text-center">Add new weight</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-self-center">
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
            className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 md:col-span-2 justify-self-center"
            onClick={handleEntry}
          >
            Add weight
          </button>
        </div>
      </div>
    </div>
  );
}

export default TrackWeight;
