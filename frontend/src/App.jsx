import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Decode JWT → get role + id
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        setToken(null);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar token={token} user={user} onLogout={handleLogout} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* 🔐 NOT LOGGED IN */}
        {!token ? (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Student Login */}
            <Login setToken={setToken} />

            {/* Student Signup */}
            <Signup setToken={setToken} />

            {/* Admin Login */}
            <AdminLogin setToken={setToken} />
          </div>
        ) : user ? (

          /* 👤 LOGGED IN */
          user.role === "admin" ? (
            <AdminDashboard token={token} />
          ) : (
            <Dashboard token={token} user={user} />
          )

        ) : (
          <div className="text-center py-20">
            <p className="text-xl">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;