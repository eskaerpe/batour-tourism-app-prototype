import { carRentals, destinations, guides, transitMatrix } from "../data";
import { generateBookingId } from "./bookingId";
import { calculateCarFee, calculateEntryFees, calculateGuideFee, calculateTotal, calculateDP } from "./priceCalculations";
import { generateTimeline } from "./timelineEngine";
import { generateWhatsAppMessage } from "./whatsappFormatter";

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
	const [hours, minutes] = String(timeString).split(":").map(Number);
	return hours * 60 + minutes;
}

export function createShortBookingId() {
	return generateBookingId();
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

export function buildTimeline({ selectedDestinationIds }) {
	return generateTimeline(selectedDestinationIds, destinations, transitMatrix).map((step) => ({
		step: step.step,
		name: step.destination,
		scheduledTime: step.arrivalTime,
		estimatedDurationMinutes: step.duration,
		zone: step.zone,
		destinationId: step.destinationId,
		transitMinutes: step.transitMinutes,
	}));
}

export function calculateTripCosts({ selectedDestinationIds, guideId, carId, paymentOption }) {
	const entryFees = calculateEntryFees(selectedDestinationIds, destinations);
	const guideFee = calculateGuideFee(guideId, guides);
	const carFee = calculateCarFee(carId, carRentals);
	const subtotal = calculateTotal(guideFee, carFee, entryFees);
	const discount = paymentOption === "FULL" ? Math.round(subtotal * 0.05) : 0;
	const totalCost = subtotal - discount;

	return {
		guideFee,
		carFee,
		entryFees,
		subtotal,
		discount,
		totalCost,
		dpAmount: calculateDP(totalCost, paymentOption),
	};
}

export function buildWhatsAppMessage(booking) {
	return generateWhatsAppMessage(booking, destinations, guides, carRentals);
}

export function encodeWhatsAppUrl(message, phone = "6281234567890") {
	return `https://wa.me/${phone}/?text=${encodeURIComponent(message)}`;
}

export function createBookingObject({ selectedDestinationIds, guideId, carId, paymentOption }) {
	const costs = calculateTripCosts({ selectedDestinationIds, guideId, carId, paymentOption });
	const timeline = buildTimeline({ selectedDestinationIds, carId });
	const bookingId = createShortBookingId();
	const createdAt = new Date().toISOString();
	const guide = getGuideById(guideId);
	const car = carId ? getCarById(carId) : null;

	return {
		bookingId,
		createdAt,
		tripDate: null,
		status: "pending",
		paymentStatus: paymentOption === "DP_50" ? "partially-paid" : "not-paid",
		destinationIds: selectedDestinationIds,
		destinationNames: selectedDestinationIds.map((destinationId) => getDestinationById(destinationId)?.name).filter(Boolean),
		guideId,
		guideName: guide?.name ?? null,
		guidePhoto: guide?.photo ?? null,
		guidePhone: guide?.phone ?? null,
		carId,
		carLabel: car?.label ?? null,
		paymentOption,
		totalCost: costs.totalCost,
		guideFee: costs.guideFee,
		carFee: costs.carFee,
		entryFees: costs.entryFees.map((entry) => entry.amount),
		dpAmount: costs.dpAmount,
		timeline,
		whatsappMessageSent: false,
		whatsappContactPhone: guide?.phone ?? "6281234567890",
		confirmationDetails: null,
		notes: "",
	};
}
