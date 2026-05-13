import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapPinned, Ticket, Users } from "lucide-react";
import { BottomActionBar, Badge, Button, Card, SectionTitle, TimelineStep } from "../components/ui";
import { carRentals, destinations, guides } from "../data";
import { formatIDR } from "../utils/batour";
import { useStore } from "../store/useStore";

export default function BookingDetailsPage() {
	const navigate = useNavigate();
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const selectedGuide = useStore((state) => state.selectedGuide);
	const selectedCar = useStore((state) => state.selectedCar);
	const selectedPaymentOption = useStore((state) => state.selectedPaymentOption);
	const guideFee = useStore((state) => state.guideFee);
	const carFee = useStore((state) => state.carFee);
	const entryFees = useStore((state) => state.entryFees);
	const subtotal = useStore((state) => state.subtotal);
	const totalCost = useStore((state) => state.totalCost);
	const timeline = useStore((state) => state.timeline);
	const calculateTotal = useStore((state) => state.calculateTotal);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	useEffect(() => {
		setCurrentPage("/booking-details");
		calculateTotal();
	}, [calculateTotal, setCurrentPage]);

	const destinationModels = useMemo(() => selectedDestinations.map((id) => destinations.find((destination) => destination.id === id)).filter(Boolean), [selectedDestinations]);
	const guide = useMemo(() => guides.find((item) => item.id === selectedGuide) ?? null, [selectedGuide]);
	const car = useMemo(() => carRentals.find((item) => item.id === selectedCar) ?? null, [selectedCar]);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_18%,#f8fafc_100%)] pb-52 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Booking Details"
					title="Review Your Trip"
				/>

				<div className="mt-5 space-y-4">
					<Card className="overflow-hidden p-5">
						<div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
							<Ticket
								size={18}
								className="text-brand"
							/>{" "}
							Booking Summary
						</div>
						<div className="space-y-4">
							<div>
								<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Destinations</div>
								<div className="mt-2 flex flex-wrap gap-2">
									{destinationModels.map((destination) => (
										<Badge
											key={destination.id}
											tone="brand">
											{destination.name}
										</Badge>
									))}
								</div>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<div className="rounded-3xl bg-slate-50 p-4">
									<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Guide</div>
									<div className="mt-2 text-lg font-bold text-slate-900">{guide?.name ?? "Not selected"}</div>
									<div className="mt-1 text-sm text-slate-500">{guide ? formatIDR(guide.dailyRate) : "-"}</div>
								</div>
								<div className="rounded-3xl bg-slate-50 p-4">
									<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Transport</div>
									<div className="mt-2 text-lg font-bold text-slate-900">{car ? car.label : "Kendaraan dari guide"}</div>
									<div className="mt-1 text-sm text-slate-500">{car ? formatIDR(car.dailyRate) : "Included"}</div>
								</div>
							</div>
						</div>
					</Card>

					<Card className="p-5">
						<div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-900">
							<MapPinned
								size={18}
								className="text-brand"
							/>{" "}
							Timeline
						</div>
						<div className="space-y-2 rounded-[24px] bg-slate-50 p-4">
							{timeline.map((step, index) => (
								<TimelineStep
									key={`${step.name}-${step.scheduledTime}`}
									step={step}
									active={index === 0}
									last={index === timeline.length - 1}
								/>
							))}
						</div>
					</Card>

					<Card className="p-5">
						<div className="mb-4 text-lg font-bold text-slate-900">Cost Breakdown</div>
						<div className="space-y-3 text-sm">
							<div className="flex items-center justify-between text-slate-600">
								<span>Guide fee</span>
								<span>{formatIDR(guideFee)}</span>
							</div>
							<div className="flex items-center justify-between text-slate-600">
								<span>Car fee</span>
								<span>{car ? formatIDR(carFee) : "—"}</span>
							</div>
							<div className="flex items-center justify-between text-slate-600">
								<span>Entry fees</span>
								<span>{formatIDR(entryFees.reduce((sum, item) => sum + item.amount, 0))}</span>
							</div>
							<div className="flex items-center justify-between border-t border-slate-200 pt-3 text-slate-600">
								<span>Subtotal</span>
								<span>{formatIDR(subtotal)}</span>
							</div>
							<div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-black text-slate-900">
								<span>Total</span>
								<span>{formatIDR(totalCost)}</span>
							</div>
						</div>
					</Card>
				</div>
			</div>

			<BottomActionBar>
				<div className="space-y-3">
					<div className="grid gap-2 rounded-3xl bg-brandSoft p-4 text-sm text-slate-700 sm:grid-cols-2">
						<div className="flex items-center gap-2">
							<Users
								size={16}
								className="text-brand"
							/>{" "}
							Verified Local Guides
						</div>
						<div className="flex items-center gap-2">
							<Ticket
								size={16}
								className="text-brand"
							/>{" "}
							Transparent pricing
						</div>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							className="flex-1 py-4"
							onClick={() => navigate("/car-selection")}>
							Back
						</Button>
						<Button
							className="flex-1 py-4"
							disabled={!selectedPaymentOption}
							onClick={() => navigate("/payment-options")}>
							Continue
						</Button>
					</div>
				</div>
			</BottomActionBar>
		</div>
	);
}
