import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const BookingContext = createContext(null);

const STORAGE_KEY = "batour-booking-session";

function loadFromStorage() {
	if (typeof window === "undefined") {
		return null;
	}
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch (error) {
		console.warn("Failed to load booking session from storage:", error);
		return null;
	}
}

function saveToStorage(data) {
	if (typeof window === "undefined") {
		return;
	}
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.warn("Failed to save booking session to storage:", error);
	}
}

export function BookingProvider({ children }) {
	const [tripParams, setTripParamsState] = useState({
		startDate: null,
		endDate: null,
		adults: 1,
		children: 0,
	});

	const [clientInfo, setClientInfoState] = useState({
		fullName: "",
		email: "",
		phoneNumber: "",
		specialRequests: "",
	});

	const [packageInfo, setPackageInfoState] = useState({
		packageName: "",
		basePrice: 0,
		selectedDestinations: [],
		selectedGuide: null,
		selectedCar: null,
	});

	const [bookingId, setBookingIdState] = useState(null);
	const [isHydrated, setIsHydrated] = useState(false);

	// Hydrate from localStorage on mount
	useEffect(() => {
		const stored = loadFromStorage();
		if (stored) {
			if (stored.tripParams) setTripParamsState(stored.tripParams);
			if (stored.clientInfo) setClientInfoState(stored.clientInfo);
			if (stored.packageInfo) setPackageInfoState(stored.packageInfo);
			if (stored.bookingId) setBookingIdState(stored.bookingId);
		}
		setIsHydrated(true);
	}, []);

	// Persist to localStorage whenever state changes
	useEffect(() => {
		if (isHydrated) {
			saveToStorage({
				tripParams,
				clientInfo,
				packageInfo,
				bookingId,
			});
		}
	}, [tripParams, clientInfo, packageInfo, bookingId, isHydrated]);

	const setTripParams = useCallback((params) => {
		setTripParamsState((prev) => ({ ...prev, ...params }));
	}, []);

	const setClientInfo = useCallback((info) => {
		setClientInfoState((prev) => ({ ...prev, ...info }));
	}, []);

	const setPackageInfo = useCallback((info) => {
		setPackageInfoState((prev) => ({ ...prev, ...info }));
	}, []);

	const setBookingId = useCallback((id) => {
		setBookingIdState(id);
	}, []);

	const getTotalDays = useCallback(() => {
		if (!tripParams.startDate || !tripParams.endDate) {
			return 0;
		}
		return Math.ceil((new Date(tripParams.endDate) - new Date(tripParams.startDate)) / (1000 * 60 * 60 * 24));
	}, [tripParams.startDate, tripParams.endDate]);

	const getTotalPax = useCallback(() => {
		return tripParams.adults + tripParams.children;
	}, [tripParams.adults, tripParams.children]);

	const isBookingComplete = useCallback(() => {
		return tripParams.startDate && tripParams.endDate && clientInfo.fullName.trim() && clientInfo.email.trim() && clientInfo.phoneNumber.trim() && packageInfo.packageName && packageInfo.basePrice > 0;
	}, [tripParams, clientInfo, packageInfo]);

	const clearBooking = useCallback(() => {
		setTripParamsState({
			startDate: null,
			endDate: null,
			adults: 1,
			children: 0,
		});
		setClientInfoState({
			fullName: "",
			email: "",
			phoneNumber: "",
			specialRequests: "",
		});
		setPackageInfoState({
			packageName: "",
			basePrice: 0,
			selectedDestinations: [],
			selectedGuide: null,
			selectedCar: null,
		});
		setBookingIdState(null);
		if (typeof window !== "undefined") {
			window.localStorage.removeItem(STORAGE_KEY);
		}
	}, []);

	const contextValue = useMemo(
		() => ({
			// Trip data
			tripParams,
			setTripParams,
			getTotalDays,
			getTotalPax,

			// Client data
			clientInfo,
			setClientInfo,

			// Package data
			packageInfo,
			setPackageInfo,

			// Booking
			bookingId,
			setBookingId,
			isBookingComplete,

			// Lifecycle
			clearBooking,
			isHydrated,
		}),
		[tripParams, setTripParams, getTotalDays, getTotalPax, clientInfo, setClientInfo, packageInfo, setPackageInfo, bookingId, setBookingId, isBookingComplete, clearBooking, isHydrated],
	);

	return <BookingContext.Provider value={contextValue}>{children}</BookingContext.Provider>;
}

export function useBooking() {
	const context = useContext(BookingContext);
	if (!context) {
		throw new Error("useBooking must be used within a BookingProvider");
	}
	return context;
}
