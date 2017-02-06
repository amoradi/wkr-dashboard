class TeamMemberScores {
  constructor(options) {
    Object.assign(this, { options });

    axios.get(this.options["spreadsheetData"])
      .then(function (response) {
        this.data = response.data;
        this.dataFeed = this.data["feed"];
        this.teamMemberCount = parseInt(this.dataFeed["openSearch$totalResults"]["$t"], 10);
        this.allTeamMembers = createTeamMembersObj(this.dataFeed["entry"]);
        [this.particpants, this.nonParticpants] = this.allTeamMembers;
      }.bind(this))
      .catch(function (error) {
        console.log(`Dashboard not initialized: ${error}`);
      }
    );

    function createTeamMembersObj(teamMemberArray) {
      var particpants = teamMemberArray.filter(isParticipant);
      var nonParticipants = teamMemberArray.filter(isNonParticipant);

      // TODO turn content, name, and headshot fields
      // unmarshall json to js objects
      return [particpants, nonParticipants];
    }

    function isNonParticipant(teamMember) {
      let scores = teamMember["content"]["$t"];
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
  unmarshallSpreadSheetData(spreadSheetJson) {
    let array = spreadSheetJson.split(','),
    tempObj = {};

    array.forEach(function(item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }
}

var dashboardOpts = {
  spreadsheetData: "https:\/\/spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",
  docFrag: document.createDocumentFragment(),
  dashboardDimensions: [
    ["satisfactioninverse", "satisfaction"],
    ["workloadinverse", "workload"],
    ["prodinverse", "productivity"],
    ["clarityinverse","clarity"],
    ["stressinverse", "stresslevel"]
  ],
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

var myDashboard = new TeamMemberScores(dashboardOpts);
