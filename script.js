const expForm = document.getElementById('expense-form');

const titleInput = document.getElementById('title');
const categoryInput = document.getElementById('category');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const ul = document.getElementById('expense-list');

let editingExpenseId = null;

// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Display saved expenses when page loads
expenses.forEach((expense) => {
  renderExpense(expense);
});

totalExpenseCount();

// Save expenses to localStorage
function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

function addExpense() {
  const title = titleInput.value.trim();
  const category = categoryInput.value.trim();
  const amount = Number(amountInput.value);
  const date = dateInput.value.trim();

  const expense = {
    id: Date.now(),
    title,
    category,
    amount,
    date,
  };

  expenses.push(expense);

  saveExpenses();

  renderExpense(expense);

  totalExpenseCount();

  expForm.reset();
}

function renderExpense(expense) {
  const li = document.createElement('li');

  li.textContent = `${expense.title} | ${expense.category} | ₹${expense.amount} | ${expense.date}`;

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';

  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit';

  li.appendChild(editBtn);
  li.appendChild(delBtn);
  ul.appendChild(li);

  editBtn.addEventListener('click', function () {
    titleInput.value = expense.title;
    categoryInput.value = expense.category;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;

    editingExpenseId = expense.id;
  });

  delBtn.addEventListener('click', function () {
    expenses = expenses.filter((item) => item.id !== expense.id);

    if (editingExpenseId === expense.id) {
      editingExpenseId = null;
      expForm.reset();
    }

    saveExpenses();

    li.remove();

    totalExpenseCount();
  });
}

function totalExpenseCount() {
  const totalAmount = expenses.reduce((sum, item) => {
    return sum + item.amount;
  }, 0);

  document.getElementById('total-expense').textContent =
    `₹${totalAmount.toFixed(2)}`;
}

expForm.addEventListener('submit', function (event) {
  event.preventDefault();
  if (editingExpenseId !== null) {
    const index = expenses.findIndex((item) => item.id === editingExpenseId);
    expenses[index].title = titleInput.value.trim();
    expenses[index].category = categoryInput.value.trim();
    expenses[index].amount = Number(amountInput.value);
    expenses[index].date = dateInput.value.trim();

    saveExpenses();

    ul.innerHTML = '';

    expenses.forEach((expense) => {
      renderExpense(expense);
    });
    totalExpenseCount();

    editingExpenseId = null;
    expForm.reset();
  } else {
    addExpense();
  }
});
