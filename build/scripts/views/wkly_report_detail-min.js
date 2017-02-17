"use strict";(function(){function e(e,t){axios.get(e).then(function(e){t(e.data)}).catch(function(e){console.log(e)})}function t(e){var t={},a=[{start:"name:",end:", emailaddress:"},{start:"high:",end:", low:"},{start:"low:",end:", jobsatisfaction:"},{start:"isthereanythingthatasyourleadericouldbedoingbetteroryouwantmetoknow:",end:", daterange:"}];return a.forEach(function(a,n){var r=e.indexOf(a.start),o=a.start.length,c=r+o,s=e.indexOf(a.end),i=e.substr(r,o-1);t[i]=e.substring(c+1,s)}),t}function a(e){var t=[i.chartOpts.colors.inverseColor];return i.chartOpts.colors.activeColors.some(function(a){var n=a.condition(e[1]);if(n)return t.push(a.value),!0}),t}function n(e,t,a){var n=document.createElement("canvas"),r=n.getContext("2d"),o=document.createElement("div");return a?r.canvas.height=r.canvas.width=2*a:(r.canvas.height=2*i.chartOpts.height,r.canvas.width=2*i.chartOpts.width),new Chart(r,{type:"doughnut",data:{datasets:[{data:e,backgroundColor:t}]},options:{tooltips:{enabled:!1},animation:{duration:200,animateRotate:!0,animateScale:!0},cutoutPercentage:70,responsive:!1,maintainAspectRatio:!1}}),o.setAttribute("data-avg-score",e[1]),n.setAttribute("data-score",e[1]),a?n.style.width=n.style.height=a+"px":(n.style.height=i.chartOpts.height+"px",n.style.width=i.chartOpts.width+"px"),n.className=i.chartOpts.chartClassName,o.className=i.chartOpts.cellClassName,o.appendChild(n),o}function r(e,t){t||(t=window.location.href),e=e.replace(/[\[\]]/g,"\\$&");var a=new RegExp("[?&]"+e+"(=([^&#]*)|&|#|$)"),n=a.exec(t);return n?n[2]?decodeURIComponent(n[2].replace(/\+/g," ")):"":null}function o(){var e=document.querySelector(".u-container"),t=document.querySelector(".u-loader");t.parentNode.removeChild(t),e.setAttribute("class","u-container u-ready")}var c={1:"satisfaction",2:"workload",3:"productivity",4:"clarity",5:"stress"},s="1Fg2caxWdjvm_XaGajHNI9rs4N38maqfBx8Tp9wCZ1wQ",i={spreadsheetData:"https://spreadsheets.google.com/feeds/list/"+s+"/3/public/basic?alt=json",detailSpreadsheetData:"https://spreadsheets.google.com/feeds/list/"+s+"/1/public/basic?alt=json",docFrag:document.createDocumentFragment(),dashboardDimensions:[["satisfactioninverse","satisfaction"],["workloadinverse","workload"],["prodinverse","productivity"],["clarityinverse","clarity"],["stressinverse","stresslevel"]],dimensionMap:c,mainClassName:"TeamMemberScores-colMain",avgScoreClassName:"Aggregate-aggregateScore",scoresContainerClassName:"TeamMemberScores-scores",headingClassName:"TeamMemberScores-heading",rowClass:"TeamMemberScores-row",rowClassWrap:"TeamMemberScores-rowWrap",headShotClassName:"TeamMemberScores-headShot",nameClassName:"u-small-label TeamMemberScores-name",noScoresClassName:"TeamMemberScores-noScores",noScoresHeadingText:"Didn't Fill Out Survey",chartOpts:{largeHeightWidth:110,height:60,width:60,cellClassName:"TeamMemberScores-cell",chartClassName:"TeamMemberScores-chart",colors:{inverseColor:"#d3d3d3",activeColors:[{value:"#c26263",condition:function(e){return e<=35}},{value:"#e3e448",condition:function(e){return e>36&&e<=70}},{value:"#61c275",condition:function(e){return e>71}}]}}};document.querySelector("body").addEventListener("click",function(e){"Detail-backText u-label"===e.target.className&&(window.location.href="dashboard")});!function(){function c(e){var t=document.createDocumentFragment();t.appendChild(s()),t.appendChild(d(e)),document.querySelector(".Detail").appendChild(t),o()}function s(){var e=document.createDocumentFragment(),t=document.createDocumentFragment(),a=p(),n=document.createElement("h1"),o=document.createElement("span"),c=r("image");return n.className="Detail-name",o.className="Detail-image",n.innerHTML=r("name"),"undefined"!=typeof c&&(o.style.backgroundImage=c),o.style.borderColor=r("borderColor"),a.appendChild(n),a.appendChild(o),t.appendChild(a),e.appendChild(t),e}function d(e){var t=document.createDocumentFragment(),a=p(),n=document.createElement("div"),r=document.createElement("span");return n.className="Detail-back",r.className="Detail-backText u-label",r.innerHTML="Back to Dashboard",n.appendChild(r),a.appendChild(n),a.appendChild(l()),a.appendChild(m(e)),t.appendChild(a),t}function l(){var e=document.createDocumentFragment(),t=document.createElement("header"),a=["satisfaction","workload","productivity","clarity","stress"];return t.className="ScoreBox",a.forEach(function(e){t.appendChild(h("div","ScoreBox-dimension "+e,"span","u-label",""+e))}),e.appendChild(t),e}function m(e){var a=e.feed.entry,n=a.find(u),r=t(n.content.$t),o=document.createDocumentFragment(),c=document.createElement("span"),s=document.createElement("span"),i=document.createElement("span"),d=document.createElement("p"),l=document.createElement("p"),m=document.createElement("p"),h=r.isthereanythingthatasyourleadericouldbedoingbetteroryouwantmetoknow;return i.className=c.className=s.className="u-label",i.innerHTML="ANYTHING ELSE YOU WANT TO TELL YOUR LEADER",c.innerHTML="HIGH",s.innerHTML="LOW",d.className=l.className=m.className="u-padding-btm-40",d.innerHTML=h,l.innerHTML=r.high,m.innerHTML=r.low,o.appendChild(c),o.appendChild(l),o.appendChild(s),o.appendChild(m),"undefined"!=typeof h&&(o.appendChild(i),o.appendChild(d)),o}function u(e){var t="name: "+r("name"),a=e.content.$t.indexOf(t);return 0===a}function h(e,t,o,c,s){var d=document.createElement(e);d.className=t;var l=document.createElement(o);l.className=c,l.innerHTML=s;var m=r(s),u=[100-m,m],h=n(u,a(u),i.chartOpts.largeHeightWidth);return d.appendChild(l),d.appendChild(h),d}function p(){var e=document.createElement("div");return e.className="Detail-column",e}e(i.detailSpreadsheetData,c)}()}).call(void 0);