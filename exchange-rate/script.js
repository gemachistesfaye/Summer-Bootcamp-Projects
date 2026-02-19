     const currencyOne = document.getElementById("currency-one");
        const currencyTwo = document.getElementById("currency-two");
        const amountOne = document.getElementById("amount-one");
        const amountTwo = document.getElementById("amount-two");
        const rateDisplay = document.getElementById("rate");
        const swapBtn = document.getElementById("swap");
        const clock = document.getElementById("clock");
        const historyList = document.getElementById("history");
        const card = document.getElementById("card");

        let debounceTimer;
        let history = [];

        function updateClock() {
            clock.textContent = new Date().toLocaleTimeString();
        }
        setInterval(updateClock, 1000);
        updateClock();

        async function exchange() {
            const from = currencyOne.value;
            const to = currencyTwo.value;
            const amount = amountOne.value;

            if (amount <= 0 || !amount) {
                amountTwo.value = "0.00";
                return;
            }

            card.classList.add('loading');
            
            try {
                const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
                const data = await res.json();
                
                if (data.result === "success") {
                    const rate = data.rates[to];
                    const converted = (amount * rate).toFixed(2);
                    
                    rateDisplay.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
                    
                    amountTwo.style.opacity = "0";
                    setTimeout(() => {
                        amountTwo.value = parseFloat(converted).toLocaleString(undefined, {minimumFractionDigits: 2});
                        amountTwo.style.opacity = "1";
                        addToHistory(amount, from, converted, to);
                    }, 100);
                }
            } catch (err) {
                rateDisplay.textContent = "Network Error";
            } finally {
                card.classList.remove('loading');
            }
        }

        function addToHistory(val1, cur1, val2, cur2) {
            const entry = `${val1} ${cur1} → ${val2} ${cur2}`;
            if(history[0] === entry) return;
            
            history.unshift(entry);
            if(history.length > 5) history.pop();
            
            historyList.innerHTML = history.map(item => `
                <li class="history-item">
                    <span>${item}</span>
                    <span style="color:var(--success)">●</span>
                </li>
            `).join('');
        }

        function debouncedExchange() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(exchange, 400);
        }

        currencyOne.addEventListener("change", exchange);
        currencyTwo.addEventListener("change", exchange);
        amountOne.addEventListener("input", debouncedExchange);

        swapBtn.addEventListener("click", () => {
            const temp = currencyOne.value;
            currencyOne.value = currencyTwo.value;
            currencyTwo.value = temp;
            exchange();
        });

        exchange();