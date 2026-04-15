import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const AdminDashboard = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setUsers(data.users);
  };

  const fetchStats = async () => {
    const res = await fetch(`${API_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setStats(data);
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/api/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  const viewAttendance = async (id) => {
    const res = await fetch(`${API_URL}/api/admin/attendance/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      setAttendance(data.data);
      setSelectedUser(id);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-semibold">👨‍🏫 Admin Panel</h1>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-6 rounded-2xl">
          Total Users: {stats.totalUsers || 0}
        </div>
        <div className="bg-zinc-900 p-6 rounded-2xl">
          Total Attendance: {stats.totalAttendance || 0}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-900 p-6 rounded-2xl">
        <h2 className="text-xl mb-4">All Users</h2>

        <table className="w-full text-center">
          <thead>
            <tr className="border-b border-zinc-700">
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-zinc-800">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => viewAttendance(u._id)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    View
                  </button>

                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Attendance Viewer */}
      {selectedUser && (
        <div className="bg-zinc-900 p-6 rounded-2xl">
          <h2 className="text-xl mb-4">User Attendance</h2>

          {attendance.length === 0 ? (
            <p>No records</p>
          ) : (
            <ul className="space-y-2">
              {attendance.map((a, i) => (
                <li key={i}>
                  {new Date(a.date).toLocaleString("en-IN")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;