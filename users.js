(function () {
	"use strict";

	const service = window.FamilyService;

	async function createAccount(state, name, password, avatar) {
		const cleanName = String(name || "").trim();
		if (!cleanName) throw new Error("Ismni kiriting.");
		if (cleanName.length > 32) throw new Error("Ism 32 belgidan oshmasin.");
		if (state.profiles.some(profile => profile.name.trim().toLocaleLowerCase() === cleanName.toLocaleLowerCase())) {
			throw new Error("Bu ism bilan hisob mavjud. Boshqa ism tanlang.");
		}
		if (String(password || "").length < 6) {
			throw new Error("Parol kamida 6 belgidan iborat bo'lishi kerak.");
		}

		const passwordSalt = service.createPasswordSalt();
		const passwordHash = await service.hashPassword(password, passwordSalt);
		return {
			id: `id_${Math.random().toString(36).slice(2, 11)}_${Date.now()}`,
			name: cleanName,
			avatar,
			passwordSalt,
			passwordHash,
			role: state.profiles.some(profile => profile.role === "admin") ? "user" : "admin",
			createdAt: Date.now(),
			lastLoginAt: Date.now(),
			warningCount: 0,
			isBanned: false
		};
	}

	async function authenticate(state, name, password) {
		const cleanName = String(name || "").trim();
		const profile = state.profiles.find(item => item.name.trim().toLocaleLowerCase() === cleanName.toLocaleLowerCase());
		if (!profile) throw new Error("Bunday ismli hisob topilmadi. Avval hisob yarating.");
		if (profile.isBanned) throw new Error("Hisobingiz admin tomonidan vaqtincha bloklangan.");

		if (!profile.passwordHash) {
			profile.passwordSalt = service.createPasswordSalt();
			profile.passwordHash = await service.hashPassword(password, profile.passwordSalt);
			profile.role = state.profiles.some(item => item.role === "admin") ? "user" : "admin";
		} else {
			const candidateHash = await service.hashPassword(password, profile.passwordSalt);
			if (candidateHash !== profile.passwordHash) throw new Error("Parol noto'g'ri.");
		}

		profile.lastLoginAt = Date.now();
		return profile;
	}

	function isAdmin(state, profileId) {
		return state.profiles.some(profile => profile.id === profileId && profile.role === "admin");
	}

	window.FamilyUsers = Object.freeze({ createAccount, authenticate, isAdmin });
})();
