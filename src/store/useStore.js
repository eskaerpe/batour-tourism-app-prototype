import { create } from "zustand";
import { buildTimeline, calculateTripCosts, createBookingObject } from "../utils/batour";
import { saveBooking, saveSessionState, saveUserPreferences } from "../lib/idb";

const defaultState = {
	selectedDestinations: [],
	selectedGuide: null,
	selectedCar: null,
	needsCar: null,
	selectedPaymentOption: null,
	searchTerm: "",
	activeCategory: "All",
	currentPage: "/",
	hasVisited: false,
	hasHydrated: false,
	isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
	guideFee: 0,
	carFee: 0,
	entryFees: [],
	subtotal: 0,
	totalCost: 0,
	discount: 0,
	timeline: [],
	currentBooking: null,
};

function buildSessionState(state) {
	return {
		selectedDestinations: state.selectedDestinations,
		selectedGuide: state.selectedGuide,
		selectedCar: state.selectedCar,
		needsCar: state.needsCar,
		selectedPaymentOption: state.selectedPaymentOption,
		searchTerm: state.searchTerm,
		activeCategory: state.activeCategory,
		currentPage: state.currentPage,
		guideFee: state.guideFee,
		carFee: state.carFee,
		entryFees: state.entryFees,
		subtotal: state.subtotal,
		totalCost: state.totalCost,
		discount: state.discount,
		timeline: state.timeline,
		currentBooking: state.currentBooking,
		updatedAt: new Date().toISOString(),
	};
}

function persistSession(state) {
	void saveSessionState(buildSessionState(state));
}

export const useStore = create((set, get) => ({
	...defaultState,
	setCurrentPage: (currentPage) => {
		set({ currentPage });
		persistSession(get());
	},
	markVisited: () => {
		set({ hasVisited: true });
		void saveUserPreferences({ hasVisited: true, updatedAt: new Date().toISOString() });
	},
	setActiveCategory: (activeCategory) => {
		set({ activeCategory });
		persistSession(get());
	},
	setSearchTerm: (searchTerm) => {
		set({ searchTerm });
		persistSession(get());
	},
	addDestination: (destinationId) => {
		set((state) => {
			if (state.selectedDestinations.includes(destinationId)) {
				return state;
			}
			if (state.selectedDestinations.length >= 3) {
				return state;
			}
			return { selectedDestinations: [...state.selectedDestinations, destinationId] };
		});
		get().calculateTotal();
		persistSession(get());
	},
	removeDestination: (destinationId) => {
		set((state) => ({
			selectedDestinations: state.selectedDestinations.filter((id) => id !== destinationId),
		}));
		get().calculateTotal();
		persistSession(get());
	},
	setGuide: (guideId) => {
		set({ selectedGuide: guideId });
		get().calculateTotal();
		persistSession(get());
	},
	setNeedCar: (needsCar) => {
		set({ needsCar });
		get().calculateTotal();
		persistSession(get());
	},
	setCar: (carId) => {
		set({ selectedCar: carId });
		get().calculateTotal();
		persistSession(get());
	},
	clearCar: () => {
		set({ selectedCar: null });
		get().calculateTotal();
		persistSession(get());
	},
	setPaymentOption: (paymentOption) => {
		set({ selectedPaymentOption: paymentOption });
		get().calculateTotal();
		persistSession(get());
	},
	calculateTotal: () => {
		const state = get();
		const carId = state.needsCar ? state.selectedCar : null;
		const costs = calculateTripCosts({
			selectedDestinationIds: state.selectedDestinations,
			guideId: state.selectedGuide,
			carId,
			paymentOption: state.selectedPaymentOption,
		});
		const timeline = buildTimeline({ selectedDestinationIds: state.selectedDestinations, carId });
		set({
			guideFee: costs.guideFee,
			carFee: costs.carFee,
			entryFees: costs.entryFees,
			subtotal: costs.subtotal,
			discount: costs.discount,
			totalCost: costs.totalCost,
			timeline,
		});
	},
	generateBooking: async () => {
		const state = get();
		const carId = state.needsCar ? state.selectedCar : null;
		const booking = createBookingObject({
			selectedDestinationIds: state.selectedDestinations,
			guideId: state.selectedGuide,
			carId,
			paymentOption: state.selectedPaymentOption,
		});
		set({ currentBooking: booking });
		persistSession(get());
		await saveBooking(booking);
		return booking;
	},
	setHydrated: (hasHydrated) => set({ hasHydrated }),
	setOnline: (isOnline) => set({ isOnline }),
	hydrateFromStorage: ({ sessionState, userPreferences }) => {
		const nextState = { ...defaultState };
		if (sessionState) {
			Object.assign(nextState, {
				selectedDestinations: sessionState.selectedDestinations ?? nextState.selectedDestinations,
				selectedGuide: sessionState.selectedGuide ?? nextState.selectedGuide,
				selectedCar: sessionState.selectedCar ?? nextState.selectedCar,
				needsCar: sessionState.needsCar ?? nextState.needsCar,
				selectedPaymentOption: sessionState.selectedPaymentOption ?? nextState.selectedPaymentOption,
				searchTerm: sessionState.searchTerm ?? nextState.searchTerm,
				activeCategory: sessionState.activeCategory ?? nextState.activeCategory,
				currentPage: sessionState.currentPage ?? nextState.currentPage,
				guideFee: sessionState.guideFee ?? nextState.guideFee,
				carFee: sessionState.carFee ?? nextState.carFee,
				entryFees: sessionState.entryFees ?? nextState.entryFees,
				subtotal: sessionState.subtotal ?? nextState.subtotal,
				totalCost: sessionState.totalCost ?? nextState.totalCost,
				discount: sessionState.discount ?? nextState.discount,
				timeline: sessionState.timeline ?? nextState.timeline,
				currentBooking: sessionState.currentBooking ?? nextState.currentBooking,
			});
		}
		if (userPreferences) {
			nextState.hasVisited = userPreferences.hasVisited ?? nextState.hasVisited;
		}
		set(nextState);
	},
}));
