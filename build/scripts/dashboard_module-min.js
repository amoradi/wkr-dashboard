"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}var _slicedToArray=function(){function e(e,t){var r=[],a=!0,n=!1,s=void 0;try{for(var i,o=e[Symbol.iterator]();!(a=(i=o.next()).done)&&(r.push(i.value),!t||r.length!==t);a=!0);}catch(e){n=!0,s=e}finally{try{!a&&o.return&&o.return()}finally{if(n)throw s}}return r}return function(t,r){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,r);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),_createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,r,a){return r&&e(t.prototype,r),a&&e(t,a),t}}();(function(){var e={spreadsheetData:"https://spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{height:"60px",width:"60px",cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=50}},{value:"#61c275",condition:function(e){return e>50}}]}}},t=function(e){return[{satisfactioninverse:e.satisfactioninverse,satisfaction:e.satisfaction},{clarityinverse:e.clarityinverse,clarity:e.clarity},{prodinverse:e.prodinvers,productivity:e.productivity},{stressinverse:e.stressinverse,stresslevel:e.stresslevel},{workloadinverse:e.workloadinverse,workload:e.workload}]},r=function(){function e(r){function a(e){var r=e.filter(s),a=e.filter(n),o="content",c="$t",l="title",u="headshot",m=r.map(function(e){var r=e[l][c],a=i(e[o][c]),n={name:"",image:"",dimensions:null};return n.name=r,n.image=a[u],n.dimensions=t(a),n}),d=a.map(function(e){return{name:e[l][c],image:i(e[o][c])[u]}});return[m,d]}function n(e){var t=e.content.$t,r=/: x/g;return r.test(t)}function s(e){return!n(e)}function i(e){var t=e.split(","),r={};return t.forEach(function(e){e=e.split(": "),r[e[0].trim()]=e[1]}),r}_classCallCheck(this,e),Object.assign(this,{options:r}),axios.get(this.options.spreadsheetData).then(function(e){this.data=e.data,this.dataFeed=this.data.feed,this.teamMemberCount=parseInt(this.dataFeed.openSearch$totalResults.$t,10),this.allTeamMembers=a(this.dataFeed.entry);var t=_slicedToArray(this.allTeamMembers,2);this.particpants=t[0],this.nonParticpants=t[1]}.bind(this))}return _createClass(e,[{key:"stringToObject",value:function(e){var t=e.split(","),r={};return t.forEach(function(e){e=e.split(": "),r[e[0].trim()]=e[1]}),r}}]),e}();window.myDashboard=new r(e)}).call(void 0);