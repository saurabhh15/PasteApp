import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePasteFromCloud } from "../redux/pasteSlice";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Pastes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();

  const filteredData = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleDelete(pasteId) {
    dispatch(deletePasteFromCloud(pasteId));
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
        `${window.location.origin}/pastes/${paste._id}`,
      );
      toast.success("Link copied to clipboard!");
    }
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200 font-mono flex flex-col">
      {/* Page wrapper */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        {/* Search */}
        <div className="mb-6 sm:mb-8">
          <input
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
            type="search"
            placeholder="Search pastes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Paste list */}
        <div className="flex flex-col gap-4">
          {filteredData.length === 0 ? (
            <div className="text-center text-zinc-600 py-16 text-xs sm:text-sm tracking-widest uppercase">
              No pastes found
            </div>
          ) : (
            filteredData.map((paste) => (
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

                {/* Actions */}
                <div className="px-3 sm:px-5 py-3 border-t border-zinc-800 flex flex-wrap gap-2">
                  <Link
                    to={`/pastes/${paste._id}`}
                    className="flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    👁 View
                  </Link>

                  <Link
                    to={`/?pasteId=${paste._id}`}
                    className="flex-1 sm:flex-none text-center text-xs px-3 py-2 rounded border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    ✏️ Edit
                  </Link>

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
                      toast.success("Copied to clipboard!");
                    }}
                    className="flex-1 sm:flex-none text-xs px-3 py-2 rounded border border-indigo-900 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300 transition-colors"
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Pastes;
