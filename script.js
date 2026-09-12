// Global Variables

const transactions = [];

const icons = {
income: "cash",
living_expenses: "cart3",
transportation: "fuel-pump",
personal_care: "scissors",
healthcare: "heart-pulse",
debt_payments: "credit-card",
savings_investments: "piggy-bank",
entertainment: "ticket-perforated",
miscellaneous: "box",
};

const categoryNames = {
  living_expenses: "Living Expenses",
  transportation: "Transportation",
  personal_care: "Personal Care",
  healthcare: "Healthcare",
  debt_payments: "Debt Payments",
  savings_investments: "Savings & Investments",
  entertainment: "Entertainment",
  miscellaneous: "Miscellaneous"
};

let editingTransaction = null;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let spendingChart;



// DOM selectors

const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");


const incomeElement = document.querySelector("#total-income");
const expenseElement = document.querySelector("#total-expenses");

const deleteModal = document.querySelector(".delete-modal");
let transactionToDelete = null;

const cancelDelete = document.querySelector(".delete-modal-actions button:first-child");
const confirmDelete = document.querySelector(".delete-modal-actions button:last-child");

const deleteMessage = document.querySelector("#delete-message"); 

const cancelEdit = document.querySelector("#cancel-edit");

const exportButton = document.querySelector("#export-csv");


// Event Listeners

const button = document.querySelector("#add-transaction");
button.textContent = "Add Transaction";
button.addEventListener("click", addTransaction);

const searchInput = document.querySelector("#search-transactions");
searchInput.addEventListener("input", () => {
  filterTransactions();
});


const categoryFilter = document.querySelector("#category-filter");
categoryFilter.addEventListener("change", () => {
  filterTransactions();
});

const sortFilter = document.querySelector("#sort-filter");
sortFilter.addEventListener("change", () => {
  filterTransactions();
});

cancelDelete.addEventListener("click", () => {
  deleteModal.classList.remove("show");
  transactionToDelete = null;
});

