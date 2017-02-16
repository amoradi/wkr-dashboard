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

  var $$$event_handlers$detail_event_handlers$$default = document.querySelector("body").addEventListener("click", function (e) {
    if (e.target.className === "Detail-backText u-label") {
      window.location.href = "dashboard";
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

    $$$global$utilities$$fetchWeeklyReportsData($$$global$dashboard_options$$default["detailSpreadsheetData"], initDetailView);

    function initDetailView(data) {
      var mainDocFrag = document.createDocumentFragment();
      mainDocFrag.appendChild(drawLeftColumn());
      mainDocFrag.appendChild(drawRightColumn(data));
      document.querySelector('.Detail').appendChild(mainDocFrag);
      $$$global$utilities$$viewReady();
    }

    function drawLeftColumn() {
      var leftColumn = document.createDocumentFragment(),
          docFrag = document.createDocumentFragment(),
          colDiv = createDiv(),
          name = document.createElement("h1"),
          image = document.createElement("span"),
          headshot = $$$global$utilities$$getParameterByName("image");

      name.className = "Detail-name";
      image.className = "Detail-image";

      name.innerHTML = $$$global$utilities$$getParameterByName("name");

      if (typeof headshot !== 'undefined') {
        image.style.backgroundImage = headshot;
      }

      image.style.borderColor = $$$global$utilities$$getParameterByName("borderColor");

      colDiv.appendChild(name);
      colDiv.appendChild(image);
      docFrag.appendChild(colDiv);
      leftColumn.appendChild(docFrag);

      return leftColumn;
    }

    function drawRightColumn(data) {
      var rightColumn = document.createDocumentFragment(),
          colDiv = createDiv(),
          backToDashboard = document.createElement("div"),
          backToDashboardText = document.createElement("span");

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
      var rightColHeader = document.createDocumentFragment(),
          header = document.createElement("header"),
          dimensions = ["satisfaction", "workload", "productivity", "clarity", "stress"];
      header.className = "ScoreBox";

      dimensions.forEach(function (dimension) {
        header.appendChild(createNestedElems("div", "ScoreBox-dimension " + dimension, "span", "u-label", "" + dimension));
      });

      rightColHeader.appendChild(header);

      return rightColHeader;
    }

    function drawRightColumnHighsLows(data) {
      var teamMembers = data["feed"]["entry"],
          teamMember = teamMembers.find(checkName),
          teamMemberContent = $$$global$utilities$$stringToObject(teamMember["content"]["$t"]),
          docFrag = document.createDocumentFragment(),
          highLabel = document.createElement("span"),
          lowLabel = document.createElement("span"),
          anythingElseLabel = document.createElement("span"),
          anythingElse = document.createElement("p"),
          high = document.createElement("p"),
          low = document.createElement("p"),
          anythingElseContent = teamMemberContent["isthereanythingthatasyourleadericouldbedoingbetteroryouwantmetoknow"];

      anythingElseLabel.className = highLabel.className = lowLabel.className = "u-label";
      anythingElseLabel.innerHTML = "ANYTHING ELSE YOU WANT TO TELL YOUR LEADER";
      highLabel.innerHTML = "HIGH";
      lowLabel.innerHTML = "LOW";
      anythingElse.className = high.className = low.className = "u-padding-btm-40";
      anythingElse.innerHTML = anythingElseContent;
      high.innerHTML = teamMemberContent["high"];
      low.innerHTML = teamMemberContent["low"];

      docFrag.appendChild(highLabel);
      docFrag.appendChild(high);
      docFrag.appendChild(lowLabel);
      docFrag.appendChild(low);

      if (typeof anythingElseContent !== 'undefined') {
        docFrag.appendChild(anythingElseLabel);
        docFrag.appendChild(anythingElse);
      }

      return docFrag;
    }

    function checkName(teamMember) {
      var tmName = "name: " + $$$global$utilities$$getParameterByName("name"),
          index = teamMember["content"]["$t"].indexOf(tmName);

      return index === 0 ? true : false;
    }

    function createNestedElems(prntElem, prntClass, chElem, chClass, chText) {
      var parent = document.createElement(prntElem);
      parent.className = prntClass;

      var child = document.createElement(chElem);
      child.className = chClass;
      child.innerHTML = chText;

      var dimensionVal = $$$global$utilities$$getParameterByName(chText),
          dimensionSet = [100 - dimensionVal, dimensionVal],
          chart = $$$global$utilities$$doughnutChartFactory(dimensionSet, $$$global$utilities$$calculateColor(dimensionSet), $$$global$dashboard_options$$default["chartOpts"]["largeHeightWidth"]);

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