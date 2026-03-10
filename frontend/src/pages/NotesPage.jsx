import React, { useEffect, useState } from "react";

/* ─── Helpers ─────────────────────────────────────────── */
function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/* ─── Note Card ───────────────────────────────────────── */
const NoteCard = ({ note, onDelete }) => (
    <div className="group relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#16161e] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 border-t-2 border-t-indigo-500/60">
        <div className="flex items-start justify-between gap-2">
            <h3 className="text-[0.95rem] font-semibold text-slate-100 leading-snug line-clamp-1">
                {note.title}
            </h3>
            <div className="flex shrink-0 gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                    title="Edit"
                    className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
                >
                    ✏️
                </button>
                <button
                    title="Delete"
                    onClick={() => onDelete(note._id)}
                    className="rounded-md px-2 py-1 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    🗑️
                </button>
            </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {note.content}
        </p>

        <div className="mt-auto pt-2 text-[11px] text-slate-600">
            {formatDate(note.createdAt)}
        </div>
    </div>
);

/* ─── Skeleton Loader ─────────────────────────────────── */
const SkeletonCard = () => (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-[#16161e] p-5 animate-pulse">
        <div className="h-4 w-3/4 rounded-md bg-white/5" />
        <div className="h-3 w-full rounded-md bg-white/5" />
        <div className="h-3 w-5/6 rounded-md bg-white/5" />
        <div className="h-3 w-1/2 rounded-md bg-white/5 mt-auto" />
    </div>
);

/* ─── New Note Modal ─────────────────────────────────── */
const NewNoteModal = ({ onClose, onCreated }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            setErr("Both title and content are required.");
            return;
        }
        try {
            setSaving(true);
            setErr("");
            const res = await fetch("/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: title.trim(), content: content.trim() }),
            });
            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const saved = await res.json();
            onCreated(saved);
            onClose();
        } catch (e) {
            setErr(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
                className="relative flex w-full max-w-lg flex-col gap-5 rounded-2xl border border-white/10 bg-[#1c1c27] p-7 shadow-2xl shadow-black/40"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-100">New Note</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-300 transition-colors text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Title</label>
                    <input
                        autoFocus
                        type="text"
                        placeholder="Note title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded-xl border border-white/5 bg-[#0f0f13] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/60 transition-colors"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-400">Content</label>
                    <textarea
                        rows={5}
                        placeholder="Write your note here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="resize-none rounded-xl border border-white/5 bg-[#0f0f13] px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500/60 transition-colors"
                    />
                </div>

                {/* Error */}
                {err && <p className="text-xs text-red-400">{err}</p>}

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-white/5 px-5 py-2 text-sm font-medium text-slate-400 hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Create Note"}
                    </button>
                </div>
            </form>
        </div>
    );
};

/* ─── Main Page ───────────────────────────────────────── */
const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    /* Fetch notes from backend */
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/notes");

                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setNotes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    /* Optimistic delete */
    const handleDelete = async (id) => {
        const prevNotes = notes;
        setNotes((n) => n.filter((note) => note._id !== id));
        try {
            const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
        } catch {
            setNotes(prevNotes); // rollback
        }
    };

    const filtered = notes.filter(
        (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            className="flex min-h-screen bg-[#0f0f13] text-slate-200"
            style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
        >


            {/* ── Main ── */}
            <main className="flex flex-1 flex-col gap-8 overflow-y-auto px-12 py-10">

                {/* Header */}
                <header className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-[1.75rem] font-bold tracking-tight text-slate-100">All Notes</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {loading ? "Loading..." : `${notes.length} note${notes.length !== 1 ? "s" : ""} in your collection`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-150 hover:-translate-y-0.5 hover:opacity-90 active:scale-95"
                    >
                        + New Note
                    </button>
                </header>

                {/* Search */}
                <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-[#16161e] px-4 py-2.5 focus-within:border-indigo-500/50 transition-colors duration-200 max-w-md">
                    <span className="text-sm text-slate-500">🔍</span>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 outline-none"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Content */}
                {error ? (
                    /* Error state */
                    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 py-20 text-center">
                        <span className="text-4xl">⚠️</span>
                        <p className="text-sm font-medium text-red-400">Failed to load notes</p>
                        <p className="text-xs text-slate-500">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-2 rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                ) : loading ? (
                    /* Skeleton grid */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                        <span className="text-5xl">😶‍🌫️</span>
                        <p className="text-slate-400 font-medium">
                            {search ? "No notes match your search." : "No notes yet. Create your first one!"}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-xs text-indigo-400 hover:underline"
                            >
                                Clear search
                            </button>
                        )}
                    </div>
                ) : (
                    /* Notes grid */
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((note) => (
                            <NoteCard key={note._id} note={note} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </main>

            {/* ── New Note Modal ── */}
            {showModal && (
                <NewNoteModal
                    onClose={() => setShowModal(false)}
                    onCreated={(note) => setNotes((prev) => [note, ...prev])}
                />
            )}
        </div>
    );
};

export default NotesPage;
