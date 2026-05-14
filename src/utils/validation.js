export function validateDestinationSelection(destinationIds, destinations) {
	if (!Array.isArray(destinationIds) || destinationIds.length < 1) {
		throw new Error("Pilih minimal 1 destinasi");
	}
	if (destinationIds.length > 3) {
		throw new Error("Maksimal 3 destinasi");
	}
	for (const destinationId of destinationIds) {
		if (!destinations.some((destination) => destination.id === destinationId)) {
			throw new Error(`Destinasi tidak valid: ${destinationId}`);
		}
	}
}

export function validateGuideSelection(guideId, guides) {
	if (!guideId) {
		throw new Error("Pilih 1 tour guide");
	}
	if (!guides.some((guide) => guide.id === guideId)) {
		throw new Error("Guide tidak valid");
	}
}

export function validatePaymentOption(option) {
	if (!["DP_50", "FULL"].includes(option)) {
		throw new Error("Pilih opsi pembayaran yang valid");
	}
}

export function validateBooking(booking) {
	if (!booking?.bookingId || !/^BATOUR-[A-Z0-9]{6}$/.test(booking.bookingId)) {
		throw new Error("Booking ID tidak valid");
	}
	if (!Array.isArray(booking.destinationIds) || booking.destinationIds.length < 1) {
		throw new Error("Pilih minimal 1 destinasi");
	}
	if (!booking.guideId) {
		throw new Error("Pilih 1 tour guide");
	}
	validatePaymentOption(booking.paymentOption);
}
