(function () {
	"use strict";

	function render(mode) {
		const isRegistering = mode === "register";
		return `
			<main class="auth-page">
				<section class="auth-panel">
					<div class="auth-brand"><span class="brand-icon">✦</span> Family Studio</div>
					<p class="hero-tag">Family & Friends</p>
					<h1>${isRegistering ? "Hisob yaratish" : "Xush kelibsiz"}</h1>
					<p class="auth-copy">${isRegistering ? "Ism va parol kiriting. Birinchi yaratilgan hisob admin bo'ladi." : "Davom etish uchun ismingiz va parolingiz bilan kiring."}</p>
					<form id="auth-form" class="auth-form">
						<label for="auth-name">Ism</label>
						<input class="form-control" id="auth-name" name="name" autocomplete="username" maxlength="32" required placeholder="Ismingiz">
						<label for="auth-password">Parol</label>
						<input class="form-control" id="auth-password" name="password" type="password" autocomplete="${isRegistering ? "new-password" : "current-password"}" minlength="6" required placeholder="Kamida 6 belgi">
						<p id="auth-message" class="auth-message" role="status"></p>
						<button class="btn btn-primary auth-submit" type="submit">${isRegistering ? "Hisob yaratish" : "Kirish"}</button>
					</form>
					<button class="auth-mode-toggle" type="button" onclick="window.toggleAuthMode()">
						${isRegistering ? "Hisobingiz bormi? Kirish" : "Yangi foydalanuvchimisiz? Hisob yarating"}
					</button>
					<p class="auth-note">Hisoblar faqat shu brauzerda saqlanadi. Boshqa qurilmalar bilan umumiy login uchun server kerak.</p>
				</section>
			</main>
		`;
	}

	function bind(onSubmit) {
		const form = document.getElementById("auth-form");
		if (form) form.addEventListener("submit", onSubmit);
	}

	window.FamilyLogin = Object.freeze({ render, bind });
})();
