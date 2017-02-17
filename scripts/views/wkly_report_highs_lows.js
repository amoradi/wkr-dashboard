import dashboardOpts from '../global/dashboard_options.js';
import {
  fetchWeeklyReportsData,
  detailStringToObject,
  viewReady
} from '../global/utilities.js';

(function() {
  const highsLowsDocFrag = document.createDocumentFragment();
  var teamMemberData;

  fetchWeeklyReportsData(
    dashboardOpts["spreadsheetData"],
    fetchHighLowData
  );

  function fetchHighLowData(dimensionData) {
    teamMemberData = dimensionData;

    fetchWeeklyReportsData(
      dashboardOpts["detailSpreadsheetData"],
      initHighsLowsView
    );
  }

  function initHighsLowsView(weeklyReportsData) {
    weeklyReportsData["feed"]["entry"].forEach(function(teamMember) {
      drawMemberRows(teamMember);
    });

    appendHighsLowsDocFrag();
    viewReady();
    console.log(teamMemberData);
  }

  function appendHighsLowsDocFrag() {
    document.querySelector(`.${dashboardOpts["scoresContainerClassName"]}`).appendChild(highsLowsDocFrag);
  }

  function drawMemberRows(teamMember) {
    let row = document.createElement("div");
    let contentStr = teamMember["content"]["$t"],
    contentObj = detailStringToObject(contentStr),
    name = contentObj["name"],
    headshot = contentObj["headshot"],
    high = contentObj["high"],
    low = contentObj["low"];

    row.className = dashboardOpts["rowClass"];
    row.appendChild(drawTeamMember(name, headshot));
    row.appendChild(drawTeamMemberHighsLows([high, low]));
    highsLowsDocFrag.appendChild(row);
  }
  
  function drawTeamMember(nameString, headShotUrl) {
    
    let nameNode = document.createElement("div"),
    headShot = document.createElement("span"),
    name = document.createElement("span");
    
    nameNode.className = dashboardOpts["chartOpts"]["cellClassName"];
    headShot.className = dashboardOpts["headShotClassName"];

    if (typeof headShotUrl !== 'undefined') {
      headShot.style.backgroundImage = `url(${headShotUrl})`;
    }

    name.className = dashboardOpts["nameClassName"];
    name.innerHTML = nameString;
    name.setAttribute("data-name", nameString);
    nameNode.appendChild(headShot);
    nameNode.appendChild(name);

    return nameNode;
  }

  function drawTeamMemberHighsLows(highLow) {
    let docFrag = document.createDocumentFragment();

    highLow.forEach(function(value) {
      let span = document.createElement('span');
      span.className = "TeamMemberScores-cell";
      span.innerHTML = value;

      docFrag.appendChild(span);
    });

    return docFrag;
  }
})();