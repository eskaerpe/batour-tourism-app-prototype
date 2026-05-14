function timeToMinutes(time) {
	const [hours, minutes] = String(time).split(":").map(Number);
	return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
	const hours = Math.floor(totalMinutes / 60) % 24;
	const minutes = totalMinutes % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function getTransitMinutes(fromZone, toZone, transitMatrix) {
	if (!fromZone || !toZone) {
		return 0;
	}

	const directKey = `${fromZone}->${toZone}`;
	const reverseKey = `${toZone}->${fromZone}`;
	return transitMatrix?.matrix?.[directKey] ?? transitMatrix?.matrix?.[reverseKey] ?? 60;
}

export function generateTimeline(destinationIds, destinations, transitMatrix) {
	const selectedDestinations = destinationIds.map((destinationId) => destinations.find((item) => item.id === destinationId)).filter(Boolean);
	const startTime = transitMatrix?.defaultStartTime ?? "08:00";
	const bufferMinutes = transitMatrix?.bufferMinutesBetweenStops ?? 15;
	const startMinutes = timeToMinutes(startTime);
	const timeline = [];
	let currentMinutes = startMinutes;
	let previousZone = "Bandung Pusat";

	selectedDestinations.forEach((destination, index) => {
		const transitMinutes = index === 0 ? getTransitMinutes(previousZone, destination.zone, transitMatrix) : getTransitMinutes(previousZone, destination.zone, transitMatrix) + bufferMinutes;
		currentMinutes += transitMinutes;
		timeline.push({
			step: index + 1,
			destinationId: destination.id,
			destination: destination.name,
			arrivalTime: minutesToTime(currentMinutes),
			duration: destination.estimatedDurationMinutes,
			zone: destination.zone,
			transitMinutes,
		});
		currentMinutes += destination.estimatedDurationMinutes;
		previousZone = destination.zone;
	});

	return timeline;
}
