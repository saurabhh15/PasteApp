import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 font-mono">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4">

        {/* Wrapper */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Logo */}
          <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs sm:text-sm">
            📋 Pasteboard
          </span>

          {/* Links */}
          <div className="flex w-full sm:w-auto gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex-1 sm:flex-none text-center text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border transition-colors duration-200 ${
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
                `flex-1 sm:flex-none text-center text-xs tracking-widest uppercase px-3 sm:px-4 py-2 rounded border transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-950 border-indigo-700 text-indigo-300"
                    : "border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`
              }
            >
              Pastes
            </NavLink>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;