function initDashboard(e){window.ReportIncompleteCount=0,window.ReportAvgScore=[],window.ReportAverages={avgScore:[],avgSatisfaction:[],avgWorkload:[],avgProductivity:[],avgClarity:[],avgStress:[]},fetchWeeklyReportsData(e.spreadsheetData)}function fetchWeeklyReportsData(e){axios.get(e).then(function(e){parseTeamMemberScores(e.data)}).catch(function(e){console.log(e)})}function parseTeamMemberScores(e){e.feed.entry.forEach(function(e){var a=e.content.$t,r=e.title.$t,t=toJson(a),o=t.headshot;return isReportIncomplete(a)?(ReportIncompleteCount++,1==ReportIncompleteCount&&(window.NoScoresMembers=createNoScoresSection()),drawTeamMember(r,o,!0),!0):(drawTeamMember(r,o),void createTeamMemberCharts(t,dashboardOpts.dashboardDimensions))}),ReportIncompleteCount&&(appendNode(NoScores,NoScoresMembers),appendNode(document.querySelector("."+dashboardOpts.mainClassName),NoScores)),drawAvgScore()}function add(e,a){return e+a}function drawAvgScore(){document.querySelector("."+dashboardOpts.avgScoreClassName).innerHTML=Math.round(ReportAvgScore.reduce(add,0)/ReportAvgScore.length)}function createNoScoresSection(){return window.NoScores=document.createElement("section"),h2=document.createElement("h2"),row=document.createElement("div"),NoScores.className=dashboardOpts.noScoresClassName,h2.className=dashboardOpts.headingClassName,h2.innerHTML=dashboardOpts.noScoresHeadingText,NoScores.appendChild(h2),row.className=dashboardOpts.rowClass+" "+dashboardOpts.rowClassWrap,row}function isReportIncomplete(e){var a=/: x/g;return a.test(e)}function drawTeamMember(e,a,r){var t=document.createElement("div"),o=document.createElement("span"),s=document.createElement("span");t.className=dashboardOpts.chartOpts.cellClassName,o.className=dashboardOpts.headShotClassName,o.style.backgroundImage="url("+a+")",r&&(t.setAttribute("data-incomplete-report","true"),o.style.borderColor=dashboardOpts.chartOpts.colors.activeColors[0].value),s.className=dashboardOpts.nameClassName,s.innerHTML=e,t.appendChild(o),t.appendChild(s);var n=r?window.NoScoresMembers:dashboardOpts.docFrag;appendNode(n,t)}function toJson(e){var a=e.split(","),r={};return a.forEach(function(e){e=e.split(": "),r[e[0].trim()]=e[1]}),r}function createTeamMemberCharts(e,a){a.forEach(function(a){var r=[parseInt(e[a[0]],10),parseInt(e[a[1]],10)];filterInvalidMemberFields(r)}),drawTeamMemberScores(dashboardOpts.docFrag,dashboardOpts.scoresContainerClassName)}function filterInvalidMemberFields(e){Number.isInteger(e[0])&&Number.isInteger(e[1])&&appendNode(dashboardOpts.docFrag,doughnutChartFactory(e,calculateColor(e)))}function calculateColor(e){var a=[dashboardOpts.chartOpts.colors.inverseColor];return dashboardOpts.chartOpts.colors.activeColors.some(function(r){var t=r.condition(e[1]);if(t)return a.push(r.value),!0}),a}function doughnutChartFactory(e,a){var r=document.createElement("canvas"),t=r.getContext("2d"),o=document.createElement("div");return new Chart(t,{type:"doughnut",data:{datasets:[{data:e,backgroundColor:a}]},options:{tooltips:{enabled:!1},responsive:!1,animation:{animateRotate:!0,animateScale:!0},cutoutPercentage:70,maintainAspectRatio:!1}}),r.setAttribute("data-score",e[1]),r.style.width=dashboardOpts.chartOpts.height,r.style.height=dashboardOpts.chartOpts.width,r.className=dashboardOpts.chartOpts.chartClassName,o.className=dashboardOpts.chartOpts.cellClassName,o.appendChild(r),o}function appendNode(e,a){e.appendChild(a)}function drawTeamMemberScores(e,a){var r=document.createElement("div");setMemberAvgScore(e),affixNumberToCell(e),r.className=dashboardOpts.rowClass,r.appendChild(e),document.querySelector("."+a).appendChild(r)}function affixNumberToCell(e){var a=e.querySelectorAll("."+dashboardOpts.chartOpts.cellClassName);for(i=0,ii=a.length;i<ii;i++)if(i>0){a[i].setAttribute("data-cell",i);var r=a[i].firstChild.getAttribute("data-score");pushToReportAverages(i,r)}}function pushToReportAverages(e,a){var r={1:"avgSatisfaction",2:"avgWorkload",3:"avgProductivity",4:"avgClarity",5:"avgStress"};window.ReportAverages[r[e]].push(a)}function setMemberAvgScore(e){var a=calcTeamMemberAvgScore(e),r="."+dashboardOpts.headShotClassName,t=document.createElement("span"),o=calculateColor([0,a])[1];ReportAvgScore.push(a),t.style.color=o,t.innerHTML="<br />"+a,e.querySelector(r).style.borderColor=o,e.querySelector(r+" + span").appendChild(t)}function calcTeamMemberAvgScore(e){var a=e.querySelectorAll("[data-score]"),r=a.length,t=0;for(i=0;i<r;i++)t+=parseInt(a[i].getAttribute("data-score"),10);return parseInt(t/r,10)}var dashboardOpts={spreadsheetData:"https://spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{height:"60px",width:"60px",cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=50}},{value:"#61c275",condition:function(e){return e>50}}]}}};initDashboard(dashboardOpts),Number.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e};