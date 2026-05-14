export function calculateGuideFee(guideId, guides) {
	return guides.find((guide) => guide.id === guideId)?.dailyRate ?? 0;
}

export function calculateCarFee(carId, carRentals) {
	return carRentals.find((car) => car.id === carId)?.dailyRate ?? 0;
}

export function calculateEntryFees(destinationIds, destinations) {
	return destinationIds
		.map((destinationId) => {
			const destination = destinations.find((item) => item.id === destinationId);
			if (!destination) {
				return null;
			}

			return {
				destinationId: destination.id,
				amount: destination.entryFee ?? 0,
				name: destination.name,
			};
		})
		.filter(Boolean);
}

export function calculateTotal(guideFee, carFee, entryFees) {
	return Number(guideFee || 0) + Number(carFee || 0) + (entryFees || []).reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

export function calculateDP(totalCost, paymentOption) {
	if (paymentOption === "FULL") {
		return Math.round(Number(totalCost || 0) * 0.95);
	}

	return Math.round(Number(totalCost || 0) * 0.5);
}
