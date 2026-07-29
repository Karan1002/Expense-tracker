import { FaMoneyBillWave, FaListAlt } from "react-icons/fa";

function SummaryCard({ total, totalTransactions }) {
  return (
    <div className="dashboard">

      <div className="dashboardCard">
        <FaMoneyBillWave className="icon" />

        <div>
          <h4>Total Expense</h4>
          <h2>₹ {total}</h2>
        </div>
      </div>

      <div className="dashboardCard">
        <FaListAlt className="icon" />

        <div>
          <h4>Total Transactions</h4>
          <h2>{totalTransactions}</h2>
        </div>
      </div>

    </div>
  );
}

export default SummaryCard;