        const balance = document.getElementById('balance');
        const money_plus = document.getElementById('money-plus');
        const money_minus = document.getElementById('money-minus');
        const list = document.getElementById('list');
        const form = document.getElementById('form');
        const text = document.getElementById('text');
        const amount = document.getElementById('amount');
        const category = document.getElementById('category');
        const searchInput = document.getElementById('search');
        let myChart;

        const categoryIcons = {
            'Food': 'fa-utensils',
            'Shopping': 'fa-shopping-bag',
            'Housing': 'fa-home',
            'Transport': 'fa-car',
            'Salary': 'fa-money-bill-wave',
            'General': 'fa-tags'
        };

        let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        function showToast(msg, type = 'error') {
            const toast = document.getElementById('toast');
            toast.innerText = msg;
            toast.style.backgroundColor = type === 'error' ? '#ef4444' : '#10b981';
            toast.style.display = 'block';
            toast.style.animation = 'slideUp 0.3s ease forwards';
            setTimeout(() => { toast.style.display = 'none'; }, 3000);
        }

        function addTransaction(e) {
            e.preventDefault();
            if (text.value.trim() === '' || amount.value.trim() === '') {
                showToast('Please enter description and amount');
                return;
            }

            const transaction = {
                id: Date.now(),
                text: text.value,
                amount: +amount.value,
                category: category.value,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            };

            transactions.push(transaction);
            updateUI();
            
            text.value = '';
            amount.value = '';
            showToast('Transaction added successfully!', 'success');
        }

        function removeTransaction(id) {
            transactions = transactions.filter(t => t.id !== id);
            updateUI();
        }

        function clearAll() {
            if(confirm('Reset all transaction data?')) {
                transactions = [];
                updateUI();
            }
        }

        function filterTransactions() {
            const term = searchInput.value.toLowerCase();
            const filtered = transactions.filter(t => t.text.toLowerCase().includes(term));
            renderList(filtered);
        }

        function renderList(data) {
            list.innerHTML = '';
            if (data.length === 0) {
                list.innerHTML = '<li style="text-align:center; color:#94a3b8; padding:40px; font-size:0.9rem;">No transactions found</li>';
                return;
            }

            data.slice().reverse().forEach(t => {
                const sign = t.amount < 0 ? '-' : '+';
                const icon = categoryIcons[t.category] || 'fa-tag';

                const li = document.createElement('li');
                li.className = 'list-item';
                li.innerHTML = `
                    <div class="item-info">
                        <div class="item-icon"><i class="fas ${icon}"></i></div>
                        <div class="item-details">
                            <b>${t.text}</b>
                            <span>${t.category} • ${t.date}</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <div class="item-amount" style="color: ${t.amount < 0 ? 'var(--expense-color)' : 'var(--income-color)'}">
                            ${sign}$${Math.abs(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </div>
                        <button class="delete-btn" onclick="removeTransaction(${t.id})"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                list.appendChild(li);
            });
        }

        function updateUI() {
            localStorage.setItem('transactions', JSON.stringify(transactions));
            renderList(transactions);
            
            const amounts = transactions.map(t => t.amount);
            const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
            const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
            const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

            balance.innerText = `$${Number(total).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            money_plus.innerText = `+$${Number(income).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            money_minus.innerText = `-$${Number(expense).toLocaleString(undefined, {minimumFractionDigits: 2})}`;
            document.getElementById('item-count').innerText = transactions.length;
            
            updateChart(income, expense);
        }

        function updateChart(inc, exp) {
            const ctx = document.getElementById('expenseChart').getContext('2d');
            if (myChart) myChart.destroy();

            const dataValues = (inc == 0 && exp == 0) ? [1, 0] : [inc, exp];
            const bgColors = (inc == 0 && exp == 0) ? ['#e2e8f0', '#e2e8f0'] : ['#10b981', '#ef4444'];

            myChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: dataValues,
                        backgroundColor: bgColors,
                        borderWidth: 0,
                        hoverOffset: 4
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '75%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: (inc != 0 || exp != 0) }
                    }
                }
            });
        }

        form.addEventListener('submit', addTransaction);
        window.onload = updateUI;