import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});

  // ✅ FETCH USERS
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

  // ✅ FETCH STATS
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

  // ✅ MARK ATTENDANCE (NEW)
  const markAttendance = async (userId, status) => {
    try {
      await fetch(`${API_URL}/api/admin/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, status }),
      });

      fetchUsers(); // refresh after update
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ RUN ON LOAD
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
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p>Total Students</p>
          <h2 className="text-4xl">{stats.totalStudents || 0}</h2>
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <p>Total Attendance</p>
          <h2 className="text-4xl">{stats.totalAttendance || 0}</h2>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-xl mb-4">Students</h2>

        {users.length === 0 ? (
          <p>No student data found</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th>Name</th>
                <th>Email</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-zinc-800">
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.totalAttendance}</td>

                  <td className="flex gap-2 py-2">
                    <button
                      onClick={() => markAttendance(user._id, "present")}
                      className="px-3 py-1 bg-emerald-600 rounded-lg"
                    >
                      Present
                    </button>

                    <button
                      onClick={() => markAttendance(user._id, "absent")}
                      className="px-3 py-1 bg-red-600 rounded-lg"
                    >
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;