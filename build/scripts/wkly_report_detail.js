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

  var $$detail_event_handlers$$default = document.querySelector("body").addEventListener("click", function (e) {
    if (e.target.className === "Detail-backText u-label") window.location.href = "index.html";
  });

  function $$utilities$$fetchWeeklyReportsData(endPoint, callback) {
    axios.get(endPoint).then(function (response) {
      callback(response.data);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function $$utilities$$stringToObject(contentString) {
    var array = contentString.split(','),
        tempObj = {};

    array.forEach(function (item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }

  function $$utilities$$calculateColor(dimensionSet) {
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

  function $$utilities$$doughnutChartFactory(chartData, colors, size) {
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

  function $$utilities$$getParameterByName(name, url) {
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

  function $$utilities$$viewReady() {
    document.querySelector("body").setAttribute("class", "u-ready");
  }

  (function () {

    $$utilities$$fetchWeeklyReportsData($$dashboard_options$$default["detailSpreadsheetData"], initDetailView);

    function initDetailView(data) {
      var mainDocFrag = document.createDocumentFragment();
      mainDocFrag.appendChild(drawLeftColumn());
      mainDocFrag.appendChild(drawRightColumn(data));
      document.querySelector('.Detail').appendChild(mainDocFrag);
      $$utilities$$viewReady();
    }

    function drawLeftColumn() {
      var leftColumn = document.createDocumentFragment();
      var docFrag = document.createDocumentFragment();
      var colDiv = createDiv();
      var name = document.createElement("h1");
      var image = document.createElement("span");

      name.className = "Detail-name";
      image.className = "Detail-image";

      name.innerHTML = $$utilities$$getParameterByName("name");
      image.style.backgroundImage = $$utilities$$getParameterByName("image");
      image.style.borderColor = $$utilities$$getParameterByName("borderColor");

      colDiv.appendChild(name);
      colDiv.appendChild(image);
      docFrag.appendChild(colDiv);
      leftColumn.appendChild(docFrag);

      return leftColumn;
    }

    function drawRightColumn(data) {
      var rightColumn = document.createDocumentFragment();
      var colDiv = createDiv();
      var backToDashboard = document.createElement("div");
      var backToDashboardText = document.createElement("span");

      backToDashboard.className = "Detail-back";
      backToDashboardText.className = "Detail-backText u-label";
      backToDashboardText.innerHTML = "Back to Dashboard";
      backToDashboard.appendChild(backToDashboardText);
      colDiv.appendChild(backToDashboard);
      colDiv.appendChild(drawRightColumnHeader());
      colDiv.appendChild(drawRightColumnHighsLows(data));
      rightColumn.appendChild(colDiv);

      return rightColumn;
    }

    function drawRightColumnHeader() {
      var rightColHeader = document.createDocumentFragment();
      var header = document.createElement("header");
      var dimensions = ["satisfaction", "workload", "productivity", "clarity", "stress"];
      header.className = "ScoreBox";

      dimensions.forEach(function (dimension) {
        header.appendChild(createNestedElems("div", "ScoreBox-dimension " + dimension, "span", "u-label", "" + dimension));;
      });

      rightColHeader.appendChild(header);

      return rightColHeader;
    }

    function drawRightColumnHighsLows(data) {
      var teamMembers = data["feed"]["entry"];
      var teamMember = teamMembers.find(checkName);
      var teamMemberContent = $$utilities$$stringToObject(teamMember["content"]["$t"]);
      var docFrag = document.createDocumentFragment();
      var highLabel = document.createElement("span");
      var lowLabel = document.createElement("span");
      var high = document.createElement("p");
      var low = document.createElement("p");

      highLabel.className = lowLabel.className = "u-label";
      highLabel.innerHTML = "HIGH";
      lowLabel.innerHTML = "LOW";
      high.className = "u-padding-btm-40";
      high.innerHTML = teamMemberContent["high"];
      low.innerHTML = teamMemberContent["low"];
      docFrag.appendChild(highLabel);
      docFrag.appendChild(high);
      docFrag.appendChild(lowLabel);
      docFrag.appendChild(low);

      return docFrag;
    }

    function checkName(teamMember) {
      var tmName = "name: " + $$utilities$$getParameterByName("name");
      var index = teamMember["content"]["$t"].indexOf(tmName);

      return index === 0 ? true : false;
    }

    function createNestedElems(parentElem, parentClass, childElem, childClass, childText) {
      var parent = document.createElement(parentElem);
      parent.className = parentClass;

      var child = document.createElement(childElem);
      child.className = childClass;
      child.innerHTML = childText;

      var dimensionVal = $$utilities$$getParameterByName(childText);
      var dimensionSet = [100 - dimensionVal, dimensionVal];
      var chart = $$utilities$$doughnutChartFactory(dimensionSet, $$utilities$$calculateColor(dimensionSet), $$dashboard_options$$default["chartOpts"]["largeHeightWidth"]);

      parent.appendChild(child);
      parent.appendChild(chart);

      return parent;
    }

    function createDiv() {
      var colDiv = document.createElement("div");
      colDiv.className = "Detail-column";

      return colDiv;
    }
  })();
}).call(undefined);