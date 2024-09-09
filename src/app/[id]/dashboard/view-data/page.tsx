"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';


const DynamicPieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart as any) as Promise<typeof PieChart>, { ssr: false });
const DynamicPie = dynamic(() => import('recharts').then((mod) => mod.Pie as any) as Promise<typeof Pie>, { ssr: false });
const DynamicBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart as any) as Promise<typeof BarChart>, { ssr: false });
const DynamicBar = dynamic(() => import('recharts').then((mod) => mod.Bar as any) as Promise<typeof Bar>, { ssr: false });
const DynamicXAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis as any) as Promise<typeof XAxis>, { ssr: false });
const DynamicYAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis as any) as Promise<typeof YAxis>, { ssr: false });
const DynamicTooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip as any) as Promise<typeof Tooltip>, { ssr: false });
const DynamicLegend = dynamic(() => import('recharts').then((mod) => mod.Legend as any) as Promise<typeof Legend>, { ssr: false });
const DynamicCell = dynamic(() => import('recharts').then((mod) => mod.Cell as any) as Promise<typeof Cell>, { ssr: false });

const MainPage = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [gradesFilter, setGradesFilter] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  useEffect(() => {
    fetch("/data/sihcgpaatt.json")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data); // Initialize filteredData with all data
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  useEffect(() => {
    updateStudentList();
  }, [gradesFilter, attendanceFilter, branchFilter, data]);

  const updateStudentList = () => {
    const filtered = data.filter((student) => {
      const gradeCondition =
        gradesFilter === "" ||
        (gradesFilter === "above-9" && student.GRADES > 9) ||
        (gradesFilter === "9-to-8" && student.GRADES <= 9 && student.GRADES >= 8) ||
        (gradesFilter === "7-to-8" && student.GRADES < 8 && student.GRADES >= 7) ||
        (gradesFilter === "below-7" && student.GRADES < 7);

      const attendanceCondition =
        attendanceFilter === "" ||
        (attendanceFilter === "above-95" && student.Attendance > 95) ||
        (attendanceFilter === "90-to-95" && student.Attendance <= 95 && student.Attendance >= 90) ||
        (attendanceFilter === "85-to-90" && student.Attendance < 90 && student.Attendance >= 85) ||
        (attendanceFilter === "75-to-85" && student.Attendance < 85 && student.Attendance >= 75) ||
        (attendanceFilter === "below-75" && student.Attendance < 75);

      const branchCondition = branchFilter === "" || student.BRANCH === branchFilter;

      return gradeCondition && attendanceCondition && branchCondition;
    });

    setFilteredData(filtered);
  };

  const prepareChartData = (type) => {
    if (type === 'grades') {
      const gradeRanges = {
        'Above 9': 0,
        '8 to 9': 0,
        '7 to 8': 0,
        'Below 7': 0
      };
      filteredData.forEach(student => {
        if (student.GRADES > 9) gradeRanges['Above 9']++;
        else if (student.GRADES >= 8) gradeRanges['8 to 9']++;
        else if (student.GRADES >= 7) gradeRanges['7 to 8']++;
        else gradeRanges['Below 7']++;
      });
      return Object.entries(gradeRanges).map(([name, value]) => ({ name, value }));
    } else if (type === 'attendance') {
      const attendanceRanges = {
        'Above 95%': 0,
        '90% to 95%': 0,
        '85% to 90%': 0,
        '75% to 85%': 0,
        'Below 75%': 0
      };
      filteredData.forEach(student => {
        if (student.Attendance > 95) attendanceRanges['Above 95%']++;
        else if (student.Attendance >= 90) attendanceRanges['90% to 95%']++;
        else if (student.Attendance >= 85) attendanceRanges['85% to 90%']++;
        else if (student.Attendance >= 75) attendanceRanges['75% to 85%']++;
        else attendanceRanges['Below 75%']++;
      });
      return Object.entries(attendanceRanges).map(([name, value]) => ({ name, value }));
    }
    return [];
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const openChartPopup = (type) => {
    const chartData = prepareChartData(type);
    const popup = window.open('', '_blank', 'width=800,height=600');
    popup.document.write(`
      <html>
        <head>
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Chart</title>
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        </head>
        <body>
          <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Distribution</h2>
          <div style="display: flex; justify-content: center;">
            <div style="width: 400px; height: 400px;">
              <canvas id="pieChart"></canvas>
            </div>
            <div style="width: 400px; height: 400px;">
              <canvas id="barChart"></canvas>
            </div>
          </div>
          <script>
            const chartData = ${JSON.stringify(chartData)};
            const COLORS = ${JSON.stringify(COLORS)};

            // Pie Chart
            new Chart(document.getElementById('pieChart'), {
              type: 'pie',
              data: {
                labels: chartData.map(item => item.name),
                datasets: [{
                  data: chartData.map(item => item.value),
                  backgroundColor: COLORS
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return \`\${label}: \${value} (\${percentage}%)\`;
                      }
                    }
                  }
                }
              }
            });

            // Bar Chart
            new Chart(document.getElementById('barChart'), {
              type: 'bar',
              data: {
                labels: chartData.map(item => item.name),
                datasets: [{
                  label: '${type.charAt(0).toUpperCase() + type.slice(1)} Distribution',
                  data: chartData.map(item => item.value),
                  backgroundColor: COLORS
                }]
              },
              options: {
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
          </script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <div className="p-4 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Student Data Visualization
      </h1>

      {/* Filter Options */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md max-w-xl mx-auto">
        <div className="mb-4">
          <label htmlFor="filter-grades" className="block text-lg font-semibold mb-2">Filter by Grades:</label>
          <select
            id="filter-grades"
            value={gradesFilter}
            onChange={(e) => setGradesFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="above-9">Above 9</option>
            <option value="9-to-8">9 to 8</option>
            <option value="7-to-8">7 to 8</option>
            <option value="below-7">Below 7</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="filter-attendance" className="block text-lg font-semibold mb-2">Filter by Attendance:</label>
          <select
            id="filter-attendance"
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="above-95">Above 95%</option>
            <option value="90-to-95">90% to 95%</option>
            <option value="85-to-90">85% to 90%</option>
            <option value="75-to-85">75% to 85%</option>
            <option value="below-75">Below 75%</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="filter-branch" className="block text-lg font-semibold mb-2">Filter by Branch:</label>
          <select
            id="filter-branch"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">ME</option>
            {/* Add other branches as needed */}
          </select>
        </div>
      </div>

      {/* Buttons to view charts */}
      <div className="text-center mb-4">
        <button
          onClick={() => openChartPopup('grades')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
        >
          View Grades Chart
        </button>
        <button
          onClick={() => openChartPopup('attendance')}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
        >
          View Attendance Chart
        </button>
      </div>

      {/* Container for student list */}
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-gray-100 border border-gray-300 rounded-lg shadow-md mx-auto text-black">
          <thead>
            <tr className="bg-gray-200 text-black">
              <th className="p-3 text-left">Registration Number</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Grades</th>
              <th className="p-3 text-left">Attendance</th>
              <th className="p-3 text-left">Branch</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={index}>
                <td className="p-3 border">{student.REGNO}</td>
                <td className="p-3 border">{student.NAME}</td>
                <td className="p-3 border">{student.GRADES}</td>
                <td className="p-3 border">{student.Attendance}</td>
                <td className="p-3 border">{student.BRANCH}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPage;
