const DB_NAME = "batour-db";
const DB_VERSION = 1;

function openDatabase() {
	return new Promise((resolve, reject) => {
		if (typeof indexedDB === "undefined") {
			reject(new Error("IndexedDB is not available"));
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const database = request.result;

			if (!database.objectStoreNames.contains("bookings")) {
				database.createObjectStore("bookings", { keyPath: "bookingId" });
			}
			if (!database.objectStoreNames.contains("sessionState")) {
				database.createObjectStore("sessionState", { keyPath: "sessionKey" });
			}
			if (!database.objectStoreNames.contains("userPreferences")) {
				database.createObjectStore("userPreferences", { keyPath: "preferenceKey" });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function withStore(storeName, mode, handler) {
	const database = await openDatabase();
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(storeName, mode);
		const store = transaction.objectStore(storeName);
		const result = handler(store);
		transaction.oncomplete = () => resolve(result);
		transaction.onerror = () => reject(transaction.error);
	});
}

function requestToPromise(request) {
	return new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result ?? null);
		request.onerror = () => reject(request.error);
	});
}

export async function ensureDatabase() {
	return openDatabase();
}

export async function getSessionState() {
	try {
		return await withStore("sessionState", "readonly", (store) => requestToPromise(store.get("current")));
	} catch {
		return null;
	}
}

export async function saveSessionState(sessionState) {
	return withStore("sessionState", "readwrite", (store) => store.put({ ...sessionState, sessionKey: "current" }));
}

export async function getUserPreferences() {
	try {
		return await withStore("userPreferences", "readonly", (store) => requestToPromise(store.get("user")));
	} catch {
		return null;
	}
}

export async function saveUserPreferences(preferences) {
	return withStore("userPreferences", "readwrite", (store) => store.put({ ...preferences, preferenceKey: "user" }));
}

export async function saveBooking(booking) {
	return withStore("bookings", "readwrite", (store) => store.put(booking));
}

export async function getBooking(bookingId) {
	if (!bookingId) {
		return null;
	}

	try {
		return await withStore("bookings", "readonly", (store) => requestToPromise(store.get(bookingId)));
	} catch {
		return null;
	}
}
