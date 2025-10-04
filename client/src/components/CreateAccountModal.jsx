import { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

function CreateAccountModal(props) {
  const { isOpen, onClose } = props;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleSubmit = e => {
    e.preventDefault();

    let newErrors = {};

    if (!username) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Signed up with:", { username, password });

      onClose();
      setUsername("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  //if (!isOpen) return null;

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
            className="relative bg-white p-6 rounded-2xl shadow-lg h-[50%]"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={onClose}
              className="absolute top-0 right-0 mt-2 mr-2 text-lg text-gray-500 hover:text-gray-800 "
            >
              X
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              {" "}
              Create Account:
            </h2>
            <form
              className="flex flex-col justify-evenly h-full"
              onSubmit={handleSubmit}
            >
              <div className="">
                <input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
                ></input>

                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.username || " "}
                </p>
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
                ></input>
                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.password || " "}
                </p>
              </div>
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent focus:ring-green-500"
                ></input>
                <p className="text-red-500 text-sm mt-1 h-2">
                  {errors.confirmPassword || " "}
                </p>
              </div>
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300 w-full"
                type="submit"
              >
                Sign up
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateAccountModal;
