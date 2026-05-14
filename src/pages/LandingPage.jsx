import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Badge, Button } from "../components/ui";
import { useStore } from "../store/useStore";

export default function LandingPage() {
	const navigate = useNavigate();
	const hasVisited = useStore((state) => state.hasVisited);
	const markVisited = useStore((state) => state.markVisited);
	const setCurrentPage = useStore((state) => state.setCurrentPage);

	useEffect(() => {
		setCurrentPage("/");
	}, [setCurrentPage]);

	return (
		<div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
			<img
				src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1634&auto=format&fit=crop"
				alt="Bandung landscape"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.12)_0%,rgba(15,23,42,0.2)_40%,rgba(15,23,42,0.9)_82%,rgba(15,23,42,0.98)_100%)]" />

			<div className="relative flex min-h-screen flex-col justify-end px-5 pb-7 pt-14">
				<div className="mb-auto flex items-center justify-center">
					<div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold tracking-[0.2em] backdrop-blur">BaTour</div>
				</div>

				<div className="space-y-5 rounded-[34px] bg-white/6 p-5 shadow-[0_-12px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm">
					{/* <Badge
						tone="brand"
						className="w-fit">
						<BadgeCheck size={14} /> SDG 8 - Empowering Locals
					</Badge> */}
					<div>
						<p className="mb-3 text-sm uppercase tracking-[0.32em] text-white/65">Asisten Pribadi Travelmu</p>
						<h1 className="max-w-[12ch] text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl">Anti-Ribet Travel di Bandung</h1>
						<p className="mt-4 max-w-sm text-[1.02rem] leading-7 text-white/80">Jelajahi Bandung dengan alur yang rapi, lokal, dan terasa premium sejak langkah pertama.</p>
					</div>

					<Button
						className="w-full py-4 text-base"
						onClick={() => {
							markVisited();
							navigate("/explore");
						}}>
						{hasVisited ? "Lanjutkan Perjalanan" : "Mulai Eksplorasi"} <ArrowRight size={18} />
					</Button>
				</div>
			</div>
		</div>
	);
}
