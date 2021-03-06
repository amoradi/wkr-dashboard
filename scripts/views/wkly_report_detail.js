import dashboardOpts from '../global/dashboard_options.js';
import detailEventHandlers from '../event_handlers/detail_event_handlers.js';
import {
  fetchWeeklyReportsData,
  calculateColor,
  doughnutChartFactory,
  getParameterByName,
  detailStringToObject,
  viewReady
} from '../global/utilities.js';

(function() {

  fetchWeeklyReportsData(
    dashboardOpts["detailSpreadsheetData"],
    initDetailView
  );

  function initDetailView(data) {
    let mainDocFrag = document.createDocumentFragment();
    mainDocFrag.appendChild(drawLeftColumn());
    mainDocFrag.appendChild(drawRightColumn(data));
    document.querySelector('.Detail').appendChild(mainDocFrag);
    viewReady();
  }

  function drawLeftColumn() {
    let leftColumn = document.createDocumentFragment(),
    docFrag = document.createDocumentFragment(),
    colDiv = createDiv(),
    name = document.createElement("h1"),
    image = document.createElement("span"),
    headshot = getParameterByName("image");

    name.className = "Detail-name";
    image.className = "Detail-image";

    name.innerHTML =  getParameterByName("name");

    if (typeof headshot !== 'undefined') {
      image.style.backgroundImage = headshot;
    }
    
    image.style.borderColor = getParameterByName("borderColor");

    colDiv.appendChild(name);
    colDiv.appendChild(image);
    docFrag.appendChild(colDiv);
    leftColumn.appendChild(docFrag);

    return leftColumn;
  }

  function drawRightColumn(data) {
    let rightColumn = document.createDocumentFragment(),
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
    let rightColHeader = document.createDocumentFragment(),
    header = document.createElement("header"),
    dimensions = [
      "satisfaction", "workload", "productivity", "clarity", "stress"
    ];
    header.className = "ScoreBox";

    dimensions.forEach(function(dimension) {
      header.appendChild(
        createNestedElems(
          "div",
          `ScoreBox-dimension ${dimension}`,
          "span",
          "u-label",
          `${dimension}`
        )
      );
    });

    rightColHeader.appendChild(header);

    return rightColHeader;
  }

  function drawRightColumnHighsLows(data) {
    let teamMembers = data["feed"]["entry"],
    teamMember = teamMembers.find(checkName),
    teamMemberContent = detailStringToObject(teamMember["content"]["$t"]),
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
    let tmName = `name: ${getParameterByName("name")}`,
    index = teamMember["content"]["$t"].indexOf(tmName);

    return (index === 0) ? true : false;
  }

  function createNestedElems(prntElem, prntClass, chElem, chClass, chText) {
    let parent = document.createElement(prntElem);
    parent.className = prntClass;

    let child = document.createElement(chElem);
    child.className = chClass;
    child.innerHTML = chText;

    let dimensionVal = getParameterByName(chText),
    dimensionSet = [100 - dimensionVal, dimensionVal],
    chart = doughnutChartFactory(
      dimensionSet,
      calculateColor(dimensionSet),
      dashboardOpts["chartOpts"]["largeHeightWidth"]
    );

    parent.appendChild(child);
    parent.appendChild(chart);

    return parent;
  }

  function createDiv() {
    let colDiv = document.createElement("div");
    colDiv.className = "Detail-column";

    return colDiv;
  }
})();