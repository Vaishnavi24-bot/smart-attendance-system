import { useState, useEffect } from 'react';
import AttendanceTable from './AttendanceTable';
import AttendanceChart from './AttendanceChart';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = ({ token, user }) => {
  const [attendances, setAttendances] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/attendance/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setAttendances(data.attendances || []);
        setStats(data.stats || {});
      }
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    setMessage('');
    try {
      const res = await fetch(`${API_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Attendance marked successfully!');
        await fetchAttendance();        // Refresh data immediately
      } else {
        setMessage(data.message || 'Failed to mark attendance');
      }
    } catch (err) {
      setMessage('Cannot connect to backend');
    }
  };

  useEffect(() => {
    if (token) fetchAttendance();
  }, [token]);

  return (
    <div className="space-y-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-4xl font-semibold header">Welcome back, {user?.name} 👋</h1>
          <p className="text-zinc-400 mt-2">Role: <span className="capitalize">{user?.role}</span></p>
        </div>

        <button
          onClick={markAttendance}
          className="px-10 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-medium text-lg transition-all"
        >
          📍 Mark Today's Attendance
        </button>
      </div>

      {message && (
        <div className="bg-emerald-900/30 border border-emerald-500 text-emerald-400 px-6 py-4 rounded-2xl">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-zinc-400">Total Days Marked</p>
          <p className="text-6xl font-semibold mt-3">{stats.totalMarked || 0}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-zinc-400">Attendance Percentage</p>
          <p className="text-6xl font-semibold mt-3 text-emerald-400">{stats.percentage || 0}%</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <p className="text-zinc-400">Expected Classes</p>
          <p className="text-6xl font-semibold mt-3">60</p>
        </div>
      </div>

      <AttendanceChart attendances={attendances} />
      <AttendanceTable attendances={attendances} loading={loading} />
    </div>
  );
};

export default Dashboard;