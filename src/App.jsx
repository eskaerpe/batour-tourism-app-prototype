import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import GuideSelectionPage from "./pages/GuideSelectionPage";
import CarSelectionPage from "./pages/CarSelectionPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import PaymentOptionsPage from "./pages/PaymentOptionsPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import CheckoutPage from "./pages/CheckoutPage";
import ActiveTripPage from "./pages/ActiveTripPage";
import { ensureDatabase, getSessionState, getUserPreferences } from "./lib/idb";
import { useStore } from "./store/useStore";

function PhoneFrame({ children }) {
	return <div className="w-full max-w-md mx-auto min-h-screen bg-gray-50 shadow-2xl relative overflow-x-hidden">{children}</div>;
}

function AppBootstrap() {
	const location = useLocation();
	const hasHydrated = useStore((state) => state.hasHydrated);
	const hydrateFromStorage = useStore((state) => state.hydrateFromStorage);
	const setHydrated = useStore((state) => state.setHydrated);
	const setOnline = useStore((state) => state.setOnline);

	useEffect(() => {
		void ensureDatabase();
		let cancelled = false;

		async function hydrate() {
			const [sessionState, userPreferences] = await Promise.all([getSessionState(), getUserPreferences()]);
			if (cancelled) {
				return;
			}
			hydrateFromStorage({ sessionState, userPreferences });
			setHydrated(true);
		}

		hydrate();

		const handleOnline = () => setOnline(true);
		const handleOffline = () => setOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			cancelled = true;
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [hydrateFromStorage, setHydrated, setOnline]);

	if (!hasHydrated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
				<div className="rounded-3xl bg-white px-5 py-4 text-sm font-medium shadow-lg">Loading BaTour…</div>
			</div>
		);
	}

	return null;
}

export default function App() {
	return (
		<PhoneFrame>
			<AppBootstrap />
			<Routes>
				<Route
					path="/"
					element={<LandingPage />}
				/>
				<Route
					path="/explore"
					element={<ExplorePage />}
				/>
				<Route
					path="/guide-selection"
					element={<GuideSelectionPage />}
				/>
				<Route
					path="/car-selection"
					element={<CarSelectionPage />}
				/>
				<Route
					path="/booking-details"
					element={<BookingDetailsPage />}
				/>
				<Route
					path="/payment-options"
					element={<PaymentOptionsPage />}
				/>
				<Route
					path="/confirmation"
					element={<ConfirmationPage />}
				/>
				<Route
					path="/checkout"
					element={<CheckoutPage />}
				/>
				<Route
					path="/active-trip/:bookingId"
					element={<ActiveTripPage />}
				/>
				<Route
					path="/build"
					element={
						<Navigate
							to="/booking-details"
							replace
						/>
					}
				/>
				<Route
					path="/build-itinerary"
					element={
						<Navigate
							to="/booking-details"
							replace
						/>
					}
				/>
				<Route
					path="*"
					element={
						<Navigate
							to="/"
							replace
						/>
					}
				/>
			</Routes>
		</PhoneFrame>
	);
}
