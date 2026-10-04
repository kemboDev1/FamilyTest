/**
 * Family & Friends Test Application Core Logic
 * Full Feature Implementation: Multi-user profiles, custom avatars,
 * multi-type test creation, dynamic evaluation notes, text feedback,
 * light/dark theme toggling, and owner result tracking.
 */

(function () {
    "use strict";

    // Available Icons / Avatars for Users
    const SYSTEM_AVATARS = [
        "👨‍💻", "👩‍💻", "🧙‍♂️", "🧚‍♀️", "🦸‍♂️", "🕵️‍♂️", "🤖", "👽",
        "🦊", "🦉", "🦁", "🐼", "🚀", "👑", "🎯", "💎"
    ];

    let state = window.FamilyService.loadState();

    const savedUser = state.profiles.find(profile => profile.id === state.currentUserId);
    if (state.currentUserId && (!savedUser || !savedUser.passwordHash || savedUser.isBanned)) {
        state.currentUserId = null;
    }

    // Helper functions for state modification
    function saveState() {
        window.FamilyService.saveState(state);
    }

    function generateUniqueId() {
        return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function escapeHtml(value = "") {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getAiQuestionBank(topic) {
        const normalizedTopic = topic.toLocaleLowerCase();
        const makeChoiceQuestion = (id, text, options, correctOptionIndex) => {
            const shuffledOptions = window.FamilyService.shuffleItems(options.map((option, index) => ({ option, index })));
            return {
                id,
                type: "multiple",
                text,
                options: shuffledOptions.map(({ option }) => ({ text: option, evaluationNote: "" })),
                correctOptionIndex: shuffledOptions.findIndex(({ index }) => index === correctOptionIndex)
            };
        };

        if (/pet|animal|hayvon|mushuk|it\b|kuchuk|parrand|qush/.test(normalizedTopic)) {
            return [
                ["pet-water", "Uy hayvoniga toza suvni doimiy berish nima uchun muhim?", ["Sog'lom suvsizlanishning oldini olish uchun", "Faqat junini yaltiroq qilish uchun", "Uxlash vaqtini uzaytirish uchun", "Ovqat o'rnini bosishi uchun"], 0],
                ["pet-vet", "Hayvon o'zini yomon his qilsa, eng to'g'ri yo'l qaysi?", ["Veterinar bilan maslahatlashish", "Odam dorisini berish", "Bir necha kun kutish", "Ovqatini butunlay to'xtatish"], 0],
                ["pet-food", "Uy hayvoni uchun ovqat tanlashda nimaga qarash kerak?", ["Yoshi va turiga mosligiga", "Faqat qadoq rangiga", "Eng arzonligiga", "Faqat hidiga"], 0],
                ["pet-safety", "Notanish hayvonga yaqinlashishda nima qilish kerak?", ["Avval egasidan ruxsat so'rash", "Birdan quchoqlash", "Qattiq tovush chiqarish", "Ovqatni majburan berish"], 0],
                ["pet-cat", "Mushukning tirnoqlarini tirnashi uchun uyda nima foydali?", ["Tirnash ustuni", "Shisha idish", "Yopiq quti", "Yumshoq yostiq"], 0],
                ["pet-dog", "It bilan sayrda xavfsizlik uchun nima muhim?", ["Mos tasma va nazorat", "Uni yolg'iz qo'yib yuborish", "Issiqda uzoq yugurtirish", "Suv bermaslik"], 0],
                ["pet-clean", "Hayvon yashaydigan joyni toza saqlash nimaga yordam beradi?", ["Kasallik va noqulay hidlarni kamaytirishga", "Hayvonni tezroq o'stirishga", "Ko'proq ovqat yeyishiga", "Rangini o'zgartirishga"], 0],
                ["pet-body", "Hayvon bezovta bo'lib, yashirinsa, nima qilish ma'qul?", ["Unga tinch joy berib, holatini kuzatish", "Majburan ko'tarish", "Orqasidan quvish", "Baland musiqa qo'yish"], 0],
                ["pet-exercise", "Ko'pchilik uy hayvonlariga har kuni nima kerak?", ["Turiga mos harakat va mashg'ulot", "Kun bo'yi yolg'iz qolish", "Cheksiz shirinlik", "Faqat uxlash"], 0],
                ["pet-care", "Hayvonni oilaga olishdan avval nimani o'ylab ko'rish kerak?", ["Vaqt, xarajat va uzoq muddatli parvarishni", "Faqat uning suratini", "Faqat bugungi kayfiyatni", "Faqat o'yinchoqlar sonini"], 0]
            ].map(([id, text, options, correct]) => makeChoiceQuestion(id, text, options, correct));
        }

        if (/family|oila|ota|ona|aka|uka|opa|singil|do'st|friend/.test(normalizedTopic)) {
            return [
                ["family-memory", `${topic} bilan bog'liq eng quvnoq xotirang qaysi?`],
                ["family-tradition", `${topic} bilan birga davom ettirishni istaydigan an'ana qaysi?`],
                ["family-strength", `${topic}dagi qaysi fazilatni eng ko'p qadrlaysan?`],
                ["family-day", `${topic} bilan ideal dam olish kuning qanday o'tardi?`],
                ["family-laugh", `${topic} bilan birga seni eng ko'p nima kuldiradi?`],
                ["family-thanks", `${topic}ga aytmoqchi bo'lgan minnatdorchiliging nima?`],
                ["family-trip", `${topic} bilan qaysi joyga sayohat qilishni xohlarding?`],
                ["family-skill", `${topic}dan o'rgangan eng foydali narsang nima?`],
                ["family-song", `${topic}ni eslatadigan qo'shiq yoki film qaysi?`],
                ["family-surprise", `${topic} uchun qanday kichik syurpriz tayyorlarding?`]
            ].map(([id, text]) => ({ id, type: "text", text, options: [], correctOptionIndex: 0 }));
        }

        return [
            ["topic-source", `${topic} haqida yangi ma'lumotni tekshirishda qaysi manbaga ko'proq ishonish kerak?`, ["Mutaxassis yoki ishonchli manbaga", "Muallifi noma'lum xabarga", "Faqat ko'p ulashilgan postga", "Tasodifiy taxminga"], 0],
            ["topic-conflict", `${topic} bo'yicha ikki manba zid gapirsa, eng yaxshi qadam qaysi?`, ["Dalil, sana va muallif tajribasini solishtirish", "Birinchi ko'rgan fikrni tanlash", "Ikkalasini ham tekshirmaslik", "Eng keskin sarlavhaga ishonish"], 0],
            ["topic-practice", `${topic}ni yaxshiroq eslab qolishga qaysi usul yordam beradi?`, ["Oraliq bilan takrorlash va o'z so'zing bilan tushuntirish", "Bir marta shoshilib o'qish", "Faqat sarlavhani yodlash", "Chalg'ib turib tinglash"], 0],
            ["topic-question", `${topic} haqida yaxshi test savoli qanday bo'ladi?`, ["Aniq va tushunarli, bitta asosiy javobli", "Bir-biriga aloqasiz uchta savol", "Javobi noma'lum taxmin", "Juda uzun va noaniq"], 0],
            ["topic-example", `${topic}ni tushunganingni ko'rsatadigan eng yaxshi belgi nima?`, ["G'oyani misol bilan tushuntira olish", "Faqat atamani ko'rgan bo'lish", "Javobni taxmin qilish", "Savoldan qochish"], 0],
            ["topic-plan", `${topic}ni o'rganishni boshlash uchun foydali birinchi qadam qaysi?`, ["Maqsadni belgilab, asosiy tushunchalarni aniqlash", "Barcha tafsilotni birdan yodlash", "Faqat tasodifiy video ko'rish", "Rejasiz ko'plab havola ochish"], 0],
            ["topic-evidence", `${topic} haqidagi da'voni baholashda nimaga qarash kerak?`, ["Dalil va manbaning ishonchliligiga", "Faqat yozuvdagi undovlarga", "Muallifning obunachilari soniga", "Xabarning rangiga"], 0],
            ["topic-summary", `${topic}ni o'rganganingdan keyin bilimni sinashning yaxshi usuli qaysi?`, ["Asosiy fikrni eslab, o'z so'zing bilan bayon qilish", "Matnni tushunmay ko'chirish", "Faqat rasmlarga qarash", "Darhol boshqa mavzuga o'tish"], 0],
            ["topic-improve", `${topic} bo'yicha xato qilgan javobdan keyin nima qilish foydali?`, ["Sababini ko'rib chiqib, to'g'ri tushunchani qayta mashq qilish", "Xatoni yashirish", "Savolni umuman unutish", "Faqat tezroq taxmin qilish"], 0],
            ["topic-share", `${topic} haqidagi foydali bilimni boshqaga yetkazishda nima muhim?`, ["Aniq misol va sodda izoh ishlatish", "Ataylab chalkashtirish", "Manbani yashirish", "Tekshirilmagan gapni fakt deyish"], 0]
        ].map(([id, text, options, correct]) => makeChoiceQuestion(id, text, options, correct));
    }

    // Temporary storage for test creation builder
    let testDraft = {
        title: "",
        description: "",
        questions: []
    };

    window.testDraft = testDraft;

    function resetDraft() {
        testDraft = {
            title: "",
            description: "",
            questions: [
                {
                    id: generateUniqueId(),
                    text: "",
                    type: "multiple", // 'multiple', 'boolean', 'text'
                    options: [
                        { text: "", evaluationNote: "" },
                        { text: "", evaluationNote: "" }
                    ],
                    correctOptionIndex: 0
                }
            ]
        };
        window.testDraft = testDraft;
    }

    // Determine current active page based on URL hash
    function getCurrentRoute() {
        const hash = window.location.hash.replace("#", "");
        return hash || "tests";
    }

    function navigateTo(route) {
        window.location.hash = route;
    }

    let toastQueue = [];
    let pendingConfirm = null;
    let authMode = "login";

    function renderToasts() {
        if (!toastQueue.length) return "";
        return `
            <div class="toast-stack">
                ${toastQueue.map(toast => `
                    <div class="toast toast-${toast.type}" data-toast-id="${toast.id}">
                        <div class="toast-icon">${toast.type === 'success' ? '✓' : toast.type === 'error' ? '!' : 'i'}</div>
                        <div class="toast-text">${escapeHtml(toast.message)}</div>
                        <button class="toast-close" onclick="window.dismissToast('${toast.id}')">×</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderConfirmModal() {
        if (!pendingConfirm) return "";
        return `
            <div class="modal-backdrop" onclick="window.closeConfirmModal()">
                <div class="modal-card" onclick="event.stopPropagation()">
                    <div class="modal-header">
                        <div class="modal-badge">⚡</div>
                        <h3>${escapeHtml(pendingConfirm.title)}</h3>
                    </div>
                    <p>${escapeHtml(pendingConfirm.message)}</p>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="window.closeConfirmModal()">${escapeHtml(pendingConfirm.cancelText)}</button>
                        <button class="btn btn-primary" onclick="window.confirmAction(true)">${escapeHtml(pendingConfirm.confirmText)}</button>
                    </div>
                </div>
            </div>
        `;
    }

    function showToast(message, type = "info") {
        const id = generateUniqueId();
        toastQueue.push({ id, message, type });
        renderApp();
        window.setTimeout(() => {
            toastQueue = toastQueue.filter(toast => toast.id !== id);
            renderApp();
        }, 2600);
    }

    function addNotification(message, type = "info") {
        state.notifications = [
            {
                id: generateUniqueId(),
                message,
                type,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            ...state.notifications
        ].slice(0, 12);

        saveState();
    }

    window.dismissToast = function (id) {
        toastQueue = toastQueue.filter(toast => toast.id !== id);
        renderApp();
    };

    function showConfirmDialog({ title, message, confirmText = "Tasdiqlash", cancelText = "Bekor qilish" }, onConfirm) {
        pendingConfirm = { title, message, confirmText, cancelText, onConfirm };
        renderApp();
    }

    window.closeConfirmModal = function () {
        pendingConfirm = null;
        renderApp();
    };

    window.confirmAction = function (confirmed) {
        if (confirmed && pendingConfirm && typeof pendingConfirm.onConfirm === "function") {
            pendingConfirm.onConfirm();
        }
        pendingConfirm = null;
        renderApp();
    };

    // Main App Renderer
    function renderApp() {
        const root = document.getElementById("app");
        const currentRoute = getCurrentRoute();

        // Apply global theme
        document.documentElement.setAttribute("data-theme", state.theme || "light");

        if (!state.currentUserId) {
            root.innerHTML = window.FamilyLogin.render(authMode);
            window.FamilyLogin.bind(window.authenticateUser);
            return;
        }

        const activeProfile = state.profiles.find(profile => profile.id === state.currentUserId);
        if (!activeProfile || activeProfile.isBanned) {
            state.currentUserId = null;
            saveState();
            root.innerHTML = window.FamilyLogin.render(authMode);
            window.FamilyLogin.bind(window.authenticateUser);
            return;
        }

        // Shell Structure
        root.innerHTML = `
            <div class="app-shell">
                <div class="ambient ambient-one"></div>
                <div class="ambient ambient-two"></div>
                <div class="ambient ambient-three"></div>
                <div class="app-container">
                    <aside class="sidebar">
                        <div>
                            <div class="brand">
                                <div class="brand-icon">✦</div>
                                <span>Family Studio</span>
                            </div>
                            <nav class="nav-menu">
                                <a class="nav-item ${currentRoute === 'tests' ? 'active' : ''}" data-route="tests">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12"/><path d="M8 10h8M8 14h8M8 18h5"/></svg></span>
                                    <span>Testlar</span>
                                </a>
                                <a class="nav-item ${currentRoute === 'builder' ? 'active' : ''}" data-route="builder">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/><rect x="3.5" y="3.5" width="17" height="17" rx="4"/></svg></span>
                                    <span>Studio</span>
                                </a>
                                <a class="nav-item ${currentRoute === 'leaderboard' ? 'active' : ''}" data-route="leaderboard">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18V9"/><path d="M12 18V5"/><path d="M17 18v-7"/><path d="M4 18h16"/></svg></span>
                                    <span>Leaderboard</span>
                                </a>
                                <a class="nav-item ${currentRoute === 'results' ? 'active' : ''}" data-route="results">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8"/><path d="M12 17V9"/><path d="M7 9l5-5 5 5"/><path d="M5 18h14"/></svg></span>
                                    <span>Natijalar</span>
                                </a>
                                ${activeProfile.role === 'admin' ? `<a class="nav-item ${currentRoute === 'admin' ? 'active' : ''}" data-route="admin">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6"/><path d="M12 15v6"/><path d="M3 12h6"/><path d="M15 12h6"/><circle cx="12" cy="12" r="3"/></svg></span>
                                    <span>Admin</span>
                                </a>` : ''}
                                <a class="nav-item ${currentRoute === 'profiles' ? 'active' : ''}" data-route="profiles">
                                    <span class="nav-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/><circle cx="10" cy="7" r="4"/><path d="M20 18v-1a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
                                    <span>Profillar</span>
                                </a>
                            </nav>
                        </div>
                    </aside>
                    
                    <main class="main-content">
                        <header class="topbar">
                            <div class="topbar-user">
                                ${renderCurrentUserBadge()}
                            </div>
                            <div class="topbar-actions">
                                <button class="btn btn-secondary logout-button" onclick="window.logoutUser()" title="Hisobdan chiqish">Chiqish</button>
                                <button id="theme-toggle-btn" class="theme-toggle-btn" title="Mavzuni o'zgartirish">
                                    ${state.theme === 'dark' ? '☀️' : '🌙'}
                                </button>
                            </div>
                        </header>
                        
                        <div class="content-body">
                            ${renderRouteContent(currentRoute)}
                        </div>
                    </main>
                </div>
                ${renderToasts()}
                ${renderConfirmModal()}
            </div>
        `;

        bindGlobalEvents();
    }

    async function createUserAccount(name, password, avatar = SYSTEM_AVATARS[0]) {
        const newProfile = await window.FamilyUsers.createAccount(state, name, password, avatar);
        state.profiles.push(newProfile);
        state.currentUserId = newProfile.id;
        addNotification(`${newProfile.avatar} ${newProfile.name} tizimga kirdi`, "success");
        saveState();
        return newProfile;
    }

    window.toggleAuthMode = function () {
        authMode = authMode === "login" ? "register" : "login";
        renderApp();
    };

    window.authenticateUser = async function (event) {
        event.preventDefault();
        const name = document.getElementById("auth-name").value.trim();
        const password = document.getElementById("auth-password").value;
        const message = document.getElementById("auth-message");

        try {
            if (authMode === "register") {
                await createUserAccount(name, password);
            } else {
                const profile = await window.FamilyUsers.authenticate(state, name, password);
                state.currentUserId = profile.id;
                addNotification(`${profile.avatar} ${profile.name} tizimga kirdi`, "success");
                saveState();
            }

            window.location.hash = window.location.pathname.toLocaleLowerCase().endsWith("adminpanel.html") ? "admin" : "tests";
            renderApp();
        } catch (error) {
            message.textContent = error.message || "Kirish amalga oshmadi.";
        }
    };

    window.logoutUser = function () {
        state.currentUserId = null;
        authMode = "login";
        saveState();
        renderApp();
    };

    function renderCurrentUserBadge() {
        const activeUser = state.profiles.find(p => p.id === state.currentUserId);
        if (!activeUser) {
            return `<span style="color: var(--text-secondary); font-weight:600;">Profil tanlanmagan</span>`;
        }
        return `
            <div class="user-avatar-badge">${activeUser.avatar}</div>
            <div>
                <div style="font-weight: 700; font-size: 15px;">${activeUser.name}</div>
                <div style="font-size: 12px; color: var(--text-muted);">Faol Profil</div>
            </div>
        `;
    }

    function renderRouteContent(route) {
        if (route.startsWith('play_')) {
            const testId = route.replace('play_', '');
            return renderTestPlayerView(testId);
        }

        switch (route) {
            case "tests":
                return renderTestsView();
            case "builder":
                return renderBuilderView();
            case "leaderboard":
                return renderLeaderboardView();
            case "results":
                return renderResultsView();
            case "admin":
                return window.FamilyUsers.isAdmin(state, state.currentUserId)
                    ? renderAdminView()
                    : `<div class="card"><h2>Ruxsat yo'q</h2><p>Admin panel faqat admin hisobiga ochiq.</p></div>`;
            case "profiles":
                return renderProfilesView();
            default:
                return renderTestsView();
        }
    }

    // ==========================================
    // VIEW 1: TESTS LIST
    // ==========================================
    function renderTestsView() {
        const tests = state.tests;

        const testCards = tests.map(test => {
            const owner = state.profiles.find(p => p.id === test.ownerId) || { name: "Noma'lum", avatar: "👤" };
            const isOwner = state.currentUserId === test.ownerId;

            return `
                <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <span class="badge badge-primary">${test.questions.length} ta savol</span>
                            ${isOwner ? `<span class="badge badge-warning">Sizning testingiz</span>` : ''}
                        </div>
                        <h3 style="font-size: 18px; margin-bottom: 8px;">${escapeHtml(test.title)}</h3>
                        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">
                            ${escapeHtml(test.description || "Tavsif berilmagan.")}
                        </p>
                    </div>
                    <div>
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; font-size: 13px; color: var(--text-muted);">
                            <span>Ega: ${owner.avatar} ${escapeHtml(owner.name)}</span>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <button class="btn btn-primary" style="flex:1;" onclick="window.location.hash='play_${test.id}'">
                                Testni Yechish
                            </button>
                            ${isOwner ? `
                                <button class="btn btn-danger" onclick="window.deleteTest('${test.id}')">
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="hero-banner">
                <div>
                    <span class="hero-tag">Warm Studio</span>
                    <h1>Family & Friends Luxury Lounge</h1>
                    <p>Har bir profil o'z testini yaratishi mumkin, boshqalar ham ko'rib va yechishi mumkin. Bu yerda barcha testlar ochiq, ammo leaderboard va admin panel bilan nazorat ham bor.</p>
                </div>
                <button class="btn btn-secondary" onclick="window.location.hash='builder'">
                    ✦ Yangi Test
                </button>
            </div>

            <div class="stat-strip">
                <div class="stat-pill">
                    <span class="stat-label">Barcha testlar</span>
                    <strong>${tests.length}</strong>
                </div>
                <div class="stat-pill">
                    <span class="stat-label">Mening testlarim</span>
                    <strong>${tests.filter(t => t.ownerId === state.currentUserId).length}</strong>
                </div>
                <div class="stat-pill">
                    <span class="stat-label">Umumiy natijalar</span>
                    <strong>${state.results.length}</strong>
                </div>
            </div>

            <h2 style="margin-bottom: 20px;">Mavjud Testlar</h2>
            ${tests.length > 0 
                ? `<div class="grid-2">${testCards}</div>` 
                : `<div class="card"><p style="color: var(--text-secondary);">Hozircha hech qanday test yaratilmagan. Birinchi bo'lib test yarating!</p></div>`
            }
        `;
    }

    // ==========================================
    // VIEW 2: TEST BUILDER
    // ==========================================
    function renderBuilderView() {
        if (!state.currentUserId) {
            return `
                <div class="card" style="text-align: center; padding: 40px;">
                    <h3>Test yaratish uchun avval Profil tanlang!</h3>
                    <p style="color: var(--text-secondary); margin: 12px 0 20px;">Profil yaratish bo'limidan o'zingizga avatar va ism tanlang.</p>
                    <button class="btn btn-primary" onclick="window.location.hash='profiles'">Profillarga O'tish</button>
                </div>
            `;
        }

        if (!testDraft.questions || testDraft.questions.length === 0) {
            resetDraft();
        }

        const questionsHtml = testDraft.questions.map((q, qIndex) => {
            return `
                <div class="question-builder-item">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <strong style="font-size: 16px;">Savol #${qIndex + 1}</strong>
                        ${testDraft.questions.length > 1 ? `
                            <button class="btn btn-danger" style="padding: 6px 12px;" onclick="window.removeDraftQuestion(${qIndex})">
                                Savolni o'chirish
                            </button>
                        ` : ''}
                    </div>

                    <div class="form-group">
                        <label>Savol Matni</label>
                        <input type="text" class="form-control" placeholder="Masalan: Meni eng yoqtirgan taomim qaysi?" 
                               value="${escapeHtml(q.text)}" oninput="window.updateDraftQuestionText(${qIndex}, this.value)">
                    </div>

                    <div class="form-group">
                        <label>Savol Turi</label>
                        <select class="form-control" onchange="window.updateDraftQuestionType(${qIndex}, this.value)">
                            <option value="multiple" ${q.type === 'multiple' ? 'selected' : ''}>Variantli Savol (Variantga xos izoh/baho bilan)</option>
                            <option value="boolean" ${q.type === 'boolean' ? 'selected' : ''}>To'g'ri / Noto'g'ri</option>
                            <option value="text" ${q.type === 'text' ? 'selected' : ''}>Ochiq Fikr Bildirish (Matnli javob)</option>
                        </select>
                    </div>

                    ${q.type === 'text' ? `
                        <div style="padding: 12px; background-color: var(--bg-surface); border-radius: var(--radius-sm); color: var(--text-secondary); font-size: 13px;">
                            💡 Ushbu savolda javob beruvchi shaxs o'z fikrini yozma ravishda matn ko'rinishida qoldiradi.
                        </div>
                    ` : `
                        <div style="margin-top: 15px;">
                            <label style="font-size: 13px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 10px;">
                                Variantlar va Har bir javobga Shaxsiy Baxolash/Izoh:
                            </label>
                            
                            ${q.options.map((opt, optIndex) => `
                                <div class="option-input-group">
                                    <input type="radio" name="correct_q_${qIndex}" ${q.correctOptionIndex === optIndex ? 'checked' : ''} 
                                           onchange="window.setDraftCorrectOption(${qIndex}, ${optIndex})" title="To'g'ri javob deb belgilash">
                                    <input type="text" class="form-control" placeholder="Variant text..." value="${escapeHtml(opt.text)}" 
                                           oninput="window.updateDraftOptionText(${qIndex}, ${optIndex}, this.value)">
                                    <input type="text" class="form-control" placeholder="Javob tanlanganda chiqadigan izoh (Ixtiyoriy)" 
                                           value="${escapeHtml(opt.evaluationNote || '')}" oninput="window.updateDraftOptionNote(${qIndex}, ${optIndex}, this.value)">
                                    ${q.options.length > 2 ? `
                                        <button class="btn btn-secondary" style="padding: 8px;" onclick="window.removeDraftOption(${qIndex},${optIndex})">❌</button>
                                    ` : '<span></span>'}
                                </div>
                            `).join('')}

                            ${q.type === 'multiple' ? `
                                <button class="btn btn-secondary" style="margin-top: 8px; font-size: 12px;" onclick="window.addDraftOption(${qIndex})">
                                    + Variant Qo'shish
                                </button>
                            ` : ''}
                        </div>
                    `}
                </div>
            `;
        }).join('');

        return `
            <div class="card">
                <h2 style="margin-bottom: 20px;">Create in Studio</h2>

                <section class="ai-assistant" aria-labelledby="ai-assistant-title">
                    <div class="ai-assistant-heading">
                        <span class="ai-mark">✦</span>
                        <div>
                            <h3 id="ai-assistant-title">AI test yordamchisi</h3>
                            <p>Mavzuni kiriting, savollar avtomatik tayyorlanadi.</p>
                        </div>
                    </div>
                    <div class="ai-assistant-controls">
                        <input id="ai-topic" class="form-control" maxlength="60" placeholder="Masalan: Mushuklar, Oila, Do'stlik">
                        <input id="ai-question-count" class="form-control ai-count" type="number" min="2" max="10" value="5" aria-label="Savollar soni">
                        <button class="btn btn-primary" type="button" onclick="window.generateAiQuestions()">Savollar yaratish</button>
                    </div>
                    <p class="ai-disclaimer">Offline yordamchi savol shablonlaridan foydalanadi. Savollarni nashrdan oldin tahrirlashingiz mumkin.</p>
                </section>
                
                <div class="form-group">
                    <label>Test Nomi</label>
                    <input type="text" class="form-control" id="draft-title" placeholder="Masalan: Do'stlik Testi 2026" 
                           value="${escapeHtml(testDraft.title)}" oninput="window.testDraft.title = this.value">
                </div>

                <div class="form-group">
                    <label>Test Haqida Qisqacha (Tavsif)</label>
                    <textarea class="form-control" id="draft-desc" placeholder="Ushbu test nima haqida..." 
                              oninput="window.testDraft.description = this.value">${escapeHtml(testDraft.description)}</textarea>
                </div>

                <h3 style="margin: 30px 0 15px;">Savollar Ro'yxati</h3>
                ${questionsHtml}

                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button class="btn btn-secondary" onclick="window.addDraftQuestion()">
                        + Savol Qo'shish
                    </button>
                    <button class="btn btn-primary" onclick="window.saveTestDraft()">
                        💾 Testni Saqlash va Nashr Qilish
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================
    // VIEW 3: TEST PLAYER
    // ==========================================
    function renderTestPlayerView(testId) {
        const test = state.tests.find(t => t.id === testId);

        if (!test) {
            return `<div class="card"><h3>Test topilmadi!</h3></div>`;
        }

        if (!state.currentUserId) {
            return `
                <div class="card" style="text-align: center; padding: 40px;">
                    <h3>Testni yechish uchun profil tanlang!</h3>
                    <p style="color: var(--text-secondary); margin-top: 10px;">Natijalaringiz saqlanishi uchun profilingiz belgilangan bo'lishi kerak.</p>
                    <br>
                    <button class="btn btn-primary" onclick="window.location.hash='profiles'">Profillarga O'tish</button>
                </div>
            `;
        }

        const questionsHtml = test.questions.map((q, index) => {
            return `
                <div class="card" style="margin-bottom: 20px;">
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 14px;">
                        <span class="badge badge-primary">Savol #${index + 1}</span>
                        <span style="font-size: 13px; color: var(--text-muted);">
                            ${q.type === 'text' ? 'Ochiq Fikr' : 'Tanlovli'}
                        </span>
                    </div>
                    <h3 style="font-size: 18px; margin-bottom: 16px;">${escapeHtml(q.text)}</h3>

                    ${q.type === 'text' ? `
                        <div class="form-group">
                            <textarea class="form-control" id="play_ans_${index}" placeholder="O'z fikringizni batafsil yozib qoldiring..."></textarea>
                        </div>
                    ` : `
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            ${q.options.map((opt, optIdx) => `
                                <label style="display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: 1px solid var(--border-color); border-radius: var(--radius-md); cursor: pointer; transition: var(--transition);">
                                    <input type="radio" name="play_q_${index}" value="${optIdx}">
                                    <span style="font-size: 15px;">${escapeHtml(opt.text)}</span>
                                </label>
                            `).join('')}
                        </div>
                    `}
                </div>
            `;
        }).join('');

        return `
            <div style="margin-bottom: 20px;">
                <button class="btn btn-secondary" onclick="window.location.hash='tests'">← Ortga qaytish</button>
            </div>
            <div class="card" style="background: linear-gradient(135deg, var(--primary-soft), var(--bg-surface)); border-left: 6px solid var(--primary);">
                <h2>${escapeHtml(test.title)}</h2>
                <p style="color: var(--text-secondary); margin-top: 6px;">${escapeHtml(test.description)}</p>
            </div>

            ${questionsHtml}

            <button class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 16px; margin-bottom: 40px;" onclick="window.submitTestAnswers('${test.id}')">
                Javoblarni Topshirish va Natijani Ko'rish
            </button>
        `;
    }

    // ==========================================
    // VIEW 4: RESULTS DASHBOARD
    // ==========================================
    function renderResultsView() {
        const activeUserId = state.currentUserId;

        if (!activeUserId) {
            return `
                <div class="card" style="text-align: center;">
                    <h3>Natijalarni ko'rish uchun profil tanlang.</h3>
                </div>
            `;
        }

        // Filter results where current user is either test Owner OR player
        const relevantResults = state.results.filter(r => {
            const test = state.tests.find(t => t.id === r.testId);
            const isOwner = test && test.ownerId === activeUserId;
            const isPlayer = r.playerId === activeUserId;
            return isOwner || isPlayer;
        });

        if (relevantResults.length === 0) {
            return `
                <div class="card">
                    <h2>Natijalar Topilmadi</h2>
                    <p style="color: var(--text-secondary); margin-top: 8px;">
                        Siz hali test yechmadingiz yoki siz yaratgan testlarni hech kim yechmadi.
                    </p>
                </div>
            `;
        }

        const resultsListHtml = relevantResults.reverse().map(res => {
            const test = state.tests.find(t => t.id === res.testId);
            const isOwner = test && test.ownerId === activeUserId;

            const answersBreakdown = res.answers.map((ans, idx) => {
                return `
                    <div style="padding: 12px 0; border-bottom: 1px dashed var(--border-color);">
                        <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">
                            ${idx + 1}. ${escapeHtml(ans.questionText)}
                        </div>
                        <div style="font-size: 14px; color: var(--text-secondary);">
                            Javob: <strong style="color: var(--text-primary);">${escapeHtml(ans.userAnswerText)}</strong>
                            ${ans.isText ? '' : (ans.isCorrect ? ' ✅' : ' ❌')}
                        </div>
                        ${ans.evaluationNote ? `
                            <div class="evaluation-note">
                                💬 Izoh/Baxolash: ${escapeHtml(ans.evaluationNote)}
                            </div>
                        ` : ''}
                    </div>
                `;
            }).join('');

            return `
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                        <div>
                            <span class="badge ${isOwner ? 'badge-warning' : 'badge-primary'}">
                                ${isOwner ? 'Sizning Testingiz Natijasi' : 'Siz Yechgan Test'}
                            </span>
                            <h3 style="margin-top: 8px;">${escapeHtml(res.testTitle)}</h3>
                            <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                                Yechgan shaxs: <strong>${escapeHtml(res.playerName)}</strong> | Sana: ${new Date(res.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 24px; font-weight: 800; color: var(--primary);">
                                ${res.score} / ${res.totalScoreable}
                            </div>
                            <div style="font-size: 12px; color: var(--text-muted);">To'plangan Ball</div>
                        </div>
                    </div>

                    <details>
                        <summary style="cursor: pointer; color: var(--primary); font-weight: 600; font-size: 14px;">
                            Batafsil Javoblar va Fikrlarni Ko'rish
                        </summary>
                        <div class="details-box">
                            ${answersBreakdown}
                        </div>
                    </details>
                </div>
            `;
        }).join('');

        return `
            <h2 style="margin-bottom: 20px;">Natijalar va Fikrlar Paneli</h2>
            ${resultsListHtml}
        `;
    }

    function renderLeaderboardView() {
        const rankings = state.profiles.map(profile => {
            const played = state.results.filter(r => r.playerId === profile.id);
            const best = played.reduce((bestScore, result) => Math.max(bestScore, result.score), 0);
            const total = played.reduce((sum, result) => sum + result.score, 0);
            return {
                profile,
                plays: played.length,
                best,
                total
            };
        }).sort((a, b) => b.best - a.best || b.total - a.total || b.plays - a.plays);

        const rowsHtml = rankings.length
            ? rankings.map((entry, index) => `
                <div class="leaderboard-row ${index === 0 ? 'top-rank' : ''}">
                    <div class="leaderboard-rank">#${index + 1}</div>
                    <div class="leaderboard-user">
                        <span class="leaderboard-avatar">${entry.profile.avatar}</span>
                        <div>
                            <strong>${escapeHtml(entry.profile.name)}</strong>
                            <small>${entry.plays} ta o'yin</small>
                        </div>
                    </div>
                    <div class="leaderboard-score">
                        <span>Best</span>
                        <strong>${entry.best}</strong>
                    </div>
                    <div class="leaderboard-score">
                        <span>Umumiy</span>
                        <strong>${entry.total}</strong>
                    </div>
                </div>
            `).join('')
            : '<p style="color: var(--text-secondary);">Hali leaderboard bo\'sh.</p>';

        return `
            <div class="card">
                <h2 style="margin-bottom: 20px;">Leaderboard</h2>
                <div class="leaderboard-list">
                    ${rowsHtml}
                </div>
            </div>
        `;
    }

    function renderAdminView() {
        const user = state.profiles.find(p => p.id === state.currentUserId);
        const registeredUsers = state.profiles.filter(profile => Boolean(profile.passwordHash));

        const profileStats = state.profiles.map(profile => {
            const tests = state.tests.filter(t => t.ownerId === profile.id).length;
            const plays = state.results.filter(r => r.playerId === profile.id).length;
            return {
                profile,
                tests,
                plays
            };
        });

        const latestNotifications = state.notifications.length ? state.notifications : [
            { message: 'Yangi ogohlantirishlar mavjud emas', type: 'info', time: 'hozir' }
        ];

        return `
            <div class="admin-grid">
                <div class="card">
                    <h2>Admin Panel</h2>
                    <p style="color: var(--text-secondary); margin: 10px 0 18px;">
                        ${user ? `${user.avatar} ${user.name} admin ko'rinishida` : 'Hech qanday profil tanlanmagan.'}
                    </p>
                    <div class="admin-metrics">
                        <div class="mini-stat">
                            <span>Users</span>
                            <strong>${registeredUsers.length}</strong>
                        </div>
                        <div class="mini-stat">
                            <span>Tests</span>
                            <strong>${state.tests.length}</strong>
                        </div>
                        <div class="mini-stat">
                            <span>Results</span>
                            <strong>${state.results.length}</strong>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3>Ogohlantirishlar</h3>
                    <div class="notification-list">
                        ${latestNotifications.map(item => `
                            <div class="notification-item ${item.type}">
                                <span class="notif-dot"></span>
                                <div>
                                    <strong>${escapeHtml(item.message)}</strong>
                                    <small>${escapeHtml(item.time || 'hozir')}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>

            <p class="admin-local-note">Hisoblar va kirish vaqti shu brauzerda saqlanadi; umumiy, ko'p qurilmali monitoring uchun backend kerak.</p>

            <div class="card">
                <h3>Foydalanuvchilar (${registeredUsers.length})</h3>
                <div class="profile-admin-list">
                    ${profileStats.map(item => `
                        <div class="profile-admin-row">
                            <div class="profile-admin-main">
                                <span class="leaderboard-avatar">${item.profile.avatar}</span>
                                <div>
                                    <strong>${escapeHtml(item.profile.name)}</strong>
                                    <small>${item.profile.role === 'admin' ? 'Admin' : item.profile.passwordHash ? 'User' : 'Eski profil'} · Oxirgi kirish: ${item.profile.lastLoginAt ? new Date(item.profile.lastLoginAt).toLocaleString() : 'hali kirmagan'} · ${item.profile.warningCount || 0} ogohlantirish</small>
                                </div>
                            </div>
                            <div class="profile-admin-badges">
                                <span class="badge badge-primary">${item.tests} tests</span>
                                <span class="badge badge-success">${item.plays} plays</span>
                                <span class="badge ${item.profile.isBanned ? 'badge-warning' : 'badge-success'}">${item.profile.isBanned ? 'Bloklangan' : 'Faol'}</span>
                                ${item.profile.id !== state.currentUserId && item.profile.passwordHash ? `
                                    <button class="btn btn-secondary admin-action-button" onclick="window.moderateUser('${item.profile.id}', 'warn')">Ogohlantirish</button>
                                    <button class="btn ${item.profile.isBanned ? 'btn-primary' : 'btn-danger'} admin-action-button" onclick="window.moderateUser('${item.profile.id}', '${item.profile.isBanned ? 'unban' : 'ban'}')">${item.profile.isBanned ? 'Blokdan chiqarish' : 'Bloklash'}</button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('') || '<p style="color: var(--text-secondary);">Hech qanday profil mavjud emas.</p>'}
                </div>
            </div>
        `;
    }

    // ==========================================
    // VIEW 5: PROFILES MANAGEMENT
    // ==========================================
    function renderProfilesView() {
        let selectedAvatar = SYSTEM_AVATARS[0];

        const profilesList = state.profiles.map(p => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--bg-main); border-radius: var(--radius-md); margin-bottom: 10px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span style="font-size: 28px;">${p.avatar}</span>
                    <div>
                        <div style="font-weight: 700;">${escapeHtml(p.name)}</div>
                        <small>${p.role === 'admin' ? 'Admin' : p.passwordHash ? 'User' : 'Eski profil'}</small>
                        ${state.currentUserId === p.id ? '<span class="badge badge-success">Faol</span>' : ''}
                    </div>
                </div>
                ${state.profiles.find(profile => profile.id === state.currentUserId)?.role === 'admin' && state.currentUserId !== p.id ? `<button class="btn btn-danger" style="padding: 6px 12px;" onclick="window.deleteProfile('${p.id}')">O'chirish</button>` : ''}
            </div>
        `).join('');

        const avatarSelectorHtml = SYSTEM_AVATARS.map((av, i) => `
            <div class="avatar-option ${i === 0 ? 'selected' : ''}" data-avatar="${av}" onclick="window.selectAvatarOption(this, '${av}')">
                ${av}
            </div>
        `).join('');

        return `
            <div class="grid-2">
                <div class="card">
                    <h2>Yangi Profil Yaratish</h2>
                    <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
                        Tizimdan foydalanish uchun o'zingizga ism va maxsus icon (avatar) tanlang.
                    </p>

                    <div class="form-group">
                        <label>Ism yoki Taxallus</label>
                        <input type="text" id="new-profile-name" class="form-control" placeholder="Masalan: Ali">
                    </div>

                    <div class="form-group">
                        <label>Parol</label>
                        <input type="password" id="new-profile-password" class="form-control" minlength="6" autocomplete="new-password" placeholder="Kamida 6 belgi">
                    </div>

                    <div class="form-group">
                        <label>Avatar Tanlang</label>
                        <div class="avatar-selector" id="avatar-picker-container">
                            ${avatarSelectorHtml}
                        </div>
                    </div>

                    <button class="btn btn-primary" style="margin-top: 15px; width: 100%;" onclick="window.createNewProfile()">
                        ✨ Profilni Saqlash
                    </button>
                </div>

                <div class="card">
                    <h2>Mavjud Profillar</h2>
                    <div style="margin-top: 20px;">
                        ${profilesList.length > 0 ? profilesList : '<p style="color: var(--text-muted);">Hozircha profillar yo\'q.</p>'}
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // GLOBAL EVENT HANDLERS & LOGIC
    // ==========================================
    let currentSelectedAvatar = SYSTEM_AVATARS[0];

    window.selectAvatarOption = function(element, avatar) {
        document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        currentSelectedAvatar = avatar;
    };

    window.createNewProfile = async function() {
        const nameInput = document.getElementById('new-profile-name');
        const passwordInput = document.getElementById('new-profile-password');
        const name = nameInput.value.trim();
        const password = passwordInput.value;

        if (!name) {
            showToast("Iltimos, ismingizni kiriting!", "error");
            return;
        }

        try {
            await createUserAccount(name, password, currentSelectedAvatar);
            showToast("Hisob yaratildi", "success");
            renderApp();
        } catch (error) {
            showToast(error.message, "error");
        }
    };

    window.moderateUser = function(profileId, action) {
        const admin = state.profiles.find(profile => profile.id === state.currentUserId);
        const target = state.profiles.find(profile => profile.id === profileId);
        if (!window.FamilyUsers.isAdmin(state, admin?.id) || !target || target.role === "admin") return;

        if (action === "warn") {
            target.warningCount = (target.warningCount || 0) + 1;
            addNotification(`${target.name} foydalanuvchisiga admin ogohlantirish berdi`, "info");
        } else if (action === "ban" || action === "unban") {
            target.isBanned = action === "ban";
            addNotification(`${target.name} hisobi ${target.isBanned ? 'bloklandi' : 'blokdan chiqarildi'}`, target.isBanned ? "error" : "success");
        }

        saveState();
        renderApp();
    };

    window.deleteProfile = function(profileId) {
        const admin = state.profiles.find(profile => profile.id === state.currentUserId);
        if (!window.FamilyUsers.isAdmin(state, admin?.id) || profileId === state.currentUserId) return;
        showConfirmDialog({
            title: "Profilni o'chirish",
            message: "Haqiqatan ham ushbu profilni o'chirmoqchimisiz?",
            confirmText: "O'chirish",
            cancelText: "Bekor qilish"
        }, () => {
            const removed = state.profiles.find(p => p.id === profileId);
            state.profiles = state.profiles.filter(p => p.id !== profileId);
            if (state.currentUserId === profileId) {
                state.currentUserId = state.profiles.length > 0 ? state.profiles[0].id : null;
            }
            addNotification(`${removed ? removed.avatar + ' ' + removed.name : 'Profil'} tizimdan chiqarildi`, "error");
            saveState();
            showToast("Profil o'chirildi", "success");
            renderApp();
        });
    };

    window.deleteTest = function(testId) {
        showConfirmDialog({
            title: "Testni o'chirish",
            message: "Ushbu testni o'chirib tashlamoqchimisiz?",
            confirmText: "O'chirish",
            cancelText: "Bekor qilish"
        }, () => {
            const removed = state.tests.find(t => t.id === testId);
            state.tests = state.tests.filter(t => t.id !== testId);
            addNotification(`${removed ? removed.title : 'Test'} o'chirildi`, "error");
            saveState();
            showToast("Test muvaffaqiyatli o'chirildi", "success");
            renderApp();
        });
    };

    // Draft Builder Functions
    window.addDraftQuestion = function() {
        testDraft.questions.push({
            id: generateUniqueId(),
            text: "",
            type: "multiple",
            options: [
                { text: "", evaluationNote: "" },
                { text: "", evaluationNote: "" }
            ],
            correctOptionIndex: 0
        });
        renderApp();
    };

    window.removeDraftQuestion = function(qIndex) {
        testDraft.questions.splice(qIndex, 1);
        renderApp();
    };

    window.updateDraftQuestionText = function(qIndex, val) {
        testDraft.questions[qIndex].text = val;
    };

    window.updateDraftQuestionType = function(qIndex, type) {
        testDraft.questions[qIndex].type = type;
        if (type === 'boolean') {
            testDraft.questions[qIndex].options = [
                { text: "To'g'ri", evaluationNote: "" },
                { text: "Noto'g'ri", evaluationNote: "" }
            ];
            testDraft.questions[qIndex].correctOptionIndex = 0;
        }
        renderApp();
    };

    window.addDraftOption = function(qIndex) {
        testDraft.questions[qIndex].options.push({ text: "", evaluationNote: "" });
        renderApp();
    };

    window.removeDraftOption = function(qIndex, optIndex) {
        testDraft.questions[qIndex].options.splice(optIndex, 1);
        if (testDraft.questions[qIndex].correctOptionIndex >= testDraft.questions[qIndex].options.length) {
            testDraft.questions[qIndex].correctOptionIndex = 0;
        }
        renderApp();
    };

    window.updateDraftOptionText = function(qIndex, optIndex, val) {
        testDraft.questions[qIndex].options[optIndex].text = val;
    };

    window.updateDraftOptionNote = function(qIndex, optIndex, val) {
        testDraft.questions[qIndex].options[optIndex].evaluationNote = val;
    };

    window.setDraftCorrectOption = function(qIndex, optIndex) {
        testDraft.questions[qIndex].correctOptionIndex = optIndex;
    };

    window.saveTestDraft = function() {
        if (!testDraft.title.trim()) {
            showToast("Testga nom bering!", "error");
            return;
        }

        for (let i = 0; i < testDraft.questions.length; i++) {
            const q = testDraft.questions[i];
            if (!q.text.trim()) {
                showToast(`${i + 1}-savol matni kiritilmagan!`, "error");
                return;
            }
        }

        const newTest = {
            id: generateUniqueId(),
            ownerId: state.currentUserId,
            title: testDraft.title,
            description: testDraft.description,
            questions: JSON.parse(JSON.stringify(testDraft.questions))
        };

        state.tests.push(newTest);
        addNotification(`${newTest.title} yangi test qo'shildi`, "success");
        saveState();
        resetDraft();
        showToast("Test saqlandi va ommaga tayyor", "success");
        navigateTo("tests");
    };

    window.generateAiQuestions = function() {
        const topic = document.getElementById("ai-topic").value.trim();
        const requestedCount = Number.parseInt(document.getElementById("ai-question-count").value, 10);
        const count = Math.min(10, Math.max(2, Number.isFinite(requestedCount) ? requestedCount : 5));
        if (!topic) {
            showToast("Avval test mavzusini yozing.", "error");
            return;
        }

        const bank = getAiQuestionBank(topic);
        const topicKey = topic.toLocaleLowerCase();
        const history = Array.isArray(state.aiQuestionHistory) ? state.aiQuestionHistory : [];
        let available = bank.filter(question => !history.includes(`${topicKey}:${question.id}`));
        if (available.length < count) {
            state.aiQuestionHistory = [];
            available = bank;
        }

        const selected = window.FamilyService.shuffleItems(available).slice(0, count);
        const generated = selected.map(question => ({
            ...question,
            templateId: question.id,
            id: generateUniqueId(),
            options: question.options.map(option => ({ ...option }))
        }));
        state.aiQuestionHistory = [...(state.aiQuestionHistory || []), ...selected.map(question => `${topicKey}:${question.id}`)].slice(-100);

        const hasExistingQuestions = testDraft.questions.some(question => question.text.trim());
        if (!hasExistingQuestions) testDraft.questions = [];
        testDraft.questions.push(...generated);
        if (!testDraft.title.trim()) testDraft.title = `${topic} testi`;
        if (!testDraft.description.trim()) testDraft.description = `${topic} mavzusida yordamchi tuzgan savollar.`;
        window.testDraft = testDraft;
        saveState();
        renderApp();
        showToast(`${generated.length} ta yangi savol tayyorlandi`, "success");
    };

    // Test Submission Handler
    window.submitTestAnswers = function(testId) {
        const test = state.tests.find(t => t.id === testId);
        const playerProfile = state.profiles.find(p => p.id === state.currentUserId);

        let score = 0;
        let totalScoreable = 0;
        const answersResult = [];

        for (let i = 0; i < test.questions.length; i++) {
            const q = test.questions[i];

            if (q.type === 'text') {
                const textarea = document.getElementById(`play_ans_${i}`);
                const userVal = textarea ? textarea.value.trim() : "";
                answersResult.push({
                    questionText: q.text,
                    userAnswerText: userVal || "(Javob yozilmadi)",
                    isText: true,
                    isCorrect: false,
                    evaluationNote: ""
                });
            } else {
                totalScoreable++;
                const selectedRadio = document.querySelector(`input[name="play_q_${i}"]:checked`);
                const selectedIndex = selectedRadio ? parseInt(selectedRadio.value) : -1;

                if (selectedIndex >= 0) {
                    const selectedOpt = q.options[selectedIndex];
                    const isCorrect = selectedIndex === q.correctOptionIndex;
                    if (isCorrect) score++;

                    answersResult.push({
                        questionText: q.text,
                        userAnswerText: selectedOpt.text,
                        isText: false,
                        isCorrect: isCorrect,
                        evaluationNote: selectedOpt.evaluationNote || ""
                    });
                } else {
                    answersResult.push({
                        questionText: q.text,
                        userAnswerText: "(Javob tanlanmadi)",
                        isText: false,
                        isCorrect: false,
                        evaluationNote: ""
                    });
                }
            }
        }

        const resultRecord = {
            id: generateUniqueId(),
            testId: test.id,
            testTitle: test.title,
            playerId: playerProfile.id,
            playerName: playerProfile.avatar + " " + playerProfile.name,
            score: score,
            totalScoreable: totalScoreable,
            answers: answersResult,
            timestamp: Date.now()
        };

        state.results.push(resultRecord);
        const profile = state.profiles.find(p => p.id === state.currentUserId);
        addNotification(`${profile ? profile.avatar + ' ' + profile.name : 'Foydalanuvchi'} ${test.title} testini yakunladi`, "success");
        saveState();
        navigateTo("results");
    };

    function bindGlobalEvents() {
        // Navigation Click Event Delegation
        document.querySelectorAll("[data-route]").forEach(el => {
            el.addEventListener("click", (e) => {
                e.preventDefault();
                navigateTo(el.getAttribute("data-route"));
            });
        });

        // Theme Toggle Event
        const themeBtn = document.getElementById("theme-toggle-btn");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                state.theme = state.theme === "dark" ? "light" : "dark";
                saveState();
                renderApp();
            });
        }

        // Global Profile Switcher Event
        const profileSelect = document.getElementById("global-profile-switcher");
        if (profileSelect) {
            profileSelect.addEventListener("change", (e) => {
                state.currentUserId = e.target.value || null;
                saveState();
                renderApp();
            });
        }
    }

    // Initial Listeners
    window.addEventListener("hashchange", renderApp);

    // Initial Startup
    resetDraft();
    renderApp();
})();