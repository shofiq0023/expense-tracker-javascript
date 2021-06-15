const balance = document.getElementById('balance');
const moneyPlus = document.getElementById('money-plus');
const moneyMinus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(
	localStorage.getItem('transactions')
);

let allTransaction =
	localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// add transaction
const addTransaction = (e) => {
	e.preventDefault();
	if (text.value.trim() === '' || amount.value.trim() === '') {
		alert('Enter amound and text');
	} else {
		let transaction = {
			id: idGen(),
			text: text.value,
			amount: +amount.value,
		};

		allTransaction.push(transaction);
		addTransactionToDOM(transaction);
		updateValues();
		updateLocalStorage();

		text.value = '';
		amount.value = '';
	}
};

// delete transaction
const deleteTransaction = (id) => {
	allTransaction = allTransaction.filter((item) => item.id !== id);
	updateLocalStorage();
	init();
};

// generate random number
const idGen = () => {
	return Math.floor(Math.random() * 100000000);
};

// add transaction to DOM
const addTransactionToDOM = (transaction) => {
	let sign = transaction.amount < 0 ? '-' : '+';

	let item = document.createElement('li');
	item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
	item.innerHTML = `
        ${transaction.text} <span>${sign}${Math.abs(
		transaction.amount
	)}</span><button class="delete-btn" onclick="deleteTransaction(${
		transaction.id
	})">x</button>
    `;
	list.appendChild(item);
};

// updates the income, expense and balance
const updateValues = () => {
	let amounts = allTransaction.map((transaction) => transaction.amount);
	let totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

	let income = amounts
		.filter((amount) => amount > 0)
		.reduce((acc, item) => (acc += item), 0)
		.toFixed(2);
	let expense = (
		amounts
			.filter((amount) => amount < 0)
			.reduce((acc, item) => (acc += item), 0) * -1
	).toFixed(2);

	balance.innerHTML = `$${totalBalance}`;
	moneyPlus.innerHTML = `+$${income}`;
	moneyMinus.innerHTML = `-$${expense}`;
};

// updates local storage
const updateLocalStorage = () => {
	localStorage.setItem('transactions', JSON.stringify(allTransaction));
};

// initiate app
const init = () => {
	list.innerHTML = '';
	allTransaction.forEach(addTransactionToDOM);

	updateValues();
};

init();

form.addEventListener('submit', addTransaction);
