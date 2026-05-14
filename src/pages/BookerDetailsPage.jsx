import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "../components/ui";
import { useTranslation } from "../i18n/LanguageContext";
import { useStore } from "../store/useStore";
import { useBooking } from "../context/BookingContext";
import { formatIDR } from "../utils/batour";

export default function BookerDetailsPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { setCurrentPage, selectedDestinations, selectedGuide, selectedCar, totalCost } = useStore();
	const { tripParams, bookerDetails, setBookerDetails } = useBooking();

	const [fullName, setFullName] = useState(bookerDetails.fullName || "");
	const [email, setEmail] = useState(bookerDetails.email || "");
	const [phoneNumber, setPhoneNumber] = useState(bookerDetails.phoneNumber || "");
	const [specialRequests, setSpecialRequests] = useState(bookerDetails.specialRequests || "");
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setCurrentPage("/booker-details");
	}, [setCurrentPage]);

	const validateForm = () => {
		const newErrors = {};
		if (!fullName.trim()) {
			newErrors.fullName = t("bookerDetails.errors.fullNameRequired", "Full name is required");
		}
		if (!email.trim()) {
			newErrors.email = t("bookerDetails.errors.emailRequired", "Email is required");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = t("bookerDetails.errors.invalidEmail", "Please enter a valid email");
		}
		if (!phoneNumber.trim()) {
			newErrors.phoneNumber = t("bookerDetails.errors.phoneRequired", "Phone number is required");
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			setBookerDetails({
				fullName,
				email,
				phoneNumber,
				specialRequests,
			});
			setIsLoading(true);
			// Simulate payment processing
			setTimeout(() => {
				const newBookingId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
				navigate("/payment-success", { state: { bookingId: newBookingId } });
			}, 1500);
		}
	};

	const startDateObj = tripParams.startDate ? new Date(tripParams.startDate) : null;
	const endDateObj = tripParams.endDate ? new Date(tripParams.endDate) : null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-5 py-6 text-white">
			{/* Header */}
			<div className="mb-6 flex items-center justify-between">
				<button
					onClick={() => navigate(-1)}
					className="flex items-center gap-2 text-white/80 transition-colors hover:text-white">
					<ChevronLeft size={20} />
					<span className="text-sm">{t("bookerDetails.back", "Back")}</span>
				</button>
				<h1 className="text-lg font-bold">{t("bookerDetails.title", "Booking Details")}</h1>
				<div className="w-8" />
			</div>

			<div className="space-y-6">
				{/* Booker Information Section */}
				<div className="space-y-4 rounded-[24px] bg-white/6 p-5 backdrop-blur-sm">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("bookerDetails.bookerInfo", "Booker Information")}</h2>

					{/* Full Name */}
					<div className="space-y-2">
						<label className="block text-xs uppercase tracking-widest text-white/60">{t("bookerDetails.fullName", "Full Name")}</label>
						<input
							type="text"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder={t("bookerDetails.fullNamePlaceholder", "John Doe")}
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.fullName && <p className="text-xs text-red-400">{errors.fullName}</p>}
					</div>

					{/* Email */}
					<div className="space-y-2">
						<label className="block text-xs uppercase tracking-widest text-white/60">{t("bookerDetails.email", "Email Address")}</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder={t("bookerDetails.emailPlaceholder", "john@example.com")}
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
					</div>

					{/* Phone Number */}
					<div className="space-y-2">
						<label className="block text-xs uppercase tracking-widest text-white/60">{t("bookerDetails.phone", "Phone Number")}</label>
						<input
							type="tel"
							value={phoneNumber}
							onChange={(e) => setPhoneNumber(e.target.value)}
							placeholder={t("bookerDetails.phonePlaceholder", "+62 812 3456 7890")}
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						{errors.phoneNumber && <p className="text-xs text-red-400">{errors.phoneNumber}</p>}
					</div>

					{/* Special Requests */}
					<div className="space-y-2">
						<label className="block text-xs uppercase tracking-widest text-white/60">{t("bookerDetails.specialRequests", "Special Requests (Optional)")}</label>
						<textarea
							value={specialRequests}
							onChange={(e) => setSpecialRequests(e.target.value)}
							placeholder={t("bookerDetails.specialRequestsPlaceholder", "Any special dietary needs or preferences...")}
							rows="3"
							className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				{/* Booking Summary */}
				<div className="space-y-4 rounded-[24px] bg-white/6 p-5 backdrop-blur-sm">
					<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("bookerDetails.summary", "Booking Summary")}</h2>

					{/* Trip Dates */}
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<span className="text-sm text-white/70">{t("bookerDetails.dates", "Travel Dates")}</span>
						<span className="text-sm font-medium">{startDateObj && endDateObj ? `${startDateObj.toLocaleDateString()} - ${endDateObj.toLocaleDateString()}` : "—"}</span>
					</div>

					{/* Participants */}
					<div className="flex items-center justify-between border-b border-white/10 pb-3">
						<span className="text-sm text-white/70">{t("bookerDetails.participants", "Participants")}</span>
						<span className="text-sm font-medium">
							{tripParams.adults} {t("bookerDetails.adults", "adults")}
							{tripParams.children > 0 && `, ${tripParams.children} ${t("bookerDetails.children", "children")}`}
						</span>
					</div>

					{/* Total Price */}
					<div className="flex items-center justify-between border-t border-white/10 pt-3">
						<span className="text-base font-semibold text-white/80">{t("bookerDetails.totalPrice", "Total Price")}</span>
						<span className="text-lg font-bold text-blue-400">{formatIDR(totalCost)}</span>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-3 pb-4">
					<Button
						className="w-full py-4 text-base"
						onClick={handleSubmit}
						disabled={isLoading}>
						{isLoading ? (
							<span className="inline-flex items-center gap-2">
								<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
								{t("bookerDetails.processing", "Processing...")}
							</span>
						) : (
							<>
								{t("bookerDetails.proceedPayment", "Proceed to Payment")} <ArrowRight size={18} />
							</>
						)}
					</Button>
					<button
						onClick={() => navigate(-1)}
						disabled={isLoading}
						className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50">
						{t("bookerDetails.cancelBtn", "Cancel")}
					</button>
				</div>
			</div>
		</div>
	);
}
