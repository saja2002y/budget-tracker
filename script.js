// =====================
// Global Variables
// =====================


const transactions = [];


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

// addTransaction()

function addTransaction() {

  const description = document.querySelector("#description").value;
  const amount = parseFloat(document.querySelector("#amount").value);
  const categorySelect = document.querySelector("#category");
  const category = categorySelect.options[categorySelect.selectedIndex].value;



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

  const transaction = {
    description,
    amount,
    category,
    date: new Date()
  };

  console.log(transaction);
  
  transactions.push(transaction);

  saveTransactions();

  filterTransactions();

  clearForm();
};


function filterTransactions() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;


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

    const amount = document.createElement("span");
    amount.classList.add("transaction-amount");

    if (transaction.amount >= 0) {
      amount.textContent = `+$${Math.abs(transaction.amount).toFixed(2)}`;
    } else {
      amount.textContent = `-$${Math.abs(transaction.amount).toFixed(2)}`;
    }

  
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");

    const transactionLeft = document.createElement("div");
    transactionLeft.classList.add("transaction-left");

    transactionLeft.append(description);
    transactionLeft.append(date);

    li.append(transactionLeft);

    const transactionRight = document.createElement("div");
    transactionRight.classList.add("transaction-right");


    transactionRight.append(amount);
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

function loadTransactions() {
  const savedTransactions = localStorage.getItem("transactions");

  if (savedTransactions) {
    const loadedTransactions = JSON.parse(savedTransactions);
    
    loadedTransactions.forEach((transaction) => {
      transactions.push(transaction);
      });
    };
    filterTransactions();
};

loadTransactions();


