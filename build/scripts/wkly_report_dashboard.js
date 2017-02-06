"use strict";

(function () {
  "use strict";

  var $$dashboard_options$$default = {
    spreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",
    docFrag: document.createDocumentFragment(),
    dashboardDimensions: [["satisfactioninverse", "satisfaction"], ["workloadinverse", "workload"], ["prodinverse", "productivity"], ["clarityinverse", "clarity"], ["stressinverse", "stresslevel"]],
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

  scripts$wkly_report_dashboard$$initDashboard($$dashboard_options$$default);

  Number.isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };

  function scripts$wkly_report_dashboard$$initDashboard(options) {
    window.ReportIncompleteCount = 0;
    window.ReportAvgScore = [];
    window.ReportAverages = {
      "avgScore": [],
      "avgSatisfaction": [],
      "avgWorkload": [],
      "avgProductivity": [],
      "avgClarity": [],
      "avgStress": []
    };

    scripts$wkly_report_dashboard$$fetchWeeklyReportsData(options["spreadsheetData"]);
  }

  function scripts$wkly_report_dashboard$$fetchWeeklyReportsData(endPoint) {
    axios.get(endPoint).then(function (response) {
      scripts$wkly_report_dashboard$$parseTeamMemberScores(response.data);
    })
    // .catch(function (error) {
    //   console.log(error);
    // }
    //)
    ;
  }

  function scripts$wkly_report_dashboard$$parseTeamMemberScores(weeklyReportsData) {
    weeklyReportsData["feed"]["entry"].forEach(function (entry) {
      var content = entry["content"]["$t"],
          name = entry["title"]["$t"],
          contentObj = scripts$wkly_report_dashboard$$toJson(content),
          headShot = contentObj["headshot"];

      if (scripts$wkly_report_dashboard$$isReportIncomplete(content)) {
        ReportIncompleteCount++;

        if (ReportIncompleteCount == 1) {
          window.NoScoresMembers = scripts$wkly_report_dashboard$$createNoScoresSection();
        }

        scripts$wkly_report_dashboard$$drawTeamMember(name, headShot, true);
        return true;
      }

      scripts$wkly_report_dashboard$$drawTeamMember(name, headShot);

      scripts$wkly_report_dashboard$$createTeamMemberCharts(contentObj, $$dashboard_options$$default["dashboardDimensions"]);
    });

    if (ReportIncompleteCount) {
      scripts$wkly_report_dashboard$$appendNode(NoScores, NoScoresMembers);
      scripts$wkly_report_dashboard$$appendNode(document.querySelector("." + $$dashboard_options$$default["mainClassName"]), NoScores);
    }

    scripts$wkly_report_dashboard$$drawAvgScore();
  }

  function scripts$wkly_report_dashboard$$add(a, b) {
    return a + b;
  }

  function scripts$wkly_report_dashboard$$drawAvgScore() {
    document.querySelector("." + $$dashboard_options$$default["avgScoreClassName"]).innerHTML = Math.round(ReportAvgScore.reduce(scripts$wkly_report_dashboard$$add, 0) / ReportAvgScore.length);
  }

  function scripts$wkly_report_dashboard$$createNoScoresSection() {
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

  function scripts$wkly_report_dashboard$$isReportIncomplete(content) {
    var re = /: x/g;

    return re.test(content);
  }

  function scripts$wkly_report_dashboard$$drawTeamMember(nameString, headShotUrl, isReportIncomplete) {
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
    nameNode.appendChild(headShot);
    nameNode.appendChild(name);

    var htmlToAppendTo = isReportIncomplete ? window.NoScoresMembers : $$dashboard_options$$default["docFrag"];

    scripts$wkly_report_dashboard$$appendNode(htmlToAppendTo, nameNode);
  }

  function scripts$wkly_report_dashboard$$toJson(malformedJson) {
    var array = malformedJson.split(','),
        tempObj = {};

    array.forEach(function (item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }

  function scripts$wkly_report_dashboard$$createTeamMemberCharts(entryContent, dashboardDimensions) {
    dashboardDimensions.forEach(function (dimensionSet) {
      var set = [parseInt(entryContent[dimensionSet[0]], 10), parseInt(entryContent[dimensionSet[1]], 10)];

      scripts$wkly_report_dashboard$$filterInvalidMemberFields(set);
    });

    scripts$wkly_report_dashboard$$drawTeamMemberScores($$dashboard_options$$default["docFrag"], $$dashboard_options$$default["scoresContainerClassName"]);
  }

  function scripts$wkly_report_dashboard$$filterInvalidMemberFields(dimensionSet) {
    if (Number.isInteger(dimensionSet[0]) && Number.isInteger(dimensionSet[1])) {
      scripts$wkly_report_dashboard$$appendNode($$dashboard_options$$default["docFrag"], scripts$wkly_report_dashboard$$doughnutChartFactory(dimensionSet, scripts$wkly_report_dashboard$$calculateColor(dimensionSet)));
    }
  }

  function scripts$wkly_report_dashboard$$calculateColor(dimensionSet) {
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

  function scripts$wkly_report_dashboard$$doughnutChartFactory(chartData, colors) {
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
        responsive: false,
        animation: {
          animateRotate: true,
          animateScale: true
        },
        cutoutPercentage: 70,
        maintainAspectRatio: false
      }
    });

    chart.setAttribute("data-score", chartData[1]);
    chart.style.width = $$dashboard_options$$default["chartOpts"]["height"];
    chart.style.height = $$dashboard_options$$default["chartOpts"]["width"];
    chart.className = $$dashboard_options$$default["chartOpts"]["chartClassName"];
    chartCell.className = $$dashboard_options$$default["chartOpts"]["cellClassName"];
    chartCell.appendChild(chart);
    return chartCell;
  }

  function scripts$wkly_report_dashboard$$appendNode(docFrag, chartElem) {
    docFrag.appendChild(chartElem);
  }

  function scripts$wkly_report_dashboard$$drawTeamMemberScores(docFrag, scoresContainerClassName) {
    var row = document.createElement("div");

    scripts$wkly_report_dashboard$$setMemberAvgScore(docFrag);
    scripts$wkly_report_dashboard$$affixNumberToCell(docFrag);
    row.className = $$dashboard_options$$default["rowClass"];
    row.appendChild(docFrag);
    document.querySelector("." + scoresContainerClassName).appendChild(row);
  }

  function scripts$wkly_report_dashboard$$affixNumberToCell(docFrag) {
    var cells = docFrag.querySelectorAll("." + $$dashboard_options$$default["chartOpts"]["cellClassName"]);

    for (var i = 0, ii = cells.length; i < ii; i++) {
      if (i > 0) {
        cells[i].setAttribute("data-cell", i);

        var value = cells[i].firstChild.getAttribute("data-score");
        scripts$wkly_report_dashboard$$pushToReportAverages(i, value);
      }
    }
  }

  function scripts$wkly_report_dashboard$$pushToReportAverages(cellNum, value) {
    var map = {
      "1": "avgSatisfaction",
      "2": "avgWorkload",
      "3": "avgProductivity",
      "4": "avgClarity",
      "5": "avgStress"
    };

    window.ReportAverages[map[cellNum]].push(value);
  }

  function scripts$wkly_report_dashboard$$setMemberAvgScore(docFrag) {
    var avgScore = scripts$wkly_report_dashboard$$calcTeamMemberAvgScore(docFrag),
        headShotElem = "." + $$dashboard_options$$default["headShotClassName"],
        avgScoreElem = document.createElement("span"),
        color = scripts$wkly_report_dashboard$$calculateColor([0, avgScore])[1];

    ReportAvgScore.push(avgScore);
    avgScoreElem.style.color = color;
    avgScoreElem.innerHTML = "<br />" + avgScore;
    docFrag.querySelector(headShotElem).style.borderColor = color;
    docFrag.querySelector(headShotElem + " + span").appendChild(avgScoreElem);
  }

  function scripts$wkly_report_dashboard$$calcTeamMemberAvgScore(docFrag) {
    var scores = docFrag.querySelectorAll("[data-score]"),
        dimensionCount = scores.length,
        sum = 0;

    for (var i = 0; i < dimensionCount; i++) {
      sum += parseInt(scores[i].getAttribute("data-score"), 10);
    }

    return parseInt(sum / dimensionCount, 10);
  }
}).call(undefined);