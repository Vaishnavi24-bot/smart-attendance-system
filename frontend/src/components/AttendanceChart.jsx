import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const AttendanceChart = ({ attendances }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (attendances.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    // Group attendance by month
    const monthlyData = {};
    attendances.forEach((att) => {
      const month = new Date(att.date).toLocaleString('default', { month: 'short' });
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(monthlyData),
        datasets: [{
          label: 'Days Present',
          data: Object.values(monthlyData),
          backgroundColor: '#6366f1',
          borderColor: '#818cf8',
          borderWidth: 2,
          borderRadius: 8,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa' }
          },
          x: {
            grid: { color: '#27272a' },
            ticks: { color: '#a1a1aa' }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [attendances]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
      <h3 className="text-2xl font-semibold mb-6">📈 Attendance Trend</h3>
      {attendances.length === 0 ? (
        <p className="text-zinc-400">Mark attendance to see the chart</p>
      ) : (
        <canvas ref={chartRef} height="100"></canvas>
      )}
    </div>
  );
};

export default AttendanceChart;