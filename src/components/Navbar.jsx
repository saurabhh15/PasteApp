import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 font-mono">
      <div className="max-w-4xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm">
          📋 Pasteboard
        </span>

        {/* Links */}
        <div className="flex gap-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-xs tracking-widest uppercase px-4 py-2 rounded border transition-colors duration-200 ${
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
              `text-xs tracking-widest uppercase px-4 py-2 rounded border transition-colors duration-200 ${
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
    </nav>
  );
};

export default Navbar;