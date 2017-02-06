"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TeamMemberScores = function () {
  function TeamMemberScores(options) {
    _classCallCheck(this, TeamMemberScores);

    Object.assign(this, { options: options });

    axios.get(this.options["spreadsheetData"]).then(function (response) {
      this.data = response.data;
      this.dataFeed = this.data["feed"];
      this.teamMemberTotal = parseInt(this.dataFeed["openSearch$totalResults"]["$t"], 10);
      this.allTeamMembers = createTeamMembersObj(this.dataFeed["entry"]);

      var _allTeamMembers = _slicedToArray(this.allTeamMembers, 2);

      this.particpants = _allTeamMembers[0];
      this.nonParticpants = _allTeamMembers[1];
    }.bind(this)).catch(function (error) {
      console.log("Dashboard not initialized: " + error);
    });

    function createTeamMembersObj(teamMemberArray) {
      var particpants = teamMemberArray.filter(isParticipant);
      var nonParticipants = teamMemberArray.filter(isNonParticipant);

      // TODO turn content, name, and headshot fields
      // unmarshall json to js objects
      return [particpants, nonParticipants];
    }

    function isNonParticipant(teamMember) {
      var scores = teamMember["content"]["$t"];
      var re = /: x/g;

      return re.test(scores);
    }

    function isParticipant(teamMember) {
      return !isNonParticipant(teamMember);
    }
  }

  // isNonParticipants(teamMember) {
  //   let scores = unmarshallSpreadSheetData(teamMember["content"]["$t"]),
  //   name = entry["title"]["$t"],
  //   headShot = scores["headshot"];

  //   if (isReportIncomplete(content)) {
  // }

  // turn JSON into obj


  _createClass(TeamMemberScores, [{
    key: "unmarshallSpreadSheetData",
    value: function unmarshallSpreadSheetData(spreadSheetJson) {
      var array = spreadSheetJson.split(','),
          tempObj = {};

      array.forEach(function (item) {
        item = item.split(': ');
        tempObj[item[0].trim()] = item[1];
      });

      return tempObj;
    }
  }]);

  return TeamMemberScores;
}();

var dashboardOpts = {
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

var myDashboard = new TeamMemberScores(dashboardOpts);