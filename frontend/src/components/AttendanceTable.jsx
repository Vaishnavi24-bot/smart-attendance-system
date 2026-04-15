const AttendanceTable = ({ attendances, loading }) => {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold mb-6">📋 Attendance Records</h3>

      {loading ? (
        <p className="text-zinc-400">Loading attendance...</p>
      ) : attendances.length === 0 ? (
        <p className="text-zinc-400">No attendance records yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="py-4 px-4 text-zinc-400 font-medium">Date</th>
                <th className="py-4 px-4 text-zinc-400 font-medium">Time</th>
                <th className="py-4 px-4 text-zinc-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((att, index) => (
                <tr key={index} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                  <td className="py-4 px-4">
                    {new Date(att.date).toLocaleDateString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    {new Date(att.date).toLocaleTimeString('en-IN')}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-4 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-sm">
                      Present
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AttendanceTable;