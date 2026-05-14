const DB_NAME = "batour-db";
const DB_VERSION = 2;

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
				database.createObjectStore("sessionState", { keyPath: "key" });
			}
			if (!database.objectStoreNames.contains("tripState")) {
				database.createObjectStore("tripState", { keyPath: "key" });
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

export async function initDB() {
	return ensureDatabase();
}

export async function saveSession(key, value) {
	return withStore("sessionState", "readwrite", (store) => store.put({ key, value }));
}

export async function getSession(key) {
	if (!key) {
		return null;
	}

	try {
		const record = await withStore("sessionState", "readonly", (store) => requestToPromise(store.get(key)));
		return record?.value ?? null;
	} catch {
		return null;
	}
}

export async function saveTripState(value) {
	return withStore("tripState", "readwrite", (store) => store.put({ key: "current-trip", value }));
}

export async function getTripState() {
	try {
		const record = await withStore("tripState", "readonly", (store) => requestToPromise(store.get("current-trip")));
		return record?.value ?? null;
	} catch {
		return null;
	}
}

export async function getSessionState() {
	return getTripState();
}

export async function saveSessionState(sessionState) {
	return saveTripState(sessionState);
}

export async function getUserPreferences() {
	return getSession("user");
}

export async function saveUserPreferences(preferences) {
	return saveSession("user", preferences);
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
