import dashboardOpts from './dashboard_options.js';
import { fetchWeeklyReportsData, calculateColor, doughnutChartFactory, getParameterByName, stringToObject } from './utilities.js';

(function() {

  fetchWeeklyReportsData(dashboardOpts["detailSpreadsheetData"], initDetailView);

  function initDetailView(data) {
    let mainDocFrag = document.createDocumentFragment();
    mainDocFrag.appendChild(drawLeftColumn());
    mainDocFrag.appendChild(drawRightColumn(data));
    document.querySelector('.Detail').appendChild(mainDocFrag);
  }

  function drawLeftColumn() {
    let leftColumn = document.createDocumentFragment();
    let docFrag = document.createDocumentFragment();
    let colDiv = createDiv();
    let name = document.createElement("h1");
    let image = document.createElement("span");

    name.className = "Detail-name";
    image.className = "Detail-image";

    name.innerHTML =  getParameterByName("name");
    image.style.backgroundImage = getParameterByName("image");
    image.style.borderColor = getParameterByName("borderColor");

    colDiv.appendChild(name);
    colDiv.appendChild(image);
    docFrag.appendChild(colDiv);
    leftColumn.appendChild(docFrag);

    return leftColumn;
  }

  function drawRightColumn(data) {
    let rightColumn = document.createDocumentFragment();
    let colDiv = createDiv();

    colDiv.appendChild(drawRightColumnHeader());
    colDiv.appendChild(drawRightColumnHighsLows(data));
    rightColumn.appendChild(colDiv);

    return rightColumn;
  }

  function drawRightColumnHeader() {
    let rightColHeader = document.createDocumentFragment();
    let header = document.createElement("header");
    let dimensions = ["satisfaction", "workload", "productivity", "clarity", "stress"];
    header.className = "ScoreBox";

    dimensions.forEach(function(dimension) {
      header.appendChild(createNestedElems("div", `ScoreBox-dimension ${dimension}`, "span", "u-label", `${dimension}`));;
    });

    rightColHeader.appendChild(header);

    return rightColHeader;
  }

  function drawRightColumnHighsLows(data) {
    let teamMembers = data["feed"]["entry"];
    let teamMember = teamMembers.find(checkName);
    let teamMemberContent = stringToObject(teamMember["content"]["$t"]);
    let docFrag = document.createDocumentFragment();
    let highLabel = document.createElement("span");
    let lowLabel = document.createElement("span");
    let high = document.createElement("p");
    let low = document.createElement("p");

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
    let tmName = `name: ${getParameterByName("name")}`;
    let index = teamMember["content"]["$t"].indexOf(tmName);

    return (index === 0) ? true : false;
  }

  function createNestedElems(parentElem, parentClass, childElem, childClass, childText) {
    let parent = document.createElement(parentElem);
    parent.className = parentClass;

    let child = document.createElement(childElem);
    child.className = childClass;
    child.innerHTML = childText;

    let dimensionVal = getParameterByName(childText);
    let dimensionSet = [100 - dimensionVal, dimensionVal];
    let chart = doughnutChartFactory(dimensionSet, calculateColor(dimensionSet), dashboardOpts["chartOpts"]["largeHeightWidth"]);

    parent.appendChild(child);
    parent.appendChild(chart);

    return parent;
  }

  function createDiv() {
    let colDiv = document.createElement("div")
    colDiv.className = "Detail-column";

    return colDiv;
  }
})();