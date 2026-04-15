import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const Signup = ({ setToken }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    } else {
      setError(data.msg || "Signup failed");
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h2 className="text-3xl font-semibold mb-8">Create Account</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        {/* 🔥 ROLE DROPDOWN */}
        <select
          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4"
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-violet-600 hover:bg-violet-700 py-4 rounded-2xl font-medium text-lg">
          Sign Up
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}
      {message && <p className="text-emerald-400 mt-4">{message}</p>}
    </div>
  );
};

export default Signup;