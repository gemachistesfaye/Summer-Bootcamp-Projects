        const cardsContainer = document.getElementById('cards-container');
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        const counterEl = document.getElementById('counter');
        const progressBar = document.getElementById('progress-bar');
        const searchInput = document.getElementById('search-input');
        const shuffleBtn = document.getElementById('btn-shuffle');
        const exportBtn = document.getElementById('btn-export');
        const importTrigger = document.getElementById('btn-import-trigger');
        const importInput = document.getElementById('import-input');
        const themeToggle = document.getElementById('theme-toggle');
        const showAddBtn = document.getElementById('btn-show-add');
        const hideModalBtn = document.getElementById('btn-hide-modal');
        const saveCardBtn = document.getElementById('btn-save-card');
        const clearBtn = document.getElementById('btn-clear');
        const modalCard = document.getElementById('modal-card');
        const modalTitle = document.getElementById('modal-title');
        const categoryInput = document.getElementById('input-category');
        const questionInput = document.getElementById('input-question');
        const answerInput = document.getElementById('input-answer');

        let currentIndex = 0;
        let editIndex = null;
        let filteredCards = [];
        let cardsData = JSON.parse(localStorage.getItem('cards')) || [];

       
const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
   
    document.documentElement.setAttribute('data-theme', savedTheme);
} else {
    
    document.documentElement.setAttribute('data-theme', 'dark');
}


themeToggle.onclick = () => {
    const current = document.documentElement.getAttribute('data-theme');
    const target = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', target);
    localStorage.setItem('theme', target);
};


        function updateUI() {
            const searchTerm = searchInput.value.toLowerCase();
            filteredCards = cardsData.filter(c => 
                c.question.toLowerCase().includes(searchTerm) || 
                c.answer.toLowerCase().includes(searchTerm) ||
                (c.category && c.category.toLowerCase().includes(searchTerm))
            );

            cardsContainer.innerHTML = '';
            
            if (filteredCards.length === 0) {
                cardsContainer.innerHTML = `
                    <div class="empty-state">
                        <p>${searchTerm ? 'No matches found.' : 'Your deck is empty.'}</p>
                    </div>`;
                counterEl.innerText = '0 / 0';
                progressBar.style.width = '0%';
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                return;
            }

            if (currentIndex >= filteredCards.length) currentIndex = Math.max(0, filteredCards.length - 1);

            filteredCards.forEach((data, index) => {
                const card = document.createElement('div');
                card.className = `card ${index === currentIndex ? 'active' : ''} ${index < currentIndex ? 'left' : ''}`;
                const originalIndex = cardsData.indexOf(data);

                card.innerHTML = `
                    <div class="card-inner">
                        <div class="card-face card-face-front">
                            <span class="label">Question</span>
                            ${data.category ? `<span class="category-tag">${data.category}</span>` : ''}
                            <p>${data.question}</p>
                            <div class="card-actions">
                                <button class="action-btn edit" data-index="${originalIndex}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                </button>
                                <button class="action-btn delete" data-index="${originalIndex}">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                </button>
                            </div>
                        </div>
                        <div class="card-face card-face-back">
                            <span class="label">Answer</span>
                            <p>${data.answer}</p>
                        </div>
                    </div>
                `;

                card.onclick = (e) => {
                    if (e.target.closest('.edit')) {
                        openEditModal(parseInt(e.target.closest('.edit').dataset.index));
                        return;
                    }
                    if (e.target.closest('.delete')) {
                        deleteCard(parseInt(e.target.closest('.delete').dataset.index));
                        return;
                    }
                    card.classList.toggle('flipped');
                };
                cardsContainer.appendChild(card);
            });

            counterEl.innerText = `${currentIndex + 1} / ${filteredCards.length}`;
            const progress = ((currentIndex + 1) / filteredCards.length) * 100;
            progressBar.style.width = `${progress}%`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === filteredCards.length - 1;
        }

        function deleteCard(index) {
            if (confirm('Delete this card?')) {
                cardsData.splice(index, 1);
                saveAndRefresh();
            }
        }

        function openEditModal(index) {
            editIndex = index;
            modalTitle.innerText = 'Edit Card';
            categoryInput.value = cardsData[index].category || '';
            questionInput.value = cardsData[index].question;
            answerInput.value = cardsData[index].answer;
            modalCard.classList.add('open');
            questionInput.focus();
        }

        function saveAndRefresh() {
            localStorage.setItem('cards', JSON.stringify(cardsData));
            updateUI();
        }

        function showNext() { if (currentIndex < filteredCards.length - 1) { currentIndex++; updateUI(); } }
        function showPrev() { if (currentIndex > 0) { currentIndex--; updateUI(); } }

        nextBtn.onclick = showNext;
        prevBtn.onclick = showPrev;
        searchInput.oninput = () => { currentIndex = 0; updateUI(); };

        shuffleBtn.onclick = () => {
            if (cardsData.length < 2) return;
            for (let i = cardsData.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cardsData[i], cardsData[j]] = [cardsData[j], cardsData[i]];
            }
            currentIndex = 0;
            saveAndRefresh();
        };

        // Export/Import
        exportBtn.onclick = () => {
            const blob = new Blob([JSON.stringify(cardsData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `my-flashcards-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
        };

        importTrigger.onclick = () => importInput.click();
        importInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    if (Array.isArray(imported)) {
                        cardsData = [...cardsData, ...imported];
                        saveAndRefresh();
                    }
                } catch (err) { alert('Invalid file format.'); }
            };
            reader.readAsText(file);
        };

        document.addEventListener('keydown', (e) => {
            if (modalCard.classList.contains('open') || document.activeElement === searchInput) return;
            if (e.key === 'ArrowRight') showNext();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === ' ') {
                const activeCard = document.querySelector('.card.active');
                if (activeCard) activeCard.classList.toggle('flipped');
                e.preventDefault();
            }
        });

        showAddBtn.onclick = () => {
            editIndex = null;
            modalTitle.innerText = 'Create New Card';
            categoryInput.value = '';
            questionInput.value = '';
            answerInput.value = '';
            modalCard.classList.add('open');
            questionInput.focus();
        };

        hideModalBtn.onclick = () => modalCard.classList.remove('open');

        saveCardBtn.onclick = () => {
            const c = categoryInput.value.trim();
            const q = questionInput.value.trim();
            const a = answerInput.value.trim();
            if (!q || !a) return;
            const cardObj = { category: c, question: q, answer: a };
            if (editIndex !== null) cardsData[editIndex] = cardObj;
            else { cardsData.push(cardObj); currentIndex = cardsData.length - 1; }
            saveAndRefresh();
            modalCard.classList.remove('open');
        };

        clearBtn.onclick = () => {
            if (confirm('Clear the entire deck?')) {
                cardsData = [];
                currentIndex = 0;
                saveAndRefresh();
            }
        };

        updateUI();