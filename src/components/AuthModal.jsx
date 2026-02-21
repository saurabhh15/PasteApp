import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, loginUser } from "../redux/authSlice";

const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth ?? { loading: false });
  const modalRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  // Reset fields when switching mode
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) return; // HTML validation handles this but double-check

    if (mode === "signup") {
      const res = await dispatch(registerUser({ email, password }));
      if (!res.error) onClose();
    } else {
      const res = await dispatch(loginUser({ email, password }));
      if (!res.error) onClose();
    }
  };

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      {/* Card */}
      <div
        ref={modalRef}
        className="w-full max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/60 font-mono overflow-hidden"
        style={{ animation: "fadeSlideIn 0.18s ease" }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] text-zinc-500 tracking-widest uppercase">
            {mode === "login" ? "🔑 Login" : "📝 Create Account"}
          </span>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 text-lg leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-[11px] tracking-widest uppercase transition-colors ${
              mode === "login"
                ? "bg-indigo-950 text-indigo-300 border-b-2 border-indigo-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2.5 text-[11px] tracking-widest uppercase transition-colors ${
              mode === "signup"
                ? "bg-indigo-950 text-indigo-300 border-b-2 border-indigo-500"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-6 flex flex-col gap-4">
          {/* Anonymous notice */}
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-[10px] text-zinc-400 tracking-wide leading-relaxed">
            👻 <span className="text-zinc-300">Your identity stays anonymous.</span> Nobody can see who created a paste — only you control your own.
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 tracking-widest uppercase">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-zinc-500 tracking-widest uppercase">
              Password
              <span className="text-zinc-600 ml-1 normal-case">(min 6 chars)</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
              >
                {showPass ? "🙈" : "👁"}
              </button>
            </div>
            {/* Live password strength */}
            {password.length > 0 && (
              <div className="flex gap-1 mt-1">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-0.5 flex-1 rounded-full transition-colors ${
                      i < password.length
                        ? password.length < 6
                          ? "bg-red-500"
                          : password.length < 10
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-zinc-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 text-xs tracking-widest uppercase rounded-lg border border-indigo-700 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 hover:text-indigo-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "🔑 Login"
              : "🚀 Create Account"}
          </button>

          {/* Switch mode hint */}
          <p className="text-center text-[10px] text-zinc-600">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have one?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-indigo-400 hover:text-indigo-300 underline transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>

      {/* Animation keyframe */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;