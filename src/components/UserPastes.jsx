import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deletePasteFromCloud, fetchMyPastes } from "../redux/pasteSlice";
import toast from "react-hot-toast";

const UserPastes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const { myPastes, loading } = useSelector((state) => state.paste);
  const [searchTerm, setSearchTerm] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your pastes.");
      navigate("/");
    } else {
      dispatch(fetchMyPastes(user.uid));
    }
  }, [user]);

  const filteredPastes = myPastes.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(pasteId) {
    if (window.confirm("Delete this paste?")) {
      dispatch(deletePasteFromCloud(pasteId));
    }
  }

  function handleShare(paste) {
    if (navigator.share) {
      navigator.share({
        title: paste.title,
        text: paste.content,
        url: `${window.location.origin}/pastes/${paste._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/pastes/${paste._id}`
      );
      toast.success("Link copied!");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100dvh-64px)] w-full bg-zinc-950 text-zinc-200 font-mono flex flex-col">
      <div className="flex-1 w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-sm sm:text-lg font-bold tracking-widest uppercase text-zinc-300">
            🗂 My Pastes
          </h1>
          <p className="text-[10px] sm:text-xs text-zinc-600 mt-1 tracking-wide">
            Only you can see this list. Your pastes are anonymous to everyone else.
          </p>
        </div>

        {/* Anonymous reminder badge */}
        <div className="mb-5 inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-[10px] text-zinc-400 tracking-wide">
          <span className="text-green-400">●</span>
          You are anonymous — no one can trace these pastes back to you
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            type="search"
            placeholder="Search your pastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center text-zinc-600 py-16 text-xs tracking-widest uppercase animate-pulse">
            Loading your pastes...
          </div>
        ) : filteredPastes.length === 0 ? (
          <div className="text-center text-zinc-600 py-16 text-xs tracking-widest uppercase">
            {searchTerm ? "No pastes match your search" : "You haven't created any pastes yet"}
            <div className="mt-4">
              <Link
                to="/"
                className="text-indigo-400 hover:text-indigo-300 underline text-[10px]"
              >
                Create your first paste →
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPastes.map((paste) => (
              <div
                key={paste._id}
                className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg shadow-black/30 hover:border-zinc-700 transition-colors"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 sm:px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-semibold text-zinc-200 tracking-wide truncate">
                      {paste.title}
                    </h3>
                    {/* Owner badge — only visible to the owner */}
                    <span className="text-[9px] text-indigo-500 border border-indigo-900 rounded px-1.5 py-0.5 tracking-widest uppercase">
                      yours
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-zinc-500">
                    {new Date(paste.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Content preview */}
                <div className="px-3 sm:px-5 py-4">
                  <pre className="text-xs sm:text-sm text-zinc-400 whitespace-pre-wrap break-words line-clamp-3 leading-6">
                    {paste.content}
                  </pre>
                </div>

                {/* Actions — Edit/Delete available only because user is the owner */}
                <div className="px-3 sm:px-5 py-3 border-t border-zinc-800 flex flex-wrap gap-2">
                  <Link
                    to={`/pastes/${paste._id}`}
                    className="flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    👁 View
                  </Link>

                  {/* ✏️ Edit — only owner sees this */}
                  <Link
                    to={`/?pasteId=${paste._id}`}
                    className="flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    ✏️ Edit
                  </Link>

                  {/* 🗑 Delete — only owner sees this */}
                  <button
                    onClick={() => handleDelete(paste._id)}
                    className="flex-1 sm:flex-none text-xs px-3 py-2 rounded border border-red-900 text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors"
                  >
                    🗑 Delete
                  </button>

                  <button
                    onClick={() => handleShare(paste)}
                    className="flex-1 sm:flex-none text-xs px-3 py-2 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    🔗 Share
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paste.content);
                      toast.success("Copied!");
                    }}
                    className="flex-1 sm:flex-none text-xs px-3 py-2 rounded border border-indigo-900 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPastes;