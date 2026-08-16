import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://expense-tracker-m3ku.onrender.com/api/expenses";

const emptyForm = {
  type: "income",
  person: "",
  roomNo: "",
  category: "Owner",
  amount: "",
  mode: "Offline",
  status: "Paid",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.person || !form.category) {
      alert("Please fill required fields");
      return;
    }

    try {
      await axios.post(API, {
        ...form,
        amount: Number(form.amount),
      });

      setForm(emptyForm);
      await loadTransactions();
      alert("Transaction added successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      await loadTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      const text = `
        ${item.person || ""}
        ${item.description || ""}
        ${item.category || ""}
        ${item.roomNo || ""}
        ${item.mode || ""}
        ${item.status || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "Income") {
        matchesFilter = item.type === "income";
      }

      if (filter === "Expense") {
        matchesFilter = item.type === "expense";
      }

      if (filter === "Pending") {
        matchesFilter = item.status === "Pending";
      }

      if (filter === "Paid") {
        matchesFilter = item.status === "Paid";
      }

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const income = transactions
    .filter((t) => t.type === "income" && t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense" && t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const pending = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const cashIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        t.status === "Paid" &&
        t.mode === "Offline"
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const onlineIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        t.status === "Paid" &&
        t.mode === "Online"
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  const categories =
    form.type === "income"
      ? ["Owner", "Other"]
      : [
          "Owner",
          "Rental",
          "Decoration",
          "Mandap",
          "Murti",
          "Prasad",
          "Puja",
          "Sound",
          "Electricity",
          "Other",
        ];

  return (
    <div className="ganpati-app">

      <header className="top-header">
        <div>
          <h1>🙏 Ganpati Ledger</h1>
          <p>Ganpati Mandal Finance Management</p>
        </div>

        <div className="header-date">
          {new Date().toLocaleDateString("en-IN")}
        </div>
      </header>

      <main className="container">

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card income-card">
            <span>💰</span>
            <div>
              <small>Total Income</small>
              <h2>₹{income.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card expense-card">
            <span>💸</span>
            <div>
              <small>Total Expense</small>
              <h2>₹{expense.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card pending-card">
            <span>⏳</span>
            <div>
              <small>Pending Amount</small>
              <h2>₹{pending.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card balance-card">
            <span>🏦</span>
            <div>
              <small>Remaining Balance</small>
              <h2>₹{balance.toLocaleString("en-IN")}</h2>
            </div>
          </div>

        </section>

        {/* PAYMENT BREAKDOWN */}

        <section className="payment-grid">

          <div>
            <small>Cash / Offline Income</small>
            <strong>
              ₹{cashIncome.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <small>Online Income</small>
            <strong>
              ₹{onlineIncome.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <small>Total Entries</small>
            <strong>{transactions.length}</strong>
          </div>

        </section>

        {/* ADD TRANSACTION */}

        <section className="card">

          <div className="section-heading">
            <div>
              <h2>Add Transaction</h2>
              <p>Add money received or money spent.</p>
            </div>
          </div>

          <form onSubmit={addTransaction}>

            <div className="type-selector">

              <button
                type="button"
                className={
                  form.type === "income"
                    ? "type-btn income-selected"
                    : "type-btn"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "income",
                    status: "Paid",
                    category: "Owner",
                  })
                }
              >
                🟢 Income / Jama
              </button>

              <button
                type="button"
                className={
                  form.type === "expense"
                    ? "type-btn expense-selected"
                    : "type-btn"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "expense",
                    status: "Paid",
                    category: "Owner",
                  })
                }
              >
                🔴 Expense / Kharacha
              </button>

            </div>

            <div className="form-grid">

              <div className="field">
                <label>Person / Party Name *</label>
                <input
                  value={form.person}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      person: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                />
              </div>

              <div className="field">
                <label>Room No.</label>
                <input
                  value={form.roomNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomNo: e.target.value,
                    })
                  }
                  placeholder="Example: 101"
                />
              </div>

              <div className="field">
                <label>Category *</label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              </div>

              <div className="field">
                <label>Amount ₹ *</label>

                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                />

              </div>

              <div className="field">
                <label>Payment Mode</label>

                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: e.target.value,
                    })
                  }
                >
                  <option value="Offline">Offline / Cash</option>
                  <option value="Online">Online</option>
                </select>

              </div>

              <div className="field">
                <label>Payment Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Paid">Paid / Received</option>
                  <option value="Pending">Pending</option>
                </select>

              </div>

              <div className="field">
                <label>Date</label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                />

              </div>

              <div className="field">
                <label>Description</label>

                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Example: Decoration material"
                />

              </div>

            </div>

            <button className="save-btn">
              + Save Transaction
            </button>

          </form>

        </section>

        {/* TRANSACTIONS */}

        <section className="card">

          <div className="section-heading">

            <div>
              <h2>Transaction History</h2>
              <p>All income and expenses</p>
            </div>

            <div className="total-count">
              {filtered.length} Entries
            </div>

          </div>

          <div className="filters">

            <input
              placeholder="🔎 Search name, room, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

          </div>

          {loading ? (
            <div className="empty">
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div>📋</div>
              <h3>No transactions found</h3>
              <p>Add your first transaction above.</p>
            </div>
          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.map((item) => (

                    <tr key={item._id}>

                      <td>
                        <strong>
                          {item.person || item.description || "-"}
                        </strong>
                      </td>

                      <td>
                        {item.roomNo || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            item.type === "income"
                              ? "badge income"
                              : "badge expense"
                          }
                        >
                          {item.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>

                      <td>
                        {item.category}
                      </td>

                      <td
                        className={
                          item.type === "income"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {item.type === "income" ? "+" : "-"}
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {item.mode || "Offline"}
                      </td>

                      <td>

                        <span
                          className={
                            item.status === "Pending"
                              ? "badge pending"
                              : "badge paid"
                          }
                        >
                          {item.status || "Paid"}
                        </span>

                      </td>

                      <td>
                        {item.date
                          ? new Date(item.date).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteTransaction(item._id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      <footer className="footer">
        🙏 गणपती बाप्पा मोरया 🙏
      </footer>

    </div>
  );
}

export default App;import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "https://expense-tracker-m3ku.onrender.com/api/expenses";

const emptyForm = {
  type: "income",
  person: "",
  roomNo: "",
  category: "Owner",
  amount: "",
  mode: "Offline",
  status: "Paid",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const res = await axios.get(API);
      setTransactions(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const addTransaction = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.person || !form.category) {
      alert("Please fill required fields");
      return;
    }

    try {
      await axios.post(API, {
        ...form,
        amount: Number(form.amount),
      });

      setForm(emptyForm);
      await loadTransactions();
      alert("Transaction added successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to add transaction");
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      await axios.delete(`${API}/${id}`);
      await loadTransactions();
    } catch (error) {
      console.error(error);
    }
  };

  const filtered = useMemo(() => {
    return transactions.filter((item) => {
      const text = `
        ${item.person || ""}
        ${item.description || ""}
        ${item.category || ""}
        ${item.roomNo || ""}
        ${item.mode || ""}
        ${item.status || ""}
      `.toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "Income") {
        matchesFilter = item.type === "income";
      }

      if (filter === "Expense") {
        matchesFilter = item.type === "expense";
      }

      if (filter === "Pending") {
        matchesFilter = item.status === "Pending";
      }

      if (filter === "Paid") {
        matchesFilter = item.status === "Paid";
      }

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  const income = transactions
    .filter((t) => t.type === "income" && t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expense = transactions
    .filter((t) => t.type === "expense" && t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const pending = transactions
    .filter((t) => t.status === "Pending")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const cashIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        t.status === "Paid" &&
        t.mode === "Offline"
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const onlineIncome = transactions
    .filter(
      (t) =>
        t.type === "income" &&
        t.status === "Paid" &&
        t.mode === "Online"
    )
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = income - expense;

  const categories =
    form.type === "income"
      ? ["Owner", "Other"]
      : [
          "Owner",
          "Rental",
          "Decoration",
          "Mandap",
          "Murti",
          "Prasad",
          "Puja",
          "Sound",
          "Electricity",
          "Other",
        ];

  return (
    <div className="ganpati-app">

      <header className="top-header">
        <div>
          <h1>🙏 Ganpati Ledger</h1>
          <p>Ganpati Mandal Finance Management</p>
        </div>

        <div className="header-date">
          {new Date().toLocaleDateString("en-IN")}
        </div>
      </header>

      <main className="container">

        {/* SUMMARY */}

        <section className="summary-grid">

          <div className="summary-card income-card">
            <span>💰</span>
            <div>
              <small>Total Income</small>
              <h2>₹{income.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card expense-card">
            <span>💸</span>
            <div>
              <small>Total Expense</small>
              <h2>₹{expense.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card pending-card">
            <span>⏳</span>
            <div>
              <small>Pending Amount</small>
              <h2>₹{pending.toLocaleString("en-IN")}</h2>
            </div>
          </div>

          <div className="summary-card balance-card">
            <span>🏦</span>
            <div>
              <small>Remaining Balance</small>
              <h2>₹{balance.toLocaleString("en-IN")}</h2>
            </div>
          </div>

        </section>

        {/* PAYMENT BREAKDOWN */}

        <section className="payment-grid">

          <div>
            <small>Cash / Offline Income</small>
            <strong>
              ₹{cashIncome.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <small>Online Income</small>
            <strong>
              ₹{onlineIncome.toLocaleString("en-IN")}
            </strong>
          </div>

          <div>
            <small>Total Entries</small>
            <strong>{transactions.length}</strong>
          </div>

        </section>

        {/* ADD TRANSACTION */}

        <section className="card">

          <div className="section-heading">
            <div>
              <h2>Add Transaction</h2>
              <p>Add money received or money spent.</p>
            </div>
          </div>

          <form onSubmit={addTransaction}>

            <div className="type-selector">

              <button
                type="button"
                className={
                  form.type === "income"
                    ? "type-btn income-selected"
                    : "type-btn"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "income",
                    status: "Paid",
                    category: "Owner",
                  })
                }
              >
                🟢 Income / Jama
              </button>

              <button
                type="button"
                className={
                  form.type === "expense"
                    ? "type-btn expense-selected"
                    : "type-btn"
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "expense",
                    status: "Paid",
                    category: "Owner",
                  })
                }
              >
                🔴 Expense / Kharacha
              </button>

            </div>

            <div className="form-grid">

              <div className="field">
                <label>Person / Party Name *</label>
                <input
                  value={form.person}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      person: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                />
              </div>

              <div className="field">
                <label>Room No.</label>
                <input
                  value={form.roomNo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomNo: e.target.value,
                    })
                  }
                  placeholder="Example: 101"
                />
              </div>

              <div className="field">
                <label>Category *</label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

              </div>

              <div className="field">
                <label>Amount ₹ *</label>

                <input
                  type="number"
                  min="0"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                />

              </div>

              <div className="field">
                <label>Payment Mode</label>

                <select
                  value={form.mode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mode: e.target.value,
                    })
                  }
                >
                  <option value="Offline">Offline / Cash</option>
                  <option value="Online">Online</option>
                </select>

              </div>

              <div className="field">
                <label>Payment Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Paid">Paid / Received</option>
                  <option value="Pending">Pending</option>
                </select>

              </div>

              <div className="field">
                <label>Date</label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                />

              </div>

              <div className="field">
                <label>Description</label>

                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Example: Decoration material"
                />

              </div>

            </div>

            <button className="save-btn">
              + Save Transaction
            </button>

          </form>

        </section>

        {/* TRANSACTIONS */}

        <section className="card">

          <div className="section-heading">

            <div>
              <h2>Transaction History</h2>
              <p>All income and expenses</p>
            </div>

            <div className="total-count">
              {filtered.length} Entries
            </div>

          </div>

          <div className="filters">

            <input
              placeholder="🔎 Search name, room, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Income">Income</option>
              <option value="Expense">Expense</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

          </div>

          {loading ? (
            <div className="empty">
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <div>📋</div>
              <h3>No transactions found</h3>
              <p>Add your first transaction above.</p>
            </div>
          ) : (

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filtered.map((item) => (

                    <tr key={item._id}>

                      <td>
                        <strong>
                          {item.person || item.description || "-"}
                        </strong>
                      </td>

                      <td>
                        {item.roomNo || "-"}
                      </td>

                      <td>
                        <span
                          className={
                            item.type === "income"
                              ? "badge income"
                              : "badge expense"
                          }
                        >
                          {item.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>

                      <td>
                        {item.category}
                      </td>

                      <td
                        className={
                          item.type === "income"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {item.type === "income" ? "+" : "-"}
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>

                      <td>
                        {item.mode || "Offline"}
                      </td>

                      <td>

                        <span
                          className={
                            item.status === "Pending"
                              ? "badge pending"
                              : "badge paid"
                          }
                        >
                          {item.status || "Paid"}
                        </span>

                      </td>

                      <td>
                        {item.date
                          ? new Date(item.date).toLocaleDateString(
                              "en-IN"
                            )
                          : "-"}
                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteTransaction(item._id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      <footer className="footer">
        🙏 गणपती बाप्पा मोरया 🙏
      </footer>

    </div>
  );
}

export default App;
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
