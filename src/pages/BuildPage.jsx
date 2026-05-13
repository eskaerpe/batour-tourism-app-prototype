import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Star, Users } from "lucide-react";
import { Button, Card, SectionTitle } from "../components/ui";
import { guides, vehicleOptions } from "../data/mockData";
import { useStore } from "../store/useStore";

const destinationTimes = ["10:30 AM", "12:30 PM", "02:30 PM"];

export default function BuildPage() {
	const navigate = useNavigate();
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const vehicle = useStore((state) => state.vehicle);
	const guide = useStore((state) => state.guide);
	const setVehicle = useStore((state) => state.setVehicle);
	const setGuide = useStore((state) => state.setGuide);

	const tripStops = selectedDestinations.length > 0 ? selectedDestinations : [{ id: "placeholder", name: "Kawah Putih", location: "Ciwidey, Bandung" }];
	const timelineStops = [
		{ time: "08:00 AM", title: "Hotel Pickup", subtitle: "Central City Hotel" },
		...tripStops.map((destination, index) => ({
			time: destinationTimes[index] || `${10 + index}:30 AM`,
			title: destination.name,
			subtitle: destination.location,
		})),
		{ time: "01:00 PM", title: "Local Lunch", subtitle: "Mountain View Restaurant" },
		{ time: "04:00 PM", title: "Return to Hotel", subtitle: "Central City Hotel" },
	];

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_32%,#f8fafc_100%)] pb-44 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Trip Builder"
					title="Build Itinerary"
				/>

				<div className="mt-5 space-y-4">
					<Card className="p-4">
						<div className="mb-4 text-base font-bold text-slate-900">Vehicle Selection</div>
						<div className="grid gap-3 sm:grid-cols-2">
							{vehicleOptions.map((option) => {
								const isActive = vehicle.id === option.id;
								return (
									<button
										key={option.id}
										onClick={() => setVehicle(option)}
										className={`rounded-3xl border p-4 text-left transition ${isActive ? "border-brand bg-brand/5 ring-1 ring-brand/20" : "border-slate-200 bg-white"}`}>
										<div className="flex items-center justify-between gap-3">
											<div>
												<div className="font-semibold text-slate-900">{option.label}</div>
												<p className="mt-1 text-sm text-slate-500">{option.description}</p>
											</div>
											<div className={`h-5 w-5 rounded-full border-2 ${isActive ? "border-brand bg-brand" : "border-slate-300"}`} />
										</div>
									</button>
								);
							})}
						</div>
					</Card>

					<Card className="p-4">
						<div className="mb-4 text-base font-bold text-slate-900">Select a Local Guide</div>
						<div className="space-y-3">
							{guides.map((candidate) => {
								const isActive = guide.id === candidate.id;
								return (
									<button
										key={candidate.id}
										onClick={() => setGuide(candidate)}
										className={`flex w-full items-start gap-4 rounded-3xl border p-4 text-left transition ${isActive ? "border-brand bg-brand/5" : "border-slate-200 bg-white"}`}>
										<img
											src={candidate.avatar}
											alt={candidate.name}
											className="h-16 w-16 rounded-2xl object-cover"
										/>
										<div className="min-w-0 flex-1">
											<div className="flex items-center justify-between gap-3">
												<div className="font-semibold text-slate-900">{candidate.name}</div>
												<div className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
													<Star
														size={14}
														className="fill-amber-400 text-amber-400"
													/>{" "}
													{candidate.rating}
												</div>
											</div>
											<p className="mt-2 text-sm leading-6 text-slate-500">{candidate.bio}</p>
											<div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand">
												<Users size={15} /> Select {candidate.name}
											</div>
										</div>
										<div className={`mt-1 h-5 w-5 rounded-full border-2 ${isActive ? "border-brand bg-brand" : "border-slate-300"}`} />
									</button>
								);
							})}
						</div>
					</Card>

					<Card className="p-4">
						<div className="mb-5 flex items-center justify-between">
							<div className="text-base font-bold text-slate-900">Your Itinerary</div>
							<button className="text-sm font-semibold text-brand">Edit</button>
						</div>

						<div className="space-y-5 border-l border-slate-200 pl-4">
							{timelineStops.map((step, index) => {
								const dotColor = index === 0 ? "bg-brand" : index <= tripStops.length ? "bg-brand/60" : "bg-slate-300";

								return (
									<div
										key={`${step.time}-${step.title}`}
										className="relative">
										<div className={`absolute -left-[1.45rem] top-1 h-3.5 w-3.5 rounded-full ${dotColor}`} />
										<div className="text-sm font-bold text-brand/80">{step.time}</div>
										<div className="mt-1 text-lg font-extrabold text-slate-900">{step.title}</div>
										<div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
											<MapPin size={15} /> {step.subtitle}
										</div>
									</div>
								);
							})}
						</div>

						{selectedDestinations.length > 1 ? (
							<div className="mt-5 rounded-3xl bg-brandSoft p-4 text-sm text-slate-700">
								<div className="font-semibold text-slate-900">Added stops</div>
								<div className="mt-2 flex flex-wrap gap-2">
									{selectedDestinations.map((destination) => (
										<span
											key={destination.id}
											className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
											{destination.name}
										</span>
									))}
								</div>
							</div>
						) : null}
					</Card>
				</div>
			</div>

			<div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-slate-50 px-5 py-4">
				<div className="mb-3 flex items-end justify-between">
					<div>
						<div className="text-sm text-slate-500">Total estimated cost</div>
						<div className="text-3xl font-black text-slate-900">$145.00</div>
					</div>
					<div className="rounded-full bg-brandSoft px-3 py-2 text-xs font-semibold text-brand">Mocked total</div>
				</div>
				<Button
					className="w-full py-4 text-base"
					onClick={() => navigate("/checkout")}>
					<Plus size={18} /> Add to Trip
				</Button>
			</div>
		</div>
	);
}
