const currencyOne = document.getElementById("currency-one");
const currencyTwo = document.getElementById("currency-two");
const amountOne = document.getElementById("amount-one");
const amountTwo = document.getElementById("amount-two");
const rateDisplay = document.getElementById("rate");
const swapBtn = document.getElementById("swap");

function exchange() {
  const gem = currencyOne.value;
  const tes = currencyTwo.value;

  fetch(`https://open.er-api.com/v6/latest/${gem}`)
  
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[tes];
      rateDisplay.textContent = `1 ${gem} = ${rate} ${tes}`;
      amountTwo.value = (amountOne.value * rate).toFixed(4);
    })
    .catch(() => { rateDisplay.textContent = "Error loading rates"; });
}

function reverse_exchange() {
  const gem = currencyOne.value;
  const tes = currencyTwo.value;

  fetch(`https://open.er-api.com/v6/latest/${gem}`)
    .then(res => res.json())
    .then(data => {
      const rate = data.rates[tes];
      amountOne.value = (amountTwo.value / rate).toFixed(4);
    });
}

currencyOne.addEventListener("change", exchange);
amountOne.addEventListener("input", exchange);
currencyTwo.addEventListener("change", exchange);
amountTwo.addEventListener("input", reverse_exchange);

swapBtn.addEventListener("click", () => {
  [currencyOne.value, currencyTwo.value] = [currencyTwo.value, currencyOne.value];
  exchange();
});

exchange();
