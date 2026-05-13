import { carRentals, destinations, guides, transitMatrix } from "../data";

export function formatIDR(value) {
	return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export function formatUSDLike(value) {
	return `$${Number(value || 0).toFixed(2)}`;
}

export function formatTimeFromMinutes(totalMinutes) {
	const hours = Math.floor(totalMinutes / 60) % 24;
	const minutes = totalMinutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function timeStringToMinutes(timeString) {
	const [hours, minutes] = timeString.split(":").map(Number);
	return hours * 60 + minutes;
}

export function createShortBookingId() {
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
	let code = "";
	for (let index = 0; index < 6; index += 1) {
		code += alphabet[Math.floor(Math.random() * alphabet.length)];
	}
	return `BATOUR-${code}`;
}

export function getDestinationById(destinationId) {
	return destinations.find((item) => item.id === destinationId) ?? null;
}

export function getGuideById(guideId) {
	return guides.find((item) => item.id === guideId) ?? null;
}

export function getCarById(carId) {
	return carRentals.find((item) => item.id === carId) ?? null;
}

export function getTransitMinutes(fromZone, toZone) {
	if (!fromZone || !toZone) {
		return 0;
	}

	const directKey = `${fromZone}->${toZone}`;
	const reverseKey = `${toZone}->${fromZone}`;
	return transitMatrix.matrix[directKey] ?? transitMatrix.matrix[reverseKey] ?? 60;
}

export function buildTimeline({ selectedDestinationIds, carId }) {
	const startMinutes = timeStringToMinutes(transitMatrix.defaultStartTime);
	const buffer = transitMatrix.bufferMinutesBetweenStops;
	const selected = selectedDestinationIds.map(getDestinationById).filter(Boolean);
	const vehicle = getCarById(carId);
	const transmissionBonus = vehicle?.transmissionBonus ?? 1;

	const steps = [];
	let currentMinutes = startMinutes;
	let previousZone = "Bandung Pusat";

	steps.push({
		step: 1,
		name: "Hotel Pickup",
		type: "pickup",
		scheduledTime: formatTimeFromMinutes(currentMinutes),
		estimatedDurationMinutes: 30,
		zone: "Bandung Pusat",
	});
	currentMinutes += 30;

	selected.forEach((destination, index) => {
		const transitMinutes = Math.round(getTransitMinutes(previousZone, destination.zone) * transmissionBonus);
		currentMinutes += transitMinutes + buffer;
		steps.push({
			step: index + 2,
			destinationId: destination.id,
			name: destination.name,
			scheduledTime: formatTimeFromMinutes(currentMinutes),
			estimatedDurationMinutes: destination.estimatedDurationMinutes,
			zone: destination.zone,
			transitMinutes,
		});
		currentMinutes += destination.estimatedDurationMinutes;
		previousZone = destination.zone;
	});

	currentMinutes += getTransitMinutes(previousZone, "Bandung Pusat");
	steps.push({
		step: steps.length + 1,
		name: "Return to Hotel",
		scheduledTime: formatTimeFromMinutes(currentMinutes),
		estimatedDurationMinutes: 30,
		zone: "Bandung Pusat",
	});

	return steps;
}

export function calculateTripCosts({ selectedDestinationIds, guideId, carId, paymentOption }) {
	const destinationModels = selectedDestinationIds.map(getDestinationById).filter(Boolean);
	const guide = getGuideById(guideId);
	const car = carId ? getCarById(carId) : null;

	const entryFees = destinationModels.map((destination) => ({
		destinationId: destination.id,
		amount: destination.entryFee,
		name: destination.name,
	}));

	const guideFee = guide?.dailyRate ?? 0;
	const carFee = car?.dailyRate ?? 0;
	const entryFeeTotal = entryFees.reduce((sum, item) => sum + item.amount, 0);
	const subtotal = guideFee + carFee + entryFeeTotal;
	const discount = paymentOption === "FULL" ? Math.round(subtotal * 0.05) : 0;
	const totalCost = subtotal - discount;

	return {
		guideFee,
		carFee,
		entryFees,
		subtotal,
		discount,
		totalCost,
	};
}

export function buildWhatsAppMessage(booking) {
	const destinationsText = booking.entryFees.map((entry, index) => `${index + 1}. ${entry.name} (${entry.amount > 0 ? formatIDR(entry.amount) : "Gratis"})`).join("\n");
	const guide = getGuideById(booking.guideId);
	const car = booking.carId ? getCarById(booking.carId) : null;

	return [
		"Halo BaTour! 👋",
		"",
		"Saya ingin booking trip:",
		"",
		"📅 Tanggal Kunjungan: [Mohon dikonfirmasi via WhatsApp]",
		"",
		"🗺️ Destinasi:",
		destinationsText || "1. Belum ada destinasi dipilih",
		"",
		`👤 Tour Guide: ${guide?.name ?? "-"} (Rating: ${guide ? "⭐".repeat(Math.round(guide.rating)) : "-"})`,
		"",
		`🚗 Transportasi: ${car ? `${car.label}, ${formatIDR(car.dailyRate)}` : "Kendaraan dari guide"}`,
		"",
		"💰 Rincian Biaya:",
		`- Guide: ${formatIDR(booking.guideFee)}`,
		...(booking.carFee > 0 ? [`- Mobil: ${formatIDR(booking.carFee)}`] : []),
		`- Entry Fees: ${formatIDR(booking.entryFees.reduce((sum, item) => sum + item.amount, 0))}`,
		`- Total: ${formatIDR(booking.totalCost)}`,
		"",
		`💳 Opsi Pembayaran: ${booking.paymentOption === "DP_50" ? `DP 50% (${formatIDR(Math.round(booking.totalCost * 0.5))} sekarang)` : `Full Payment (${formatIDR(booking.totalCost)} sekarang)`}`,
		"",
		`🔖 ID Pemesanan: ${booking.bookingId}`,
		"",
		"Mohon konfirmasi ketersediaan & rekening untuk pembayaran. Terima kasih! 🙏",
	].join("\n");
}

export function encodeWhatsAppUrl(message) {
	return `https://wa.me/6281234567890/?text=${encodeURIComponent(message)}`;
}

export function createBookingObject({ selectedDestinationIds, guideId, carId, paymentOption }) {
	const costs = calculateTripCosts({ selectedDestinationIds, guideId, carId, paymentOption });
	const timeline = buildTimeline({ selectedDestinationIds, carId });
	const bookingId = createShortBookingId();
	const createdAt = new Date().toISOString();

	return {
		bookingId,
		createdAt,
		visitDate: null,
		status: "confirmed",
		paymentStatus: paymentOption === "DP_50" ? "partially-paid" : "not-paid",
		destinationIds: selectedDestinationIds,
		guideId,
		carId,
		paymentOption,
		totalCost: costs.totalCost,
		guideFee: costs.guideFee,
		carFee: costs.carFee,
		entryFees: costs.entryFees,
		timeline,
		whatsappMessageSent: false,
		whatsappContactPhone: "6281234567890",
		confirmationDetails: null,
		notes: "",
	};
}
