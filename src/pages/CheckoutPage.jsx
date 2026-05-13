import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Home, Ticket, CheckCircle2 } from "lucide-react";
import { Button, Card, SectionTitle } from "../components/ui";
import { useStore } from "../store/useStore";

export default function CheckoutPage() {
	const navigate = useNavigate();
	const currentBooking = useStore((state) => state.currentBooking);

	useEffect(() => {
		if (!currentBooking) {
			navigate("/confirmation", { replace: true });
		}
	}, [currentBooking, navigate]);

	if (!currentBooking) {
		return null;
	}

	async function copyBookingId() {
		await navigator.clipboard.writeText(currentBooking.bookingId);
	}

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff,#fff7f1_36%,#f8fafc_100%)] pb-32 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Confirmation"
					title="Pesanan Anda Telah Dikirim!"
				/>

				<Card className="mt-5 p-5 text-center">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
						<CheckCircle2 size={32} />
					</div>
					<div className="mt-4 text-lg font-bold text-slate-900">Check WhatsApp Anda untuk konfirmasi dari BaTour</div>
					<p className="mt-2 text-sm leading-6 text-slate-500">Booking reference ini juga bisa dipakai untuk membuka trip offline saat perjalanan.</p>
					<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brandSoft px-4 py-2 text-sm font-black text-brand">
						<Ticket size={16} /> {currentBooking.bookingId}
					</div>
				</Card>

				<Card className="mt-5 p-5">
					<div className="mb-3 text-lg font-bold text-slate-900">Trip Snapshot</div>
					<div className="space-y-3 text-sm text-slate-600">
						<div>
							<span className="font-semibold text-slate-900">Destinations:</span> {currentBooking.destinationIds.join(", ")}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Guide:</span> {currentBooking.guideId}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Payment:</span> {currentBooking.paymentOption}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Total:</span> {currentBooking.totalCost}
						</div>
					</div>
				</Card>

				<div className="mt-4 flex gap-3">
					<Button
						variant="secondary"
						className="flex-1 py-4"
						onClick={copyBookingId}>
						<Copy size={16} /> Copy ID
					</Button>
					<Button
						className="flex-1 py-4"
						onClick={() => navigate(`/active-trip/${currentBooking.bookingId}`)}>
						Buka Trip Saya
					</Button>
				</div>

				<Button
					variant="ghost"
					className="mt-3 w-full py-4"
					onClick={() => navigate("/")}>
					<Home size={16} /> Kembali ke Beranda
				</Button>
			</div>
		</div>
	);
}
