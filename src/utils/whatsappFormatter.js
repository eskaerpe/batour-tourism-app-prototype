import { calculateDP } from "./priceCalculations";

function formatIDR(value) {
	return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export function generateWhatsAppMessage(booking, destinations, guides, carRentals) {
	if (!booking || !Array.isArray(destinations) || !Array.isArray(guides) || !Array.isArray(carRentals)) {
		throw new Error("Missing required data");
	}

	const destinationText = (booking.destinationIds || [])
		.map((destinationId, index) => {
			const destination = destinations.find((item) => item.id === destinationId);
			return `${index + 1}. ${destination?.name ?? destinationId} ${destination?.entryFee ? `(${formatIDR(destination.entryFee)})` : "(Gratis)"}`;
		})
		.join("\n");
	const guide = guides.find((item) => item.id === booking.guideId);
	const car = booking.carId ? carRentals.find((item) => item.id === booking.carId) : null;
	const entryFeeTotal = (booking.entryFees || []).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

	return [
		"Halo BaTour! 👋",
		"",
		"Saya ingin booking trip:",
		"",
		"📅 Tanggal Kunjungan: [Mohon dikonfirmasi via WhatsApp]",
		"",
		"🗺️ Destinasi:",
		destinationText || "1. Belum ada destinasi dipilih",
		"",
		`👤 Tour Guide: ${guide?.name ?? "-"}`,
		"",
		`🚗 Transportasi: ${car ? car.label : "Kendaraan dari guide"}`,
		"",
		"💰 Rincian Biaya:",
		`- Guide: ${formatIDR(booking.guideFee)}`,
		...(booking.carFee > 0 ? [`- Mobil: ${formatIDR(booking.carFee)}`] : []),
		`- Entry Fees: ${formatIDR(entryFeeTotal)}`,
		`- Total: ${formatIDR(booking.totalCost)}`,
		"",
		`💳 Opsi Pembayaran: ${booking.paymentOption === "DP_50" ? `DP 50% (${formatIDR(calculateDP(booking.totalCost, "DP_50"))} sekarang, 50% di hari kunjungan)` : `Full Payment (${formatIDR(calculateDP(booking.totalCost, "FULL"))} sekarang, diskon 5%)`}`,
		"",
		`🔖 ID Pemesanan: ${booking.bookingId}`,
		"",
		"Mohon konfirmasi ketersediaan & rekening untuk pembayaran. Terima kasih! 🙏",
	].join("\n");
}
