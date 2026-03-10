import React, { useState } from "react";

const sampleNotes = [
    {
        id: 1,
        title: "Meeting Notes",
        excerpt:
            "Discussed Q2 roadmap, assigned tasks to team leads, and finalized the product launch timeline...",
        tag: "Work",
        tagColor: "bg-indigo-500/20 text-indigo-400",
        borderAccent: "border-t-indigo-500",
        date: "Mar 9",
        pinned: true,
    },
    {
        id: 2,
        title: "Book Recommendations",
        excerpt:
            "Atomic Habits, Deep Work, The Pragmatic Programmer, Clean Code, and Designing Data-Intensive...",
        tag: "Personal",
        tagColor: "bg-emerald-500/20 text-emerald-400",
        borderAccent: "border-t-emerald-500",
        date: "Mar 8",
        pinned: false,
    },
    {
        id: 3,
        title: "React Router v7 Notes",
        excerpt:
            "Data APIs, loaders, actions — the new file-based routing convention looks very promising for large apps...",
        tag: "Dev",
        tagColor: "bg-amber-500/20 text-amber-400",
        borderAccent: "border-t-amber-500",
        date: "Mar 7",
        pinned: true,
    },
    {
        id: 4,
        title: "Weekend Ideas",
        excerpt:
            "Hiking at the national park, trying the new ramen place downtown, finishing the side project...",
        tag: "Personal",
        tagColor: "bg-emerald-500/20 text-emerald-400",
        borderAccent: "border-t-emerald-500",
        date: "Mar 6",
        pinned: false,
    },
    {
        id: 5,
        title: "API Design Checklist",
        excerpt:
            "Versioning strategy, rate limiting, auth headers, consistent error shapes, pagination patterns...",
        tag: "Dev",
        tagColor: "bg-amber-500/20 text-amber-400",
        borderAccent: "border-t-amber-500",
        date: "Mar 5",
        pinned: false,
    },
];

const FILTERS = ["All", "Work", "Personal", "Dev"];

const StatCard = ({ icon, label, value }) => (
    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#16161e] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5">
        <span className="text-2xl">{icon}</span>
        <div>
            <p className="text-xl font-bold text-slate-100">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        </div>
    </div>
);

const NoteCard = ({ note }) => (
    <div
        className={`group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#16161e] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 ${note.pinned ? "border-t-2 " + note.borderAccent : "border-t-2 border-t-transparent"
            }`}
    >
        {note.pinned && (
            <span className="text-[11px] font-semibold text-amber-400 tracking-wide">
                📌 Pinned
            </span>
        )}
        <span
            className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${note.tagColor}`}
        >
            {note.tag}
        </span>
        <h3 className="text-[0.95rem] font-semibold text-slate-100 leading-snug">
            {note.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {note.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-600">{note.date}</span>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                    ✏️
                </button>
                <button className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors">
                    🗑️
                </button>
            </div>
        </div>
    </div>
);



const Homepage = () => {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = sampleNotes.filter((n) => {
        const matchesSearch =
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.excerpt.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "All" || n.tag === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex min-h-screen bg-[#0f0f13] text-slate-200" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>


            {/* ── Main ── */}
            <main className="flex flex-1 flex-col gap-8 overflow-y-auto px-12 py-10">

                {/* Header */}
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[1.75rem] font-bold tracking-tight text-slate-100">
                            Good morning, Dev 👋
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            You have {sampleNotes.length} notes. What are you thinking today?
                        </p>
                    </div>
                    <button className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:scale-95">
                        + New Note
                    </button>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard icon="📝" label="Total Notes" value={sampleNotes.length} />
                    <StatCard icon="📌" label="Pinned" value={sampleNotes.filter((n) => n.pinned).length} />
                    <StatCard icon="🏷️" label="Tags" value={3} />
                    <StatCard icon="📅" label="This Week" value={4} />
                </section>

                {/* Search & Filter */}
                <section className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-1 min-w-[200px] items-center gap-2.5 rounded-xl border border-white/5 bg-[#16161e] px-4 py-2.5 focus-within:border-indigo-500/50 transition-colors duration-200">
                        <span className="text-sm text-slate-500">🔍</span>
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-150 ${activeFilter === f
                                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                                    : "border-white/5 bg-[#16161e] text-slate-400 hover:border-indigo-500/40 hover:text-slate-200"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Notes Grid */}
                <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.length > 0 ? (
                        filtered.map((note) => <NoteCard key={note.id} note={note} />)
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-500">
                            😶‍🌫️ No notes match your search.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Homepage;
