import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Minus, Plus, Search, Star } from "lucide-react";
import { destinations } from "../data";
import { Badge, BottomActionBar, Button, Card, OfflineIndicator, SectionTitle } from "../components/ui";
import { useStore } from "../store/useStore";
import { formatIDR } from "../utils/batour";

const categories = ["All", "tempat-wisata", "tempat-makan", "toko-oleh-oleh"];
const categoryLabels = {
	All: "All",
	"tempat-wisata": "Tempat Wisata",
	"tempat-makan": "Tempat Makan",
	"toko-oleh-oleh": "Toko Oleh-Oleh",
};

export default function ExplorePage() {
	const navigate = useNavigate();
	const selectedDestinations = useStore((state) => state.selectedDestinations);
	const searchTerm = useStore((state) => state.searchTerm);
	const activeCategory = useStore((state) => state.activeCategory);
	const isOnline = useStore((state) => state.isOnline);
	const addDestination = useStore((state) => state.addDestination);
	const removeDestination = useStore((state) => state.removeDestination);
	const setSearchTerm = useStore((state) => state.setSearchTerm);
	const setActiveCategory = useStore((state) => state.setActiveCategory);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	const [draftSearch, setDraftSearch] = useState(searchTerm);

	useEffect(() => {
		setCurrentPage("/explore");
	}, [setCurrentPage]);

	useEffect(() => {
		const timeout = setTimeout(() => setSearchTerm(draftSearch), 300);
		return () => clearTimeout(timeout);
	}, [draftSearch, setSearchTerm]);

	const filteredDestinations = useMemo(() => {
		return destinations.filter((destination) => {
			const matchesCategory = activeCategory === "All" || destination.category === activeCategory;
			const normalizedSearch = searchTerm.trim().toLowerCase();
			const matchesSearch = !normalizedSearch || destination.name.toLowerCase().includes(normalizedSearch) || destination.zone.toLowerCase().includes(normalizedSearch) || destination.shortDescription.toLowerCase().includes(normalizedSearch);
			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, searchTerm]);

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(236,91,19,0.12),_transparent_28%),#f8fafc] pb-44 text-slate-900">
			<div className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-50/95 px-5 pb-4 pt-6 backdrop-blur">
				<SectionTitle
					eyebrow="Bandung Explorer"
					title="Explore Bandung"
					action={<OfflineIndicator isOffline={!isOnline} />}
				/>
				<div className="mt-4 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
					<Search
						size={18}
						className="text-slate-400"
					/>
					<input
						value={draftSearch}
						onChange={(event) => setDraftSearch(event.target.value)}
						placeholder="Search nature, food, shops..."
						className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
					/>
				</div>

				<div className="mt-4 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					{categories.map((category) => (
						<button
							key={category}
							onClick={() => setActiveCategory(category)}
							className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "border-brand bg-brand text-white shadow-soft" : "border-slate-200 bg-white text-slate-700"}`}>
							{categoryLabels[category]}
						</button>
					))}
				</div>
			</div>

			<div className="px-5 py-5">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h3 className="text-lg font-bold text-slate-900">Top Picks for You</h3>
						<p className="text-sm text-slate-500">{selectedDestinations.length} destinasi dipilih</p>
					</div>
					<Badge tone="brand">Max 3 stops</Badge>
				</div>

				<div className="grid gap-4">
					{filteredDestinations.map((destination) => {
						const isSelected = selectedDestinations.includes(destination.id);
						return (
							<Card
								key={destination.id}
								className="overflow-hidden">
								<div className="relative h-52 overflow-hidden">
									<img
										src={destination.image}
										alt={destination.imageAlt}
										className="h-full w-full object-cover"
									/>
									<div className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-2xl bg-white/92 px-3 py-1.5 text-sm font-bold text-slate-900 shadow">
										<Star
											size={15}
											className="fill-amber-400 text-amber-400"
										/>{" "}
										{destination.rating}
									</div>
									<div className="absolute bottom-4 left-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white">{destination.operatingHours}</div>
								</div>
								<div className="space-y-3 p-5">
									<div className="flex items-start justify-between gap-4">
										<div>
											<h4 className="text-[1.2rem] font-extrabold text-slate-900">{destination.name}</h4>
											<div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
												<MapPin size={16} /> {destination.zone}
											</div>
										</div>
										<Badge tone={destination.entryFee === 0 ? "success" : "warning"}>{destination.entryFeeLabel}</Badge>
									</div>

									<p className="text-sm leading-6 text-slate-500">{destination.shortDescription}</p>

									<div className="flex items-center justify-between gap-3">
										<div className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">{categoryLabels[destination.category]}</div>
										<div className="text-sm font-semibold text-slate-600">{formatIDR(destination.entryFee)}</div>
									</div>

									<Button
										className="w-full"
										variant={isSelected ? "secondary" : "primary"}
										onClick={() => (isSelected ? removeDestination(destination.id) : addDestination(destination.id))}>
										{isSelected ? (
											<>
												<Minus size={16} /> Remove from Trip
											</>
										) : (
											<>
												<Plus size={16} /> Add to Trip
											</>
										)}
									</Button>
								</div>
							</Card>
						);
					})}
				</div>
			</div>

			<BottomActionBar>
				<div className="flex items-center gap-4">
					<div>
						<div className="text-xs text-slate-500">Selected</div>
						<div className="text-lg font-black text-slate-900">{selectedDestinations.length}/3</div>
					</div>
					<Button
						className="flex-1 py-4 text-base"
						onClick={() => navigate("/guide-selection")}
						disabled={selectedDestinations.length === 0}>
						Continue
					</Button>
				</div>
			</BottomActionBar>
		</div>
	);
}
