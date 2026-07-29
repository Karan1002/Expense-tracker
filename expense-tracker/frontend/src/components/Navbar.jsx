import { FaWallet } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaWallet />
        <h2>Expense Tracker</h2>
      </div>

      <div className="user">
        <span>Karan Sakhat</span>
      </div>
    </nav>
  );
}

export default Navbar;
