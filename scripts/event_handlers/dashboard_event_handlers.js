export default 

function closest(elem, selector, limitClass) {
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

document.querySelector(".TeamMemberScores-scores").addEventListener(
  "click",
  function(e) {
    let teamMember = closest(
      e.target,
      ".TeamMemberScores-row > div:first-child",
      "TeamMemberScores-scores"
    );

    if (teamMember) {
      let params = teamMember.getAttribute("data-detail"),
      name = teamMember.childNodes[1].getAttribute("data-name"),
      image = teamMember.childNodes[0].style.backgroundImage.replace(/['"]+/g, ''),
      borderColor = teamMember.childNodes[0].style.borderColor;

      window.location.href = `detail?name=${name}&image=${image}&borderColor=${borderColor}&${params}`;
    }
});

var bodyRect = document.body.getBoundingClientRect(),
  dimenions = document.querySelector(".TeamMemberScores-dimensions"),
  elemRect = dimenions.getBoundingClientRect(),
  stickyHeight = 59,
  dimensionsOffset = elemRect.bottom + stickyHeight - bodyRect.top,
  stickyDimensionsClass = "StickyDimensions u-sticky-container",
  stickDimensions = document.querySelector(".StickyDimensions.u-sticky-container");

window.addEventListener("resize", function(e) {
  dimensionsOffset = elemRect.bottom + stickyHeight - bodyRect.top;
});

window.addEventListener("scroll", function(e){
  if (document.body.scrollTop >= dimensionsOffset) {
    stickDimensions.setAttribute("class", `${stickyDimensionsClass} u-show`);
  } else {
    stickDimensions.setAttribute("class", stickyDimensionsClass);
  }
});
