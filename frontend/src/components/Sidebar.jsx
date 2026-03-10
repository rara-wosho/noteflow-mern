import React from "react";
import { Link, useLocation } from "react-router";

const NAV_LINKS = [
    { to: "/", icon: "🏠", label: "Home" },
    { to: "/notes", icon: "📁", label: "All Notes" },
    { to: "#", icon: "📌", label: "Pinned" },
    { to: "#", icon: "🏷️", label: "Tags" },
    { to: "#", icon: "🗑️", label: "Trash" },
];

const Sidebar = () => {
    const { pathname } = useLocation();

    return (
        <aside className="fixed z-100 top-0 flex h-screen w-60 flex-col gap-8 border-r border-white/5 bg-[#16161e] px-4 py-7">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 px-2">
                <span className="text-2xl">🗒️</span>
                <span className="bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                    NoteFlow
                </span>
            </Link>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1">
                {NAV_LINKS.map(({ to, icon, label }) => {
                    const isActive = to !== "#" && pathname === to;
                    return (
                        <Link
                            key={label}
                            to={to}
                            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${isActive
                                ? "bg-indigo-500/10 text-indigo-400"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                }`}
                        >
                            <span>{icon}</span>
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.04] p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                    D
                </div>
                <div className="overflow-hidden">
                    <p className="text-[0.8rem] font-semibold text-slate-200 truncate">Dev User</p>
                    <p className="text-[0.7rem] text-slate-500 truncate">dev@noteflow.io</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
