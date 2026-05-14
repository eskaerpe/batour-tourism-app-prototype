import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Home, Ticket, CheckCircle2 } from "lucide-react";
import { Button, Card, SectionTitle } from "../components/ui";
import { carRentals, destinations, guides } from "../data";
import { useStore } from "../store/useStore";
import { buildWhatsAppMessage, encodeWhatsAppUrl, formatIDR } from "../utils/batour";

export default function CheckoutPage() {
	const navigate = useNavigate();
	const currentBooking = useStore((state) => state.currentBooking);
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const selectedGuide = useStore((state) => state.selectedGuide);
	const selectedPaymentOption = useStore((state) => state.selectedPaymentOption);
	const generateBooking = useStore((state) => state.generateBooking);
	const setCurrentPage = useStore((state) => state.setCurrentPage);
	const [isGenerating, setIsGenerating] = useState(false);

	useEffect(() => {
		setCurrentPage("/checkout");
	}, [setCurrentPage]);

	useEffect(() => {
		let cancelled = false;

		async function createBookingIfNeeded() {
			if (currentBooking || isGenerating || !selectedPaymentOption || !selectedGuide || selectedDestinations.length === 0) {
				return;
			}

			setIsGenerating(true);
			try {
				const booking = await generateBooking();
				if (!cancelled && booking?.bookingId) {
					navigate(`/checkout?bookingId=${booking.bookingId}`, { replace: true });
				}
			} finally {
				if (!cancelled) {
					setIsGenerating(false);
				}
			}
		}

		createBookingIfNeeded();
		return () => {
			cancelled = true;
		};
	}, [currentBooking, generateBooking, isGenerating, navigate, selectedDestinations.length, selectedGuide, selectedPaymentOption]);

	const whatsappUrl = useMemo(() => {
		if (!currentBooking) {
			return null;
		}

		return encodeWhatsAppUrl(buildWhatsAppMessage(currentBooking, destinations, guides, carRentals), currentBooking.guidePhone ?? "6281234567890");
	}, [currentBooking]);

	if (!currentBooking) {
		return (
			<div className="min-h-screen bg-[linear-gradient(180deg,#fff,#fff7f1_36%,#f8fafc_100%)] pb-32 text-slate-900">
				<div className="px-5 pt-6">
					<SectionTitle
						eyebrow="Checkout"
						title={isGenerating ? "Menyiapkan booking..." : "Pesanan Anda Sedang Diproses"}
					/>
					<Card className="mt-5 p-5 text-sm text-slate-600">BaTour sedang menyiapkan booking reference dan handoff WhatsApp.</Card>
				</div>
			</div>
		);
	}

	async function copyBookingId() {
		await navigator.clipboard.writeText(currentBooking.bookingId);
	}

	function openWhatsApp() {
		if (whatsappUrl) {
			window.open(whatsappUrl, "_blank", "noopener,noreferrer");
		}
	}

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff,#fff7f1_36%,#f8fafc_100%)] pb-32 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Checkout"
					title="Pesanan Sudah Siap Dihandoff"
				/>

				<Card className="mt-5 p-5 text-center">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
						<CheckCircle2 size={32} />
					</div>
					<div className="mt-4 text-lg font-bold text-slate-900">Booking reference sudah dibuat</div>
					<p className="mt-2 text-sm leading-6 text-slate-500">Gunakan kode ini untuk trip offline dan lanjutkan koordinasi di WhatsApp.</p>
					<div className="mt-4 inline-flex items-center gap-2 rounded-full bg-brandSoft px-4 py-2 text-sm font-black text-brand">
						<Ticket size={16} /> {currentBooking.bookingId}
					</div>
				</Card>

				<Card className="mt-5 p-5">
					<div className="mb-3 text-lg font-bold text-slate-900">Trip Snapshot</div>
					<div className="space-y-3 text-sm text-slate-600">
						<div>
							<span className="font-semibold text-slate-900">Destinations:</span> {currentBooking.destinationNames.join(", ")}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Guide:</span> {currentBooking.guideName}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Payment:</span> {currentBooking.paymentOption}
						</div>
						<div>
							<span className="font-semibold text-slate-900">Total:</span> {formatIDR(currentBooking.totalCost)}
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
						onClick={openWhatsApp}>
						Buka WhatsApp
					</Button>
				</div>

				<Button
					variant="secondary"
					className="mt-3 w-full py-4"
					onClick={() => navigate(`/active-trip/${currentBooking.bookingId}`)}>
					Lihat Perjalanan Saya
				</Button>

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
