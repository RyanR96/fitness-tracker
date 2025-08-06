import { useState, useEffect } from "react";

function CreateWorkoutModal(props) {
  const { isOpen, onClose } = props;

  if (!isOpen) return null;

  return (
    <div>
      MMMMM
      <button
        className="bg-green-500 text-black px-6 py 2 rounded-full font-semibold hover:bg-green-300"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
}

export default CreateWorkoutModal;
