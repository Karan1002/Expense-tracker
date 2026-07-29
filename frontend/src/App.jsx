import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import "./App.css";

import Navbar from "./components/Navbar";
import SummaryCard from "./components/SummaryCard";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

const API = "https://expense-tracker-hfby.onrender.com/api/expenses";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Get Expenses
  const getExpenses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API);

      setExpenses(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  // Add Expense
  const addExpense = async (expense) => {
    try {
      await axios.post(API, expense);
      getExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // Delete Expense
  const deleteExpense = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      getExpenses();
    } catch (err) {
      console.log(err);
    }
  };

  // Total Amount
  const total = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  // Search Filter
  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      return (
        item.description
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.category
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [expenses, search]);

  return (
    <div className="app">
      <div className="glass">

        {/* Navbar */}
        <Navbar />

        {/* Summary Cards */}
        <SummaryCard
          total={total}
          totalTransactions={expenses.length}
        />

        {/* Expense Form */}
        <ExpenseForm addExpense={addExpense} />

        {/* Search */}
        <SearchBar
          search={search}
          setSearch={setSearch}
        />

        {/* Expense List */}

        {loading ? (
          <div className="empty">
            <h2>Loading...</h2>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <EmptyState />
        ) : (
          <ExpenseList
            expenses={filteredExpenses}
            deleteExpense={deleteExpense}
          />
        )}

      </div>
    </div>
  );
}

export default App;
