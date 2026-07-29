import { FaWallet } from "react-icons/fa";

function EmptyState() {
  return (
    <div className="empty">

      <FaWallet
        size={70}
        color="#94a3b8"
      />

      <h2>No Expenses Found</h2>

      <p>
        Add your first expense to start tracking.
      </p>

    </div>
  );
}

export default EmptyState;