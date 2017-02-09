import dashboardOpts from './dashboard_options.js';

export function fetchWeeklyReportsData(endPoint, callback) {
  axios.get(endPoint)
    .then(function (response) {
      callback(response.data);
    })
    .catch(function (error) {
      console.log(error);
    }
  );
}

export function appendNode(docFrag, chartElem) {
  docFrag.appendChild(chartElem);
}

export function isReportIncomplete(content) {
  let re = /: x/g;

  return re.test(content);
}

export function add(a, b) {
  return a + b;
}

export function average(ary, aryLength) {
  var ary = ary.map((x) => parseInt(x, 10));
  return Math.round(ary.reduce(add, 0)/aryLength)
}

export function stringToObject(contentString) {
  let ary = contentString.split(','),
  tempObj = {};

  ary.forEach(function(item) {
    item = item.split(': ');
    tempObj[item[0].trim()] = item[1];
  });

  return tempObj;
}

export function calculateColor(dimensionSet) {
  let colorAry = [dashboardOpts["chartOpts"]["colors"]["inverseColor"]];

  dashboardOpts["chartOpts"]["colors"]["activeColors"].some(function(color) {
    let isColor = color.condition(dimensionSet[1]);

    if (isColor) {
      colorAry.push(color.value);
      return true;
    }
  });

  return colorAry
}

export function doughnutChartFactory(chartData, colors, size ) {
  let chart = document.createElement("canvas"),
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

export function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  results = regex.exec(url);

  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function viewReady() {
  let container = document.querySelector(".u-container"),
  loader = document.querySelector(".u-loader");

  loader.parentNode.removeChild(loader);
  container.setAttribute("class", "u-container u-ready");
}
