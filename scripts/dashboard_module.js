import dashboardOpts from './dashboard_options.js';
import memberDimensions from './member_dimensions.js';

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
      // .catch(function (error) {
      //   console.log(`Dashboard not initialized: ${error}`);
      // }
    //);
    ;

    function createTeamMembersObj(teamMemberArray) {
      let participants = teamMemberArray.filter(isParticipant),
      nonParticipants = teamMemberArray.filter(isNonParticipant),
      content = "content",
      field = "$t",
      title = "title",
      headShot = "headshot";

      let scupltedParticipants = participants.map((participant) => {
        let name = participant[title][field],
        contentObj = stringToObject(participant[content][field]),
        tempObj = {
          name: "",
          image: "",
          dimensions: null
        };

        tempObj.name = name;
        tempObj.image = contentObj[headShot];
        tempObj.dimensions = memberDimensions(contentObj);

        return tempObj;
      });

      let scupltedNonParticipants = nonParticipants.map((nonPart) => {
        return {
          name: nonPart[title][field],
          image: stringToObject(nonPart[content][field])[headShot]
        }
      });
      
      return [scupltedParticipants, scupltedNonParticipants];
    }

    function isNonParticipant(teamMember) {
      let scores = teamMember["content"]["$t"];
      var re = /: x/g;

      return re.test(scores);
    }

    function isParticipant(teamMember) {
      return !isNonParticipant(teamMember);
    }

    function stringToObject(contentString) {
      let array = contentString.split(','),
      tempObj = {};

      array.forEach(function(item) {
        item = item.split(': ');
        tempObj[item[0].trim()] = item[1];
      });

      return tempObj;
    }
  }

  // isNonParticipants(teamMember) {
  //   let scores = unmarshallSpreadSheetData(teamMember["content"]["$t"]),
  //   name = entry["title"]["$t"],
  //   headShot = scores["headshot"];

  //   if (isReportIncomplete(content)) {
  // }

  // turn JSON into obj
  stringToObject(contentString) {
    let array = contentString.split(','),
    tempObj = {};

    array.forEach(function(item) {
      item = item.split(': ');
      tempObj[item[0].trim()] = item[1];
    });

    return tempObj;
  }
}

window.myDashboard = new TeamMemberScores(dashboardOpts);
