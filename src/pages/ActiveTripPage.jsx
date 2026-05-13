import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge, Button, Card, LoadingState, OfflineIndicator, SectionTitle, TimelineStep } from "../components/ui";
import { getBooking } from "../lib/idb";
import { carRentals, destinations, guides } from "../data";
import { formatIDR, timeStringToMinutes } from "../utils/batour";
import { useStore } from "../store/useStore";

export default function ActiveTripPage() {
	const { bookingId } = useParams();
	const isOnline = useStore((state) => state.isOnline);
	const setCurrentPage = useStore((state) => state.setCurrentPage);
	const [loading, setLoading] = useState(true);
	const [booking, setBooking] = useState(null);

	useEffect(() => {
		setCurrentPage(`/active-trip/${bookingId}`);
	}, [bookingId, setCurrentPage]);

	useEffect(() => {
		let cancelled = false;
		async function loadBooking() {
			const stored = await getBooking(bookingId);
			if (!cancelled) {
				setBooking(stored);
				setLoading(false);
			}
		}

		loadBooking();
		return () => {
			cancelled = true;
		};
	}, [bookingId]);

	const guide = useMemo(() => guides.find((item) => item.id === booking?.guideId) ?? null, [booking]);
	const car = useMemo(() => carRentals.find((item) => item.id === booking?.carId) ?? null, [booking]);
	const destinationNames = useMemo(() => booking?.destinationIds.map((id) => destinations.find((destination) => destination.id === id)?.name).filter(Boolean) ?? [], [booking]);
	const activeStepIndex = useMemo(() => {
		if (!booking?.timeline?.length) return 0;
		const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
		let currentIndex = 0;
		booking.timeline.forEach((step, index) => {
			if (timeStringToMinutes(step.scheduledTime) <= nowMinutes) {
				currentIndex = index;
			}
		});
		return currentIndex;
	}, [booking]);

	if (loading) {
		return (
			<div className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900">
				<LoadingState label="Loading offline trip..." />
			</div>
		);
	}

	if (!booking) {
		return (
			<div className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900">
				<SectionTitle
					eyebrow="Offline Trip"
					title="Trip tidak ditemukan"
					action={<OfflineIndicator isOffline={!isOnline} />}
				/>
				<Card className="mt-5 p-5 text-sm text-slate-600">Booking ini tidak ada di penyimpanan lokal. Hubungi support BaTour untuk bantuan.</Card>
				<div className="mt-4 flex gap-3">
					<Button
						className="flex-1"
						onClick={() => window.open("https://wa.me/6281234567890", "_blank", "noopener,noreferrer")}>
						Hubungi WhatsApp
					</Button>
					<Button
						variant="secondary"
						className="flex-1"
						onClick={() => window.history.back()}>
						Kembali
					</Button>
				</div>
			</div>
		);
	}

	const bookingQrValue = btoa(booking.bookingId);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_18%,#f8fafc_100%)] pb-32 text-slate-900">
			<div className="px-5 pt-6">
				<SectionTitle
					eyebrow="Active Trip"
					title="Your Offline Travel Pass"
					action={<OfflineIndicator isOffline={!isOnline} />}
				/>

				<Card className="mt-5 overflow-hidden p-5">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Trip summary</div>
							<div className="mt-2 text-xl font-black text-slate-900">{guide?.name ?? "Guide"}</div>
							<div className="mt-1 text-sm text-slate-500">{car ? car.label : "Kendaraan guide"}</div>
						</div>
						<div className="rounded-full bg-brandSoft px-3 py-2 text-xs font-bold text-brand">{booking.bookingId}</div>
					</div>
					<div className="mt-4 flex flex-wrap gap-2">
						{destinationNames.map((name) => (
							<Badge
								key={name}
								tone="brand">
								{name}
							</Badge>
						))}
					</div>
				</Card>

				<div className="mt-5 grid gap-4">
					<Card className="p-5">
						<div className="mb-4 text-lg font-bold text-slate-900">Guide Contact</div>
						<div className="flex items-start gap-4">
							<img
								src={guide?.photo ?? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"}
								alt={guide?.photoAlt ?? guide?.name ?? "Guide"}
								className="h-20 w-20 rounded-3xl object-cover"
							/>
							<div className="min-w-0 flex-1">
								<div className="font-bold text-slate-900">{guide?.name ?? "-"}</div>
								<p className="mt-2 text-sm leading-6 text-slate-600">{guide?.bio}</p>
								<div className="mt-4 flex flex-wrap gap-3">
									<Button
										variant="secondary"
										onClick={() => window.open(`https://wa.me/${guide?.whatsappNumber ?? "6281234567890"}`, "_blank", "noopener,noreferrer")}>
										<MessageCircle size={16} /> Chat di WhatsApp
									</Button>
									<Button
										variant="secondary"
										onClick={() => (window.location.href = `tel:${guide?.phone ?? "6281234567890"}`)}>
										<Phone size={16} /> Telepon Darurat
									</Button>
								</div>
							</div>
						</div>
					</Card>

					<Card className="p-5">
						<div className="mb-4 text-lg font-bold text-slate-900">QR Ticket</div>
						<div className="rounded-[24px] bg-white p-4 text-center ring-1 ring-slate-100">
							<div className="mx-auto w-fit rounded-3xl bg-brandSoft p-4">
								<QRCodeSVG
									value={bookingQrValue}
									size={180}
									bgColor="#ffffff"
									fgColor="#1f2937"
									includeMargin={false}
								/>
							</div>
							<div className="mt-4 text-sm font-semibold text-slate-600">{booking.bookingId}</div>
						</div>
					</Card>

					<Card className="p-5">
						<div className="mb-4 text-lg font-bold text-slate-900">Interactive Timeline</div>
						<div className="space-y-2 rounded-[24px] bg-slate-50 p-4">
							{booking.timeline.map((step, index) => (
								<TimelineStep
									key={`${step.name}-${step.scheduledTime}`}
									step={step}
									active={index === activeStepIndex}
									last={index === booking.timeline.length - 1}
								/>
							))}
						</div>
					</Card>

					<Card className="p-5">
						<div className="flex items-center gap-2 text-lg font-bold text-slate-900">
							<MapPinned
								size={18}
								className="text-brand"
							/>{" "}
							Route Summary
						</div>
						<div className="mt-4 space-y-3 text-sm text-slate-600">
							<div>
								<span className="font-semibold text-slate-900">Destinations:</span> {destinationNames.join(", ")}
							</div>
							<div>
								<span className="font-semibold text-slate-900">Payment:</span> {booking.paymentOption}
							</div>
							<div>
								<span className="font-semibold text-slate-900">Total:</span> {formatIDR(booking.totalCost)}
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
