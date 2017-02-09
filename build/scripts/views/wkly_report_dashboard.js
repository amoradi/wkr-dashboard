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

  var $$$global$dashboard_options$$default = {
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

  function $$$event_handlers$dashboard_event_handlers$$closest(elem, selector, limitClass) {
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

  var $$$event_handlers$dashboard_event_handlers$$default = $$$event_handlers$dashboard_event_handlers$$closest;

  document.querySelector(".TeamMemberScores-scores").addEventListener("click", function (e) {
    var teamMember = $$$event_handlers$dashboard_event_handlers$$closest(e.target, ".TeamMemberScores-row > div:first-child", "TeamMemberScores-scores");

    if (teamMember) {
      var params = teamMember.getAttribute("data-detail");
      var name = teamMember.childNodes[1].getAttribute("data-name");
      var image = teamMember.childNodes[0].style.backgroundImage;
      var borderColor = teamMember.childNodes[0].style.borderColor;
      window.location.href = "detail.html?name=" + name + "&image=" + image + "&borderColor=" + borderColor + "&" + params;
    }
  });
  function $$$global$utilities$$fetchWeeklyReportsData(endPoint, callback) {
    axios.get(endPoint).then(function (response) {
      callback(response.data);
    });
    //   .catch(function (error) {
    //     console.log(error);
    //   }
    // );
  }

  function $$$global$utilities$$stringToObject(contentString) {
    var array = contentString.split(','),
        tempObj = {};

    array.forEach(function (item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
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
      chart.style.width = $$$global$dashboard_options$$default["chartOpts"]["height"];
      chart.style.height = $$$global$dashboard_options$$default["chartOpts"]["width"];
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
    initDashboard($$$global$dashboard_options$$default);

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

      $$$global$utilities$$fetchWeeklyReportsData(options["spreadsheetData"], parseTeamMemberScores);
    }

    function parseTeamMemberScores(weeklyReportsData) {
      weeklyReportsData["feed"]["entry"].forEach(function (entry, i) {
        var content = entry["content"]["$t"],
            name = entry["title"]["$t"],
            contentObj = $$$global$utilities$$stringToObject(content),
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

        createTeamMemberCharts(contentObj, $$$global$dashboard_options$$default["dashboardDimensions"]);
      });

      if (ReportIncompleteCount) {
        appendNode(NoScores, NoScoresMembers);
        appendNode(document.querySelector("." + $$$global$dashboard_options$$default["mainClassName"]), NoScores);
      }

      drawAvgScores();
      $$$global$utilities$$viewReady();
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

      document.querySelector("." + $$$global$dashboard_options$$default["avgScoreClassName"]).innerHTML = "" + aggAgg;
      document.querySelector(".Aggregate-aggregate").style.backgroundColor = $$$global$utilities$$calculateColor([0, aggAgg])[1];

      domElem.innerHTML = Math.round((ReportMemberCount - ReportIncompleteCount) / ReportMemberCount * 100) + "%";
      completed.insertBefore(domElem, completed.childNodes[0]);

      for (var dimension in ReportAverages) {
        if (ReportAverages.hasOwnProperty(dimension) && dimension !== "avgScore") {
          var avg = average(ReportAverages[dimension], ReportAverages[dimension].length),
              inverseAvg = 100 - avg,
              dimensionSet = [inverseAvg, avg],
              dimensionHTML = document.querySelector("." + dimension);

          appendNode(dimensionHTML, $$$global$utilities$$doughnutChartFactory(dimensionSet, $$$global$utilities$$calculateColor(dimensionSet), "100px", avg));
        }
      }
    }

    function createNoScoresSection() {
      window.NoScores = document.createElement("section");
      var h2 = document.createElement("h2"),
          row = document.createElement("div");

      NoScores.className = $$$global$dashboard_options$$default["noScoresClassName"];
      h2.className = $$$global$dashboard_options$$default["headingClassName"];
      h2.innerHTML = $$$global$dashboard_options$$default["noScoresHeadingText"];
      NoScores.appendChild(h2);
      row.className = $$$global$dashboard_options$$default["rowClass"] + " " + $$$global$dashboard_options$$default["rowClassWrap"];

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

      nameNode.className = $$$global$dashboard_options$$default["chartOpts"]["cellClassName"];
      headShot.className = $$$global$dashboard_options$$default["headShotClassName"];
      headShot.style.backgroundImage = "url(" + headShotUrl + ")";

      if (isReportIncomplete) {
        nameNode.setAttribute("data-incomplete-report", "true");
        headShot.style.borderColor = $$$global$dashboard_options$$default["chartOpts"]["colors"]["activeColors"][0]["value"];
      }

      name.className = $$$global$dashboard_options$$default["nameClassName"];
      name.innerHTML = nameString;
      name.setAttribute("data-name", nameString);
      nameNode.appendChild(headShot);
      nameNode.appendChild(name);

      var htmlToAppendTo = isReportIncomplete ? window.NoScoresMembers : $$$global$dashboard_options$$default["docFrag"];

      appendNode(htmlToAppendTo, nameNode);
    }

    function createTeamMemberCharts(entryContent, dashboardDimensions) {
      dashboardDimensions.forEach(function (dimensionSet) {
        var set = [parseInt(entryContent[dimensionSet[0]], 10), parseInt(entryContent[dimensionSet[1]], 10)];

        filterInvalidMemberFields(set);
      });

      drawTeamMemberScores($$$global$dashboard_options$$default["docFrag"], $$$global$dashboard_options$$default["scoresContainerClassName"]);
    }

    function filterInvalidMemberFields(dimensionSet) {
      if (Number.isInteger(dimensionSet[0]) && Number.isInteger(dimensionSet[1])) {
        appendNode($$$global$dashboard_options$$default["docFrag"], $$$global$utilities$$doughnutChartFactory(dimensionSet, $$$global$utilities$$calculateColor(dimensionSet)));
      }
    }

    function appendNode(docFrag, chartElem) {
      docFrag.appendChild(chartElem);
    }

    function drawTeamMemberScores(docFrag, scoresContainerClassName) {
      var row = document.createElement("div");

      setMemberAvgScore(docFrag);
      affixNumberToCell(docFrag);
      row.className = $$$global$dashboard_options$$default["rowClass"];
      row.appendChild(docFrag);
      document.querySelector("." + scoresContainerClassName).appendChild(row);
    }

    function affixNumberToCell(docFrag) {
      var cells = docFrag.querySelectorAll("." + $$$global$dashboard_options$$default["chartOpts"]["cellClassName"]);
      var detailData = [];

      for (var i = 0, ii = cells.length; i < ii; i++) {
        if (i > 0) {
          cells[i].setAttribute("data-cell", i);

          var value = cells[i].firstChild.getAttribute("data-score");
          pushToReportAverages(i, value);
          detailData.push($$$global$dashboard_options$$default["dimensionMap"][i] + "=" + value);
        }
      }

      cells[0].setAttribute("data-detail", detailData.join("&"));
    }

    function pushToReportAverages(cellNum, value) {
      var map = $$$global$dashboard_options$$default["dimensionMap"];

      window.ReportAverages[map[cellNum]].push(value);
    }

    function setMemberAvgScore(docFrag) {
      var avgScore = calcTeamMemberAvgScore(docFrag),
          headShotElem = "." + $$$global$dashboard_options$$default["headShotClassName"],
          avgScoreElem = document.createElement("span"),
          color = $$$global$utilities$$calculateColor([0, avgScore])[1];

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