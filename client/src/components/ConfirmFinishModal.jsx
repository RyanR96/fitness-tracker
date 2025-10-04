import { motion, AnimatePresence } from "framer-motion";

function ConfirmFinishModal(props) {
  const { isOpen, onConfirm, onCancel } = props;

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
            className="bg-white rounded-lg p-6"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-lg font-bold mb-4 flex items-center justify-center">
              Finish Workout?
            </h2>
            <p className="mb-6">
              Are you sure you want to finish the workout? You won't be able to
              edit it.
            </p>
            <div className="mt-6 flex justify-between gap-4">
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={onConfirm}
              >
                Finish
              </button>
              <button
                className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmFinishModal;
