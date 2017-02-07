"use strict";

(function () {
  "use strict";

  function scripts$dashboard_event_handlers$$closest(elem, selector, limitClass) {
    do {
      if (elem && elem.nodeType === 1) {
        if (elem.matches(selector)) return elem;
        elem = elem.parentNode;

        if (elem.className === limitClass) return false;
      } else {
        return false;
      }
    } while (elem);
  }

  var scripts$dashboard_event_handlers$$default = scripts$dashboard_event_handlers$$closest;

  document.querySelector(".TeamMemberScores-scores").addEventListener("click", function (e) {
    var teamMember = scripts$dashboard_event_handlers$$closest(e.target, ".TeamMemberScores-row > div:first-child", "TeamMemberScores-scores");

    if (teamMember) {
      var params = teamMember.getAttribute("data-detail");
      var name = teamMember.childNodes[1].getAttribute("data-name");
      var image = teamMember.childNodes[0].style.backgroundImage;
      var borderColor = teamMember.childNodes[0].style.borderColor;
      window.location.href = "detail.html?name=" + name + "&image=" + image + "&borderColor=" + borderColor + "&" + params;
    }
  });
}).call(undefined);