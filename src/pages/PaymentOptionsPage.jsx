import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { BottomActionBar, Button, Card, SectionTitle } from "../components/ui";
import { useStore } from "../store/useStore";
import { formatIDR } from "../utils/batour";

export default function PaymentOptionsPage() {
	const navigate = useNavigate();
	const selectedPaymentOption = useStore((state) => state.selectedPaymentOption);
	const guideFee = useStore((state) => state.guideFee);
	const carFee = useStore((state) => state.carFee);
	const entryFees = useStore((state) => state.entryFees);
	const subtotal = useStore((state) => state.subtotal);
	const totalCost = useStore((state) => state.totalCost);
	const setPaymentOption = useStore((state) => state.setPaymentOption);
	const calculateTotal = useStore((state) => state.calculateTotal);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	useEffect(() => {
		setCurrentPage("/payment-options");
		calculateTotal();
	}, [calculateTotal, setCurrentPage]);

	const paymentCards = useMemo(
		() => [
			{ id: "DP_50", title: "DP 50%", description: "Bayar 50% sekarang, 50% hari kunjungan", amount: Math.round(subtotal * 0.5) },
			{ id: "FULL", title: "Full Payment", description: "Bayar penuh sekarang, diskon 5%", amount: totalCost },
		],
		[subtotal, totalCost],
	);

	return (
		<div className="min-h-screen bg-[linear-gradient(180deg,#fff7f1_0%,#f8fafc_18%,#f8fafc_100%)] pb-52 text-slate-900">
			<div className="px-4 pt-6">
				<SectionTitle
					eyebrow="Payment Decision"
					title="Choose Payment Plan"
				/>
				<p className="mt-2 text-sm text-slate-500">Pilih DP 50% atau Full Payment untuk melanjutkan ke konfirmasi WhatsApp.</p>

				<Card className="mt-5 p-5">
					<div className="mb-4 text-lg font-bold text-slate-900">Cost Breakdown</div>
					<div className="space-y-3 text-sm text-slate-600">
						<div className="flex items-center justify-between">
							<span>Guide fee</span>
							<span>{formatIDR(guideFee)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Car fee</span>
							<span>{formatIDR(carFee)}</span>
						</div>
						<div className="flex items-center justify-between">
							<span>Entry fees</span>
							<span>{formatIDR(entryFees.reduce((sum, item) => sum + item.amount, 0))}</span>
						</div>
						<div className="flex items-center justify-between border-t border-slate-200 pt-3">
							<span>Subtotal</span>
							<span>{formatIDR(subtotal)}</span>
						</div>
						<div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-lg font-black text-slate-900">
							<span>Total</span>
							<span>{formatIDR(totalCost)}</span>
						</div>
					</div>
				</Card>

				<div className="mt-5 space-y-4">
					{paymentCards.map((card) => {
						const isSelected = selectedPaymentOption === card.id;
						return (
							<button
								key={card.id}
								onClick={() => setPaymentOption(card.id)}
								className={`w-full rounded-[28px] p-4 text-left transition ${isSelected ? "border-2 border-[#ec5b13] bg-orange-50" : "border border-gray-200 bg-white"}`}>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<div className="text-xl font-extrabold leading-tight text-slate-900">{card.title}</div>
										<p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{card.description}</p>
										<div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Pay now</div>
										<div className="text-3xl font-black leading-tight text-brand">{formatIDR(card.amount)}</div>
									</div>
									{isSelected ? (
										<div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ec5b13] text-white">
											<Check size={14} />
										</div>
									) : null}
								</div>
							</button>
						);
					})}
				</div>

				<div className="mt-5 grid gap-3 sm:grid-cols-3">
					<div className="flex items-center gap-2 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
						<BadgeCheck
							size={16}
							className="text-brand"
						/>
						Secure Booking
					</div>
					<div className="flex items-center gap-2 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
						<ShieldCheck
							size={16}
							className="text-brand"
						/>
						Free Cancellation
					</div>
					<div className="flex items-center gap-2 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm">
						<CheckCircle2
							size={16}
							className="text-brand"
						/>
						Verified Guides
					</div>
				</div>
			</div>

			<BottomActionBar>
				<div className="space-y-3">
					<div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
						<div className="flex items-center justify-between text-sm text-slate-600">
							<span>Selected option</span>
							<span>{selectedPaymentOption ?? "None"}</span>
						</div>
						<div className="mt-2 flex items-center justify-between">
							<span className="text-sm font-semibold text-slate-900">Amount due now</span>
							<span className="text-2xl font-black text-slate-900">{selectedPaymentOption === "FULL" ? formatIDR(totalCost) : selectedPaymentOption === "DP_50" ? formatIDR(Math.round(subtotal * 0.5)) : "—"}</span>
						</div>
					</div>
					<div className="flex gap-3">
						<Button
							variant="secondary"
							className="flex-1 py-4"
							onClick={() => navigate("/booking-details")}>
							Back
						</Button>
						<Button
							className="flex-1 py-4"
							disabled={!selectedPaymentOption}
							onClick={() => navigate("/confirmation")}>
							Continue
						</Button>
					</div>
				</div>
			</BottomActionBar>
		</div>
	);
}
