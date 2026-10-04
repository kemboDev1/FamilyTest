/* Shared browser storage and cryptography helpers. */
(function () {
	"use strict";

	const STORAGE_KEY = "family_friends_quiz_app_v3";
	const DEFAULT_DATABASE = {
		theme: "light",
		currentUserId: null,
		profiles: [],
		tests: [],
		results: [],
		notifications: [],
		aiQuestionHistory: []
	};

	function loadState() {
		let saved = null;
		try {
			saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
		} catch (error) {
			console.warn("Family Studio data could not be parsed; using an empty state.", error);
		}

		const state = { ...DEFAULT_DATABASE, ...(saved || {}) };
		for (const collection of ["profiles", "tests", "results", "notifications", "aiQuestionHistory"]) {
			if (!Array.isArray(state[collection])) state[collection] = [];
		}
		return state;
	}

	function saveState(state) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}

	function createPasswordSalt() {
		if (!window.crypto || !window.crypto.getRandomValues) {
			throw new Error("Parolni himoyalash uchun xavfsiz brauzer muhiti kerak.");
		}
		return Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
			.map(byte => byte.toString(16).padStart(2, "0"))
			.join("");
	}

	async function hashPassword(password, saltHex) {
		if (!window.crypto || !window.crypto.subtle) {
			throw new Error("Parolni himoyalash uchun HTTPS yoki localhost kerak.");
		}

		const salt = new Uint8Array(saltHex.match(/.{2}/g).map(byte => parseInt(byte, 16)));
		const key = await window.crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(password),
			"PBKDF2",
			false,
			["deriveBits"]
		);
		const bits = await window.crypto.subtle.deriveBits(
			{ name: "PBKDF2", salt, iterations: 120000, hash: "SHA-256" },
			key,
			256
		);
		return Array.from(new Uint8Array(bits))
			.map(byte => byte.toString(16).padStart(2, "0"))
			.join("");
	}

	function shuffleItems(items) {
		const shuffled = [...items];
		for (let index = shuffled.length - 1; index > 0; index--) {
			const swapIndex = Math.floor(Math.random() * (index + 1));
			[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
		}
		return shuffled;
	}

	window.FamilyService = Object.freeze({
		loadState,
		saveState,
		createPasswordSalt,
		hashPassword,
		shuffleItems
	});
})();
