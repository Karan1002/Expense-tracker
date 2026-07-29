import { FaSearch } from "react-icons/fa";

function SearchBar({ search, setSearch }) {
  return (
    <div className="searchBox">

      <FaSearch />

      <input
        type="text"
        placeholder="Search Expense..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  );
}

export default SearchBar;