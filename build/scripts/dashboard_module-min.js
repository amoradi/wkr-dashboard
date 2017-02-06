"use strict";function _classCallCheck(e,a){if(!(e instanceof a))throw new TypeError("Cannot call a class as a function")}var _slicedToArray=function(){function e(e,a){var r=[],t=!0,s=!1,n=void 0;try{for(var o,i=e[Symbol.iterator]();!(t=(o=i.next()).done)&&(r.push(o.value),!a||r.length!==a);t=!0);}catch(e){s=!0,n=e}finally{try{!t&&i.return&&i.return()}finally{if(s)throw n}}return r}return function(a,r){if(Array.isArray(a))return a;if(Symbol.iterator in Object(a))return e(a,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,a){for(var r=0;r<a.length;r++){var t=a[r];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(a,r,t){return r&&e(a.prototype,r),t&&e(a,t),a}}(),TeamMemberScores=function(){function e(a){function r(e){var a=e.filter(s),r=e.filter(t);return[a,r]}function t(e){var a=e.content.$t,r=/: x/g;return r.test(a)}function s(e){return!t(e)}_classCallCheck(this,e),Object.assign(this,{options:a}),axios.get(this.options.spreadsheetData).then(function(e){this.data=e.data,this.dataFeed=this.data.feed,this.teamMemberTotal=parseInt(this.dataFeed.openSearch$totalResults.$t,10),this.allTeamMembers=r(this.dataFeed.entry);var a=_slicedToArray(this.allTeamMembers,2);this.particpants=a[0],this.nonParticpants=a[1]}.bind(this)).catch(function(e){console.log("Dashboard not initialized: "+e)})}return _createClass(e,[{key:"unmarshallSpreadSheetData",value:function(e){var a=e.split(","),r={};return a.forEach(function(e){e=e.split(": "),r[e[0].trim()]=e[1]}),r}}]),e}(),dashboardOpts={spreadsheetData:"https://spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{height:"60px",width:"60px",cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=50}},{value:"#61c275",condition:function(e){return e>50}}]}}},myDashboard=new TeamMemberScores(dashboardOpts);