import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch (err) {
        console.log("Invalid token");
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar token={token} user={user} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {!token ? (
          <div className="grid md:grid-cols-2 gap-10">
            <Login setToken={setToken} />
            <Signup setToken={setToken} />
          </div>
        ) : user?.role === "admin" ? (
          <AdminDashboard token={token} user={user} />
        ) : user?.role === "student" ? (
          <Dashboard token={token} user={user} />
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
}

export default App;