"use strict";

(function () {
  "use strict";

  var scripts$dashboard_options$$default = {
    spreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",
    docFrag: document.createDocumentFragment(),
    dashboardDimensions: [["satisfactioninverse", "satisfaction"], ["workloadinverse", "workload"], ["prodinverse", "productivity"], ["clarityinverse", "clarity"], ["stressinverse", "stresslevel"]],
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
}).call(undefined);