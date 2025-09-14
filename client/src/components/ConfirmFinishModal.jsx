function ConfirmFinishModal(props) {
  const { isOpen, onConfirm, onCancel } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center justify-center">
          Finish Workout?
        </h2>
        <p className="mb-6">
          Are you sure you want to finish the workout? You won't be able to edit
          it.
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
      </div>
    </div>
  );
}

export default ConfirmFinishModal;
