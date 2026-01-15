
    const system = {
        currentPage: 'dashboard',
        user: localStorage.getItem('zen_user') || '',
        userAge: localStorage.getItem('zen_age') || '',
        userJob: localStorage.getItem('zen_job') || 'System Admin',
        userBio: localStorage.getItem('zen_bio') || '',
        tasks: JSON.parse(localStorage.getItem('zen_tasks')) || [],
        theme: localStorage.getItem('zen_theme') || 'dark',
        draftCat: 'Personal',
        searchQuery: '',
        filterCat: 'All',
        timer: {
            seconds: 25 * 60,
            isActive: false,
            interval: null,
            mode: 'FOCUS'
        }
    };

  
    const toggleMobileNav = () => document.getElementById('mobileNav').classList.toggle('closed');

    const switchPage = (pageId) => {

        document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));

        document.getElementById(`page-${pageId}`).classList.remove('hidden');
        

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const desktopNav = document.getElementById(`nav-${pageId}`);
        const mobileNav = document.getElementById(`m-nav-${pageId}`);
        if(desktopNav) desktopNav.classList.add('active');
        if(mobileNav) mobileNav.classList.add('active');

        system.currentPage = pageId;
        lucide.createIcons();
    };

    const sync = () => {
        localStorage.setItem('zen_user', system.user);
        localStorage.setItem('zen_age', system.userAge);
        localStorage.setItem('zen_job', system.userJob);
        localStorage.setItem('zen_bio', system.userBio);
        localStorage.setItem('zen_tasks', JSON.stringify(system.tasks));
        localStorage.setItem('zen_theme', system.theme);
        lucide.createIcons();
    };

    const updateAnalytics = () => {
        const total = system.tasks.length;
        const done = system.tasks.filter(t => t.done).length;
        const rate = total === 0 ? 0 : Math.round((done / total) * 100);
        const completionEl = document.getElementById('completionRate');
        if(completionEl) {
            completionEl.textContent = `${rate}%`;
            document.getElementById('loadVal').textContent = `${rate}%`;
            document.getElementById('loadBar').style.width = `${rate}%`;
        }
        const emptyState = document.getElementById('emptyState');
        if(emptyState) emptyState.classList.toggle('hidden', total !== 0);
    };

    const updateTimerDisplay = () => {
        const display = document.getElementById('timerDisplay');
        if(!display) return;
        const mins = Math.floor(system.timer.seconds / 60);
        const secs = system.timer.seconds % 60;
        display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleTimerToggle = () => {
        const btnText = document.querySelector('#timerToggleBtn span');
        const btnIcon = document.getElementById('timerIcon');
        const card = document.getElementById('pomodoroCard');
        const minutesInput = parseInt(document.getElementById('minutesInput').value) || 25;

        if (system.timer.isActive) {
            clearInterval(system.timer.interval);
            system.timer.isActive = false;
            btnText.textContent = 'Resume';
            btnIcon.setAttribute('data-lucide', 'play');
            card.classList.remove('timer-active');
        } else {
            if (system.timer.seconds <= 0) {
                system.timer.seconds = minutesInput * 60;
                document.getElementById('timerMode').textContent = 'CUSTOM';
            }
            
            system.timer.isActive = true;
            btnText.textContent = 'Pause';
            btnIcon.setAttribute('data-lucide', 'pause');
            card.classList.add('timer-active');

            system.timer.interval = setInterval(() => {
                system.timer.seconds--;
                updateTimerDisplay();

                if (system.timer.seconds <= 0) {
                    clearInterval(system.timer.interval);
                    system.timer.isActive = false;
                    btnText.textContent = 'Start';
                    btnIcon.setAttribute('data-lucide', 'play');
                    card.classList.remove('timer-active');
                    document.getElementById('timerMode').textContent = 'DONE';
                    lucide.createIcons();
                }
            }, 1000);
        }
        lucide.createIcons();
    };

    const handleTimerReset = () => {
        clearInterval(system.timer.interval);
        system.timer.isActive = false;
        const minutesInput = parseInt(document.getElementById('minutesInput').value) || 25;
        system.timer.seconds = minutesInput * 60;
        
        document.querySelector('#timerToggleBtn span').textContent = 'Start';
        document.getElementById('timerIcon').setAttribute('data-lucide', 'play');
        document.getElementById('pomodoroCard').classList.remove('timer-active');
        document.getElementById('timerMode').textContent = 'FOCUS';
        
        updateTimerDisplay();
        lucide.createIcons();
    };


    const render = () => {
        document.body.dataset.theme = system.theme;
        const onboarding = document.getElementById('onboarding');
        const app = document.getElementById('app');
        const mobileTopBar = document.getElementById('mobileTopBar');
        const taskList = document.getElementById('taskList');

        if(!system.user){
            onboarding.classList.remove('hidden');
            app.classList.add('hidden');
            mobileTopBar.classList.add('hidden');
        } else {
            onboarding.classList.add('hidden');
            app.classList.remove('hidden');
            mobileTopBar.classList.remove('hidden');
            

            document.querySelectorAll('[id*="UserName"]').forEach(el => {
                if(el.tagName === 'INPUT') el.value = system.user;
                else el.textContent = system.user;
            });
            document.querySelectorAll('[id*="UserJob"]').forEach(el => {
                if(el.tagName === 'INPUT') el.value = system.userJob;
                else el.textContent = system.userJob;
            });
            document.querySelectorAll('[id*="UserAvatar"]').forEach(el => el.textContent = system.user.charAt(0).toUpperCase());
            const profileAvatar = document.getElementById('profileDisplayAvatar');
            if(profileAvatar) profileAvatar.textContent = system.user.charAt(0).toUpperCase();

            document.getElementById('editUserAgeInput').value = system.userAge;
            document.getElementById('editUserBioInput').value = system.userBio;

            document.getElementById('greeting').textContent = `Active: ${system.user.split(' ')[0]}`;
            
            const bioCard = document.getElementById('sidebarBioCard');
            if(system.userBio) {
                bioCard.classList.remove('hidden');
                document.getElementById('sidebarBioText').textContent = system.userBio;
            } else {
                bioCard.classList.add('hidden');
            }
        }

        const themeIcon = document.getElementById('themeIcon');
        if(themeIcon) themeIcon.setAttribute('data-lucide', system.theme === 'dark' ? 'sun' : 'moon');
        
        const dateDisp = document.getElementById('dateDisplay');
        if(dateDisp) dateDisp.textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
        });

        if(taskList) {
            const filtered = system.tasks.filter(t => {
                const matchesSearch = t.text.toLowerCase().includes(system.searchQuery.toLowerCase());
                const matchesCat = system.filterCat === 'All' || t.category === system.filterCat;
                return matchesSearch && matchesCat;
            });

            taskList.innerHTML = filtered.map(t => {
                const colors = {
                    'Personal': 'text-emerald-500 bg-emerald-500/10',
                    'Work': 'text-blue-500 bg-blue-500/10',
                    'Urgent': 'text-rose-500 bg-rose-500/10'
                };
                return `
                    <div class="glass p-4 rounded-2xl flex items-center justify-between group">
                        <div class="flex items-center gap-4 overflow-hidden">
                            <button onclick="toggleTask(${t.id})" class="flex-shrink-0 w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center ${t.done ? 'bg-blue-600 border-blue-600' : ''}">
                                ${t.done ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
                            </button>
                            <div>
                                <span class="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${colors[t.category] || 'bg-white/10'} mb-1 inline-block">${t.category}</span>
                                <p class="font-bold text-sm truncate ${t.done ? 'line-through opacity-30' : ''}">${t.text}</p>
                            </div>
                        </div>
                        <button onclick="deleteTask(${t.id})" class="p-2 opacity-30 hover:opacity-100 hover:text-red-500 transition-all"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                `;
            }).reverse().join('');
        }

        updateAnalytics();
        sync();
    };

 
    window.toggleTask = id => { const t = system.tasks.find(x => x.id === id); if(t) t.done = !t.done; render(); };
    window.deleteTask = id => { system.tasks = system.tasks.filter(x => x.id !== id); render(); };


    window.saveProfile = () => {
        system.user = document.getElementById('editUserNameInput').value.trim();
        system.userAge = document.getElementById('editUserAgeInput').value;
        system.userJob = document.getElementById('editUserJobInput').value || 'System Admin';
        system.userBio = document.getElementById('editUserBioInput').value;
        
    
        const btn = event.currentTarget;
        const originalText = btn.textContent;
        btn.textContent = "SYNCING...";
        btn.classList.replace('bg-blue-600', 'bg-emerald-600');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.replace('bg-emerald-600', 'bg-blue-600');
            render();
            switchPage('dashboard');
        }, 800);
    };

    window.logout = () => {
        const m = document.getElementById('confirmModal');
        m.classList.remove('hidden');
        setTimeout(() => m.classList.remove('opacity-0'), 10);
    };

    window.closeConfirm = () => {
        const m = document.getElementById('confirmModal');
        m.classList.add('opacity-0');
        setTimeout(() => m.classList.add('hidden'), 300);
    };

    window.confirmLogout = () => { localStorage.clear(); location.reload(); };


    document.getElementById('startBtn').onclick = () => { system.user = document.getElementById('userNameInput').value.trim(); render(); };
    document.getElementById('userNameInput').oninput = e => document.getElementById('startBtn').disabled = e.target.value.length < 2;
    document.getElementById('searchInput').oninput = e => { system.searchQuery = e.target.value; render(); };
    document.getElementById('categoryFilter').onchange = e => { system.filterCat = e.target.value; render(); };
    document.getElementById('themeToggle').onclick = () => { system.theme = system.theme === 'dark' ? 'light' : 'dark'; render(); };
    document.getElementById('timerToggleBtn').onclick = handleTimerToggle;
    document.getElementById('timerResetBtn').onclick = handleTimerReset;
    document.getElementById('minutesInput').oninput = (e) => {
        if (!system.timer.isActive) {
            system.timer.seconds = (parseInt(e.target.value) || 0) * 60;
            updateTimerDisplay();
        }
    };

    document.getElementById('taskForm').onsubmit = e => {
        e.preventDefault();
        const input = document.getElementById('taskInput');
        if (!input.value.trim()) return;
        system.tasks.push({ id: Date.now(), text: input.value.trim(), category: system.draftCat, done: false });
        input.value = '';
        render();
    };

    document.querySelectorAll('.category-chip').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.category-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            system.draftCat = btn.dataset.cat;
        };
    });

    window.onload = () => {
        render();
        updateTimerDisplay();
        switchPage('dashboard');
        lucide.createIcons();
    };