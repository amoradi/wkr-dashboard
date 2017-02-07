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
      largeHeightWidth: "100px",
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

  function $$dashboard_event_handlers$$closest(elem, selector, limitClass) {
    do {
      if (elem && elem.nodeType === 1) {
        if (elem.matches(selector)) return elem;
        elem = elem.parentNode;

        if (elem.className === limitClass) return false;
      } else {
        return false;
      }
    } while (elem);
  }

  var $$dashboard_event_handlers$$default = $$dashboard_event_handlers$$closest;

  document.querySelector(".TeamMemberScores-scores").addEventListener("click", function (e) {
    var teamMember = $$dashboard_event_handlers$$closest(e.target, ".TeamMemberScores-row > div:first-child", "TeamMemberScores-scores");

    if (teamMember) {
      var params = teamMember.getAttribute("data-detail");
      var name = teamMember.childNodes[1].getAttribute("data-name");
      var image = teamMember.childNodes[0].style.backgroundImage;
      var borderColor = teamMember.childNodes[0].style.borderColor;
      window.location.href = "detail.html?name=" + name + "&image=" + image + "&borderColor=" + borderColor + "&" + params;
    }
  });

  var $$calculate_color$$default = function $$calculate_color$$default(dimensionSet) {
    var colorAry = [$$dashboard_options$$default["chartOpts"]["colors"]["inverseColor"]];

    $$dashboard_options$$default["chartOpts"]["colors"]["activeColors"].some(function (color) {
      var isColor = color.condition(dimensionSet[1]);

      if (isColor) {
        colorAry.push(color.value);
        return true;
      }
    });

    return colorAry;
  };

  var $$doughnut_chart$$default = function $$doughnut_chart$$default(chartData, colors, size) {
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
  };

  (function () {
    initDashboard($$dashboard_options$$default);

    Number.isInteger = Number.isInteger || function (value) {
      return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };

    function initDashboard(options) {
      window.ReportIncompleteCount = 0;
      window.ReportMemberCount = 0;
      window.ReportAverages = {
        "avgScore": [],
        "satisfaction": [],
        "workload": [],
        "productivity": [],
        "clarity": [],
        "stress": []
      };

      fetchWeeklyReportsData(options["spreadsheetData"]);
    }

    function fetchWeeklyReportsData(endPoint) {
      axios.get(endPoint).then(function (response) {
        parseTeamMemberScores(response.data);
      })
      // .catch(function (error) {
      //   console.log(error);
      // }
      //)
      ;
    }

    function parseTeamMemberScores(weeklyReportsData) {
      weeklyReportsData["feed"]["entry"].forEach(function (entry, i) {
        var content = entry["content"]["$t"],
            name = entry["title"]["$t"],
            contentObj = toJson(content),
            headShot = contentObj["headshot"];
        ReportMemberCount = i + 1;

        if (isReportIncomplete(content)) {
          ReportIncompleteCount++;

          if (ReportIncompleteCount == 1) {
            window.NoScoresMembers = createNoScoresSection();
          }

          drawTeamMember(name, headShot, true);
          return true;
        }

        drawTeamMember(name, headShot);

        createTeamMemberCharts(contentObj, $$dashboard_options$$default["dashboardDimensions"]);
      });

      if (ReportIncompleteCount) {
        appendNode(NoScores, NoScoresMembers);
        appendNode(document.querySelector("." + $$dashboard_options$$default["mainClassName"]), NoScores);
      }

      drawAvgScores();
    }

    function add(a, b) {
      return a + b;
    }

    function average(ary, aryLength) {
      var ary = ary.map(function (x) {
        return parseInt(x, 10);
      });
      return Math.round(ary.reduce(add, 0) / aryLength);
    }

    function drawAvgScores() {
      var tempAggAvg = [],
          aggAgg = average(ReportAverages.avgScore, ReportAverages.avgScore.length),
          completed = document.querySelector(".Aggregate-aggregateCompleted"),
          domElem = document.createElement("span");
      domElem.className = "Aggregate-completedPercent";

      document.querySelector("." + $$dashboard_options$$default["avgScoreClassName"]).innerHTML = "" + aggAgg;
      document.querySelector(".Aggregate-aggregate").style.backgroundColor = $$calculate_color$$default([0, aggAgg])[1];

      domElem.innerHTML = Math.round((ReportMemberCount - ReportIncompleteCount) / ReportMemberCount * 100) + "%";
      completed.insertBefore(domElem, completed.childNodes[0]);

      for (var dimension in ReportAverages) {
        if (ReportAverages.hasOwnProperty(dimension) && dimension !== "avgScore") {
          var avg = average(ReportAverages[dimension], ReportAverages[dimension].length),
              inverseAvg = 100 - avg,
              dimensionSet = [inverseAvg, avg],
              dimensionHTML = document.querySelector("." + dimension);

          appendNode(dimensionHTML, $$doughnut_chart$$default(dimensionSet, $$calculate_color$$default(dimensionSet), $$dashboard_options$$default["chartOpts"]["largeHeightWidth"], avg));
        }
      }
    }

    function createNoScoresSection() {
      window.NoScores = document.createElement("section");
      var h2 = document.createElement("h2"),
          row = document.createElement("div");

      NoScores.className = $$dashboard_options$$default["noScoresClassName"];
      h2.className = $$dashboard_options$$default["headingClassName"];
      h2.innerHTML = $$dashboard_options$$default["noScoresHeadingText"];
      NoScores.appendChild(h2);
      row.className = $$dashboard_options$$default["rowClass"] + " " + $$dashboard_options$$default["rowClassWrap"];

      return row;
    }

    function isReportIncomplete(content) {
      var re = /: x/g;

      return re.test(content);
    }

    function drawTeamMember(nameString, headShotUrl, isReportIncomplete) {
      var nameNode = document.createElement("div"),
          headShot = document.createElement("span"),
          name = document.createElement("span");

      nameNode.className = $$dashboard_options$$default["chartOpts"]["cellClassName"];
      headShot.className = $$dashboard_options$$default["headShotClassName"];
      headShot.style.backgroundImage = "url(" + headShotUrl + ")";

      if (isReportIncomplete) {
        nameNode.setAttribute("data-incomplete-report", "true");
        headShot.style.borderColor = $$dashboard_options$$default["chartOpts"]["colors"]["activeColors"][0]["value"];
      }

      name.className = $$dashboard_options$$default["nameClassName"];
      name.innerHTML = nameString;
      name.setAttribute("data-name", nameString);
      nameNode.appendChild(headShot);
      nameNode.appendChild(name);

      var htmlToAppendTo = isReportIncomplete ? window.NoScoresMembers : $$dashboard_options$$default["docFrag"];

      appendNode(htmlToAppendTo, nameNode);
    }

    function toJson(malformedJson) {
      var array = malformedJson.split(','),
          tempObj = {};

      array.forEach(function (item) {
        item = item.split(': ');
        tempObj[item[0].trim()] = item[1];
      });

      return tempObj;
    }

    function createTeamMemberCharts(entryContent, dashboardDimensions) {
      dashboardDimensions.forEach(function (dimensionSet) {
        var set = [parseInt(entryContent[dimensionSet[0]], 10), parseInt(entryContent[dimensionSet[1]], 10)];

        filterInvalidMemberFields(set);
      });

      drawTeamMemberScores($$dashboard_options$$default["docFrag"], $$dashboard_options$$default["scoresContainerClassName"]);
    }

    function filterInvalidMemberFields(dimensionSet) {
      if (Number.isInteger(dimensionSet[0]) && Number.isInteger(dimensionSet[1])) {
        appendNode($$dashboard_options$$default["docFrag"], $$doughnut_chart$$default(dimensionSet, $$calculate_color$$default(dimensionSet)));
      }
    }

    // function calculateColor(dimensionSet) {
    //   var colorAry = [dashboardOpts["chartOpts"]["colors"]["inverseColor"]];

    //   dashboardOpts["chartOpts"]["colors"]["activeColors"].some(function(color) {
    //     var isColor = color.condition(dimensionSet[1]);

    //     if (isColor) {
    //       colorAry.push(color.value);
    //       return true;
    //     }
    //   });

    //   return colorAry
    // }

    // function doughnutChartFactory(chartData, colors, size, dataAtt) {
    //   var chart = document.createElement("canvas"),
    //   ctx = chart.getContext('2d'),
    //   chartCell = document.createElement("div");

    //   new Chart(ctx, {
    //     type: 'doughnut',
    //     data: {
    //       datasets: [
    //         {
    //           data: chartData,
    //           backgroundColor: colors
    //         }
    //       ]
    //     }, 
    //     options: {
    //       tooltips: {
    //         enabled: false
    //       },
    //       animation: {
    //         animateRotate: true,
    //         animateScale: true
    //       },
    //       cutoutPercentage: 70,
    //       responsive: false,
    //       maintainAspectRatio: false
    //     }
    //   });

    //   chartCell.setAttribute("data-avg-score", chartData[1]);
    //   chart.setAttribute("data-score", chartData[1]);

    //   if (size) {
    //     chart.style.width = chart.style.height = size;
    //   } else {
    //     chart.style.width = dashboardOpts["chartOpts"]["height"];
    //     chart.style.height = dashboardOpts["chartOpts"]["width"];
    //   }

    //   chart.className = dashboardOpts["chartOpts"]["chartClassName"]
    //   chartCell.className = dashboardOpts["chartOpts"]["cellClassName"];
    //   chartCell.appendChild(chart);
    //   return chartCell;
    // }

    function appendNode(docFrag, chartElem) {
      docFrag.appendChild(chartElem);
    }

    function drawTeamMemberScores(docFrag, scoresContainerClassName) {
      var row = document.createElement("div");

      setMemberAvgScore(docFrag);
      affixNumberToCell(docFrag);
      row.className = $$dashboard_options$$default["rowClass"];
      row.appendChild(docFrag);
      document.querySelector("." + scoresContainerClassName).appendChild(row);
    }

    function affixNumberToCell(docFrag) {
      var cells = docFrag.querySelectorAll("." + $$dashboard_options$$default["chartOpts"]["cellClassName"]);
      var detailData = [];

      for (var i = 0, ii = cells.length; i < ii; i++) {
        if (i > 0) {
          cells[i].setAttribute("data-cell", i);

          var value = cells[i].firstChild.getAttribute("data-score");
          pushToReportAverages(i, value);
          detailData.push($$dashboard_options$$default["dimensionMap"][i] + "=" + value);
        }
      }

      cells[0].setAttribute("data-detail", detailData.join("&"));
    }

    function pushToReportAverages(cellNum, value) {
      var map = $$dashboard_options$$default["dimensionMap"];

      window.ReportAverages[map[cellNum]].push(value);
    }

    function setMemberAvgScore(docFrag) {
      var avgScore = calcTeamMemberAvgScore(docFrag),
          headShotElem = "." + $$dashboard_options$$default["headShotClassName"],
          avgScoreElem = document.createElement("span"),
          color = $$calculate_color$$default([0, avgScore])[1];

      ReportAverages["avgScore"].push(avgScore);
      avgScoreElem.style.color = color;
      avgScoreElem.innerHTML = "<br />" + avgScore;
      docFrag.querySelector(headShotElem).style.borderColor = color;
      docFrag.querySelector(headShotElem + " + span").appendChild(avgScoreElem);
    }

    function calcTeamMemberAvgScore(docFrag) {
      var scores = docFrag.querySelectorAll("[data-score]"),
          dimensionCount = scores.length,
          sum = 0;

      for (var i = 0; i < dimensionCount; i++) {
        sum += parseInt(scores[i].getAttribute("data-score"), 10);
      }

      return parseInt(sum / dimensionCount, 10);
    }
  })();
}).call(undefined);