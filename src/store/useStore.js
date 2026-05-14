import { create } from "zustand";
import { carRentals, destinations, guides, transitMatrix } from "../data";
import { getSession, getTripState, saveBooking, saveSessionState, saveUserPreferences } from "../lib/idb";
import { calculateCarFee, calculateEntryFees, calculateGuideFee, calculateTotal } from "../utils/priceCalculations";
import { generateBookingId } from "../utils/bookingId";
import { generateTimeline } from "../utils/timelineEngine";
import { validateBooking, validateDestinationSelection, validateGuideSelection, validatePaymentOption } from "../utils/validation";

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
	dpAmount: 0,
	timeline: [],
	currentBooking: null,
	bookingId: null,
};

function buildSessionState(state) {
	return {
		key: "current-trip",
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
		dpAmount: state.dpAmount,
		timeline: state.timeline,
		currentBooking: state.currentBooking,
		bookingId: state.bookingId,
		updatedAt: new Date().toISOString(),
	};
}

function persistSession(state) {
	void saveSessionState(buildSessionState(state));
}

function getSelectedCarId(state) {
	if (state.needsCar === false) {
		return null;
	}
	return state.selectedCar;
}

function deriveCosts(state) {
	const carId = getSelectedCarId(state);
	const guideFee = calculateGuideFee(state.selectedGuide, guides);
	const carFee = calculateCarFee(carId, carRentals);
	const entryFees = calculateEntryFees(state.selectedDestinations, destinations);
	const subtotal = calculateTotal(guideFee, carFee, entryFees);
	const discount = state.selectedPaymentOption === "FULL" ? Math.round(subtotal * 0.05) : 0;
	const totalCost = subtotal - discount;
	const dpAmount = state.selectedPaymentOption ? Math.round(totalCost * (state.selectedPaymentOption === "DP_50" ? 0.5 : 0.95)) : 0;
	const timeline = generateTimeline(state.selectedDestinations, destinations, transitMatrix);

	return { carId, guideFee, carFee, entryFees, subtotal, discount, totalCost, dpAmount, timeline };
}

export const useStore = create((set, get) => ({
	...defaultState,
	resetTrip: () => {
		set((state) => ({
			...defaultState,
			hasVisited: state.hasVisited,
			isOnline: state.isOnline,
		}));
		persistSession(get());
	},
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
			if (state.selectedDestinations.includes(destinationId) || state.selectedDestinations.length >= 3) {
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
	clearDestinations: () => {
		set({ selectedDestinations: [] });
		get().calculateTotal();
		persistSession(get());
	},
	setGuide: (guideId) => {
		set({ selectedGuide: guideId });
		get().calculateTotal();
		persistSession(get());
	},
	clearGuide: () => {
		set({ selectedGuide: null });
		get().calculateTotal();
		persistSession(get());
	},
	setNeedCar: (needsCar) => {
		set({ needsCar, selectedCar: needsCar === false ? null : get().selectedCar });
		get().calculateTotal();
		persistSession(get());
	},
	setCar: (carId) => {
		set({ selectedCar: carId, needsCar: carId ? true : false });
		get().calculateTotal();
		persistSession(get());
	},
	clearCar: () => {
		set({ selectedCar: null, needsCar: false });
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
		const costs = deriveCosts(state);
		set({
			guideFee: costs.guideFee,
			carFee: costs.carFee,
			entryFees: costs.entryFees,
			subtotal: costs.subtotal,
			discount: costs.discount,
			dpAmount: costs.dpAmount,
			totalCost: costs.totalCost,
			timeline: costs.timeline,
		});
	},
	generateBooking: async () => {
		const state = get();
		validateDestinationSelection(state.selectedDestinations, destinations);
		validateGuideSelection(state.selectedGuide, guides);
		validatePaymentOption(state.selectedPaymentOption);
		const costs = deriveCosts(state);
		const car = costs.carId ? (carRentals.find((item) => item.id === costs.carId) ?? null) : null;
		const guide = guides.find((item) => item.id === state.selectedGuide) ?? null;
		const booking = {
			bookingId: generateBookingId(),
			createdAt: new Date().toISOString(),
			tripDate: null,
			status: "pending",
			destinationIds: state.selectedDestinations,
			destinationNames: state.selectedDestinations.map((destinationId) => destinations.find((destination) => destination.id === destinationId)?.name).filter(Boolean),
			guideId: state.selectedGuide,
			guideName: guide?.name ?? null,
			guidePhoto: guide?.photo ?? null,
			guidePhone: guide?.phone ?? null,
			carId: costs.carId,
			carLabel: car?.label ?? null,
			paymentOption: state.selectedPaymentOption,
			guideFee: costs.guideFee,
			carFee: costs.carFee,
			entryFees: costs.entryFees.map((entry) => entry.amount),
			totalCost: costs.totalCost,
			dpAmount: costs.dpAmount,
			timeline: costs.timeline,
		};
		validateBooking(booking);
		set({ currentBooking: booking, bookingId: booking.bookingId });
		persistSession(get());
		await saveBooking(booking);
		return booking;
	},
	loadFromIndexedDB: async () => {
		const [sessionState, userPreferences] = await Promise.all([getTripState(), getSession("user")]);
		get().hydrateFromStorage({ sessionState, userPreferences });
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
				dpAmount: sessionState.dpAmount ?? nextState.dpAmount,
				timeline: sessionState.timeline ?? nextState.timeline,
				currentBooking: sessionState.currentBooking ?? nextState.currentBooking,
				bookingId: sessionState.bookingId ?? nextState.bookingId,
			});
		}
		if (userPreferences) {
			nextState.hasVisited = userPreferences.hasVisited ?? nextState.hasVisited;
		}
		set(nextState);
	},
}));
