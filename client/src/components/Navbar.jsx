import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-black text-white shadow p-4">
      <h1 className="text-xl font-bold">MyFitnessApp</h1>
      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/trackWeight" className="hover:underline">
          Track weight
        </Link>
      </div>

      <button className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 md:col-span-2 justify-self-center">
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
