import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth ?? { user: null });

  return (
    <>
      {/* ✅ Removed h-16 so mobile height can grow */}
      <nav className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800 font-mono">
        <div className="w-full px-3 sm:px-4 lg:px-8">

          {/* ✅ Mobile = column, Desktop = row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">

            {/* Logo */}
            <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs sm:text-sm whitespace-nowrap">
              📋 Pasteboard
            </span>

            {/* ✅ Removed overflow-hidden */}
            <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-center text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/pastes"
                className={({ isActive }) =>
                  `text-center text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border transition-colors duration-200 ${
                    isActive
                      ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                      : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  }`
                }
              >
                Pastes
              </NavLink>

              {user && (
                <NavLink
                  to="/my-pastes"
                  className={({ isActive }) =>
                    `text-center text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border transition-colors duration-200 ${
                      isActive
                        ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                        : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                    }`
                  }
                >
                  My Pastes
                </NavLink>
              )}

              {user ? (
                <div className="flex items-center gap-2 ml-1">
                  <div
                    title="You're logged in anonymously"
                    className="w-7 h-7 rounded-full bg-indigo-900 border border-indigo-600 flex items-center justify-center text-xs text-indigo-300 select-none"
                  >
                    👤
                  </div>
                  <button
                    onClick={() => dispatch(logoutUser())}
                    className="text-xs tracking-widest uppercase px-3 py-2 rounded border border-zinc-700 text-zinc-400 hover:bg-red-950 hover:border-red-800 hover:text-red-400 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setModalOpen(true)}
                  className="ml-1 text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border border-indigo-700 bg-indigo-950 text-indigo-300 hover:bg-indigo-900 hover:text-indigo-200 active:scale-95 transition-all duration-200"
                >
                  Login / Sign Up
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default Navbar;