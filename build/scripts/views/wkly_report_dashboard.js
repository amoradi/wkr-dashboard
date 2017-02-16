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

  var $$dashboard_token$$default = "1jpXSljWBfUO7KKn9tTT6hZOTWYqXGsVTJPTU1HVMShs";

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
      var params = teamMember.getAttribute("data-detail"),
          name = teamMember.childNodes[1].getAttribute("data-name"),
          image = teamMember.childNodes[0].style.backgroundImage.replace(/['"]+/g, ''),
          borderColor = teamMember.childNodes[0].style.borderColor;

      window.location.href = "detail?name=" + name + "&image=" + image + "&borderColor=" + borderColor + "&" + params;
    }
  });

  var $$$event_handlers$dashboard_event_handlers$$bodyRect = document.body.getBoundingClientRect(),
      $$$event_handlers$dashboard_event_handlers$$dimenions = document.querySelector(".TeamMemberScores-dimensions"),
      $$$event_handlers$dashboard_event_handlers$$elemRect = $$$event_handlers$dashboard_event_handlers$$dimenions.getBoundingClientRect(),
      $$$event_handlers$dashboard_event_handlers$$stickyHeight = 59,
      $$$event_handlers$dashboard_event_handlers$$dimensionsOffset = $$$event_handlers$dashboard_event_handlers$$elemRect.bottom + $$$event_handlers$dashboard_event_handlers$$stickyHeight - $$$event_handlers$dashboard_event_handlers$$bodyRect.top,
      $$$event_handlers$dashboard_event_handlers$$stickyDimensionsClass = "StickyDimensions u-sticky-container",
      $$$event_handlers$dashboard_event_handlers$$stickDimensions = document.querySelector(".StickyDimensions.u-sticky-container");

  window.addEventListener("resize", function (e) {
    $$$event_handlers$dashboard_event_handlers$$dimensionsOffset = $$$event_handlers$dashboard_event_handlers$$elemRect.bottom + $$$event_handlers$dashboard_event_handlers$$stickyHeight - $$$event_handlers$dashboard_event_handlers$$bodyRect.top;
  });

  window.addEventListener("scroll", function (e) {
    if (document.body.scrollTop >= $$$event_handlers$dashboard_event_handlers$$dimensionsOffset) {
      $$$event_handlers$dashboard_event_handlers$$stickDimensions.setAttribute("class", $$$event_handlers$dashboard_event_handlers$$stickyDimensionsClass + " u-show");
    } else {
      $$$event_handlers$dashboard_event_handlers$$stickDimensions.setAttribute("class", $$$event_handlers$dashboard_event_handlers$$stickyDimensionsClass);
    }
  });
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
    var scoresDocFrag = document.createDocumentFragment();
    initDashboard($$$global$dashboard_options$$default);

    Number.isInteger = Number.isInteger || function (value) {
      return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    };

    function initDashboard(options) {
      window.ReportIncompleteCount = window.ReportMemberCount = 0;
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

        if ($$$global$utilities$$isReportIncomplete(content)) {
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
        $$$global$utilities$$appendNode(NoScores, NoScoresMembers);
        $$$global$utilities$$appendNode(document.querySelector("." + $$$global$dashboard_options$$default["mainClassName"]), NoScores);
      }

      drawAvgScores();
      appendScoresDocFrag();
      $$$global$utilities$$viewReady();
    }

    function appendScoresDocFrag() {
      document.querySelector("." + $$$global$dashboard_options$$default["scoresContainerClassName"]).appendChild(scoresDocFrag);
    }

    function drawAvgScores() {
      var tempAggAvg = [],
          aggAgg = $$$global$utilities$$average(ReportAverages.avgScore, ReportAverages.avgScore.length),
          completed = document.querySelector(".Aggregate-aggregateCompleted"),
          domElem = document.createElement("span");
      domElem.className = "Aggregate-completedPercent";

      document.querySelector("." + $$$global$dashboard_options$$default["avgScoreClassName"]).innerHTML = "" + aggAgg;
      document.querySelector(".Aggregate-aggregate").style.backgroundColor = $$$global$utilities$$calculateColor([0, aggAgg])[1];

      domElem.innerHTML = Math.round((ReportMemberCount - ReportIncompleteCount) / ReportMemberCount * 100) + "%";
      completed.insertBefore(domElem, completed.childNodes[0]);

      for (var dimension in ReportAverages) {
        if (ReportAverages.hasOwnProperty(dimension) && dimension !== "avgScore") {
          var avg = $$$global$utilities$$average(ReportAverages[dimension], ReportAverages[dimension].length),
              inverseAvg = 100 - avg,
              dimensionSet = [inverseAvg, avg],
              dimensionHTML = document.querySelector("." + dimension);

          $$$global$utilities$$appendNode(dimensionHTML, $$$global$utilities$$doughnutChartFactory(dimensionSet, $$$global$utilities$$calculateColor(dimensionSet), 100, avg));
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

    function drawTeamMember(nameString, headShotUrl, isReportIncomplete) {
      var nameNode = document.createElement("div"),
          headShot = document.createElement("span"),
          name = document.createElement("span");

      nameNode.className = $$$global$dashboard_options$$default["chartOpts"]["cellClassName"];
      headShot.className = $$$global$dashboard_options$$default["headShotClassName"];

      if (typeof headShotUrl !== 'undefined') {
        headShot.style.backgroundImage = "url(" + headShotUrl + ")";
      }

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

      $$$global$utilities$$appendNode(htmlToAppendTo, nameNode);
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
        $$$global$utilities$$appendNode($$$global$dashboard_options$$default["docFrag"], $$$global$utilities$$doughnutChartFactory(dimensionSet, $$$global$utilities$$calculateColor(dimensionSet)));
      }
    }

    function drawTeamMemberScores(docFrag, scoresContainerClassName) {
      var row = document.createElement("div");

      setMemberAvgScore(docFrag);
      affixNumberToCell(docFrag);
      row.className = $$$global$dashboard_options$$default["rowClass"];
      row.appendChild(docFrag);
      scoresDocFrag.appendChild(row);
    }

    function affixNumberToCell(docFrag) {
      var cells = docFrag.querySelectorAll("." + $$$global$dashboard_options$$default["chartOpts"]["cellClassName"]),
          detailData = [];

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