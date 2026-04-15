const Navbar = ({ token, user, onLogout, setPage }) => {
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-600 rounded-2xl flex items-center justify-center text-xl">
            📅
          </div>
          <h1 className="text-2xl font-semibold header tracking-tight">
            Smart Attendance
          </h1>
        </div>

        {/* Right Section */}
        {token && user && (
          <div className="flex items-center gap-4">

            {/* Welcome */}
            <div className="text-sm flex items-center gap-2">
              Welcome, 
              <span className="font-medium text-violet-400">
                {user.name}
              </span>

              {user.role === "admin" && (
                <span className="px-2 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-full">
                  Admin
                </span>
              )}
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => setPage("dashboard")}
              className="px-4 py-2 bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 rounded-xl text-sm"
            >
              Dashboard
            </button>

            {/* Admin Button */}
            {user.role === "admin" && (
              <button
                onClick={() => setPage("admin")}
                className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-xl text-sm"
              >
                Admin Panel
              </button>
            )}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="px-5 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-xl text-sm font-medium transition"
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;