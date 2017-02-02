var dashboardOpts = {
  spreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",
  docFrag: document.createDocumentFragment(),
  scoresContainerClassName: "TeamMemberScores-scores",
  dashboardDimensions: [
    ["satisfactioninverse", "satisfaction"],
    ["workloadinverse", "workload"],
    ["prodinverse", "productivity"],
    ["clarityinverse","clarity"],
    ["stressinverse", "stresslevel"]
  ],
  rowClass: "TeamMemberScores-row",
  headShotClassName: "TeamMemberScores-headShot",
  nameClassName: "u-small-label TeamMemberScores-name",
  chartOpts: {
    height: "75px",
    width: "75px",
    cellClassName: "TeamMemberScores-cell",
    chartClassName: "TeamMemberScores-chart",
    colors: {
      inverseColor: "#d3d3d3",
      activeColors: [
        {
          value: "#c26263",
          condition: function(p) {
            return p <= 35;
          }
        },
        {
          value: "#e3e448",
          condition: function(p) {
            return p > 36 && p <= 50;
          }
        },
        {
          value: "#61c275",
          condition: function(p) {
            return p > 50;
          }
        }
      ]
    }
  }
};

initDashboard(dashboardOpts);

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === 'number' && 
    isFinite(value) && 
    Math.floor(value) === value;
};

function initDashboard(options) {
  fetchWeeklyReportsData(options["spreadsheetData"]);
}

function fetchWeeklyReportsData(endPoint) {
  axios.get(endPoint)
    .then(function (response) {
      parseTeamMemberScores(response.data);
    })
    .catch(function (error) {
      console.log(error);
    }
  );
}

function parseTeamMemberScores(weeklyReportsData) {
  weeklyReportsData["feed"]["entry"].forEach(function(entry) {
    var content = entry["content"]["$t"],
    contentObj = toJson(content);

    if (isReportIncomplete(content)) {
      return true;
    }

    drawTeamMember(entry["title"]["$t"], contentObj["headshot"]);

    createTeamMemberCharts(
      contentObj,
      dashboardOpts["dashboardDimensions"]
    );
  });
}

function isReportIncomplete(content) {
  var re = /: x/g;

  return re.test(content);
}

function drawTeamMember(nameString, headShotUrl) {
  var nameNode = document.createElement("div"),
  headShot = document.createElement("span"),
  name = document.createElement("span");
  
  nameNode.className = dashboardOpts["chartOpts"]["cellClassName"];
  headShot.className = dashboardOpts["headShotClassName"];
  headShot.style.backgroundImage = "url(" + headShotUrl + ")";
  name.className = dashboardOpts["nameClassName"];
  name.innerHTML = nameString;
  nameNode.appendChild(headShot);
  nameNode.appendChild(name);

  appendNode(
    dashboardOpts["docFrag"],
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

function doughnutChartFactory(chartData, colors) {
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
      responsive: false,
      animation: {
        animateRotate: true,
        animateScale: true
      },
      cutoutPercentage: 70,
      maintainAspectRatio: false
    }
  });

  chart.style.width = dashboardOpts["chartOpts"]["height"];
  chart.style.height = dashboardOpts["chartOpts"]["width"];
  chart.className = dashboardOpts["chartOpts"]["chartClassName"]
  chartCell.className = dashboardOpts["chartOpts"]["cellClassName"];
  chartCell.appendChild(chart);
  return chartCell;
}

function drawDidNotFillOut() {

}

function appendNode(docFrag, chartElem) {
  docFrag.appendChild(chartElem);
}

function drawTeamMemberScores(docFrag, scoresContainerClassName) {
  var row = document.createElement("div");
  row.className = dashboardOpts["rowClass"];
  row.appendChild(docFrag);
  document.getElementsByClassName(scoresContainerClassName)[0].appendChild(row);
}
