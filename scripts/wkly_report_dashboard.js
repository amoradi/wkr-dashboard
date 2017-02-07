import dashboardOpts from './dashboard_options.js';
import dashboardEventHandlers from './dashboard_event_handlers.js';

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
    "avgSatisfaction": [],
    "avgWorkload": [],
    "avgProductivity": [],
    "avgClarity": [],
    "avgStress": []
  }

  fetchWeeklyReportsData(options["spreadsheetData"]);
}

function fetchWeeklyReportsData(endPoint) {
  axios.get(endPoint)
    .then(function (response) {
      parseTeamMemberScores(response.data);
    })
    // .catch(function (error) {
    //   console.log(error);
    // }
  //)
  ;
}

function parseTeamMemberScores(weeklyReportsData) {
  weeklyReportsData["feed"]["entry"].forEach(function(entry, i) {
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
  nameNode.appendChild(headShot);
  nameNode.appendChild(name);

  var htmlToAppendTo = (isReportIncomplete) ? window.NoScoresMembers : dashboardOpts["docFrag"];

  appendNode(
    htmlToAppendTo,
    nameNode
  );
}

function toJson(malformedJson) {
  var array = malformedJson.split(','),
  tempObj = {};

  array.forEach(function(item) {
    item = item.split(': ');
    tempObj[item[0].trim()] = item[1];
  });

  return tempObj;
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

function calculateColor(dimensionSet) {
  var colorAry = [dashboardOpts["chartOpts"]["colors"]["inverseColor"]];

  dashboardOpts["chartOpts"]["colors"]["activeColors"].some(function(color) {
    var isColor = color.condition(dimensionSet[1]);

    if (isColor) {
      colorAry.push(color.value);
      return true;
    }
  });

  return colorAry
}

function doughnutChartFactory(chartData, colors, size, dataAtt) {
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

  for (var i = 0, ii = cells.length; i < ii; i++) {
    if (i > 0) {
      cells[i].setAttribute("data-cell", i);

      var value = cells[i].firstChild.getAttribute("data-score");
      pushToReportAverages(i, value);
    }
  }
}

function pushToReportAverages(cellNum, value) {
  var map = {
    "1": "avgSatisfaction",
    "2": "avgWorkload",
    "3": "avgProductivity",
    "4": "avgClarity",
    "5": "avgStress"
  }

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
