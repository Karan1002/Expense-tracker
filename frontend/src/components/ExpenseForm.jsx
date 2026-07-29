import { useState } from "react";

function ExpenseForm({ addExpense }) {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "",
    date: "",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const submit = (e) => {
    e.preventDefault();

    addExpense(form);

    setForm({
      amount: "",
      description: "",
      category: "",
      date: "",
    });
  };

  return (
    <form onSubmit={submit} className="form">

      <input
        type="number"
        placeholder="Amount"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        placeholder="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Category</option>
        <option>Food</option>
        <option>Shopping</option>
        <option>Travel</option>
        <option>Bills</option>
        <option>Entertainment</option>
        <option>Other</option>
      </select>

      <input
  type="date"
  name="date"
  placeholder="dd-mm-yyyy"
  value={form.date}
  onChange={handleChange}
/>

      <button>Add Expense</button>

    </form>
  );
}

export default ExpenseForm;
