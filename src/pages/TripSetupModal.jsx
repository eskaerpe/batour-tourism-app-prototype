import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, X } from "lucide-react";
import { Button } from "../components/ui";
import { useTranslation } from "../i18n/LanguageContext";
import { useStore } from "../store/useStore";
import { useBooking } from "../context/BookingContext";

export default function TripSetupModal() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { setCurrentPage } = useStore();
	const { tripParams, setTripParams } = useBooking();

	const [startDate, setStartDate] = useState(tripParams.startDate || "");
	const [endDate, setEndDate] = useState(tripParams.endDate || "");
	const [adults, setAdults] = useState(tripParams.adults || 1);
	const [children, setChildren] = useState(tripParams.children || 0);
	const [errors, setErrors] = useState({});

	useEffect(() => {
		setCurrentPage("/trip-setup");
	}, [setCurrentPage]);

	const validateDates = () => {
		const newErrors = {};
		if (!startDate) {
			newErrors.startDate = t("tripSetup.errors.startDateRequired", "Start date is required");
		}
		if (!endDate) {
			newErrors.endDate = t("tripSetup.errors.endDateRequired", "End date is required");
		}
		if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
			newErrors.dateRange = t("tripSetup.errors.dateRange", "End date must be after start date");
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleProceed = () => {
		if (validateDates()) {
			setTripParams({
				startDate,
				endDate,
				adults,
				children,
			});
			navigate("/explore");
		}
	};

	const handleClose = () => {
		navigate("/");
	};

	const totalDays = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<img
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1634&auto=format&fit=crop"
				alt="Background"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.4)_0%,rgba(15,23,42,0.5)_50%,rgba(15,23,42,0.95)_100%)]" />

			<div className="relative flex min-h-screen flex-col items-center justify-center px-5">
				{/* Modal Card */}
				<div className="w-full max-w-sm space-y-6 rounded-[34px] bg-white/8 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-lg">
					{/* Close Button */}
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold">{t("tripSetup.title", "Plan Your Trip")}</h1>
						<button
							onClick={handleClose}
							className="rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
							aria-label="Close">
							<X size={20} />
						</button>
					</div>

					{/* Dates Section */}
					<div className="space-y-4">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("tripSetup.dates", "Travel Dates")}</h2>

						{/* Start Date */}
						<div className="space-y-2">
							<label className="block text-xs uppercase tracking-widest text-white/60">{t("tripSetup.startDate", "Start Date")}</label>
							<input
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{errors.startDate && <p className="text-xs text-red-400">{errors.startDate}</p>}
						</div>

						{/* End Date */}
						<div className="space-y-2">
							<label className="block text-xs uppercase tracking-widest text-white/60">{t("tripSetup.endDate", "End Date")}</label>
							<input
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								className="w-full rounded-lg bg-white/10 px-4 py-3 text-white placeholder-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							{errors.endDate && <p className="text-xs text-red-400">{errors.endDate}</p>}
						</div>

						{errors.dateRange && <p className="text-xs text-red-400">{errors.dateRange}</p>}

						{/* Days Display */}
						{totalDays > 0 && <p className="text-sm text-white/70">{t("tripSetup.duration", `${totalDays} days`)}</p>}
					</div>

					{/* Participants Section */}
					<div className="space-y-4 border-t border-white/10 pt-4">
						<h2 className="text-sm font-semibold uppercase tracking-wide text-white/80">{t("tripSetup.participants", "Participants")}</h2>

						{/* Adults */}
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">{t("tripSetup.adults", "Adults")}</p>
								<p className="text-xs text-white/60">{t("tripSetup.adultAge", "Age 18+")}</p>
							</div>
							<div className="flex items-center gap-3">
								<button
									onClick={() => setAdults(Math.max(1, adults - 1))}
									className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
									<Minus size={16} />
								</button>
								<span className="w-6 text-center font-semibold">{adults}</span>
								<button
									onClick={() => setAdults(adults + 1)}
									className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
									<Plus size={16} />
								</button>
							</div>
						</div>

						{/* Children */}
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium">{t("tripSetup.children", "Children")}</p>
								<p className="text-xs text-white/60">{t("tripSetup.childAge", "Age 0-17")}</p>
							</div>
							<div className="flex items-center gap-3">
								<button
									onClick={() => setChildren(Math.max(0, children - 1))}
									className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
									<Minus size={16} />
								</button>
								<span className="w-6 text-center font-semibold">{children}</span>
								<button
									onClick={() => setChildren(children + 1)}
									className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
									<Plus size={16} />
								</button>
							</div>
						</div>

						{/* Total Participants */}
						<div className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3">
							<span className="text-sm text-white/80">{t("tripSetup.totalPax", "Total Participants")}</span>
							<span className="font-semibold">{adults + children}</span>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="space-y-3 border-t border-white/10 pt-4">
						<Button
							className="w-full py-3 text-base"
							onClick={handleProceed}>
							{t("tripSetup.continueBtn", "Continue to Explore")} <ArrowRight size={18} />
						</Button>
						<button
							onClick={handleClose}
							className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10">
							{t("tripSetup.cancelBtn", "Cancel")}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
