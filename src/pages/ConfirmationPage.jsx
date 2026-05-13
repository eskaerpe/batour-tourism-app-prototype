import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Send } from "lucide-react";
import { BottomActionBar, Badge, Button, Card, OfflineIndicator, SectionTitle } from "../components/ui";
import { carRentals, destinations, guides } from "../data";
import { buildWhatsAppMessage, encodeWhatsAppUrl, formatIDR } from "../utils/batour";
import { useStore } from "../store/useStore";

export default function ConfirmationPage() {
	const navigate = useNavigate();
	const isOnline = useStore((state) => state.isOnline);
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const selectedGuide = useStore((state) => state.selectedGuide);
	const selectedCar = useStore((state) => state.selectedCar);
	const needsCar = useStore((state) => state.needsCar);
	const selectedPaymentOption = useStore((state) => state.selectedPaymentOption);
	const guideFee = useStore((state) => state.guideFee);
	const carFee = useStore((state) => state.carFee);
	const entryFees = useStore((state) => state.entryFees);
	const totalCost = useStore((state) => state.totalCost);
	const generateBooking = useStore((state) => state.generateBooking);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setCurrentPage("/confirmation");
	}, [setCurrentPage]);

	const destinationModels = useMemo(() => selectedDestinations.map((id) => destinations.find((destination) => destination.id === id)).filter(Boolean), [selectedDestinations]);
	const guide = useMemo(() => guides.find((item) => item.id === selectedGuide) ?? null, [selectedGuide]);
	const car = useMemo(() => carRentals.find((item) => item.id === selectedCar) ?? null, [selectedCar]);

	async function handleWhatsAppHandoff() {
		if (!isOnline || isSubmitting || !selectedPaymentOption || !selectedGuide || selectedDestinations.length === 0) {
			return;
		}

		setIsSubmitting(true);
		const booking = await generateBooking();
		booking.whatsappMessageSent = true;
		const whatsappMessage = buildWhatsAppMessage(booking);
		window.open(encodeWhatsAppUrl(whatsappMessage), "_blank", "noopener,noreferrer");
		navigate(`/checkout?bookingId=${booking.bookingId}`, { replace: true });
	}

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_18%,#f8fafc_100%)] pb-52 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Final Review"
					title="Confirm Before WhatsApp"
					action={<OfflineIndicator isOffline={!isOnline} />}
				/>

				<Card className="mt-5 p-5">
					<div className="flex items-center gap-2 text-lg font-bold text-slate-900">
						<BadgeCheck
							size={18}
							className="text-brand"
						/>{" "}
						Trip Summary
					</div>
					<div className="mt-4 space-y-4 text-sm text-slate-600">
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
								<div className="mt-2 text-lg font-bold text-slate-900">{guide?.name ?? "-"}</div>
								<div className="mt-1 text-sm text-slate-500">{guide ? formatIDR(guide.dailyRate) : "-"}</div>
							</div>
							<div className="rounded-3xl bg-slate-50 p-4">
								<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Transport</div>
								<div className="mt-2 text-lg font-bold text-slate-900">{needsCar ? (car?.label ?? "Car") : "Kendaraan dari guide"}</div>
								<div className="mt-1 text-sm text-slate-500">{needsCar ? formatIDR(carFee) : "Included"}</div>
							</div>
						</div>

						<div className="rounded-3xl bg-brandSoft p-4">
							<div className="text-xs uppercase tracking-[0.2em] text-brand/70">Payment plan</div>
							<div className="mt-2 text-lg font-bold text-slate-900">{selectedPaymentOption === "DP_50" ? "DP 50%" : "Full Payment"}</div>
						</div>
					</div>
				</Card>

				<Card className="mt-5 p-5">
					<div className="mb-4 text-lg font-bold text-slate-900">Cost Summary</div>
					<div className="space-y-3 text-sm text-slate-600">
						<div className="flex items-center justify-between">
							<span>Guide fee</span>
							<span>{formatIDR(guideFee)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Car fee</span>
							<span>{needsCar ? formatIDR(carFee) : "—"}</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Entry fees</span>
							<span>{formatIDR(entryFees.reduce((sum, item) => sum + item.amount, 0))}</span>
						</div>
						<div className="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-black text-slate-900">
							<span>Total</span>
							<span>{formatIDR(totalCost)}</span>
						</div>
					</div>
				</Card>
			</div>

			<BottomActionBar>
				<Button
					className="w-full py-4 text-base"
					disabled={!isOnline || isSubmitting || !selectedPaymentOption}
					onClick={handleWhatsAppHandoff}>
					{isSubmitting ? (
						"Sending..."
					) : (
						<>
							<Send size={18} /> Selesaikan Pemesanan via WhatsApp
						</>
					)}
				</Button>
				<p className="mt-3 text-center text-xs text-slate-500">Kamu akan diarahkan ke WhatsApp untuk handoff pembayaran.</p>
			</BottomActionBar>
		</div>
	);
}
