import dashboardOpts from './dashboard_options.js';
import dashboardEventHandlers from './dashboard_event_handlers.js';
import { calculateColor, fetchWeeklyReportsData, doughnutChartFactory, stringToObject, viewReady } from './utilities.js';

(function() {
  initDashboard(dashboardOpts);

  Number.isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' && 
      isFinite(value) && 
      Math.floor(value) === value;
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
    }

    fetchWeeklyReportsData(options["spreadsheetData"], parseTeamMemberScores);
  }

  function parseTeamMemberScores(weeklyReportsData) {
    weeklyReportsData["feed"]["entry"].forEach(function(entry, i) {
      var content = entry["content"]["$t"],
      name = entry["title"]["$t"],
      contentObj = stringToObject(content),
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

      createTeamMemberCharts(
        contentObj,
        dashboardOpts["dashboardDimensions"]
      );
    });

    if (ReportIncompleteCount) {
      appendNode(NoScores, NoScoresMembers);
      appendNode(document.querySelector("." + dashboardOpts["mainClassName"]), NoScores);
    }

    drawAvgScores();
    viewReady(); 
  }

  function add(a, b) {
    return a + b;
  }

  function average(ary, aryLength) {
    var ary = ary.map((x) => parseInt(x, 10));
    return Math.round(ary.reduce(add, 0)/aryLength)
  }

  function drawAvgScores() {
    let tempAggAvg = [],
    aggAgg = average(ReportAverages.avgScore, ReportAverages.avgScore.length),
    completed = document.querySelector(".Aggregate-aggregateCompleted"),
    domElem = document.createElement("span");
    domElem.className = "Aggregate-completedPercent";

    document.querySelector("." + dashboardOpts["avgScoreClassName"]).innerHTML = `${aggAgg}`;
    document.querySelector(".Aggregate-aggregate").style.backgroundColor = calculateColor([0, aggAgg])[1];

    domElem.innerHTML = `${Math.round((ReportMemberCount-ReportIncompleteCount)/ReportMemberCount * 100)}%`;
    completed.insertBefore(domElem, completed.childNodes[0]);

    for (var dimension in ReportAverages) {
      if (ReportAverages.hasOwnProperty(dimension) && dimension !== "avgScore") {
        var avg = average(ReportAverages[dimension], ReportAverages[dimension].length),
        inverseAvg = 100 - avg,
        dimensionSet = [inverseAvg, avg],
        dimensionHTML = document.querySelector(`.${dimension}`);

        appendNode(
          dimensionHTML,
          doughnutChartFactory(dimensionSet, calculateColor(dimensionSet), "100px", avg)
        );
      }
    } 
  }

  function createNoScoresSection() {
    window.NoScores = document.createElement("section");
    let h2 = document.createElement("h2"),
    row = document.createElement("div");

    NoScores.className = dashboardOpts["noScoresClassName"];
    h2.className = dashboardOpts["headingClassName"];
    h2.innerHTML = dashboardOpts["noScoresHeadingText"]
    NoScores.appendChild(h2);
    row.className = dashboardOpts["rowClass"] + " " + dashboardOpts["rowClassWrap"];
    
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
    
    nameNode.className = dashboardOpts["chartOpts"]["cellClassName"];
    headShot.className = dashboardOpts["headShotClassName"];
    headShot.style.backgroundImage = "url(" + headShotUrl + ")";

    if (isReportIncomplete) {
      nameNode.setAttribute("data-incomplete-report", "true");
      headShot.style.borderColor = dashboardOpts["chartOpts"]["colors"]["activeColors"][0]["value"];
    }

    name.className = dashboardOpts["nameClassName"];
    name.innerHTML = nameString;
    name.setAttribute("data-name", nameString);
    nameNode.appendChild(headShot);
    nameNode.appendChild(name);

    var htmlToAppendTo = (isReportIncomplete) ? window.NoScoresMembers : dashboardOpts["docFrag"];

    appendNode(
      htmlToAppendTo,
      nameNode
    );
  }

  function createTeamMemberCharts(entryContent, dashboardDimensions) {
    dashboardDimensions.forEach(function(dimensionSet) {
      var set = [
        parseInt(entryContent[dimensionSet[0]], 10),
        parseInt(entryContent[dimensionSet[1]], 10)
      ];

      filterInvalidMemberFields(set);
    });

    drawTeamMemberScores(
      dashboardOpts["docFrag"],
      dashboardOpts["scoresContainerClassName"]
    );
  }

  function filterInvalidMemberFields(dimensionSet) {
    if (Number.isInteger(dimensionSet[0]) && Number.isInteger(dimensionSet[1])) {
      appendNode(
        dashboardOpts["docFrag"],
        doughnutChartFactory(dimensionSet, calculateColor(dimensionSet))
      );
    }
  }

  function appendNode(docFrag, chartElem) {
    docFrag.appendChild(chartElem);
  }

  function drawTeamMemberScores(docFrag, scoresContainerClassName) {
    var row = document.createElement("div");

    setMemberAvgScore(docFrag);
    affixNumberToCell(docFrag);
    row.className = dashboardOpts["rowClass"]; 
    row.appendChild(docFrag);
    document.querySelector("." + scoresContainerClassName).appendChild(row);
  }

  function affixNumberToCell(docFrag) {
    var cells = docFrag.querySelectorAll("." + dashboardOpts["chartOpts"]["cellClassName"]);
    let detailData = [];

    for (var i = 0, ii = cells.length; i < ii; i++) {
      if (i > 0) {
        cells[i].setAttribute("data-cell", i);

        var value = cells[i].firstChild.getAttribute("data-score");
        pushToReportAverages(i, value);
        detailData.push(`${dashboardOpts["dimensionMap"][i]}=${value}`);
      }
    }

    cells[0].setAttribute("data-detail", detailData.join("&"));
  }

  function pushToReportAverages(cellNum, value) {
    var map = dashboardOpts["dimensionMap"];

    window.ReportAverages[map[cellNum]].push(value);
  }

  function setMemberAvgScore(docFrag) {
    var avgScore = calcTeamMemberAvgScore(docFrag),
    headShotElem = "." + dashboardOpts["headShotClassName"],
    avgScoreElem = document.createElement("span"),
    color = calculateColor([0, avgScore])[1];

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

    return parseInt(sum/dimensionCount, 10);
  }
})();

