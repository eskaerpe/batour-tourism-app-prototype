import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Home, FileText } from "lucide-react";
import { Button } from "../components/ui";
import { useTranslation } from "../i18n/LanguageContext";
import { destinations } from "../data";
import { useStore } from "../store/useStore";
import { useBooking } from "../context/BookingContext";

export default function PaymentSuccessPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const { setCurrentPage } = useStore();
	const { clearBooking, tripParams, packageInfo, getTotalDays, getTotalPax } = useBooking();
	const [showItinerarySummary, setShowItinerarySummary] = useState(false);
	const destinationIds = selectedDestinations.length ? selectedDestinations : (packageInfo.selectedDestinations ?? []);
	const destinationModels = useMemo(() => destinationIds.map((id) => destinations.find((destination) => destination.id === id)).filter(Boolean), [destinationIds]);

	const bookingId = location.state?.bookingId || `BT-${Date.now()}`;

	useEffect(() => {
		setCurrentPage("/payment-success");
	}, [setCurrentPage]);

	const handleBackHome = () => {
		clearBooking();
		navigate("/", { replace: true });
	};

	const handleViewItinerary = () => {
		setShowItinerarySummary((current) => !current);
	};

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<img
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1634&auto=format&fit=crop"
				alt="Background"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.2)_40%,rgba(15,23,42,0.9)_82%,rgba(15,23,42,0.98)_100%)]" />

			<div className="relative flex min-h-screen flex-col items-center justify-center space-y-6 px-5 py-6">
				{/* Success Illustration */}
				<div className="relative mb-4">
					<div className="absolute inset-0 -z-10 h-24 w-24 rounded-full bg-green-500/20 blur-2xl" />
					<div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500/30 to-green-600/20 backdrop-blur-sm">
						<CheckCircle2
							size={56}
							className="text-green-400"
						/>
					</div>
				</div>

				{/* Success Message */}
				<div className="text-center space-y-2">
					<h1 className="text-3xl font-black">{t("paymentSuccess.title", "Booking Confirmed!")}</h1>
					<p className="text-white/70">{t("paymentSuccess.subtitle", "Your trip is all set. Get ready for an amazing adventure!")}</p>
				</div>

				{/* Booking ID Card */}
				<div className="w-full max-w-sm space-y-4 rounded-[24px] bg-white/6 p-6 backdrop-blur-md">
					<div className="space-y-2 text-center">
						<p className="text-xs uppercase tracking-widest text-white/60">{t("paymentSuccess.bookingIdLabel", "Booking Reference")}</p>
						<p className="font-mono text-2xl font-bold text-blue-200">{bookingId}</p>
					</div>

					{/* Copy Button */}
					<button
						onClick={() => {
							navigator.clipboard.writeText(bookingId);
							alert(t("paymentSuccess.copied", "Booking ID copied to clipboard!"));
						}}
						className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/20">
						{t("paymentSuccess.copyButton", "Copy Booking ID")}
					</button>
				</div>

				{/* Confirmation Details */}
				<div className="w-full max-w-sm space-y-3 rounded-[24px] bg-white/6 p-6 backdrop-blur-sm">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("paymentSuccess.nextSteps", "What's Next?")}</h2>

					<div className="space-y-3">
						<div className="flex gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-400">1</div>
							<div>
								<p className="text-sm font-medium">{t("paymentSuccess.step1", "Review Your Itinerary")}</p>
								<p className="text-xs text-white/60">{t("paymentSuccess.step1Desc", "Check your travel dates and activities")}</p>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-400">2</div>
							<div>
								<p className="text-sm font-medium">{t("paymentSuccess.step2", "Confirm with Our Team")}</p>
								<p className="text-xs text-white/60">{t("paymentSuccess.step2Desc", "We'll reach out to finalize details")}</p>
							</div>
						</div>

						<div className="flex gap-3">
							<div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-400">3</div>
							<div>
								<p className="text-sm font-medium">{t("paymentSuccess.step3", "Meet Your Guide")}</p>
								<p className="text-xs text-white/60">{t("paymentSuccess.step3Desc", "Get ready for an unforgettable journey!")}</p>
							</div>
						</div>
					</div>
				</div>

				{showItinerarySummary && (
					<div className="w-full max-w-sm space-y-3 rounded-[24px] bg-white/6 p-6 backdrop-blur-sm">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">Your Selected Places</h2>
						<p className="text-xs leading-relaxed text-white/55">These are the places you picked before payment.</p>
						<div className="space-y-3">
							{destinationModels.length ? (
								destinationModels.map((destination, index) => (
									<div
										key={destination.id}
										className="rounded-2xl bg-white/5 p-4">
										<div className="flex items-start justify-between gap-3">
											<div>
												<div className="text-xs uppercase tracking-[0.2em] text-white/40">Stop {index + 1}</div>
												<div className="mt-1 font-semibold text-white">{destination.name}</div>
												<p className="mt-1 text-xs leading-5 text-white/60">{destination.shortDescription}</p>
											</div>
											<div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">{destination.zone}</div>
										</div>
									</div>
								))
							) : (
								<div className="rounded-2xl bg-white/5 p-4 text-sm text-white/60">No destinations were selected yet.</div>
							)}
						</div>
						<div className="rounded-2xl bg-white/5 p-3 text-xs text-white/60">
							<div className="mb-2 uppercase tracking-[0.2em] text-white/40">Trip at a glance</div>
							<p>
								{tripParams.startDate && tripParams.endDate ? `${tripParams.startDate} - ${tripParams.endDate}` : "Dates not set"} · {getTotalDays()} days · {getTotalPax()} pax
							</p>
						</div>
					</div>
				)}

				{/* Action Buttons */}
				<div className="w-full max-w-sm space-y-3">
					<Button
						className="w-full py-4 text-base"
						onClick={handleViewItinerary}>
						<FileText size={18} />
						{showItinerarySummary ? "Hide Itinerary Summary" : t("paymentSuccess.viewItinerary", "View Itinerary")}
					</Button>
					<button
						onClick={handleBackHome}
						className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-4 text-base font-semibold text-white/80 transition-colors hover:bg-white/10">
						<Home size={18} />
						{t("paymentSuccess.backHome", "Back to Home")}
					</button>
				</div>

				{/* Contact Support */}
				<div className="w-full max-w-sm text-center text-xs text-white/50">
					<p>{t("paymentSuccess.support", "Questions? Contact our support team anytime.")}</p>
				</div>
			</div>
		</div>
	);
}
