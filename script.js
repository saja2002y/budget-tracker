// =====================
// Global Variables
// =====================


const transactions = [];

const icons = {
income: "cash",
living_expenses: "cart3",
transportation: "fuel-pump",
personal_care: "scissors",
healthcare: "heart-pulse",
technology: "display",
debt_payments: "credit-card",
savings_investments: "piggy-bank",
entertainment: "ticket-perforated",
miscellaneous: "box",
};

let editingTransaction = null;


// =====================
// Event Listeners
// =====================


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


const descriptionInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");


// addTransaction()

function addTransaction() {

  console.log("editIndex in addTransaction:", editIndex);

  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
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
      amount.textContent = `+$${Math.abs(transaction.amount).toFixed(2)}`;
    } else {
      amount.textContent = `-$${Math.abs(transaction.amount).toFixed(2)}`;
    }

    // Create edit button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";

    console.log("Editing index:", editIndex);

    editButton.addEventListener("click", () => {
      editingTransaction = transaction;

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    categoryInput.value = transaction.category;

    button.textContent = "Save Changes";
    });

  
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
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
    transactions.splice(index,1);
    saveTransactions();
     filterTransactions();
  });


 

  // Add list item to list
  list.append(li);
  });

  updateBalance();
};

// updateBalance()

function updateBalance() {
  let balance = 0;

   transactions.forEach((transaction) => {
    balance += transaction.amount;
   });

    const balanceElement = document.querySelector("#current-balance");
    balanceElement.textContent = `$${balance.toFixed(2)}`;
};

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

loadTransactions();


