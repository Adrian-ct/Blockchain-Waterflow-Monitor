type Confirmation = () => void;
type Props = {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  confirmation: Confirmation;
};

const ConfirmationModal = ({ active, setActive, confirmation }: Props) => {
  return (
    <div
      className={`modal ${active ? "modal-open" : ""}`}
      role="dialog"
      aria-labelledby="dialogTitle"
    >
      <div className="modal-box bg-white">
        <h3 id="dialogTitle" className="font-bold text-lg text-center ">
          Are you sure you want to delete this contact?
        </h3>
        <div className="flex justify-between items-center">
          <div className="modal-action ml-auto">
            <button
              onClick={() => confirmation()}
              className="btn btn-error text-white"
            >
              Yes
            </button>
            <button
              onClick={() => setActive(false)}
              className="btn btn-info text-white"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
