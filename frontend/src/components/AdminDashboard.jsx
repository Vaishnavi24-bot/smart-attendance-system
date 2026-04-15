import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setStats(data);
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchStats();
    }
  }, [token]);

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold">📊 Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p>Total Students</p>
          <h2 className="text-4xl">{stats.totalStudents || 0}</h2>
        </div>

        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p>Total Attendance</p>
          <h2 className="text-4xl">{stats.totalAttendance || 0}</h2>
        </div>
      </div>

      {/* USERS */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-xl mb-4">Students</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400">
              <th>Name</th>
              <th>Email</th>
              <th>Total Attendance</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-zinc-800">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.totalAttendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;