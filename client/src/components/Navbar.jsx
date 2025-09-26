import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="flex justify-between items-center bg-black text-white shadow p-4">
      <h1 className="text-xl font-bold">MyFitnessApp</h1>
      <div className="hidden sm:flex gap-6 font-bold">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/trackWeight" className="hover:underline">
          Track weight
        </Link>
      </div>

      <button className=" hidden sm:flex bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 md:col-span-2 justify-self-center">
        Logout
      </button>

      <button
        className="sm:hidden flex bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 md:col-span-2 justify-self-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {isOpen && (
        <div className="sm:hidden absolute top-15 right-0  bg-gray-800  ">
          <ul className="space-y-2 font-bold z-50">
            <li className="">
              <Link
                to="/dashboard"
                className="hover:underline block hover:bg-gray-700  p-4 text-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/trackWeight"
                className="hover:underline block hover:bg-gray-700  p-4 text-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                Track weight
              </Link>
            </li>
            <li>
              <button
                className="hover:underline block hover:bg-gray-700 p-4 w-full"
                onClick={() => setIsOpen(!isOpen)}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
