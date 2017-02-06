class TeamMemberScores {
  constructor(options) {
    Object.addign(this, { options });
    this.data = getWeeklyReportData(this.options["spreadsheetData"]);
    this.teamMemberTotal = this.data["openSearch$totalResults"]["$t"];
    this.allTeamMembers = createTeamMembersObj(this.data["feed"]["entry"]);

    [this.participants, this.nonParticipants] =
  }

  getWeeklyReportData(endPoint) {
    return axios.get(endPoint);
  }

  winnowNonParticipants(teamMembers) {
    // return particpants {}
  }

  winnowParticipants() {
    // return non-participants {}
  }

  createTeamMembersObj(teamMemberArray) {
    particpants = teamMemberArray.filter(isParticipant),
    nonParticipants = teamMemberArray.filter(isNonParticipant);
  }

  isNonParticipant(teamMember) {
    let scores = teamMember["content"]["$t"];
    var re = /: x/g;

    return re.test(scores);
  }

  isParticipant(teamMember) {
    return !isNonParticipant(teamMember);
  }

  isNonParticipants(teamMember) {
    let scores = unmarshallSpreadSheetData(teamMember["content"]["$t"]),
    name = entry["title"]["$t"],
    headShot = scores["headshot"];

    if (isReportIncomplete(content)) {
  }

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

  this.nonParticipants = [
    {
      name: "Gary Payton",
      image: "http"
    },
    {
      name: "Gary Payton",
      image: "http"
    }
  ]

  // example teamMembers obj
  this.teamMembers = [
    {
      name: "Gary Payton",
      image: "http",
      dimensions: [
        {
          satisfactioninverse: 88,
          satisfaction: 12
        },
        {

        }
      ]
    },
    {
      name: "Gary Payton",
      dimensions: [
        {
          satisfactioninverse: 88,
          satisfaction: 12
        },
        {

        }
      ]
    }
  ];


  create
  add(y) {
    return this.x + y;
  }

  get Avg() {

  }

  static something() {

  };



  // init
  // data => filter and reorganize data
  // 
}

class DashboardView {

}



