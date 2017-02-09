"use strict";

(function () {
  "use strict";

  var $$dimension_map$$default = {
    "1": "satisfaction",
    "2": "workload",
    "3": "productivity",
    "4": "clarity",
    "5": "stress"
  };

  var $$dashboard_options$$default = {
    spreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",
    detailSpreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/1/public/basic?alt=json",
    docFrag: document.createDocumentFragment(),
    dashboardDimensions: [["satisfactioninverse", "satisfaction"], ["workloadinverse", "workload"], ["prodinverse", "productivity"], ["clarityinverse", "clarity"], ["stressinverse", "stresslevel"]],
    dimensionMap: $$dimension_map$$default,
    mainClassName: "TeamMemberScores-colMain",
    avgScoreClassName: "Aggregate-aggregateScore",
    scoresContainerClassName: "TeamMemberScores-scores",
    headingClassName: "TeamMemberScores-heading",
    rowClass: "TeamMemberScores-row",
    rowClassWrap: "TeamMemberScores-rowWrap",
    headShotClassName: "TeamMemberScores-headShot",
    nameClassName: "u-small-label TeamMemberScores-name",
    noScoresClassName: "TeamMemberScores-noScores",
    noScoresHeadingText: "Didn't Fill Out Survey",
    chartOpts: {
      largeHeightWidth: "110px",
      height: "60px",
      width: "60px",
      cellClassName: "TeamMemberScores-cell",
      chartClassName: "TeamMemberScores-chart",
      colors: {
        inverseColor: "#d3d3d3",
        activeColors: [{
          value: "#c26263",
          condition: function condition(p) {
            return p <= 35;
          }
        }, {
          value: "#e3e448",
          condition: function condition(p) {
            return p > 36 && p <= 50;
          }
        }, {
          value: "#61c275",
          condition: function condition(p) {
            return p > 50;
          }
        }]
      }
    }
  };

  function scripts$utilities$$fetchWeeklyReportsData(endPoint, callback) {
    axios.get(endPoint).then(function (response) {
      callback(response.data);
    });
    //   .catch(function (error) {
    //     console.log(error);
    //   }
    // );
  }

  function scripts$utilities$$stringToObject(contentString) {
    var array = contentString.split(','),
        tempObj = {};

    array.forEach(function (item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }

  function scripts$utilities$$calculateColor(dimensionSet) {
    var colorAry = [$$dashboard_options$$default["chartOpts"]["colors"]["inverseColor"]];

    $$dashboard_options$$default["chartOpts"]["colors"]["activeColors"].some(function (color) {
      var isColor = color.condition(dimensionSet[1]);

      if (isColor) {
        colorAry.push(color.value);
        return true;
      }
    });

    return colorAry;
  }

  function scripts$utilities$$doughnutChartFactory(chartData, colors, size) {
    var chart = document.createElement("canvas"),
        ctx = chart.getContext('2d'),
        chartCell = document.createElement("div");

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: chartData,
          backgroundColor: colors
        }]
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
      chart.style.width = $$dashboard_options$$default["chartOpts"]["height"];
      chart.style.height = $$dashboard_options$$default["chartOpts"]["width"];
    }

    chart.className = $$dashboard_options$$default["chartOpts"]["chartClassName"];
    chartCell.className = $$dashboard_options$$default["chartOpts"]["cellClassName"];
    chartCell.appendChild(chart);
    return chartCell;
  }

  function scripts$utilities$$getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function scripts$utilities$$viewReady() {
    var container = document.querySelector(".u-container"),
        loader = document.querySelector(".u-loader");

    loader.parentNode.removeChild(loader);
    container.setAttribute("class", "u-container u-ready");
  }
}).call(undefined);