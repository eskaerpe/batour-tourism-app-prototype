import React from "react";
import { Home, Search, Bookmark, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
	{ to: "/", label: "Home", icon: Home },
	{ to: "/explore", label: "Explore", icon: Search },
	{ to: "/saved", label: "Saved", icon: Bookmark },
	{ to: "/profile", label: "Profile", icon: User },
];

export default function MobileBottomNav() {
	return (
		<nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200/80 bg-white/95 px-5 pb-4 pt-3 backdrop-blur">
			<div className="grid grid-cols-4 gap-2">
				{items.map(({ to, label, icon: Icon }) => (
					<NavLink
						key={label}
						to={to}
						className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl py-2 text-[0.72rem] font-medium transition ${isActive && to !== "/" ? "text-brand" : "text-slate-500"}`}>
						<Icon size={22} />
						<span>{label}</span>
					</NavLink>
				))}
			</div>
		</nav>
	);
}
