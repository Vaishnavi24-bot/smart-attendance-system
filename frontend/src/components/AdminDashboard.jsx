import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400">Total Students</p>
          <h2 className="text-4xl mt-2">{stats.totalStudents || 0}</h2>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <p className="text-zinc-400">Total Attendance Records</p>
          <h2 className="text-4xl mt-2">{stats.totalAttendance || 0}</h2>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
        <h2 className="text-xl mb-4">Students</h2>

        {users.length === 0 ? (
          <p className="text-zinc-400">No student data found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="py-3 px-4 text-zinc-400">Name</th>
                  <th className="py-3 px-4 text-zinc-400">Email</th>
                  <th className="py-3 px-4 text-zinc-400">Attendance</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-zinc-800 hover:bg-zinc-800/40"
                  >
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      {user.totalAttendance || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;