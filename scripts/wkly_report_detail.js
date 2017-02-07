import dashboardOpts from './dashboard_options.js';
import calculateColor from './calculate_color.js';
import doughnutChartFactory from './doughnut_chart.js';

(function() {
  function getParameterByName(name, url) {
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

  let mainDocFrag = document.createDocumentFragment();
  mainDocFrag.appendChild(drawLeftColumn());
  mainDocFrag.appendChild(drawRightColumn());

  document.querySelector('.Detail').appendChild(mainDocFrag);

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

  function drawRightColumn() {
    let rightColumn = document.createDocumentFragment();
    let colDiv = createDiv();

    colDiv.appendChild(drawRightColumnHeader());
    rightColumn.appendChild(colDiv);
    //rightColumn.appendChild(drawRightColumnHighsLows());

    return rightColumn;
  }

  function drawRightColumnHeader() {
    let rightColHeader = document.createDocumentFragment();
    let header = document.createElement("header");
  
    header.className = "ScoreBox";

    var dimensions = ["satisfaction", "workload", "productivity", "clarity", "stress"];

    dimensions.forEach(function(dimension) {
      header.appendChild(createNestedElems("div", `ScoreBox-dimension ${dimension}`, "span", "u-label", `${dimension}`));;
    });

    // iterate over q params, creating a chart
    // chartData, colors, size
    // [invers, number], 
    // doughnutChartFactory(dimensionSet, calculateColor(dimensionSet))

    rightColHeader.appendChild(header);

    return rightColHeader;
  }

  function drawRightColumnHighsLows() {

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