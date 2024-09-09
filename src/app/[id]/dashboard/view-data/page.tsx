"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicPieChart = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.PieChart as typeof import("recharts").PieChart
    ),
  { ssr: false }
);
const DynamicPie = dynamic(
  () =>
    import("recharts").then((mod) => mod.Pie as typeof import("recharts").Pie),
  { ssr: false }
);
const DynamicBarChart = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.BarChart as typeof import("recharts").BarChart
    ),
  { ssr: false }
);
const DynamicBar = dynamic(
  () =>
    import("recharts").then((mod) => mod.Bar as typeof import("recharts").Bar),
  { ssr: false }
);
const DynamicXAxis = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.XAxis as typeof import("recharts").XAxis
    ),
  { ssr: false }
);
const DynamicYAxis = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.YAxis as typeof import("recharts").YAxis
    ),
  { ssr: false }
);
const DynamicTooltip = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Tooltip as typeof import("recharts").Tooltip
    ),
  { ssr: false }
);
const DynamicLegend = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Legend as typeof import("recharts").Legend
    ),
  { ssr: false }
);
const DynamicCell = dynamic(
  () =>
    import("recharts").then(
      (mod) => mod.Cell as typeof import("recharts").Cell
    ),
  { ssr: false }
);

const MainPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [gradesFilter, setGradesFilter] = useState<string>("");
  const [attendanceFilter, setAttendanceFilter] = useState<string>("");
  const [branchFilter, setBranchFilter] = useState<string>("");

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
        (gradesFilter === "9-to-8" &&
          student.GRADES <= 9 &&
          student.GRADES >= 8) ||
        (gradesFilter === "7-to-8" &&
          student.GRADES < 8 &&
          student.GRADES >= 7) ||
        (gradesFilter === "below-7" && student.GRADES < 7);

      const attendanceCondition =
        attendanceFilter === "" ||
        (attendanceFilter === "above-95" && student.Attendance > 95) ||
        (attendanceFilter === "90-to-95" &&
          student.Attendance <= 95 &&
          student.Attendance >= 90) ||
        (attendanceFilter === "85-to-90" &&
          student.Attendance < 90 &&
          student.Attendance >= 85) ||
        (attendanceFilter === "75-to-85" &&
          student.Attendance < 85 &&
          student.Attendance >= 75) ||
        (attendanceFilter === "below-75" && student.Attendance < 75);

      const branchCondition =
        branchFilter === "" || student.BRANCH === branchFilter;

      return gradeCondition && attendanceCondition && branchCondition;
    });

    setFilteredData(filtered);
  };

  const prepareChartData = (type: "grades" | "attendance") => {
    if (type === "grades") {
      const gradeRanges = {
        "Above 9": 0,
        "8 to 9": 0,
        "7 to 8": 0,
        "Below 7": 0,
      };
      filteredData.forEach((student) => {
        if (student.GRADES > 9) gradeRanges["Above 9"]++;
        else if (student.GRADES >= 8) gradeRanges["8 to 9"]++;
        else if (student.GRADES >= 7) gradeRanges["7 to 8"]++;
        else gradeRanges["Below 7"]++;
      });
      return Object.entries(gradeRanges).map(([name, value]) => ({
        name,
        value,
      }));
    } else if (type === "attendance") {
      const attendanceRanges = {
        "Above 95%": 0,
        "90% to 95%": 0,
        "85% to 90%": 0,
        "75% to 85%": 0,
        "Below 75%": 0,
      };
      filteredData.forEach((student) => {
        if (student.Attendance > 95) attendanceRanges["Above 95%"]++;
        else if (student.Attendance >= 90) attendanceRanges["90% to 95%"]++;
        else if (student.Attendance >= 85) attendanceRanges["85% to 90%"]++;
        else if (student.Attendance >= 75) attendanceRanges["75% to 85%"]++;
        else attendanceRanges["Below 75%"]++;
      });
      return Object.entries(attendanceRanges).map(([name, value]) => ({
        name,
        value,
      }));
    }
    return [];
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const openChartPopup = (type: "grades" | "attendance") => {
    const chartData = prepareChartData(type);
    const popup = window.open("", "_blank", "width=800,height=600");
    popup?.document.write(`
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
                  label: '${
                    type.charAt(0).toUpperCase() + type.slice(1)
                  } Distribution',
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
    popup?.document.close();
  };

  return (
    <div className="p-4 min-h-screen bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Student Data Visualization
      </h1>

      {/* Filter Options */}
      <div className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md max-w-xl mx-auto">
        <div className="mb-4">
          <label
            htmlFor="filter-grades"
            className="block text-lg font-semibold mb-2"
          >
            Filter by Grades:
          </label>
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
          <label
            htmlFor="filter-attendance"
            className="block text-lg font-semibold mb-2"
          >
            Filter by Attendance:
          </label>
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
          <label
            htmlFor="filter-branch"
            className="block text-lg font-semibold mb-2"
          >
            Filter by Branch:
          </label>
          <select
            id="filter-branch"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
          </select>
        </div>

        {/* Buttons to Open Charts */}
        <div className="flex justify-around mt-4">
          <button
            onClick={() => openChartPopup("grades")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            View Grades Chart
          </button>
          <button
            onClick={() => openChartPopup("attendance")}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            View Attendance Chart
          </button>
        </div>
      </div>

      {/* Display filtered student data */}
      <div className="max-w-xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Student Details</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Branch</th>
              <th className="border border-gray-300 p-2">Grades</th>
              <th className="border border-gray-300 p-2">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{student.Name}</td>
                <td className="border border-gray-300 p-2">{student.BRANCH}</td>
                <td className="border border-gray-300 p-2">{student.GRADES}</td>
                <td className="border border-gray-300 p-2">
                  {student.Attendance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainPage;
