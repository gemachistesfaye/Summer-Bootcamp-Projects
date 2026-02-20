        const quizDatabase = [
            {
                q: "Inside which HTML element do we put the JavaScript code?",
                options: ["&lt;js&gt;", "&lt;javascript&gt;", "&lt;scripting&gt;", "&lt;script&gt;"],
                correct: 3,
                difficulty: "Fundamental",
                explanation: "The <script> tag is the standard container for JavaScript code in HTML, whether it's inline or pointing to an external file via 'src'."
            },
            {
                q: "What is the optimal placement for script tags to ensure high performance?",
                options: ["In the <head> section", "At the very end of the <body>", "Immediately after the opening <html>", "Inside the CSS stylesheet"],
                correct: 1,
                difficulty: "Engineering",
                explanation: "Placing scripts at the end of the body allows the HTML parser to finish rendering the DOM before the browser starts executing heavy JS."
            },
            {
                q: "Which attribute is required to link an external file named 'logic.js'?",
                options: ["name='logic.js'", "href='logic.js'", "src='logic.js'", "data='logic.js'"],
                correct: 2,
                difficulty: "Fundamental",
                explanation: "The 'src' (source) attribute specifies the URL of an external script file."
            },
            {
                q: "How do you invoke a system-level modal alert box for debugging?",
                options: ["pop('Message')", "alert('Message')", "modal('Message')", "console.log('Message')"],
                correct: 1,
                difficulty: "Fundamental",
                explanation: "The alert() function is a built-in method of the window object that displays a dialog with a custom message."
            },
            {
                q: "Which operator provides strict equality without type coercion?",
                options: ["=", "==", "===", "!="],
                correct: 2,
                difficulty: "Intermediate",
                explanation: "The '===' operator checks for both value and type equality, preventing bugs caused by automatic type conversion."
            }
        ];

        const wrapper = document.getElementById('questionsWrapper');
        const progressBar = document.getElementById('progressBar');
        const progressCount = document.getElementById('progressCount');
        const timerDisplay = document.getElementById('timerDisplay');
        const form = document.getElementById('quizForm');
        
        let timeLeft = 300; 
        let quizActive = true;

       
        const playSound = (type) => {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'correct') {
                osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
                osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
                osc.start(); osc.stop(ctx.currentTime + 0.2);
            } else if (type === 'wrong') {
                osc.frequency.setValueAtTime(220, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);
                gain.gain.setValueAtTime(0.1, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(); osc.stop(ctx.currentTime + 0.3);
            }
        };

        function init() {
            quizDatabase.forEach((data, i) => {
                const card = document.createElement('div');
                card.className = 'question-card';
                card.innerHTML = `
                    <div class="q-meta">
                        <span>Question ${i+1}</span>
                        <span>Level: ${data.difficulty}</span>
                    </div>
                    <div class="q-text">${data.q}</div>
                    <div class="options-grid">
                        ${data.options.map((opt, optIndex) => `
                            <label class="option-label">
                                <input type="radio" name="q${i}" value="${optIndex}" required onchange="handleAnswer()">
                                <div class="custom-radio"></div>
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                    <div class="explanation" id="exp${i}">
                        <strong>Technical Breakdown:</strong> ${data.explanation}
                    </div>
                `;
                wrapper.appendChild(card);
            });
            startTimer();
        }

        function handleAnswer() {
            if (!quizActive) return;
            const answeredCount = [...new Set(new FormData(form).keys())].length;
            const percent = (answeredCount / quizDatabase.length) * 100;
            
            progressBar.style.width = `${percent}%`;
            progressCount.textContent = `${answeredCount}/${quizDatabase.length}`;
        }

        function startTimer() {
            const clock = setInterval(() => {
                if (!quizActive) { clearInterval(clock); return; }
                if (timeLeft <= 0) {
                    clearInterval(clock);
                    form.requestSubmit();
                } else {
                    timeLeft--;
                    const m = Math.floor(timeLeft / 60);
                    const s = timeLeft % 60;
                    timerDisplay.textContent = `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
                    if(timeLeft < 30) timerDisplay.style.color = 'var(--accent)';
                }
            }, 1000);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            quizActive = false;
            const data = new FormData(form);
            let score = 0;

            quizDatabase.forEach((q, i) => {
                const userChoice = parseInt(data.get(`q${i}`));
                const card = wrapper.children[i];
                const exp = document.getElementById(`exp${i}`);
                
                exp.style.display = 'block';
                
                if (userChoice === q.correct) {
                    score++;
                    card.classList.add('answered-correct');
                } else {
                    card.classList.add('answered-wrong');
                }

                card.querySelectorAll('input').forEach(inp => inp.disabled = true);
            });

            
            const finalScore = Math.round((score / quizDatabase.length) * 100);
            
            
            document.getElementById('resultCard').style.display = 'block';
            document.getElementById('finalScore').textContent = `${finalScore}%`;
            document.getElementById('submitBtn').style.display = 'none';

            let message = "";
            if(finalScore === 100) {
                message = "Exceptional! You've mastered these frontend concepts. 🚀";
                confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                playSound('correct');
            } else if (finalScore >= 60) {
                message = "Solid performance. Review the insights below to bridge your knowledge gaps.";
                playSound('correct');
            } else {
                message = "Keep learning! Consistency is the key to becoming a senior developer.";
                playSound('wrong');
            }
            document.getElementById('resultFeedback').textContent = message;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        init();