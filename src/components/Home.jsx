import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToPastes, updateToPastes } from "../redux/pasteSlice";
import { nanoid } from "nanoid";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const dispatch = useDispatch();
  const pastes = useSelector((state) => state.paste.pastes);

  function createPaste() {
    const paste = {
      _id: pasteId || nanoid(), // ✅ fixed: removed duplicate _id
      title: title,
      content: value,
      createdAt: new Date().toISOString(),
    };

    if (pasteId) {
      dispatch(updateToPastes(paste));
    } else {
      dispatch(addToPastes(paste));
    }

    setTitle("");
    setValue("");
    setSearchParams({});
  }

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
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
    <div className=" w-3.5xl bg-zinc-950 text-zinc-200 font-mono px-4 py-10">
      <div className="w-3xl  mx-auto">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-lg font-bold tracking-widest uppercase text-zinc-300">
            {pasteId ? "✏️ Edit Paste" : "📋 New Paste"}
          </h1>
          <p className="text-xs text-zinc-600 mt-1 tracking-wide">
            {pasteId
              ? "Modify your paste and hit update."
              : "Write something and save it for later."}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-xl shadow-black/40">

          {/* Title bar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <input
              type="text"
              value={title}
              placeholder="Enter title..."
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 bg-transparent text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none tracking-wide"
            />
          </div>

          {/* Line numbers + Textarea */}
          <div className="flex min-h-72">

            {/* Line numbers */}
            <div className="select-none bg-zinc-900/50 border-r border-zinc-800 px-3 py-4 text-right text-xs text-zinc-600 leading-7 min-w-[44px]">
              {(value || " ").split("\n").map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              value={value}
              placeholder="Enter content here..."
              rows={12}
              onChange={(e) => setValue(e.target.value)}
              className="flex-1 bg-transparent px-5 py-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none resize-none leading-7"
            />
          </div>

          {/* Footer with button */}
          <div className="px-5 py-3 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-xs text-zinc-600">
              {value.split("\n").length} lines · {value.length} chars
            </span>
            <button
              onClick={createPaste}
              className="text-xs tracking-widest uppercase px-5 py-2 rounded border border-indigo-700 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 hover:text-indigo-200 active:scale-95 transition-all duration-200"
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