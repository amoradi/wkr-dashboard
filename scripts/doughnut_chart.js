import dashboardOpts from './dashboard_options.js';

export default (chartData, colors, size ) => {
  var chart = document.createElement("canvas"),
  ctx = chart.getContext('2d'),
  chartCell = document.createElement("div");

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [
        {
          data: chartData,
          backgroundColor: colors
        }
      ]
    }, 
    options: {
      tooltips: {
        enabled: false
      },
      animation: {
        animateRotate: true,
        animateScale: true
      },
      cutoutPercentage: 70,
      responsive: false,
      maintainAspectRatio: false
    }
  });

  chartCell.setAttribute("data-avg-score", chartData[1]);
  chart.setAttribute("data-score", chartData[1]);

  if (size) {
    chart.style.width = chart.style.height = size;
  } else {
    chart.style.width = dashboardOpts["chartOpts"]["height"];
    chart.style.height = dashboardOpts["chartOpts"]["width"];
  }

  chart.className = dashboardOpts["chartOpts"]["chartClassName"]
  chartCell.className = dashboardOpts["chartOpts"]["cellClassName"];
  chartCell.appendChild(chart);
  return chartCell;
}
