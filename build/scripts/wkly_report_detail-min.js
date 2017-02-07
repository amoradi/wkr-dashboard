"use strict";(function(){var e={1:"satisfaction",2:"workload",3:"productivity",4:"clarity",5:"stress"},a={spreadsheetData:"https://spreadsheets.google.com/feeds/list/1HRQm4opZYzyF8zzJiZOFZCQKcTas5Fw6CU8twSsy-3k/3/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],dimensionMap:e,mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{largeHeightWidth:"100px",height:"60px",width:"60px",cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=50}},{value:"#61c275",condition:function(e){return e>50}}]}}},t=function(e){var t=[a.chartOpts.colors.inverseColor];return a.chartOpts.colors.activeColors.some(function(a){var r=a.condition(e[1]);if(r)return t.push(a.value),!0}),t},r=function(e,t,r){var n=document.createElement("canvas"),o=n.getContext("2d"),s=document.createElement("div");return new Chart(o,{type:"doughnut",data:{datasets:[{data:e,backgroundColor:t}]},options:{tooltips:{enabled:!1},animation:{animateRotate:!0,animateScale:!0},cutoutPercentage:70,responsive:!1,maintainAspectRatio:!1}}),s.setAttribute("data-avg-score",e[1]),n.setAttribute("data-score",e[1]),r?n.style.width=n.style.height=r:(n.style.width=a.chartOpts.height,n.style.height=a.chartOpts.width),n.className=a.chartOpts.chartClassName,s.className=a.chartOpts.cellClassName,s.appendChild(n),s};!function(){function e(e,a){a||(a=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var t=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),r=t.exec(a);return r?r[2]?decodeURIComponent(r[2].replace(/\+/g," ")):"":null}function n(){var a=document.createDocumentFragment(),t=document.createDocumentFragment(),r=i(),n=document.createElement("h1"),o=document.createElement("span");return n.className="Detail-name",o.className="Detail-image",n.innerHTML=e("name"),o.style.backgroundImage=e("image"),o.style.borderColor=e("borderColor"),r.appendChild(n),r.appendChild(o),t.appendChild(r),a.appendChild(t),a}function o(){var e=document.createDocumentFragment(),a=i();return a.appendChild(s()),e.appendChild(a),e}function s(){var e=document.createDocumentFragment(),a=document.createElement("header");a.className="ScoreBox";var t=["satisfaction","workload","productivity","clarity","stress"];return t.forEach(function(e){a.appendChild(c("div","ScoreBox-dimension "+e,"span","u-label",""+e))}),e.appendChild(a),e}function c(n,o,s,c,i){var l=document.createElement(n);l.className=o;var d=document.createElement(s);d.className=c,d.innerHTML=i;var m=e(i),u=[100-m,m],p=r(u,t(u),a.chartOpts.largeHeightWidth);return l.appendChild(d),l.appendChild(p),l}function i(){var e=document.createElement("div");return e.className="Detail-column",e}var l=document.createDocumentFragment();l.appendChild(n()),l.appendChild(o()),document.querySelector(".Detail").appendChild(l)}()}).call(void 0);