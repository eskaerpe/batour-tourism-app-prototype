import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Check, Star } from "lucide-react";
import { BottomActionBar, Badge, Button, SectionTitle } from "../components/ui";
import { guides } from "../data";
import { formatIDR } from "../utils/batour";
import { useStore } from "../store/useStore";

export default function GuideSelectionPage() {
	const navigate = useNavigate();
	const selectedGuide = useStore((state) => state.selectedGuide);
	const guideFee = useStore((state) => state.guideFee);
	const entryFees = useStore((state) => state.entryFees);
	const subtotal = useStore((state) => state.subtotal);
	const totalCost = useStore((state) => state.totalCost);
	const setGuide = useStore((state) => state.setGuide);
	const calculateTotal = useStore((state) => state.calculateTotal);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	useEffect(() => {
		setCurrentPage("/guide-selection");
		calculateTotal();
	}, [calculateTotal, setCurrentPage]);

	const selectedGuideObject = useMemo(() => guides.find((guide) => guide.id === selectedGuide) ?? null, [selectedGuide]);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_22%,#f8fafc_100%)] pb-52 text-slate-900">
			<div className="px-4 pt-6">
				<SectionTitle
					eyebrow="Trip Builder"
					title="Choose Your Guide"
				/>
				<p className="mt-2 text-sm text-slate-500">Pilih satu guide lokal yang paling cocok dengan gaya perjalananmu.</p>

				<div className="mt-5 space-y-4 pb-8">
					{guides.map((guide) => {
						const isSelected = selectedGuide === guide.id;
						return (
							<button
								key={guide.id}
								onClick={() => setGuide(guide.id)}
								className={`w-full overflow-hidden rounded-[28px] p-4 text-left transition ${isSelected ? "border-2 border-[#ec5b13] bg-orange-50 shadow-[0_12px_30px_rgba(236,91,19,0.08)]" : "border border-slate-200 bg-white shadow-sm"}`}>
								<div className="flex gap-4">
									<img
										src={guide.photo}
										alt={guide.photoAlt}
										className="h-24 w-24 shrink-0 rounded-2xl object-cover"
									/>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<h3 className="text-xl font-extrabold leading-tight text-slate-900">{guide.name}</h3>
													{guide.certified ? (
														<Badge tone="success">
															<BadgeCheck size={12} /> Certified
														</Badge>
													) : null}
												</div>
												<div className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
													<Star
														size={14}
														className="fill-amber-400 text-amber-400"
													/>
													{guide.rating} ({guide.reviewCount} reviews)
												</div>
												<div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Daily rate</div>
												<div className="text-3xl font-black leading-tight text-brand">{formatIDR(guide.dailyRate)}</div>
											</div>
											{isSelected ? (
												<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec5b13] text-white">
													<Check size={14} />
												</div>
											) : null}
										</div>
										<p className="mt-3 text-sm leading-7 text-slate-600">{guide.bio}</p>
										<div className="mt-4 flex gap-2 overflow-x-auto whitespace-nowrap pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
											{guide.languages.map((language) => (
												<Badge key={language}>{language}</Badge>
											))}
											{guide.specialties.map((specialty) => (
												<Badge
													key={specialty}
													tone="brand">
													{specialty}
												</Badge>
											))}
										</div>
									</div>
								</div>
							</button>
						);
					})}
				</div>
			</div>

			<BottomActionBar>
				<div className="space-y-3">
					<div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
						<div className="flex items-center justify-between text-sm text-slate-600">
							<span>Destination fees</span>
							<span>{formatIDR(entryFees.reduce((sum, item) => sum + item.amount, 0))}</span>
						</div>
						<div className="mt-2 flex items-center justify-between text-sm text-slate-600">
							<span>Guide fee</span>
							<span>{formatIDR(guideFee)}</span>
						</div>
						<div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3">
							<span className="text-sm font-semibold text-slate-900">Total</span>
							<span className="text-2xl font-black text-slate-900">{formatIDR(totalCost || subtotal)}</span>
						</div>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							className="flex-1 py-4"
							onClick={() => navigate("/explore")}>
							Back
						</Button>
						<Button
							className="flex-1 py-4"
							disabled={!selectedGuideObject}
							onClick={() => navigate("/car-selection")}>
							Continue
						</Button>
					</div>
				</div>
			</BottomActionBar>
		</div>
	);
}
