const balance = document.getElementById('balance');
const incomes = document.getElementById('money-plus');
const expens = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');


 const dummyData = [
   {id:1 , text:'tea', amount :30},
  {id:2 , text:'water', amount :90},
  {id:3 , text:'burgur', amount :100},
  {id:4 , text:'coffe', amount :120} ];


const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')

);

let transactions =localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function generateId(){
  // Youre code 
return Math.floor(Math.random() * 10000000);
  
}


function addTransaction(e){
  // your code 
e.preventDefault();

  if(!text.value.trim() && !amount.value.trim() ) { return alert("text & amount place is empty"); }
  if(!text.value.trim()) {return alert("text place is empty"); }
  if(!amount.value.trim()) {return alert("amount place is empty"); }

  const transaction={ id: generateId(), text: text.value, amount: +amount.value};
  transactions.push(transaction); addTransactionDOM(transaction); updatevalues(); updateLocalStorage();
   text.value="";  
   amount.value=""
}

function addTransactionDOM(transaction){  
  // your code

  const abc=transaction.amount<0;
  const ab=document.createElement('li');
  ab.classList.add(abc?'minus' :  'plus');
  ab.innerHTML=`${transaction.text} <span>${Math.abs?'-': '+'}${Math.abs(transaction.amount)} </span>   <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>  `;
 list.appendChild(ab); }

function updatevalues(){
  // your code

  const amounts=transactions.map(t=>t.amount);
  const total=amounts.reduce((x,y) =>x+y,0);
  const income=amounts.filter(y=>y>0).reduce((x,y)=> x+y,0);
  const expense=amounts.filter(y=>y<0).reduce((x,y)=>x+y,0);

  balance.innerText=`$${total.toFixed(4)}`;
  incomes.innerText=`$${income.toFixed(4)}`;
  expens.innerText=`$${Math.abs(expense).toFixed(4)}`;
}

function updateLocalStorage(){
  // your code
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function removeTransaction(id){
//  your code
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function init(){
  // your code 
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updatevalues();
}

// add event Listener

form.addEventListener('submit', addTransaction);