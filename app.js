(() => {
	"use strict";

	const STORAGE_KEY = "familytest-data-v1";
	const ACTIVE_KEY = "familytest-active-run-v1";
	const roleIcons = {
		father: "👨", mother: "👩", child: "🧒", brother: "👦", sister: "👧",
		grandmother: "👵", grandfather: "👴", pet: "🐾", cat: "🐈", dog: "🐕", other: "✨"
	};
	const roleKeys = {
		father: "roleFather", mother: "roleMother", child: "roleChild", brother: "roleBrother",
		sister: "roleSister", grandmother: "roleGrandmother", grandfather: "roleGrandfather",
		pet: "rolePet", cat: "roleCat", dog: "roleDog", other: "roleOther"
	};
	const translations = {
		uz: {
			navTests: "Testlar", navCreate: "Test yaratish", navResults: "Natijalar", navSettings: "Sozlamalar", workspace: "OILA MAYDONI",
			today: "Oila maydoni", welcomeEyebrow: "BIRGA O'YNANG, BIRGA BILING", welcome: "Oilaviy xotiralar sinovdan o'tsin", welcomeText: "O'zingiz test tuzing, yaqinlaringizni qo'shing va kim oilani yaxshiroq bilishini ko'ring.", createTest: "Test yaratish", yourTests: "Sizning testlaringiz", testsHint: "Oilangiz bilan o'ynash uchun tayyorlangan testlar", testsCount: "Testlar", playsCount: "O'yinlar", peopleCount: "Oila a'zolari", start: "Boshlash", edit: "Tahrirlash", delete: "O'chirish", questions: "savol", participants: "ishtirokchi", noTests: "Hali test yo'q", noTestsText: "Birinchi testingizni tuzing, savollar va javoblarni o'zingiz tanlang.", createFirst: "Birinchi testni yaratish", addPeople: "Oila a'zolarini qo'shish", noPeopleText: "Testga kimlar qatnashishini tanlash uchun avval oila a'zolarini kiriting.", setupPeople: "Oila a'zolarini sozlash", recentResults: "So'nggi natijalar", allResults: "Barcha natijalar", builderEyebrow: "O'ZINGIZ TUZING", newTest: "Yangi test", editTest: "Testni tahrirlash", builderText: "Savollarni yozing, javob turini tanlang va to'g'ri javobni belgilang.", basics: "Test haqida", testTitle: "Test nomi", titlePlaceholder: "Masalan: Oilamizni kim yaxshi biladi?", questionsBlock: "Savollar", addQuestion: "Savol qo'shish", question: "Savol", questionPlaceholder: "Savolingizni yozing...", answerType: "Javob turi", trueFalse: "To'g'ri / Noto'g'ri", multipleChoice: "Bir nechta variant", correctAnswer: "To'g'ri javobni belgilang", addOption: "Variant qo'shish", removeQuestion: "Savolni o'chirish", timer: "Vaqt chegarasi", timerHint: "Test uchun vaqt belgilang", minutes: "daqiqa", testFor: "Kimlar uchun?", choosePeople: "Testni bajaradigan oila a'zolarini tanlang.", noMembers: "Hali oila a'zolari yo'q.", goSettings: "Sozlamalarga o'tish", saveTest: "Testni saqlash", cancel: "Bekor qilish", saved: "Test saqlandi", needQuestion: "Har bir savol va javob variantlarini to'ldiring.", needPeople: "Kamida bitta ishtirokchini tanlang.", needTitle: "Test nomini kiriting.", settingsEyebrow: "O'ZINGIZGA MOSLANG", settingsTitle: "Sozlamalar", settingsText: "Tilni tanlang va oilangiz hamda uy hayvonlaringizni qo'shing.", language: "Til", languageText: "Ilova tilini tanlang", uzbek: "O'zbekcha", russian: "Русский", english: "English", family: "Oila a'zolari", familyText: "Ism va rol qo'shing. Belgilar avtomatik ko'rinadi.", name: "Ism", namePlaceholder: "Masalan: Dadam yoki Momiq", role: "Oila ichidagi o'rni", addMember: "A'zo qo'shish", memberPreview: "Tanlangan belgi shu yerda ko'rinadi", noMembersYet: "A'zolar ro'yxati hozircha bo'sh.", memberAdded: "Oila a'zosi qo'shildi", memberExists: "Bu a'zo allaqachon bor.", removeMember: "A'zoni o'chirish", familyTip: "Hayvonlaringizni ham qo'shing: mushuk, it yoki boshqa jonivor.", roleFather: "Ota", roleMother: "Ona", roleChild: "Farzand", roleBrother: "Aka / uka", roleSister: "Opa / singil", roleGrandmother: "Buvi", roleGrandfather: "Bobo", rolePet: "Uy hayvoni", roleCat: "Mushuk", roleDog: "It", roleOther: "Boshqa", resultsEyebrow: "O'YINLAR TARIXI", resultsTitle: "Natijalar", resultsText: "Oila a'zolaringizning oxirgi natijalari shu yerda.", noResults: "Hali natija yo'q", noResultsText: "Testlardan birini boshlang, natijalar shu yerda saqlanadi.", score: "natija", correct: "to'g'ri", playedBy: "Bajardi", backTests: "Testlarga qaytish", playAgain: "Qayta o'ynash", answerReview: "Javoblar", yourAnswer: "Sizning javobingiz", correctWas: "To'g'ri javob", startTest: "Testni boshlash", whoPlays: "Kim bajaryapti?", submitAnswers: "Natijani ko'rish", timeLeft: "Qolgan vaqt", timeUp: "Vaqt tugadi", testMissing: "Bu test topilmadi yoki o'chirilgan.", finished: "Test yakunlandi", chooseAnswer: "Davom etish uchun har bir savolga javob bering.", role: "rol", deleteConfirm: "Ushbu elementni o'chirmoqchimisiz?", minutesShort: "daq.", languageFlagUz: "🇺🇿", languageFlagRu: "🇷🇺", languageFlagEn: "🇬🇧", untimed: "Vaqtsiz", questionCount: "ta savol", emptyOptions: "Variant matnini kiriting", questionLabel: "Savol", scoreMessage: "Ajoyib! Oila haqida bilimingiz kuchli.", scoreGood: "Yaxshi natija! Yana bir bor urinib ko'ring.", scoreTry: "Har bir o'yin oilani yanada yaqinlashtiradi."
		},
		ru: {
			navTests: "Тесты", navCreate: "Создать тест", navResults: "Результаты", navSettings: "Настройки", workspace: "СЕМЕЙНОЕ ПРОСТРАНСТВО",
			today: "Семейное пространство", welcomeEyebrow: "ИГРАЙТЕ И УЗНАВАЙТЕ ВМЕСТЕ", welcome: "Проверьте, как хорошо вы знаете семью", welcomeText: "Создавайте тесты, добавляйте близких и узнавайте, кто лучше знает вашу семью.", createTest: "Создать тест", yourTests: "Ваши тесты", testsHint: "Тесты, готовые для семейной игры", testsCount: "Тесты", playsCount: "Игры", peopleCount: "Члены семьи", start: "Начать", edit: "Изменить", delete: "Удалить", questions: "вопросов", participants: "участников", noTests: "Пока нет тестов", noTestsText: "Создайте первый тест и сами выберите вопросы и ответы.", createFirst: "Создать первый тест", addPeople: "Добавить членов семьи", noPeopleText: "Сначала добавьте членов семьи, чтобы выбрать участников теста.", setupPeople: "Настроить семью", recentResults: "Последние результаты", allResults: "Все результаты", builderEyebrow: "СОЗДАЙТЕ САМИ", newTest: "Новый тест", editTest: "Редактировать тест", builderText: "Добавляйте вопросы, выбирайте тип ответа и отмечайте правильный вариант.", basics: "О тесте", testTitle: "Название теста", titlePlaceholder: "Например: Кто лучше знает нашу семью?", questionsBlock: "Вопросы", addQuestion: "Добавить вопрос", question: "Вопрос", questionPlaceholder: "Введите вопрос...", answerType: "Тип ответа", trueFalse: "Верно / Неверно", multipleChoice: "Несколько вариантов", correctAnswer: "Отметьте правильный ответ", addOption: "Добавить вариант", removeQuestion: "Удалить вопрос", timer: "Ограничение времени", timerHint: "Установите время на тест", minutes: "минут", testFor: "Для кого?", choosePeople: "Выберите участников теста.", noMembers: "Членов семьи пока нет.", goSettings: "Открыть настройки", saveTest: "Сохранить тест", cancel: "Отмена", saved: "Тест сохранён", needQuestion: "Заполните каждый вопрос и варианты ответов.", needPeople: "Выберите хотя бы одного участника.", needTitle: "Введите название теста.", settingsEyebrow: "ПЕРСОНАЛИЗАЦИЯ", settingsTitle: "Настройки", settingsText: "Выберите язык и добавьте семью и домашних животных.", language: "Язык", languageText: "Выберите язык приложения", uzbek: "O'zbekcha", russian: "Русский", english: "English", family: "Члены семьи", familyText: "Добавьте имя и роль. Значок появится автоматически.", name: "Имя", namePlaceholder: "Например: Папа или Пушок", role: "Роль в семье", addMember: "Добавить", memberPreview: "Значок появится здесь", noMembersYet: "Список членов семьи пока пуст.", memberAdded: "Член семьи добавлен", memberExists: "Такой участник уже есть.", removeMember: "Удалить участника", familyTip: "Добавьте питомцев: кошку, собаку или другое животное.", roleFather: "Отец", roleMother: "Мать", roleChild: "Ребёнок", roleBrother: "Брат", roleSister: "Сестра", roleGrandmother: "Бабушка", roleGrandfather: "Дедушка", rolePet: "Питомец", roleCat: "Кошка", roleDog: "Собака", roleOther: "Другое", resultsEyebrow: "ИСТОРИЯ ИГР", resultsTitle: "Результаты", resultsText: "Здесь отображаются последние результаты вашей семьи.", noResults: "Результатов пока нет", noResultsText: "Запустите тест, и результаты появятся здесь.", score: "результат", correct: "верно", playedBy: "Участник", backTests: "К тестам", playAgain: "Сыграть ещё", answerReview: "Ответы", yourAnswer: "Ваш ответ", correctWas: "Правильный ответ", startTest: "Начать тест", whoPlays: "Кто отвечает?", submitAnswers: "Показать результат", timeLeft: "Осталось", timeUp: "Время вышло", testMissing: "Тест не найден или был удалён.", finished: "Тест завершён", chooseAnswer: "Ответьте на каждый вопрос, чтобы продолжить.", role: "роль", deleteConfirm: "Удалить этот элемент?", minutesShort: "мин.", languageFlagUz: "🇺🇿", languageFlagRu: "🇷🇺", languageFlagEn: "🇬🇧", untimed: "Без таймера", questionCount: "вопросов", emptyOptions: "Введите текст варианта", questionLabel: "Вопрос", scoreMessage: "Прекрасно! Вы отлично знаете свою семью.", scoreGood: "Хороший результат! Попробуйте ещё раз.", scoreTry: "Каждая игра помогает семье стать ближе."
		},
		en: {
			navTests: "Tests", navCreate: "Create a test", navResults: "Results", navSettings: "Settings", workspace: "FAMILY SPACE",
			today: "Family space", welcomeEyebrow: "PLAY TOGETHER, LEARN TOGETHER", welcome: "How well do you know your family?", welcomeText: "Make your own quizzes, invite your family, and find out who knows everyone best.", createTest: "Create a test", yourTests: "Your tests", testsHint: "Quizzes ready for your next family game", testsCount: "Tests", playsCount: "Games played", peopleCount: "Family members", start: "Start", edit: "Edit", delete: "Delete", questions: "questions", participants: "players", noTests: "No tests yet", noTestsText: "Make your first test and choose every question and answer yourself.", createFirst: "Create your first test", addPeople: "Add family members", noPeopleText: "Add family members first so you can choose who takes each test.", setupPeople: "Set up your family", recentResults: "Recent results", allResults: "All results", builderEyebrow: "MADE BY YOU", newTest: "New test", editTest: "Edit test", builderText: "Write questions, choose an answer style, and mark the correct answer.", basics: "Test details", testTitle: "Test name", titlePlaceholder: "For example: Who knows our family best?", questionsBlock: "Questions", addQuestion: "Add question", question: "Question", questionPlaceholder: "Write your question...", answerType: "Answer type", trueFalse: "True / False", multipleChoice: "Multiple choice", correctAnswer: "Choose the correct answer", addOption: "Add an option", removeQuestion: "Remove question", timer: "Time limit", timerHint: "Set a timer for the test", minutes: "minutes", testFor: "Who is this for?", choosePeople: "Choose the family members who will take this test.", noMembers: "No family members yet.", goSettings: "Go to settings", saveTest: "Save test", cancel: "Cancel", saved: "Test saved", needQuestion: "Complete every question and answer option.", needPeople: "Choose at least one participant.", needTitle: "Enter a test name.", settingsEyebrow: "MAKE IT YOURS", settingsTitle: "Settings", settingsText: "Choose a language and add family members and pets.", language: "Language", languageText: "Choose the app language", uzbek: "O'zbekcha", russian: "Русский", english: "English", family: "Family members", familyText: "Add a name and role. Its icon appears automatically.", name: "Name", namePlaceholder: "For example: Dad or Momo", role: "Family role", addMember: "Add member", memberPreview: "Your chosen icon appears here", noMembersYet: "Your family list is empty for now.", memberAdded: "Family member added", memberExists: "That family member is already on the list.", removeMember: "Remove member", familyTip: "Add pets too: a cat, dog, or any other animal.", roleFather: "Father", roleMother: "Mother", roleChild: "Child", roleBrother: "Brother", roleSister: "Sister", roleGrandmother: "Grandmother", roleGrandfather: "Grandfather", rolePet: "Pet", roleCat: "Cat", roleDog: "Dog", roleOther: "Other", resultsEyebrow: "GAME HISTORY", resultsTitle: "Results", resultsText: "See your family's latest quiz results here.", noResults: "No results yet", noResultsText: "Play a test and its results will show up here.", score: "score", correct: "correct", playedBy: "Played by", backTests: "Back to tests", playAgain: "Play again", answerReview: "Answer review", yourAnswer: "Your answer", correctWas: "Correct answer", startTest: "Start test", whoPlays: "Who is playing?", submitAnswers: "See result", timeLeft: "Time left", timeUp: "Time is up", testMissing: "This test could not be found or was deleted.", finished: "Test complete", chooseAnswer: "Answer every question before continuing.", role: "role", deleteConfirm: "Delete this item?", minutesShort: "min", languageFlagUz: "🇺🇿", languageFlagRu: "🇷🇺", languageFlagEn: "🇬🇧", untimed: "No timer", questionCount: "questions", emptyOptions: "Enter an answer option", questionLabel: "Question", scoreMessage: "Wonderful! You know your family so well.", scoreGood: "Nice score! Give it another try.", scoreTry: "Every game brings your family a little closer."
		}
	};

	const app = document.getElementById("app");
	const currentPage = document.body.dataset.page || "tests";
	let db = readData();
	let draftQuestions = [newQuestion()];
	let draftSettings = { title: "", timerEnabled: false, timerMinutes: 5, participants: [] };
	let loadedDraftId = null;
	let activeRun = null;
	let activeTest = null;
	let timerInterval = null;
	let finishingRun = false;
	let toastTimeout = null;

	function readData() {
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
			return {
				language: ["uz", "ru", "en"].includes(saved.language) ? saved.language : "uz",
				members: Array.isArray(saved.members) ? saved.members : [],
				tests: Array.isArray(saved.tests) ? saved.tests : [],
				results: Array.isArray(saved.results) ? saved.results : []
			};
		} catch (_) {
			return { language: "uz", members: [], tests: [], results: [] };
		}
	}

	function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }
	function t(key) {
		const language = db.language;
		if (key === "trueOption") return { uz: "To'g'ri", ru: "Верно", en: "True" }[language];
		if (key === "falseOption") return { uz: "Noto'g'ri", ru: "Неверно", en: "False" }[language];
		if (key === "role") return { uz: "Oiladagi o'rni", ru: "Роль в семье", en: "Family role" }[language];
		if (key === "sideTip") return { uz: "To'g'ri javob yonidagi doirani belgilang.", ru: "Отметьте кружок рядом с правильным ответом.", en: "Select the circle next to the correct answer." }[language];
		return (translations[language] || translations.uz)[key] || key;
	}
	function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`; }
	function escapeHTML(value) {
		return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
	}
	function newQuestion() { return { id: uid(), text: "", type: "boolean", options: ["true", "false"], correct: 0 }; }
	function roleName(role) { return t(roleKeys[role] || "roleOther"); }
	function iconFor(role) { return roleIcons[role] || roleIcons.other; }
	function memberById(id) { return db.members.find((member) => member.id === id); }
	function formatDate(date) {
		return new Intl.DateTimeFormat(db.language === "uz" ? "uz-UZ" : db.language === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" }).format(new Date(date));
	}
	function languageOptions() {
		return `<option value="uz" ${db.language === "uz" ? "selected" : ""}>🇺🇿 UZ</option><option value="ru" ${db.language === "ru" ? "selected" : ""}>🇷🇺 RU</option><option value="en" ${db.language === "en" ? "selected" : ""}>🇬🇧 EN</option>`;
	}

	function renderShell(content) {
		const nav = [
			["tests", "Tests.html", "▦", "navTests"], ["builder", "Question.html", "＋", "navCreate"],
			["results", "Result.html", "◷", "navResults"], ["settings", "Settings.html", "⚙", "navSettings"]
		];
		const labels = nav.map(([page, href, icon, label]) => `<a class="nav-link ${currentPage === page ? "active" : ""}" href="${href}" ${currentPage === page ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon}</span><span>${t(label)}</span></a>`).join("");
		app.innerHTML = `<div class="app-shell">
			<aside class="sidebar"><a class="brand" href="Tests.html"><span class="brand-mark" aria-hidden="true">✿</span><span class="brand-name">FamilyTest</span></a>
				<p class="nav-label">${t("workspace")}</p><nav class="side-nav" aria-label="${t("workspace")}">${labels}</nav>
				<div class="sidebar-bottom"><strong>FamilyTest</strong>${t("welcomeEyebrow")}</div>
			</aside>
			<div class="main-area"><header class="topbar"><span class="breadcrumb">FamilyTest <span aria-hidden="true">/</span> ${t(currentPage === "builder" ? "navCreate" : currentPage === "settings" ? "navSettings" : currentPage === "results" ? "navResults" : "navTests")}</span>
				<div class="topbar-right"><label class="visually-hidden" for="global-language">${t("language")}</label><select class="language-select" id="global-language" data-language>${languageOptions()}</select><span class="user-dot" aria-hidden="true">🌼</span></div>
			</header><main class="page-content">${content}</main></div>
			<div class="toast" id="toast" role="status" aria-live="polite"></div>
		</div>`;
	}

	function renderTests() {
		const tests = [...db.tests].sort((a, b) => b.updatedAt - a.updatedAt);
		const recent = [...db.results].sort((a, b) => b.finishedAt - a.finishedAt).slice(0, 3);
		const cards = tests.length ? `<div class="test-grid">${tests.map((test) => {
			const participants = (test.participants || []).map(memberById).filter(Boolean);
			return `<article class="test-card"><div class="test-card-top"><span class="test-symbol" aria-hidden="true">${test.symbol || "🌿"}</span><div class="member-avatars" aria-label="${participants.length} ${t("participants")}">${participants.slice(0, 5).map((member) => `<span class="member-avatar" title="${escapeHTML(member.name)}">${iconFor(member.role)}</span>`).join("")}</div></div>
				<h3>${escapeHTML(test.title)}</h3><p class="test-meta"><span>${test.questions.length} ${t("questions")}</span><span>${participants.length} ${t("participants")}</span><span>${test.timerMinutes ? `${test.timerMinutes} ${t("minutesShort")}` : t("untimed")}</span></p>
				<div class="test-card-actions"><a class="button button-primary" href="Result.html?play=${encodeURIComponent(test.id)}">${t("start")} <span aria-hidden="true">→</span></a><div class="card-action-group"><a class="button button-quiet" href="Question.html?edit=${encodeURIComponent(test.id)}" aria-label="${t("edit")}">✎</a><button class="button button-danger" type="button" data-action="delete-test" data-id="${escapeHTML(test.id)}">${t("delete")}</button></div></div></article>`;
		}).join("")}</div>` : `<div class="empty-state"><span class="empty-illustration" aria-hidden="true">📝</span><h3>${t("noTests")}</h3><p>${t("noTestsText")}</p><a class="button button-primary" href="${db.members.length ? "Question.html" : "Settings.html"}">${db.members.length ? t("createFirst") : t("addPeople")} <span aria-hidden="true">→</span></a></div>`;
		const recentSection = recent.length ? `<section class="recent-block"><div class="section-heading" style="margin-top:30px"><h2>${t("recentResults")}</h2><a class="button button-quiet" href="Result.html">${t("allResults")} →</a></div><div class="result-grid">${recent.map((result) => `<a class="result-row" href="Result.html?done=${encodeURIComponent(result.id)}"><span class="result-score">${result.score}/${result.total}</span><span class="result-copy"><strong>${escapeHTML(result.testTitle)}</strong><span>${escapeHTML(result.playerName)} · ${formatDate(result.finishedAt)}</span></span><span class="muted">${Math.round(result.score / Math.max(1, result.total) * 100)}%</span></a>`).join("")}</div></section>` : "";
		return `<section class="hero-panel"><div class="hero-copy"><p class="eyebrow">${t("welcomeEyebrow")}</p><h1>${t("welcome")}</h1><p>${t("welcomeText")}</p><a class="button" href="${db.members.length ? "Question.html" : "Settings.html"}">${db.members.length ? t("createTest") : t("addPeople")} <span aria-hidden="true">→</span></a></div><div class="hero-image"><img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85" alt="Family spending time together" loading="eager"><span class="hero-sticker" aria-hidden="true">🐾</span></div></section>
			<section class="stats-grid" aria-label="${t("workspace")}"><div class="stat-card"><span class="stat-icon" aria-hidden="true">🧩</span><span><strong class="stat-value">${db.tests.length}</strong><span class="stat-label">${t("testsCount")}</span></span></div><div class="stat-card"><span class="stat-icon" aria-hidden="true">🎯</span><span><strong class="stat-value">${db.results.length}</strong><span class="stat-label">${t("playsCount")}</span></span></div><div class="stat-card"><span class="stat-icon" aria-hidden="true">👨‍👩‍👧</span><span><strong class="stat-value">${db.members.length}</strong><span class="stat-label">${t("peopleCount")}</span></span></div></section>
			<section><div class="section-heading"><div><h2>${t("yourTests")}</h2><span class="section-kicker">${t("testsHint")}</span></div>${tests.length ? `<a class="button button-primary" href="Question.html">＋ ${t("createTest")}</a>` : ""}</div>${cards}</section>${recentSection}`;
	}

	function setupDraft() {
		const editId = new URLSearchParams(location.search).get("edit");
		if (loadedDraftId === editId) return;
		loadedDraftId = editId;
		const test = editId && db.tests.find((item) => item.id === editId);
		draftQuestions = test ? test.questions.map((question) => ({ ...question, options: [...question.options] })) : [newQuestion()];
		draftSettings = {
			title: test?.title || "",
			timerEnabled: Boolean(test?.timerMinutes),
			timerMinutes: test?.timerMinutes || 5,
			participants: test ? [...test.participants] : db.members.map((member) => member.id)
		};
	}

	function renderQuestionEditor(question, index) {
		const isBoolean = question.type === "boolean";
		const options = question.options || [];
		return `<article class="question-card" data-question-index="${index}"><div class="question-card-head"><span class="question-number"><span class="number-dot">${index + 1}</span>${t("question")} ${index + 1}</span>${draftQuestions.length > 1 ? `<button class="button button-quiet" type="button" data-action="remove-question" data-index="${index}">${t("removeQuestion")}</button>` : ""}</div>
			<div class="field"><label for="question-text-${index}">${t("question")}</label><textarea id="question-text-${index}" data-question-text="${index}" maxlength="500" required placeholder="${t("questionPlaceholder")}">${escapeHTML(question.text)}</textarea></div>
			<div class="inline-fields"><div class="field"><label for="question-type-${index}">${t("answerType")}</label><select id="question-type-${index}" data-question-type="${index}"><option value="boolean" ${isBoolean ? "selected" : ""}>${t("trueFalse")}</option><option value="multiple" ${!isBoolean ? "selected" : ""}>${t("multipleChoice")}</option></select></div><div class="field"><span class="field-label">${t("correctAnswer")}</span><div class="field-hint">${t("sideTip")}</div></div></div>
			<div class="option-list">${options.map((option, optionIndex) => {
				const value = isBoolean ? t(option === "true" ? "trueOption" : "falseOption") : option;
				return `<div class="option-row"><input type="radio" name="correct-${index}" value="${optionIndex}" data-correct="${index}" aria-label="${t("correctAnswer")} ${optionIndex + 1}" ${Number(question.correct) === optionIndex ? "checked" : ""}><input type="text" data-option="${index}:${optionIndex}" value="${escapeHTML(value)}" ${isBoolean ? "disabled" : "required"} maxlength="120" aria-label="${t("answerType")} ${optionIndex + 1}" placeholder="${t("emptyOptions")}">${!isBoolean && options.length > 2 ? `<button class="option-remove" type="button" data-action="remove-option" data-index="${index}" data-option-index="${optionIndex}" aria-label="${t("delete")}">×</button>` : "<span></span>"}</div>`;
			}).join("")}</div>${!isBoolean ? `<button class="button button-quiet" type="button" data-action="add-option" data-index="${index}">＋ ${t("addOption")}</button>` : ""}<p class="correct-hint">${t("sideTip")}</p></article>`;
	}

	function renderBuilder() {
		setupDraft();
		const editId = new URLSearchParams(location.search).get("edit");
		const existing = editId && db.tests.find((item) => item.id === editId);
		const participantIds = draftSettings.participants;
		const participants = db.members.length ? `<div class="participant-list">${db.members.map((member) => `<label class="participant-choice"><input type="checkbox" name="participants" value="${escapeHTML(member.id)}" ${participantIds.length ? participantIds.includes(member.id) ? "checked" : "" : "checked"}><span class="member-avatar" aria-hidden="true">${iconFor(member.role)}</span><span class="participant-name">${escapeHTML(member.name)}</span><span class="participant-role">${roleName(member.role)}</span></label>`).join("")}</div>` : `<div class="no-family">${t("noMembers")}<br><a href="Settings.html">${t("goSettings")} →</a></div>`;
		return `<div class="page-heading"><div><p class="eyebrow">${t("builderEyebrow")}</p><h1>${existing ? t("editTest") : t("newTest")}</h1><p class="subheading">${t("builderText")}</p></div></div>
			<form id="test-form" novalidate><div class="builder-layout"><div><section class="panel"><div class="panel-heading"><h2>${t("basics")}</h2><span aria-hidden="true">✏️</span></div><div class="field"><label for="test-title">${t("testTitle")}</label><input id="test-title" name="title" maxlength="90" required value="${escapeHTML(draftSettings.title)}" placeholder="${t("titlePlaceholder")}"></div>
				<div class="toggle-row"><div class="toggle-copy"><strong>${t("timer")}</strong><span>${t("timerHint")}</span></div><label class="toggle-control"><input id="timer-enabled" name="timerEnabled" type="checkbox" ${draftSettings.timerEnabled ? "checked" : ""} aria-label="${t("timer")}"><span class="toggle-track"></span></label></div><div class="timer-fields ${draftSettings.timerEnabled ? "" : "hidden"}" id="timer-fields"><label for="timer-minutes">${t("minutes")}</label><input id="timer-minutes" name="timerMinutes" type="number" min="1" max="180" value="${draftSettings.timerMinutes}"></div>
			</section><section class="panel"><div class="panel-heading"><h2>${t("questionsBlock")}</h2><span class="section-kicker">${draftQuestions.length} ${t("questions")}</span></div><div id="question-list">${draftQuestions.map(renderQuestionEditor).join("")}</div><button class="button add-question" type="button" data-action="add-question">＋ ${t("addQuestion")}</button><p class="form-error" id="builder-error" role="alert"></p><div class="form-actions"><a class="button button-secondary" href="Tests.html">${t("cancel")}</a><button class="button button-primary" type="submit">${t("saveTest")}</button></div></section></div>
			<aside class="builder-sidebar"><section class="panel"><div class="panel-heading"><h2>${t("testFor")}</h2><span aria-hidden="true">👨‍👩‍👧</span></div><p class="field-hint" style="margin:-7px 0 13px">${t("choosePeople")}</p>${participants}</section><div class="side-note"><strong>💡 ${t("builderEyebrow")}</strong>${t("sideTip")}</div></aside></div></form>`;
	}

	function renderSettings() {
		const roles = Object.keys(roleKeys);
		const members = db.members.length ? `<div class="family-list">${db.members.map((member) => `<div class="family-row"><span class="member-avatar" aria-hidden="true">${iconFor(member.role)}</span><span class="family-copy"><strong>${escapeHTML(member.name)}</strong><span>${roleName(member.role)}</span></span><button class="button button-quiet" type="button" data-action="delete-member" data-id="${escapeHTML(member.id)}" aria-label="${t("removeMember")}">×</button></div>`).join("")}</div>` : `<div class="empty-state" style="min-height:115px;margin-top:16px"><p style="margin:0">${t("noMembersYet")}</p></div>`;
		return `<div class="page-heading"><div><p class="eyebrow">${t("settingsEyebrow")}</p><h1>${t("settingsTitle")}</h1><p class="subheading">${t("settingsText")}</p></div></div>
			<div class="settings-grid"><section class="panel"><div class="panel-heading"><h2>${t("language")}</h2><span aria-hidden="true">🌐</span></div><p class="field-hint" style="margin:-7px 0 12px">${t("languageText")}</p>
				${[["uz", "languageFlagUz", "uzbek", "O'zbekiston"], ["ru", "languageFlagRu", "russian", "Русский язык"], ["en", "languageFlagEn", "english", "English language"]].map(([code, flag, label, native]) => `<label class="language-option"><span class="language-flag">${t(flag)}</span><span class="language-copy"><strong>${t(label)}</strong><span>${native}</span></span><input type="radio" name="language-choice" value="${code}" data-language-radio ${db.language === code ? "checked" : ""} aria-label="${t(label)}"></label>`).join("")}
			</section><section class="panel"><div class="panel-heading"><div><h2>${t("family")}</h2><span class="section-kicker">${t("familyText")}</span></div><span aria-hidden="true">🏡</span></div>
				<form class="member-form" id="member-form"><span class="member-preview" id="member-preview" aria-hidden="true">${roleIcons.father}</span><div class="field"><label for="member-name">${t("name")}</label><input id="member-name" name="name" maxlength="45" required placeholder="${t("namePlaceholder")}"></div><div class="field"><label for="member-role">${t("role")}</label><select id="member-role" name="role">${roles.map((role) => `<option value="${role}">${roleName(role)}</option>`).join("")}</select></div><button class="button button-primary" type="submit">＋ ${t("addMember")}</button><span class="member-preview-caption" id="member-preview-caption">${t("memberPreview")}</span></form>
				${members}<div class="settings-tip">${t("familyTip")}</div></section></div>`;
	}

	function renderResults() {
		const params = new URLSearchParams(location.search);
		const doneId = params.get("done");
		if (doneId) {
			const result = db.results.find((item) => item.id === doneId);
			if (result) return renderResultDetail(result);
		}
		const playId = params.get("play");
		if (playId) {
			const test = db.tests.find((item) => item.id === playId);
			if (!test) return `<div class="empty-state"><span class="empty-illustration">🔎</span><h3>${t("testMissing")}</h3><a class="button button-primary" href="Tests.html">${t("backTests")}</a></div>`;
			activeTest = test;
			activeRun = readActiveRun(test);
			return renderPlay(test);
		}
		activeTest = null;
		activeRun = null;
		const results = [...db.results].sort((a, b) => b.finishedAt - a.finishedAt);
		const content = results.length ? `<div class="result-grid">${results.map((result) => `<a class="result-row" href="Result.html?done=${encodeURIComponent(result.id)}"><span class="result-score">${result.score}/${result.total}</span><span class="result-copy"><strong>${escapeHTML(result.testTitle)}</strong><span>${t("playedBy")}: ${escapeHTML(result.playerName)} · ${formatDate(result.finishedAt)}</span></span><span class="muted">${Math.round(result.score / Math.max(1, result.total) * 100)}%</span></a>`).join("")}</div>` : `<div class="empty-state"><span class="empty-illustration" aria-hidden="true">🏆</span><h3>${t("noResults")}</h3><p>${t("noResultsText")}</p><a class="button button-primary" href="Tests.html">${t("backTests")}</a></div>`;
		return `<div class="page-heading"><div><p class="eyebrow">${t("resultsEyebrow")}</p><h1>${t("resultsTitle")}</h1><p class="subheading">${t("resultsText")}</p></div></div>${content}`;
	}

	function readActiveRun(test) {
		try {
			const saved = JSON.parse(sessionStorage.getItem(ACTIVE_KEY) || "null");
			if (saved?.testId === test.id) return saved;
		} catch (_) { /* Start a fresh run if saved state is unreadable. */ }
		const run = { testId: test.id, startedAt: Date.now() };
		sessionStorage.setItem(ACTIVE_KEY, JSON.stringify(run));
		return run;
	}

	function renderPlay(test) {
		const allowed = (test.participants || []).map(memberById).filter(Boolean);
		const playerOptions = allowed.length ? allowed : db.members;
		if (!playerOptions.length) return `<div class="empty-state"><span class="empty-illustration">👨‍👩‍👧</span><h3>${t("noMembers")}</h3><p>${t("noPeopleText")}</p><a class="button button-primary" href="Settings.html">${t("setupPeople")}</a></div>`;
		const participant = playerOptions[0];
		const questions = test.questions.map((question, questionIndex) => `<fieldset class="play-question"><legend class="play-question-title">${questionIndex + 1}. ${escapeHTML(question.text)}</legend>${question.options.map((option, optionIndex) => {
			const label = question.type === "boolean" ? t(option === "true" ? "trueOption" : "falseOption") : option;
			return `<label class="play-answer"><input type="radio" name="answer_${questionIndex}" value="${optionIndex}" required><span>${escapeHTML(label)}</span></label>`;
		}).join("")}</fieldset>`).join("");
		return `<div class="page-heading"><div><p class="eyebrow">${t("startTest")}</p><h1>${escapeHTML(test.title)}</h1><p class="subheading">${test.questions.length} ${t("questions")}</p></div></div>
			<form id="play-form" data-test-id="${escapeHTML(test.id)}"><div class="play-topline"><label class="field" style="display:flex;align-items:center;gap:9px;margin:0"><span class="field-label">${t("whoPlays")}</span><select name="player" class="text-input" style="width:auto;min-width:120px">${playerOptions.map((member) => `<option value="${escapeHTML(member.id)}">${escapeHTML(member.name)}</option>`).join("")}</select></label>${test.timerMinutes ? `<span class="timer-pill" id="timer-display" data-start="${activeRun.startedAt}" data-minutes="${test.timerMinutes}">◷ <span>--:--</span></span>` : ""}</div>${questions}<p class="form-error" id="play-error" role="alert"></p><div class="play-footer"><a class="button button-secondary" href="Tests.html">${t("cancel")}</a><button class="button button-primary" type="submit">${t("submitAnswers")} →</button></div></form>`;
	}

	function renderResultDetail(result) {
		const percent = Math.round(result.score / Math.max(1, result.total) * 100);
		const message = percent >= 80 ? t("scoreMessage") : percent >= 50 ? t("scoreGood") : t("scoreTry");
		const answers = (result.answers || []).map((answer, index) => `<div class="answer-item ${answer.correct ? "correct" : "incorrect"}"><strong>${index + 1}. ${escapeHTML(answer.question)}</strong><span>${t("yourAnswer")}: ${escapeHTML(answer.selected)}</span>${!answer.correct ? `<br><span>${t("correctWas")}: ${escapeHTML(answer.correctAnswer)}</span>` : ""}</div>`).join("");
		return `<div class="page-heading"><div><p class="eyebrow">${t("finished")}</p><h1>${escapeHTML(result.testTitle)}</h1><p class="subheading">${t("playedBy")}: ${escapeHTML(result.playerName)} · ${formatDate(result.finishedAt)}</p></div></div>
			<section class="result-detail"><div class="score-banner"><span class="score-big">${result.score}/${result.total}</span><div><strong>${percent}% · ${message}</strong><p>${result.score} ${t("correct")}</p></div></div><h2>${t("answerReview")}</h2><div class="answer-review">${answers}</div><div class="form-actions"><a class="button button-secondary" href="Tests.html">${t("backTests")}</a><a class="button button-primary" href="Result.html?play=${encodeURIComponent(result.testId)}">${t("playAgain")}</a></div></section>`;
	}

	function showToast(message) {
		const toast = document.getElementById("toast");
		if (!toast) return;
		toast.textContent = message;
		toast.classList.add("show");
		clearTimeout(toastTimeout);
		toastTimeout = setTimeout(() => toast.classList.remove("show"), 2300);
	}

	function render() {
		let content;
		if (currentPage === "builder") content = renderBuilder();
		else if (currentPage === "settings") content = renderSettings();
		else if (currentPage === "results") content = renderResults();
		else content = renderTests();
		renderShell(content);
		document.documentElement.lang = db.language;
		document.title = `FamilyTest | ${t(currentPage === "builder" ? "navCreate" : currentPage === "settings" ? "navSettings" : currentPage === "results" ? "navResults" : "navTests")}`;
		if (currentPage === "results" && activeTest?.timerMinutes) startTimer();
		else if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
	}

	function startTimer() {
		if (timerInterval) clearInterval(timerInterval);
		const update = () => {
			const display = document.getElementById("timer-display");
			if (!display || !activeRun || !activeTest) return;
			const duration = Number(activeTest.timerMinutes) * 60;
			const remaining = Math.max(0, duration - Math.floor((Date.now() - activeRun.startedAt) / 1000));
			const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
			const seconds = String(remaining % 60).padStart(2, "0");
			display.querySelector("span").textContent = `${minutes}:${seconds}`;
			display.classList.toggle("urgent", remaining <= 30);
			if (remaining <= 0) finishRun(true);
		};
		update();
		timerInterval = setInterval(update, 1000);
	}

	function finishRun(timeExpired) {
		if (finishingRun || !activeTest || !activeRun) return;
		finishingRun = true;
		const form = document.getElementById("play-form");
		const player = form?.elements.player;
		const playerMember = memberById(player?.value) || (activeTest.participants || []).map(memberById).find(Boolean) || db.members[0];
		const answers = activeTest.questions.map((question, index) => {
			const selected = form?.querySelector(`input[name="answer_${index}"]:checked`);
			const selectedIndex = selected ? Number(selected.value) : -1;
			const correctIndex = Number(question.correct) || 0;
			const displayOption = (optionIndex) => question.type === "boolean" ? t(question.options[optionIndex] === "true" ? "trueOption" : "falseOption") : question.options[optionIndex] || "";
			return { question: question.text, selected: selectedIndex < 0 ? "—" : displayOption(selectedIndex), correctAnswer: displayOption(correctIndex), correct: selectedIndex === correctIndex };
		});
		const result = { id: uid(), testId: activeTest.id, testTitle: activeTest.title, playerName: playerMember?.name || "—", score: answers.filter((answer) => answer.correct).length, total: answers.length, answers, finishedAt: Date.now(), timeExpired };
		db.results.push(result);
		saveData();
		sessionStorage.removeItem(ACTIVE_KEY);
		if (timerInterval) clearInterval(timerInterval);
		location.href = `Result.html?done=${encodeURIComponent(result.id)}`;
	}

	app.addEventListener("input", (event) => {
		const target = event.target;
		if (target.id === "test-title") draftSettings.title = target.value;
		if (target.id === "timer-minutes") draftSettings.timerMinutes = target.value;
		if (target.matches("[data-question-text]")) draftQuestions[Number(target.dataset.questionText)].text = target.value;
		if (target.matches("[data-option]")) {
			const [questionIndex, optionIndex] = target.dataset.option.split(":").map(Number);
			if (draftQuestions[questionIndex]) draftQuestions[questionIndex].options[optionIndex] = target.value;
		}
		if (target.id === "member-name") {
			const preview = document.getElementById("member-preview-caption");
			if (preview) preview.textContent = target.value.trim() || t("memberPreview");
		}
	});

	app.addEventListener("change", (event) => {
		const target = event.target;
		if (target.matches("[data-language]")) {
			db.language = target.value;
			saveData();
			render();
		}
		if (target.matches("[data-language-radio]")) {
			db.language = target.value;
			saveData();
			render();
		}
		if (target.matches("[data-question-type]")) {
			const question = draftQuestions[Number(target.dataset.questionType)];
			question.type = target.value;
			question.options = target.value === "boolean" ? ["true", "false"] : ["", "", ""];
			question.correct = 0;
			render();
		}
		if (target.matches("[data-correct]")) draftQuestions[Number(target.dataset.correct)].correct = Number(target.value);
		if (target.matches('input[name="participants"]')) {
			draftSettings.participants = [...app.querySelectorAll('input[name="participants"]:checked')].map((input) => input.value);
		}
		if (target.id === "timer-enabled") {
			draftSettings.timerEnabled = target.checked;
			document.getElementById("timer-fields")?.classList.toggle("hidden", !target.checked);
		}
		if (target.id === "member-role") {
			const preview = document.getElementById("member-preview");
			if (preview) preview.textContent = iconFor(target.value);
		}
	});

	app.addEventListener("click", (event) => {
		const button = event.target.closest("[data-action]");
		if (!button) return;
		const index = Number(button.dataset.index);
		if (button.dataset.action === "add-question") { draftQuestions.push(newQuestion()); render(); }
		if (button.dataset.action === "remove-question") { draftQuestions.splice(index, 1); render(); }
		if (button.dataset.action === "add-option") { draftQuestions[index].options.push(""); render(); }
		if (button.dataset.action === "remove-option") {
			const optionIndex = Number(button.dataset.optionIndex);
			draftQuestions[index].options.splice(optionIndex, 1);
			if (draftQuestions[index].correct >= draftQuestions[index].options.length) draftQuestions[index].correct = 0;
			render();
		}
		if (button.dataset.action === "delete-test") {
			if (!window.confirm(t("deleteConfirm"))) return;
			db.tests = db.tests.filter((test) => test.id !== button.dataset.id);
			saveData();
			render();
		}
		if (button.dataset.action === "delete-member") {
			if (!window.confirm(t("deleteConfirm"))) return;
			db.members = db.members.filter((member) => member.id !== button.dataset.id);
			db.tests = db.tests.map((test) => ({ ...test, participants: test.participants.filter((id) => id !== button.dataset.id) }));
			saveData();
			render();
		}
	});

	app.addEventListener("submit", (event) => {
		const form = event.target;
		if (form.id === "member-form") {
			event.preventDefault();
			const name = String(new FormData(form).get("name") || "").trim();
			const role = String(new FormData(form).get("role") || "other");
			if (!name) return;
			if (db.members.some((member) => member.name.toLocaleLowerCase() === name.toLocaleLowerCase())) { showToast(t("memberExists")); return; }
			db.members.push({ id: uid(), name, role });
			saveData();
			render();
			showToast(t("memberAdded"));
		}
		if (form.id === "test-form") {
			event.preventDefault();
			const data = new FormData(form);
			const title = String(data.get("title") || "").trim();
			const error = document.getElementById("builder-error");
			if (!title) { error.textContent = t("needTitle"); form.elements.title.focus(); return; }
			const questions = draftQuestions.map((question) => ({
				...question,
				text: question.text.trim(),
				options: question.options.map((option) => question.type === "boolean" ? option : option.trim())
			}));
			if (questions.some((question) => !question.text || !question.options.every(Boolean) || question.options.length < 2)) { error.textContent = t("needQuestion"); return; }
			const participants = data.getAll("participants").map(String);
			if (!participants.length) { error.textContent = t("needPeople"); return; }
			const editId = new URLSearchParams(location.search).get("edit");
			const previous = db.tests.find((item) => item.id === editId);
			const timerMinutes = data.get("timerEnabled") === "on" ? Math.min(180, Math.max(1, Number(data.get("timerMinutes")) || 5)) : 0;
			const test = { id: previous?.id || uid(), title, questions, participants, timerMinutes, symbol: previous?.symbol || ["🌿", "🌞", "🌼", "🐾"][db.tests.length % 4], updatedAt: Date.now() };
			db.tests = previous ? db.tests.map((item) => item.id === previous.id ? test : item) : [test, ...db.tests];
			saveData();
			location.href = "Tests.html";
		}
		if (form.id === "play-form") {
			event.preventDefault();
			if (!form.reportValidity()) { document.getElementById("play-error").textContent = t("chooseAnswer"); return; }
			finishRun(false);
		}
	});

	render();
})();
