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

  var $$dashboard_token$$default = "1Fg2caxWdjvm_XaGajHNI9rs4N38maqfBx8Tp9wCZ1wQ";

  var $$$global$dashboard_options$$default = {
    spreadsheetData: "https://spreadsheets.google.com/feeds/list/" + $$dashboard_token$$default + "/3/public/basic?alt=json",
    detailSpreadsheetData: "https://spreadsheets.google.com/feeds/list/" + $$dashboard_token$$default + "/1/public/basic?alt=json",
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
      largeHeightWidth: 110,
      height: 60,
      width: 60,
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
            return p > 36 && p <= 70;
          }
        }, {
          value: "#61c275",
          condition: function condition(p) {
            return p > 71;
          }
        }]
      }
    }
  };

  function $$$global$utilities$$fetchWeeklyReportsData(endPoint, callback) {
    axios.get(endPoint).then(function (response) {
      callback(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function $$$global$utilities$$appendNode(docFrag, chartElem) {
    docFrag.appendChild(chartElem);
  }

  function $$$global$utilities$$isReportIncomplete(content) {
    var re = /: x/g;

    return re.test(content);
  }

  function $$$global$utilities$$add(a, b) {
    return a + b;
  }

  function $$$global$utilities$$average(ary, aryLength) {
    var ary = ary.map(function (x) {
      return parseInt(x, 10);
    });
    return Math.round(ary.reduce($$$global$utilities$$add, 0) / aryLength);
  }

  function $$$global$utilities$$stringToObject(contentString) {
    var ary = contentString.split(','),
        tempObj = {};

    ary.forEach(function (item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }

  function $$$global$utilities$$detailStringToObject(contentString) {
    var tempObj = {},
        keyOrder = [{
      start: "name:",
      end: ", emailaddress:"
    }, {
      start: "high:",
      end: ", low:"
    }, {
      start: "low:",
      end: ", jobsatisfaction:"
    }, {
      start: "isthereanythingthatasyourleadericouldbedoingbetteroryouwantmetoknow:",
      end: ", daterange:"
    }];

    keyOrder.forEach(function (dimension, i) {
      var keyStart = contentString.indexOf(dimension.start);
      var keyLength = dimension.start.length;
      var valueStart = keyStart + keyLength;
      var valueEnd = contentString.indexOf(dimension.end);
      var key = contentString.substr(keyStart, keyLength - 1);

      tempObj[key] = contentString.substring(valueStart + 1, valueEnd);
    });

    return tempObj;
  }

  function $$$global$utilities$$calculateColor(dimensionSet) {
    var colorAry = [$$$global$dashboard_options$$default["chartOpts"]["colors"]["inverseColor"]];

    $$$global$dashboard_options$$default["chartOpts"]["colors"]["activeColors"].some(function (color) {
      var isColor = color.condition(dimensionSet[1]);

      if (isColor) {
        colorAry.push(color.value);
        return true;
      }
    });

    return colorAry;
  }

  function $$$global$utilities$$doughnutChartFactory(chartData, colors, size) {
    var chart = document.createElement("canvas"),
        ctx = chart.getContext('2d'),
        chartCell = document.createElement("div");

    if (size) {
      ctx.canvas.height = ctx.canvas.width = size * 2;
    } else {
      ctx.canvas.height = $$$global$dashboard_options$$default["chartOpts"]["height"] * 2;
      ctx.canvas.width = $$$global$dashboard_options$$default["chartOpts"]["width"] * 2;
    }

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
          duration: 200,
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
      chart.style.width = chart.style.height = size + "px";
    } else {
      chart.style.height = $$$global$dashboard_options$$default["chartOpts"]["height"] + "px";
      chart.style.width = $$$global$dashboard_options$$default["chartOpts"]["width"] + "px";
    }

    chart.className = $$$global$dashboard_options$$default["chartOpts"]["chartClassName"];
    chartCell.className = $$$global$dashboard_options$$default["chartOpts"]["cellClassName"];
    chartCell.appendChild(chart);
    return chartCell;
  }

  function $$$global$utilities$$getParameterByName(name, url) {
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

  function $$$global$utilities$$viewReady() {
    var container = document.querySelector(".u-container"),
        loader = document.querySelector(".u-loader");

    loader.parentNode.removeChild(loader);
    container.setAttribute("class", "u-container u-ready");
  }

  (function () {
    var highsLowsDocFrag = document.createDocumentFragment();
    var teamMemberData;

    $$$global$utilities$$fetchWeeklyReportsData($$$global$dashboard_options$$default["spreadsheetData"], fetchHighLowData);

    function fetchHighLowData(dimensionData) {
      teamMemberData = dimensionData;

      $$$global$utilities$$fetchWeeklyReportsData($$$global$dashboard_options$$default["detailSpreadsheetData"], initHighsLowsView);
    }

    function initHighsLowsView(weeklyReportsData) {
      weeklyReportsData["feed"]["entry"].forEach(function (teamMember) {
        drawMemberRows(teamMember);
      });

      appendHighsLowsDocFrag();
      $$$global$utilities$$viewReady();
      console.log(teamMemberData);
    }

    function appendHighsLowsDocFrag() {
      document.querySelector("." + $$$global$dashboard_options$$default["scoresContainerClassName"]).appendChild(highsLowsDocFrag);
    }

    function drawMemberRows(teamMember) {
      var row = document.createElement("div");
      var contentStr = teamMember["content"]["$t"],
          contentObj = $$$global$utilities$$detailStringToObject(contentStr),
          name = contentObj["name"],
          headshot = contentObj["headshot"],
          high = contentObj["high"],
          low = contentObj["low"];

      row.className = $$$global$dashboard_options$$default["rowClass"];
      row.appendChild(drawTeamMember(name, headshot));
      row.appendChild(drawTeamMemberHighsLows([high, low]));
      highsLowsDocFrag.appendChild(row);
    }

    function drawTeamMember(nameString, headShotUrl) {

      var nameNode = document.createElement("div"),
          headShot = document.createElement("span"),
          name = document.createElement("span");

      nameNode.className = $$$global$dashboard_options$$default["chartOpts"]["cellClassName"];
      headShot.className = $$$global$dashboard_options$$default["headShotClassName"];

      if (typeof headShotUrl !== 'undefined') {
        headShot.style.backgroundImage = "url(" + headShotUrl + ")";
      }

      name.className = $$$global$dashboard_options$$default["nameClassName"];
      name.innerHTML = nameString;
      name.setAttribute("data-name", nameString);
      nameNode.appendChild(headShot);
      nameNode.appendChild(name);

      return nameNode;
    }

    function drawTeamMemberHighsLows(highLow) {
      var docFrag = document.createDocumentFragment();

      highLow.forEach(function (value) {
        var span = document.createElement('span');
        span.className = "TeamMemberScores-cell";
        span.innerHTML = value;

        docFrag.appendChild(span);
      });

      return docFrag;
    }
  })();
}).call(undefined);