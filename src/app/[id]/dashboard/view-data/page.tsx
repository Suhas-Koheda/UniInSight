"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ComponentType } from "react";

const DynamicPieChart = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.PieChart as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicPie = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then((mod) => mod.Pie as ComponentType<any>),
  { ssr: false }
);
const DynamicBarChart = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.BarChart as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicBar = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then((mod) => mod.Bar as ComponentType<any>),
  { ssr: false }
);
const DynamicXAxis = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.XAxis as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicYAxis = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.YAxis as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicTooltip = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.Tooltip as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicLegend = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.Legend as ComponentType<any>
    ),
  { ssr: false }
);
const DynamicCell = dynamic<ComponentType<any>>(
  () =>
    import("recharts").then(
      (mod) => mod.Cell as ComponentType<any>
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
                        return \\${label}: \${value} (\${percentage}%);
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
    <div>
      <h1>Student Data Analysis</h1>
      <div>
        <label>
          Grade Filter:
          <select
            value={gradesFilter}
            onChange={(e) => setGradesFilter(e.target.value)}
          >
            <option value="">All Grades</option>
            <option value="above-9">Above 9</option>
            <option value="9-to-8">9 to 8</option>
            <option value="7-to-8">7 to 8</option>
            <option value="below-7">Below 7</option>
          </select>
        </label>
        <label>
          Attendance Filter:
          <select
            value={attendanceFilter}
            onChange={(e) => setAttendanceFilter(e.target.value)}
          >
            <option value="">All Attendance</option>
            <option value="above-95">Above 95%</option>
            <option value="90-to-95">90% to 95%</option>
            <option value="85-to-90">85% to 90%</option>
            <option value="75-to-85">75% to 85%</option>
            <option value="below-75">Below 75%</option>
          </select>
        </label>
        <label>
          Branch Filter:
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={() => openChartPopup("grades")}>View Grades Chart</button>
        <button onClick={() => openChartPopup("attendance")}>View Attendance Chart</button>
      </div>
    </div>
  );
};

export default MainPage;