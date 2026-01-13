   const system = {
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

    const toggleMobileNav = () => {
        const nav = document.getElementById('mobileNav');
        nav.classList.toggle('closed');
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

        document.getElementById('completionRate').textContent = `${rate}%`;
        document.getElementById('loadVal').textContent = `${rate}%`;
        document.getElementById('loadBar').style.width = `${rate}%`;
        
        const emptyState = document.getElementById('emptyState');
        if (total === 0) emptyState.classList.remove('hidden');
        else emptyState.classList.add('hidden');
    };

    const toggleTimer = () => {
        const card = document.getElementById('pomodoroCard');
        const btnText = document.querySelector('#timerToggleBtn span');
        const btnIcon = document.getElementById('timerIcon');

        if (system.timer.isActive) {
            clearInterval(system.timer.interval);
            system.timer.isActive = false;
            btnText.textContent = 'Resume';
            btnIcon.setAttribute('data-lucide', 'play');
            card.classList.remove('timer-active');
        } else {
            system.timer.isActive = true;
            btnText.textContent = 'Pause';
            btnIcon.setAttribute('data-lucide', 'pause');
            card.classList.add('timer-active');
            system.timer.interval = setInterval(() => {
                system.timer.seconds--;
                if (system.timer.seconds <= 0) {
                    clearInterval(system.timer.interval);
                    system.timer.isActive = false;
                    system.timer.mode = system.timer.mode === 'FOCUS' ? 'BREAK' : 'FOCUS';
                    system.timer.seconds = system.timer.mode === 'FOCUS' ? 25 * 60 : 5 * 60;
                    document.getElementById('timerMode').textContent = system.timer.mode;
                }
                updateTimerDisplay();
            }, 1000);
        }
        lucide.createIcons();
    };

    const resetTimer = () => {
        clearInterval(system.timer.interval);
        system.timer.isActive = false;
        system.timer.mode = 'FOCUS';
        system.timer.seconds = 25 * 60;
        document.querySelector('#timerToggleBtn span').textContent = 'Start';
        document.getElementById('timerIcon').setAttribute('data-lucide', 'play');
        document.getElementById('pomodoroCard').classList.remove('timer-active');
        document.getElementById('timerMode').textContent = 'FOCUS';
        updateTimerDisplay();
        lucide.createIcons();
    };

    const updateTimerDisplay = () => {
        const mins = Math.floor(system.timer.seconds / 60);
        const secs = system.timer.seconds % 60;
        document.getElementById('timerDisplay').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const render = () => {
        document.body.dataset.theme = system.theme;
        
        const onboarding = document.getElementById('onboarding');
        const app = document.getElementById('app');
        const mobileTopBar = document.getElementById('mobileTopBar');
        const themeIcon = document.getElementById('themeIcon');
        const taskList = document.getElementById('taskList');

        if(!system.user){
            onboarding.classList.remove('hidden');
            app.classList.add('hidden');
            mobileTopBar.classList.add('hidden');
        } else {
            onboarding.classList.add('hidden');
            app.classList.remove('hidden');
            mobileTopBar.classList.remove('hidden');
            
  
            document.querySelectorAll('[id*="UserName"]').forEach(el => el.textContent = system.user);
            document.querySelectorAll('[id*="UserJob"]').forEach(el => el.textContent = system.userJob);
            document.querySelectorAll('[id*="UserAvatar"]').forEach(el => el.textContent = system.user.charAt(0).toUpperCase());
            
            document.getElementById('greeting').textContent = `Active: ${system.user.split(' ')[0]}`;
            
            const bioCard = document.getElementById('sidebarBioCard');
            if(system.userBio) {
                bioCard.classList.remove('hidden');
                document.getElementById('sidebarBioText').textContent = system.userBio;
            } else {
                bioCard.classList.add('hidden');
            }
        }

        themeIcon.setAttribute('data-lucide', system.theme === 'dark' ? 'sun' : 'moon');
        const now = new Date();
        document.getElementById('dateDisplay').textContent = now.toLocaleDateString('en-US', { 
            weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' 
        });

        const filtered = system.tasks.filter(t => {
            const matchesSearch = t.text.toLowerCase().includes(system.searchQuery.toLowerCase());
            const matchesCat = system.filterCat === 'All' || t.category === system.filterCat;
            return matchesSearch && matchesCat;
        });

        taskList.innerHTML = filtered.map(t => {
            const catColors = {
                'Personal': 'text-emerald-500 bg-emerald-500/10',
                'Work': 'text-blue-500 bg-blue-500/10',
                'Urgent': 'text-rose-500 bg-rose-500/10'
            };
            return `
                <div class="task-card glass p-4 rounded-2xl flex items-center justify-between group hover:border-blue-500/30">
                    <div class="flex items-center gap-4 overflow-hidden">
                        <button onclick="toggleTask(${t.id})" 
                                class="flex-shrink-0 w-6 h-6 rounded-lg border-2 border-white/10 flex items-center justify-center transition-all ${t.done ? 'bg-blue-600 border-blue-600' : ''}">
                            ${t.done ? '<i data-lucide="check" class="w-4 h-4 text-white"></i>' : ''}
                        </button>
                        <div class="overflow-hidden">
                            <span class="text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${catColors[t.category] || 'bg-white/10 text-white'} mb-1 inline-block">
                                ${t.category}
                            </span>
                            <p class="font-bold text-sm truncate ${t.done ? 'line-through opacity-30' : ''}">${t.text}</p>
                        </div>
                    </div>
                    <button onclick="deleteTask(${t.id})" class="p-2 opacity-50 hover:opacity-100 hover:text-red-500 transition-all">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            `;
        }).reverse().join('');

        updateAnalytics();
        sync();
    };

    window.toggleTask = id => {
        const t = system.tasks.find(x => x.id === id);
        if (t) t.done = !t.done;
        render();
    };

    window.deleteTask = id => {
        system.tasks = system.tasks.filter(x => x.id !== id);
        render();
    };

    window.openProfileModal = () => {
        const modal = document.getElementById('profileModal');
        document.getElementById('editUserNameInput').value = system.user;
        document.getElementById('editUserAgeInput').value = system.userAge;
        document.getElementById('editUserJobInput').value = system.userJob;
        document.getElementById('editUserBioInput').value = system.userBio;
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    };

    window.closeProfileModal = () => {
        const modal = document.getElementById('profileModal');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    window.saveProfile = () => {
        const newName = document.getElementById('editUserNameInput').value.trim();
        if (newName.length >= 2) {
            system.user = newName;
            system.userAge = document.getElementById('editUserAgeInput').value.trim();
            system.userJob = document.getElementById('editUserJobInput').value.trim() || 'System Admin';
            system.userBio = document.getElementById('editUserBioInput').value.trim();
            render();
            closeProfileModal();
        }
    };

    window.logout = () => {
        const modal = document.getElementById('confirmModal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    };

    window.closeConfirm = () => {
        const modal = document.getElementById('confirmModal');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    window.confirmLogout = () => {
        localStorage.clear();
        location.reload();
    };

    document.getElementById('startBtn').onclick = () => {
        system.user = document.getElementById('userNameInput').value.trim();
        render();
    };

    document.getElementById('userNameInput').oninput = e => {
        document.getElementById('startBtn').disabled = e.target.value.length < 2;
    };

    document.getElementById('searchInput').oninput = e => {
        system.searchQuery = e.target.value;
        render();
    };

    document.getElementById('categoryFilter').onchange = e => {
        system.filterCat = e.target.value;
        render();
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

    document.getElementById('themeToggle').onclick = () => {
        system.theme = system.theme === 'dark' ? 'light' : 'dark';
        render();
    };

    window.onload = () => {
        render();
        lucide.createIcons();
    };