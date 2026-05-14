const ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomChar() {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const buffer = new Uint32Array(1);
		crypto.getRandomValues(buffer);
		return ALPHANUMERIC[buffer[0] % ALPHANUMERIC.length];
	}

	return ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
}

export function generateBookingId() {
	let code = "";
	for (let index = 0; index < 6; index += 1) {
		code += randomChar();
	}
	return `BATOUR-${code}`;
}
