import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CarFront, Check, CheckCircle2, SkipForward } from "lucide-react";
import { BottomActionBar, Badge, Button, Card, SectionTitle } from "../components/ui";
import { carRentals, guides } from "../data";
import { formatIDR } from "../utils/batour";
import { useStore } from "../store/useStore";

export default function CarSelectionPage() {
	const navigate = useNavigate();
	const needsCar = useStore((state) => state.needsCar);
	const selectedCar = useStore((state) => state.selectedCar);
	const selectedGuide = useStore((state) => state.selectedGuide);
	const totalCost = useStore((state) => state.totalCost);
	const subtotal = useStore((state) => state.subtotal);
	const setNeedCar = useStore((state) => state.setNeedCar);
	const setCar = useStore((state) => state.setCar);
	const clearCar = useStore((state) => state.clearCar);
	const calculateTotal = useStore((state) => state.calculateTotal);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	useEffect(() => {
		setCurrentPage("/car-selection");
		calculateTotal();
	}, [calculateTotal, setCurrentPage]);

	const selectedGuideObject = useMemo(() => guides.find((guide) => guide.id === selectedGuide) ?? null, [selectedGuide]);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_20%,#f8fafc_100%)] pb-52 text-slate-900">
			<div className="px-4 pt-6">
				<SectionTitle
					eyebrow="Trip Builder"
					title="Need a Car?"
				/>
				<p className="mt-2 text-sm text-slate-500">Jika tidak perlu sewa mobil, trip akan menggunakan kendaraan pribadi guide.</p>

				<div className="mt-5 grid gap-3">
					<button
						onClick={() => setNeedCar(true)}
						className={`w-full rounded-3xl p-4 text-left transition ${needsCar === true ? "border-2 border-[#ec5b13] bg-orange-50" : "border border-gray-200 bg-white"}`}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="flex items-center gap-2 font-semibold text-slate-900">
									<CarFront
										size={18}
										className="text-brand"
									/>
									Yes, need car
								</div>
								<p className="mt-2 text-sm text-slate-500">Choose a sedan or van.</p>
							</div>
							{needsCar === true ? (
								<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec5b13] text-white">
									<Check size={14} />
								</div>
							) : null}
						</div>
					</button>
					<button
						onClick={() => {
							setNeedCar(false);
							clearCar();
						}}
						className={`w-full rounded-3xl p-4 text-left transition ${needsCar === false ? "border-2 border-[#ec5b13] bg-orange-50" : "border border-gray-200 bg-white"}`}>
						<div className="flex items-start justify-between gap-3">
							<div>
								<div className="flex items-center gap-2 font-semibold text-slate-900">
									<SkipForward
										size={18}
										className="text-brand"
									/>
									Skip car rental
								</div>
								<p className="mt-2 text-sm text-slate-500">Use the guide's vehicle.</p>
							</div>
							{needsCar === false ? (
								<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec5b13] text-white">
									<Check size={14} />
								</div>
							) : null}
						</div>
					</button>
				</div>

				{needsCar === true ? (
					<div className="mt-5 space-y-4">
						{carRentals.map((car) => {
							const isSelected = selectedCar === car.id;
							return (
								<button
									key={car.id}
									onClick={() => setCar(car.id)}
									className={`w-full rounded-[28px] p-4 text-left transition ${isSelected ? "border-2 border-[#ec5b13] bg-orange-50" : "border border-gray-200 bg-white"}`}>
									<div className="flex gap-3">
										<img
											src={car.image}
											alt={car.imageAlt}
											className="h-20 w-24 shrink-0 rounded-2xl object-cover"
										/>
										<div className="min-w-0 flex-1">
											<div className="flex items-start justify-between gap-2">
												<div>
													<h3 className="text-3xl font-extrabold leading-tight text-slate-900">{car.label}</h3>
													<p className="mt-1 text-sm text-slate-500">{car.capacity}</p>
												</div>
												{isSelected ? (
													<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec5b13] text-white">
														<Check size={14} />
													</div>
												) : null}
											</div>
											<p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{car.description}</p>
											<div className="mt-2 flex items-center justify-between">
												<Badge tone="warning">{car.dailyRateLabel}</Badge>
												<div className="text-xs text-slate-400">{car.estimatedFuelConsumption}</div>
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				) : null}

				{needsCar === false ? (
					<Card className="mt-5 p-5">
						<div className="flex items-start gap-3">
							<CheckCircle2
								className="mt-0.5 text-emerald-500"
								size={20}
							/>
							<div>
								<h3 className="font-bold text-slate-900">Akan menggunakan kendaraan pribadi guide</h3>
								<p className="mt-2 text-sm leading-6 text-slate-600">Biaya transportasi akan disesuaikan dengan paket guide yang kamu pilih.</p>
								{selectedGuideObject ? (
									<Badge
										tone="brand"
										className="mt-3">
										Selected guide: {selectedGuideObject.name}
									</Badge>
								) : null}
							</div>
						</div>
					</Card>
				) : null}
			</div>

			<BottomActionBar>
				<div className="space-y-3">
					<div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
						<div>
							<div className="text-xs uppercase tracking-[0.2em] text-slate-400">Estimated total</div>
							<div className="text-2xl font-black text-slate-900">{formatIDR(totalCost || subtotal)}</div>
						</div>
						<div className="text-right text-xs text-slate-500">Updated live</div>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							className="flex-1 py-4"
							onClick={() => navigate("/guide-selection")}>
							Back
						</Button>
						<Button
							className="flex-1 py-4"
							disabled={needsCar === null || (needsCar && !selectedCar)}
							onClick={() => navigate("/booking-details")}>
							Continue
						</Button>
					</div>
				</div>
			</BottomActionBar>
		</div>
	);
}
