const openChartPopup = (type: string) => {
  const chartData = prepareChartData(type);
  const popup = window.open('', '_blank', 'width=800,height=600');
  if (popup) {
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
                        return label + ': ' + value + ' (' + percentage + '%)';
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
  }
};
