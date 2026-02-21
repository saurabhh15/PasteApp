import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addPasteToCloud, updatePasteInCloud } from "../redux/pasteSlice";
import toast from "react-hot-toast";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const pastes = useSelector((state) => state.paste.pastes);
  const myPastes = useSelector((state) => state.paste.myPastes);
  const user = useSelector((state) => state.auth?.user);

  function createPaste() {
    if (!user) {
      toast.error("Please login to create a paste!");
      return;
    }

    if (!title.trim() || !value.trim()) {
      toast.error("Title and content cannot be empty!");
      return;
    }

    if (pasteId) {
      dispatch(
        updatePasteInCloud({
          _id: pasteId,
          title,
          content: value,
          createdAt: new Date().toISOString(),
        })
      );
    } else {
      dispatch(
        addPasteToCloud({
          title,
          content: value,
          createdAt: new Date().toISOString(),
        })
      );
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  }

  useEffect(() => {
    if (pasteId) {
      // Check both public pastes and myPastes for the one being edited
      const paste =
        myPastes.find((p) => p._id === pasteId) ||
        pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setValue(paste.content);
      }
    } else {
      setTitle("");
      setValue("");
    }
  }, [pasteId]);

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-200 font-mono flex flex-col">
      <div className="flex-1 w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        {/* Heading */}
        <div className="mb-5 sm:mb-6">
          <h1 className="text-sm sm:text-lg font-bold tracking-widest uppercase text-zinc-300">
            {pasteId ? "✏️ Edit Paste" : "📋 New Paste"}
          </h1>
          <p className="text-[10px] sm:text-xs text-zinc-600 mt-1 tracking-wide">
            {pasteId
              ? "Modify your paste and hit update."
              : user
              ? "Write something and save it for later. You'll stay anonymous."
              : "Login to create and manage your own pastes."}
          </p>
        </div>

        {/* Login prompt banner (shown when logged out) */}
        {!user && (
          <div className="mb-5 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-xs text-zinc-400 tracking-wide flex items-center gap-3">
            <span className="text-yellow-400 text-base">⚠️</span>
            You need to{" "}
            <span className="text-indigo-400 font-semibold">Login / Sign Up</span>{" "}
            to create or edit pastes. Your identity will remain anonymous.
          </div>
        )}

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl shadow-black/40">
          {/* Title bar */}
          <div className="flex items-center gap-3 px-3 sm:px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>

            <input
              type="text"
              value={title}
              placeholder={user ? "Enter title..." : "Login to start typing..."}
              onChange={(e) => setTitle(e.target.value)}
              disabled={!user}
              className="flex-1 bg-transparent text-xs sm:text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Editor */}
          <div className="flex min-h-[50vh]">
            {/* Line numbers */}
            <div className="hidden sm:block select-none bg-zinc-900/50 border-r border-zinc-800 px-3 py-4 text-right text-xs text-zinc-600 leading-7 min-w-[44px]">
              {(value || " ").split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={value}
              placeholder={user ? "Enter content here..." : "Login to write..."}
              rows={12}
              onChange={(e) => setValue(e.target.value)}
              disabled={!user}
              className="flex-1 bg-transparent px-3 sm:px-5 py-4 text-xs sm:text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none leading-6 sm:leading-7 disabled:opacity-40 disabled:cursor-not-allowed"
            />
          </div>

          {/* Footer */}
          <div className="px-3 sm:px-5 py-3 border-t border-zinc-800 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
            <span className="text-[10px] sm:text-xs text-zinc-600">
              {value.split("\n").length} lines · {value.length} chars
            </span>

            <button
              onClick={createPaste}
              disabled={!user}
              className="w-full sm:w-auto text-xs tracking-widest uppercase px-4 sm:px-5 py-2 rounded border border-indigo-700 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 hover:text-indigo-200 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-indigo-950"
            >
              {pasteId ? "⬆ Update Paste" : "＋ Create Paste"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;