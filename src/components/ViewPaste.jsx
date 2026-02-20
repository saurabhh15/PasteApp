import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ViewPaste = () => {
  const { id } = useParams();
  const pastes = useSelector((state) => state.paste.pastes);
  const paste = pastes.find((p) => p._id === id);

  if (!paste) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold text-red-400 tracking-widest uppercase">
            Paste Not Found
          </h2>
          <p className="text-zinc-500 mt-2 text-sm">
            The paste you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const lines = paste.content.split("\n");

  return (
    <div className=" w-4xl bg-zinc-950 text-zinc-200 px-4 py-10 font-mono">
      {/* Top breadcrumb */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6 text-xs text-zinc-500 tracking-widest uppercase">
        <span>Pasteboard / View</span>
        <span>{new Date(paste.createdAt).toLocaleString()}</span>
      </div>

      {/* Main card */}
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden border border-zinc-800 shadow-2xl shadow-indigo-950/30">
        {/* Title bar */}
        <div className="bg-zinc-900 border-b border-zinc-800 px-5 py-3 flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="ml-2 text-sm text-zinc-400 tracking-wide truncate">
            {paste.title}
          </span>
        </div>

        {/* Line numbers + content */}
        <div className="flex min-h-96 bg-zinc-950">
          {/* Line numbers */}
          <div className="select-none bg-zinc-900/50 border-r border-zinc-800 px-4 py-5 text-right text-xs text-zinc-600 leading-7 min-w-[48px]">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Content */}
          <pre className="flex-1 px-5 py-5 text-sm leading-7 text-zinc-300 whitespace-pre-wrap break-words overflow-x-auto">
            {paste.content}
          </pre>
        </div>

        {/* Footer */}
        <div className="bg-zinc-900 border-t border-zinc-800 px-5 py-3 flex justify-between items-center">
          <span className="text-xs text-zinc-500 tracking-widest">
            ID: {paste._id}
          </span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(paste.content);
              toast.success("Copied to clipboard!");
            }}
            className="text-xs tracking-widest uppercase text-indigo-400 border border-indigo-900 hover:bg-indigo-950 px-4 py-1.5 rounded transition-colors duration-200 active:scale-95"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Meta info below card */}
      <div className="max-w-4xl mx-auto mt-4 flex justify-end">
        <span className="text-xs text-zinc-500 tracking-wide">
          {lines.length} {lines.length === 1 ? "line" : "lines"} ·{" "}
          {paste.content.length} chars
        </span>
      </div>
    </div>
  );
};

export default ViewPaste;
