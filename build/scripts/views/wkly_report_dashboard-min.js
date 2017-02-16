"use strict";(function(){function e(e,t,r){do{if(!e||1!==e.nodeType)return!1;if(e.matches(t))return e;if(e=e.parentNode,e.className===r)return!1}while(e)}function t(e,t){axios.get(e).then(function(e){t(e.data)}).catch(function(e){console.log(e)})}function r(e,t){e.appendChild(t)}function a(e){var t=/: x/g;return t.test(e)}function o(e,t){return e+t}function n(e,t){var e=e.map(function(e){return parseInt(e,10)});return Math.round(e.reduce(o,0)/t)}function s(e){var t=e.split(","),r={};return t.forEach(function(e){e=e.split(": "),r[e[0].trim()]=e[1]}),r}function c(e){var t=[m.chartOpts.colors.inverseColor];return m.chartOpts.colors.activeColors.some(function(r){var a=r.condition(e[1]);if(a)return t.push(r.value),!0}),t}function i(e,t,r){var a=document.createElement("canvas"),o=a.getContext("2d"),n=document.createElement("div");return r?o.canvas.height=o.canvas.width=2*r:(o.canvas.height=2*m.chartOpts.height,o.canvas.width=2*m.chartOpts.width),new Chart(o,{type:"doughnut",data:{datasets:[{data:e,backgroundColor:t}]},options:{tooltips:{enabled:!1},animation:{duration:200,animateRotate:!0,animateScale:!0},cutoutPercentage:70,responsive:!1,maintainAspectRatio:!1}}),n.setAttribute("data-avg-score",e[1]),a.setAttribute("data-score",e[1]),r?a.style.width=a.style.height=r+"px":(a.style.height=m.chartOpts.height+"px",a.style.width=m.chartOpts.width+"px"),a.className=m.chartOpts.chartClassName,n.className=m.chartOpts.cellClassName,n.appendChild(a),n}function l(){var e=document.querySelector(".u-container"),t=document.querySelector(".u-loader");t.parentNode.removeChild(t),e.setAttribute("class","u-container u-ready")}var d={1:"satisfaction",2:"workload",3:"productivity",4:"clarity",5:"stress"},u="1jpXSljWBfUO7KKn9tTT6hZOTWYqXGsVTJPTU1HVMShs",m={spreadsheetData:"https://spreadsheets.google.com/feeds/list/"+u+"/3/public/basic?alt=json",detailSpreadsheetData:"https://spreadsheets.google.com/feeds/list/"+u+"/1/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],dimensionMap:d,mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{largeHeightWidth:110,height:60,width:60,cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=65}},{value:"#61c275",condition:function(e){return e>65}}]}}};document.querySelector(".TeamMemberScores-scores").addEventListener("click",function(t){var r=e(t.target,".TeamMemberScores-row > div:first-child","TeamMemberScores-scores");if(r){var a=r.getAttribute("data-detail"),o=r.childNodes[1].getAttribute("data-name"),n=r.childNodes[0].style.backgroundImage.replace(/['"]+/g,""),s=r.childNodes[0].style.borderColor;window.location.href="detail?name="+o+"&image="+n+"&borderColor="+s+"&"+a}});var p=document.body.getBoundingClientRect(),h=document.querySelector(".TeamMemberScores-dimensions"),g=h.getBoundingClientRect(),v=59,f=g.bottom+v-p.top,C="StickyDimensions u-sticky-container",S=document.querySelector(".StickyDimensions.u-sticky-container");window.addEventListener("resize",function(e){f=g.bottom+v-p.top}),window.addEventListener("scroll",function(e){document.body.scrollTop>=f?S.setAttribute("class",C+" u-show"):S.setAttribute("class",C)}),function(){function e(e){window.ReportIncompleteCount=window.ReportMemberCount=0,window.ReportAverages={avgScore:[],satisfaction:[],workload:[],productivity:[],clarity:[],stress:[]},t(e.spreadsheetData,o)}function o(e){e.feed.entry.forEach(function(e,t){var r=e.content.$t,o=e.title.$t,n=s(r),c=n.headshot;return ReportMemberCount=t+1,a(r)?(ReportIncompleteCount++,1==ReportIncompleteCount&&(window.NoScoresMembers=p()),h(o,c,!0),!0):(h(o,c),void g(n,m.dashboardDimensions))}),ReportIncompleteCount&&(r(NoScores,NoScoresMembers),r(document.querySelector("."+m.mainClassName),NoScores)),u(),d(),l()}function d(){document.querySelector("."+m.scoresContainerClassName).appendChild(y)}function u(){var e=n(ReportAverages.avgScore,ReportAverages.avgScore.length),t=document.querySelector(".Aggregate-aggregateCompleted"),a=document.createElement("span");a.className="Aggregate-completedPercent",document.querySelector("."+m.avgScoreClassName).innerHTML=""+e,document.querySelector(".Aggregate-aggregate").style.backgroundColor=c([0,e])[1],a.innerHTML=Math.round((ReportMemberCount-ReportIncompleteCount)/ReportMemberCount*100)+"%",t.insertBefore(a,t.childNodes[0]);for(var o in ReportAverages)if(ReportAverages.hasOwnProperty(o)&&"avgScore"!==o){var s=n(ReportAverages[o],ReportAverages[o].length),l=100-s,d=[l,s],u=document.querySelector("."+o);r(u,i(d,c(d),100,s))}}function p(){window.NoScores=document.createElement("section");var e=document.createElement("h2"),t=document.createElement("div");return NoScores.className=m.noScoresClassName,e.className=m.headingClassName,e.innerHTML=m.noScoresHeadingText,NoScores.appendChild(e),t.className=m.rowClass+" "+m.rowClassWrap,t}function h(e,t,a){var o=document.createElement("div"),n=document.createElement("span"),s=document.createElement("span");o.className=m.chartOpts.cellClassName,n.className=m.headShotClassName,"undefined"!=typeof t&&(n.style.backgroundImage="url("+t+")"),a&&(o.setAttribute("data-incomplete-report","true"),n.style.borderColor=m.chartOpts.colors.activeColors[0].value),s.className=m.nameClassName,s.innerHTML=e,s.setAttribute("data-name",e),o.appendChild(n),o.appendChild(s);var c=a?window.NoScoresMembers:m.docFrag;r(c,o)}function g(e,t){t.forEach(function(t){var r=[parseInt(e[t[0]],10),parseInt(e[t[1]],10)];v(r)}),f(m.docFrag,m.scoresContainerClassName)}function v(e){Number.isInteger(e[0])&&Number.isInteger(e[1])&&r(m.docFrag,i(e,c(e)))}function f(e,t){var r=document.createElement("div");b(e),C(e),r.className=m.rowClass,r.appendChild(e),y.appendChild(r)}function C(e){for(var t=e.querySelectorAll("."+m.chartOpts.cellClassName),r=[],a=0,o=t.length;a<o;a++)if(a>0){t[a].setAttribute("data-cell",a);var n=t[a].firstChild.getAttribute("data-score");S(a,n),r.push(m.dimensionMap[a]+"="+n)}t[0].setAttribute("data-detail",r.join("&"))}function S(e,t){var r=m.dimensionMap;window.ReportAverages[r[e]].push(t)}function b(e){var t=N(e),r="."+m.headShotClassName,a=document.createElement("span"),o=c([0,t])[1];ReportAverages.avgScore.push(t),a.style.color=o,a.innerHTML="<br />"+t,e.querySelector(r).style.borderColor=o,e.querySelector(r+" + span").appendChild(a)}function N(e){for(var t=e.querySelectorAll("[data-score]"),r=t.length,a=0,o=0;o<r;o++)a+=parseInt(t[o].getAttribute("data-score"),10);return parseInt(a/r,10)}var y=document.createDocumentFragment();e(m),Number.isInteger=Number.isInteger||function(e){return"number"==typeof e&&isFinite(e)&&Math.floor(e)===e}}()}).call(void 0);