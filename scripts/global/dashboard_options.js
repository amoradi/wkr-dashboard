import dimensionMap from './dimension_map.js';
import token from './dashboard_token.js';

export default {
  spreadsheetData: `https:\/\/spreadsheets.google.com/feeds/list/${token}/3/public/basic?alt=json`,
  detailSpreadsheetData: `https:\/\/spreadsheets.google.com/feeds/list/${token}/1/public/basic?alt=json`,
  docFrag: document.createDocumentFragment(),
  dashboardDimensions: [
    ["satisfactioninverse", "satisfaction"],
    ["workloadinverse", "workload"],
    ["prodinverse", "productivity"],
    ["clarityinverse","clarity"],
    ["stressinverse", "stresslevel"]
  ],
  dimensionMap: dimensionMap,
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
            return p > 36 && p <= 70;
          }
        },
        {
          value: "#61c275",
          condition: function(p) {
            return p > 71;
          }
        }
      ]
    }
  }
};