confirmDelete.addEventListener("click", () => {
    transactions.splice(transactionToDelete,1);
    saveTransactions();
    filterTransactions();
    deleteModal.classList.remove("show");
    transactionToDelete = index;
  });

  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) {
      deleteModal.classList.remove("show");
    }
  });

  cancelEdit.addEventListener("click", () => {
    editIndex = null;
    clearForm();
    button.textContent = "Add Transaction";
    cancelEdit.style.display = "none";
  });

  exportButton.addEventListener("click", () => {
    let csv = "Description,Amount,Category,Date\n";

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();

      csv += `${transaction.description},${transaction.amount},${transaction.category},${date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "budget-transactions.csv";
    link.click();
  });



// addTransaction()

function addTransaction() {


  const description = descriptionInput.value;
  let amount = parseFloat(amountInput.value);
  const category = categoryInput.value;



  //Validation

  if(description.trim() === "") {
  alert("Please enter a description.");
  return;
  } 
  if (amount === 0) {
    alert("Please enter an amount that doesn't equal 0.");
    return;
  } 
  if (category === "") {
    alert("Please select a category.");
    return;
  };


  // Decide if income or expense
  if (category !== "income") {
    amount = -Math.abs(amount);
  } else {
    amount = Math.abs(amount);
  };


  // Create transaction
  if (editingTransaction !== null) {
      editingTransaction.description = description;
      editingTransaction.amount = amount;
      editingTransaction.category = category;
  } else {
    const transaction = {
      description,
      amount,
      category,
      date: new Date()
  };
  
  transactions.push(transaction);
}
  saveTransactions();

editingTransaction = null;

  button.textContent = "Add Transaction";

  filterTransactions();

  clearForm();
};


function filterTransactions() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const selectedSort = sortFilter.value;

  let filteredTransactions = transactions;

  if (searchText !== "") {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return transaction.description
      .toLowerCase()
      .includes(searchText);
    });
  };

  if (selectedCategory != "all") {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      return transaction.category === selectedCategory;

  });
};

  if (selectedSort === "highest") {
    filteredTransactions.sort((a,b) => 
      b.amount - a.amount);
  };

  if (selectedSort === "lowest") {
    filteredTransactions.sort((a, b) => a.amount - b.amount);
  };

  if (selectedSort === "newest") {
    filteredTransactions.sort((a, b) => b.date - a.date);
  };

  if (selectedSort === "oldest") {
      filteredTransactions.sort((a, b) => a.date - b.date);
  };

renderTransactions(filteredTransactions);

};




// renderTransactions()

function renderTransactions(transactionList) {

  // Find the list
  const list = document.querySelector("#transactions");

  // Clear previous items
  list.innerHTML = "";

  if (transactionList.length === 0) {
    list.innerHTML = "<p>No transactions found</p>";
    return;
  };

  // Render each transaction
  transactionList.forEach((transaction, index) => {

    // Create list item
    const li = document.createElement("li");

    const icon = icons[transaction.category] || "cash";
  
    const iconSpan = document.createElement("span");
    iconSpan.classList.add("icon-span");

    iconSpan.innerHTML = `<i class="bi bi-${icon}"></i>`;

    const description = document.createElement("span");
    description.textContent = transaction.description;
    description.classList.add("transaction-description");
    

    const date = document.createElement("span");
    const formattedDate = new Date(transaction.date);
    

    date.textContent = formattedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
});

  date.classList.add("transaction-date");

  const transactionInfo = document.createElement("div");
  transactionInfo.classList.add("transaction-info");


    const amount = document.createElement("span");
    amount.classList.add("transaction-amount");

    if (transaction.amount >= 0) {
      amount.textContent = `+${currencyFormatter.format(transaction.amount)}`;
    } else {
      amount.textContent = currencyFormatter.format(transaction.amount);
    }

    // Create edit button
    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="bi bi-pencil-square"></i>`;
    editButton.classList.add("edit-button");

    editButton.addEventListener("click", () => {
      editingTransaction = transaction;

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;

    button.textContent = "Save Changes";
    cancelEdit.style.display = "inline-block";
    });

  
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="bi bi-trash3"></i>`
    deleteButton.classList.add("delete-button");

    const transactionLeft = document.createElement("div");
    transactionLeft.classList.add("transaction-left");

    

    transactionInfo.append(description);
    transactionInfo.append(date);

     transactionLeft.append(iconSpan);
     transactionLeft.append(transactionInfo);

    li.append(transactionLeft);

    const transactionRight = document.createElement("div");
    transactionRight.classList.add("transaction-right");


    transactionRight.append(amount);
    transactionRight.append(editButton);
    transactionRight.append(deleteButton);


    li.append(transactionRight);

     

    // Delete transaction
  deleteButton.addEventListener('click', () => {
      transactionToDelete = index;
      deleteMessage.innerHTML = `Are you sure you want to delete <strong>"${transaction.description}"</strong>?`;
      deleteModal.classList.add("show");
  });


 

  // Add list item to list
  list.append(li);
  });

  updateBalance();
};

// updateBalance()

function updateBalance() {
  let balance = 0;
  let income = 0;
  let expenses = 0;

   transactions.forEach((transaction) => {
    balance += transaction.amount;

    if (transaction.amount > 0) {
      income += transaction.amount;
    } else {
      expenses += Math.abs(transaction.amount);
    }
   });

    const balanceElement = document.querySelector("#current-balance");
    balanceElement.textContent = currencyFormatter.format(balance);

    incomeElement.textContent = currencyFormatter.format(income);
    expenseElement.textContent = currencyFormatter.format(expenses);

    updateSummaryChange();
    updateSpendingChart();
};


function updateSummaryChange() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const lastMonth = new Date(currentYear, currentMonth -1);


  const currentMonthTransactions = transactions.filter((transaction) => {
    return transaction.date.getMonth() === currentMonth && transaction.date.getFullYear() === currentYear;  
});

const lastMonthTransactions = transactions.filter((transaction) => {
  return transaction.date.getMonth() === lastMonth.getMonth() && transaction.date.getFullYear() === lastMonth.getFullYear();  
});

const currentIncome = currentMonthTransactions
.filter(transaction => transaction.amount > 0)
.reduce((total, transaction) => total + transaction.amount, 0);

const currentExpenses = currentMonthTransactions
.filter(transaction => transaction.amount < 0)
.reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

const reportTotalSpending = document.querySelector("#report-total-spending");

reportTotalSpending.innerHTML =
  `<strong>${currencyFormatter.format(currentExpenses)}</strong> spent this month`;

const lastIncome = lastMonthTransactions
.filter(transaction => transaction.amount > 0)
.reduce((total, transaction) => total + transaction.amount,0);

const lastExpenses = lastMonthTransactions
.filter(transaction => transaction.amount < 0)
.reduce((total, transaction) => total + Math.abs(transaction.amount), 0);

let incomeChange;

if (lastIncome === 0) {
  incomeChange = "N/A";
} else {
  incomeChange = ((currentIncome - lastIncome) / lastIncome) * 100;
}

if (lastExpenses === 0) {
  expensesChange = "N/A";
} else {
  expensesChange = ((lastExpenses - currentExpenses) / lastExpenses) * 100;
}

const summaryChanges = document.querySelectorAll(".summary-change");

summaryChanges[0].textContent =
  incomeChange === "N/A" 
  ? "N/A" 
  : `${incomeChange > 0 ? "+" : ""}${incomeChange.toFixed(1)}%`;

summaryChanges[1].textContent =
  expensesChange === "N/A" 
  ? "N/A" 
  : `${expensesChange > 0 ? "+" : ""}${expensesChange.toFixed(1)}%`;

}

// clearForm()

function clearForm() {
  document.querySelector("#description").value = "";
  document.querySelector("#amount"). value = "";
  document.querySelector("#category").value = "";
};

function saveTransactions() {
  const savedTransactions = JSON.stringify(transactions);
  localStorage.setItem("transactions", savedTransactions);
};

// loadTransactions()

function loadTransactions() {
  const savedTransactions = localStorage.getItem("transactions");

  if (savedTransactions) {
    const loadedTransactions = JSON.parse(savedTransactions);
    
    loadedTransactions.forEach((transaction) => {
      transaction.date = new Date(transaction.date);
      transactions.push(transaction);
      });
    };

    filterTransactions();
};


function updateSpendingChart() {
  const categoryTotals = {};

  transactions.forEach((transaction) => {
    if (transaction.amount < 0) {
      const category = transaction.category;
      const amount = Math.abs(transaction.amount);

      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    }
  });

  const chartData = Object.entries(categoryTotals).map(([category, amount]) => { return {
      category: category,
      amount: amount
  };
  });

const chart = document.querySelector("#spending-chart");

if (spendingChart) {
  spendingChart.destroy();
}

spendingChart = new Chart(chart, {
  type: "bar",
  data: {
    labels: chartData.map(item => categoryNames[item.category]),
    datasets: [{
      label: "Spending",
      data: chartData.map(item => item.amount),
      borderRadius: 20,
      barPercentage: 0.9,
      categoryPercentage: 0.7,
      backgroundColor: "#7E86D9"
    }]
  },

    options: {
      plugins: {
      legend: {
        display: false
      },

      tooltip: {
      callbacks: {
      label: function(context) {
        return "$" + context.raw;
      }
    }
  }
    },

  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false
      },
      ticks: {
      color: "black",
      callback: function(value) {
      return "$" + value;
       },
       padding: 15,
       maxTicksLimit: 7
      }
    },

    x: {
      grid: {
        display: false
      },
          ticks: {
      color: "black",
      padding: 15
    }
  }
}
}
});
}







loadTransactions();


