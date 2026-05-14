import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui";
import { useTranslation } from "../i18n/LanguageContext";
import { useStore } from "../store/useStore";
import { useBooking } from "../context/BookingContext";
import { formatIDR } from "../utils/batour";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^\+?[0-9\s\-()]{10,}$/.test(phone);

export default function ComprehensiveCheckoutPage() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { setCurrentPage } = useStore();
	const { tripParams, clientInfo, setClientInfo, packageInfo, setPackageInfo, getTotalDays, getTotalPax, isBookingComplete } = useBooking();

	// Form state
	const [fullName, setFullName] = useState(clientInfo.fullName || "");
	const [email, setEmail] = useState(clientInfo.email || "");
	const [phoneNumber, setPhoneNumber] = useState(clientInfo.phoneNumber || "");
	const [specialRequests, setSpecialRequests] = useState(clientInfo.specialRequests || "");

	// Validation state
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	// Guard against unauthorized access
	useEffect(() => {
		setCurrentPage("/checkout");
		if (!tripParams.startDate || !tripParams.endDate) {
			navigate("/trip-setup");
		}
	}, [setCurrentPage, tripParams, navigate]);

	const validateField = (fieldName, value) => {
		const newErrors = { ...errors };
		delete newErrors[fieldName];

		switch (fieldName) {
			case "fullName":
				if (!value.trim()) {
					newErrors.fullName = t("checkout.errors.fullNameRequired", "Full name is required");
				} else if (value.trim().length < 3) {
					newErrors.fullName = t("checkout.errors.fullNameMinLength", "Name must be at least 3 characters");
				}
				break;
			case "email":
				if (!value.trim()) {
					newErrors.email = t("checkout.errors.emailRequired", "Email is required");
				} else if (!validateEmail(value)) {
					newErrors.email = t("checkout.errors.invalidEmail", "Please enter a valid email address");
				}
				break;
			case "phoneNumber":
				if (!value.trim()) {
					newErrors.phoneNumber = t("checkout.errors.phoneRequired", "Phone number is required");
				} else if (!validatePhone(value)) {
					newErrors.phoneNumber = t("checkout.errors.invalidPhone", "Please enter a valid phone number");
				}
				break;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleFieldBlur = (fieldName, value) => {
		setTouched((prev) => ({ ...prev, [fieldName]: true }));
		validateField(fieldName, value);
	};

	const validateAllFields = () => {
		const fieldValidations = [
			["fullName", fullName],
			["email", email],
			["phoneNumber", phoneNumber],
		];

		let isValid = true;
		const newErrors = {};

		for (const [fieldName, value] of fieldValidations) {
			if (!validateField(fieldName, value)) {
				isValid = false;
				newErrors[fieldName] = errors[fieldName] || "Invalid field";
			}
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleProceedToPayment = () => {
		if (validateAllFields()) {
			setClientInfo({
				fullName,
				email,
				phoneNumber,
				specialRequests,
			});

			setIsLoading(true);
			setTimeout(() => {
				const newBookingId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
				navigate("/payment-success", { state: { bookingId: newBookingId } });
			}, 1500);
		}
	};

	const totalDays = getTotalDays();
	const totalPax = getTotalPax();
	const startDateObj = tripParams.startDate ? new Date(tripParams.startDate) : null;
	const endDateObj = tripParams.endDate ? new Date(tripParams.endDate) : null;

	// Calculate sample pricing (replace with actual package pricing)
	const basePricePerDay = 500000; // Rp 500k per day per person
	const totalPrice = basePricePerDay * totalDays * totalPax;
	const taxRate = 0.1; // 10% tax
	const tax = Math.round(totalPrice * taxRate);
	const finalTotal = totalPrice + tax;

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<img
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1634&auto=format&fit=crop"
				alt="Background"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.2)_40%,rgba(15,23,42,0.9)_82%,rgba(15,23,42,0.98)_100%)]" />

			<div className="relative flex min-h-screen flex-col px-5 py-6">
				{/* Header */}
				<div className="mb-6 flex items-center justify-between">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-white/80 transition-colors hover:text-white">
						<ChevronLeft size={20} />
						<span className="text-sm">{t("checkout.back", "Back")}</span>
					</button>
					<h1 className="text-lg font-bold">{t("checkout.title", "Checkout")}</h1>
					<div className="w-8" />
				</div>

				<div className="space-y-6 pb-8">
					{/* Trip Summary Card */}
					<div className="rounded-[24px] bg-white/6 p-5 backdrop-blur-sm">
						<h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">{t("checkout.tripSummary", "Trip Summary")}</h2>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm text-white/70">{t("checkout.travelDates", "Travel Dates")}</span>
								<span className="text-sm font-medium">{startDateObj && endDateObj ? `${startDateObj.toLocaleDateString("id-ID")} - ${endDateObj.toLocaleDateString("id-ID")}` : "—"}</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-sm text-white/70">{t("checkout.duration", "Duration")}</span>
								<span className="text-sm font-medium">
									{totalDays} {t("checkout.days", "days")}
								</span>
							</div>
							<div className="flex items-center justify-between border-t border-white/10 pt-3">
								<span className="text-sm text-white/70">{t("checkout.participants", "Participants")}</span>
								<span className="text-sm font-medium">
									{tripParams.adults} {t("checkout.adults", "adults")}
									{tripParams.children > 0 && `, ${tripParams.children} ${t("checkout.children", "children")}`}
								</span>
							</div>
						</div>
					</div>

					{/* Client Information Form */}
					<div className="rounded-[24px] bg-white/6 p-5 backdrop-blur-sm">
						<h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">{t("checkout.clientInfo", "Your Information")}</h2>

						<div className="space-y-4">
							{/* Full Name */}
							<div className="space-y-2">
								<label className="block text-xs uppercase tracking-widest text-white/60">{t("checkout.fullName", "Full Name")} *</label>
								<input
									type="text"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									onBlur={() => handleFieldBlur("fullName", fullName)}
									placeholder={t("checkout.fullNamePlaceholder", "e.g., Budi Santoso")}
									className={`w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 ${touched.fullName && errors.fullName ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
								/>
								{touched.fullName && errors.fullName && (
									<p className="flex items-center gap-1 text-xs text-red-400">
										<AlertCircle size={14} /> {errors.fullName}
									</p>
								)}
							</div>

							{/* Email */}
							<div className="space-y-2">
								<label className="block text-xs uppercase tracking-widest text-white/60">{t("checkout.email", "Email Address")} *</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onBlur={() => handleFieldBlur("email", email)}
									placeholder={t("checkout.emailPlaceholder", "budi@example.com")}
									className={`w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 ${touched.email && errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
								/>
								{touched.email && errors.email && (
									<p className="flex items-center gap-1 text-xs text-red-400">
										<AlertCircle size={14} /> {errors.email}
									</p>
								)}
							</div>

							{/* Phone Number */}
							<div className="space-y-2">
								<label className="block text-xs uppercase tracking-widest text-white/60">{t("checkout.phone", "Phone Number")} *</label>
								<input
									type="tel"
									value={phoneNumber}
									onChange={(e) => setPhoneNumber(e.target.value)}
									onBlur={() => handleFieldBlur("phoneNumber", phoneNumber)}
									placeholder={t("checkout.phonePlaceholder", "+62 812 3456 7890")}
									className={`w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 ${touched.phoneNumber && errors.phoneNumber ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
								/>
								{touched.phoneNumber && errors.phoneNumber && (
									<p className="flex items-center gap-1 text-xs text-red-400">
										<AlertCircle size={14} /> {errors.phoneNumber}
									</p>
								)}
							</div>

							{/* Special Requests */}
							<div className="space-y-2">
								<label className="block text-xs uppercase tracking-widest text-white/60">
									{t("checkout.specialRequests", "Special Requests")} {t("checkout.optional", "(Optional)")}
								</label>
								<textarea
									value={specialRequests}
									onChange={(e) => setSpecialRequests(e.target.value)}
									placeholder={t("checkout.specialRequestsPlaceholder", "Dietary restrictions, accessibility needs, etc.")}
									rows="3"
									className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Pricing Breakdown Card */}
					<div className="rounded-[24px] bg-white/6 p-5 backdrop-blur-sm">
						<h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">{t("checkout.pricingBreakdown", "Pricing Breakdown")}</h2>

						<div className="space-y-3">
							{/* Base Price */}
							<div className="flex items-center justify-between">
								<span className="text-sm text-white/70">
									{t("checkout.basePrice", "Base Price")} ({totalDays} {t("checkout.days", "days")} × {totalPax} {t("checkout.pax", "pax")})
								</span>
								<span className="text-sm font-medium">{formatIDR(basePricePerDay * totalDays * totalPax)}</span>
							</div>

							{/* Subtotal */}
							<div className="flex items-center justify-between border-t border-white/10 pt-3">
								<span className="text-sm text-white/70">{t("checkout.subtotal", "Subtotal")}</span>
								<span className="text-sm font-medium">{formatIDR(totalPrice)}</span>
							</div>

							{/* Tax */}
							<div className="flex items-center justify-between">
								<span className="text-sm text-white/70">{t("checkout.tax", "Tax")} (10%)</span>
								<span className="text-sm font-medium">{formatIDR(tax)}</span>
							</div>

							{/* Total */}
							<div className="flex items-center justify-between border-t border-white/10 pt-3">
								<span className="text-base font-bold text-white">{t("checkout.totalPrice", "Total Price")}</span>
								<span className="text-2xl font-bold text-green-400">{formatIDR(finalTotal)}</span>
							</div>
						</div>
					</div>

					{/* Terms & Conditions */}
					<div className="rounded-[24px] bg-blue-500/10 p-4 backdrop-blur-sm">
						<div className="flex gap-3">
							<CheckCircle2
								size={20}
								className="flex-shrink-0 text-blue-400"
							/>
							<p className="text-xs leading-relaxed text-blue-200">{t("checkout.termsConfirm", "By proceeding, you agree to our booking terms and cancellation policy. A confirmation email will be sent shortly.")}</p>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3">
						<Button
							className="w-full py-4 text-base"
							onClick={handleProceedToPayment}
							disabled={isLoading}>
							{isLoading ? (
								<span className="inline-flex items-center gap-2">
									<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
									{t("checkout.processing", "Processing...")}
								</span>
							) : (
								<>
									{t("checkout.proceedPayment", "Proceed to Payment")} <ArrowRight size={18} />
								</>
							)}
						</Button>
						<button
							onClick={() => navigate(-1)}
							disabled={isLoading}
							className="w-full rounded-lg bg-white/5 px-4 py-4 text-base font-semibold text-white/80 transition-colors hover:bg-white/10 disabled:opacity-50">
							{t("checkout.cancelBtn", "Cancel")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
