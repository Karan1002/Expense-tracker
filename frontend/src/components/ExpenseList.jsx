function ExpenseList({ expenses, deleteExpense }) {
  return (
    <div>

      {expenses.map((item) => (
        <div className="card" key={item._id}>

          <div>
            <h3>{item.description}</h3>

            <p>{item.category}</p>

            <small>
              {new Date(item.date).toLocaleDateString()}
            </small>
          </div>

          <div className="right">

            <h2>₹{item.amount}</h2>

            <button
              className="delete"
              onClick={() => deleteExpense(item._id)}
            >
              Delete
            </button>

          </div>

        </div>
      ))}

    </div>
  );
}

export default ExpenseList;