import React from "react";
import { AlertCircle, Clock3, Loader2, MapPin, ShieldCheck } from "lucide-react";

export function Button({ children, className = "", variant = "primary", ...props }) {
	const styles = {
		primary: "bg-brand text-white shadow-soft hover:bg-[#d94f10]",
		secondary: "bg-white text-slate-700 border border-slate-200 hover:border-brand/30",
		ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
	};

	return (
		<button
			className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${styles[variant]} ${className}`}
			{...props}>
			{children}
		</button>
	);
}

export function Card({ children, className = "" }) {
	return <div className={`rounded-[28px] border border-white/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${className}`}>{children}</div>;
}

export function Pill({ children, active = false, className = "", ...props }) {
	return (
		<button
			className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-brand bg-brand text-white shadow-soft" : "border-slate-200 bg-white text-slate-700"} ${className}`}
			{...props}>
			{children}
		</button>
	);
}

export function Badge({ children, tone = "default", className = "" }) {
	const tones = {
		default: "bg-slate-100 text-slate-700 border-slate-200",
		brand: "bg-brandSoft text-brand border-transparent",
		success: "bg-emerald-50 text-emerald-700 border-emerald-100",
		warning: "bg-amber-50 text-amber-700 border-amber-100",
	};

	return <div className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${tones[tone]} ${className}`}>{children}</div>;
}

export function OfflineIndicator({ isOffline }) {
	if (!isOffline) {
		return null;
	}

	return (
		<div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
			<AlertCircle size={14} /> Offline mode
		</div>
	);
}

export function SectionTitle({ eyebrow, title, action, className = "" }) {
	return (
		<div className={`flex items-end justify-between gap-3 ${className}`}>
			<div>
				{eyebrow ? <div className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand/70">{eyebrow}</div> : null}
				<h2 className="text-[1.45rem] font-extrabold tracking-tight text-slate-900">{title}</h2>
			</div>
			{action}
		</div>
	);
}

export function BottomActionBar({ children }) {
	return <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-slate-50 px-5 py-4">{children}</div>;
}

export function TimelineStep({ step, active = false, last = false }) {
	return (
		<div className={`relative ${last ? "" : "pb-5"}`}>
			<div className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full ${active ? "bg-brand" : "bg-slate-300"}`} />
			<div className="pl-6">
				<div className="text-sm font-bold text-brand/80">{step.scheduledTime}</div>
				<div className="mt-1 text-lg font-extrabold text-slate-900">{step.name}</div>
				<div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
					<MapPin size={15} /> {step.zone}
				</div>
				<div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
					<div
						className="h-full rounded-full bg-brand"
						style={{ width: `${(Math.min(step.estimatedDurationMinutes || 30, 180) / 180) * 100}%` }}
					/>
				</div>
				<div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
					<Clock3 size={12} /> {step.estimatedDurationMinutes} min
				</div>
			</div>
			{!last ? <div className="absolute left-[0.68rem] top-4 h-full w-px bg-slate-200" /> : null}
		</div>
	);
}

export function LoadingState({ label = "Loading..." }) {
	return (
		<div className="flex items-center gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
			<Loader2
				className="animate-spin text-brand"
				size={18}
			/>
			<span className="text-sm font-medium text-slate-600">{label}</span>
		</div>
	);
}

export function TrustBadge({ children }) {
	return (
		<div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
			<ShieldCheck size={14} />
			{children}
		</div>
	);
}
