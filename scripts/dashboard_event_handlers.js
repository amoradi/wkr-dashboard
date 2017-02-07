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

document.querySelector(".TeamMemberScores-scores").addEventListener("click", function(e){
  let teamMember = closest(e.target, ".TeamMemberScores-row > div:first-child","TeamMemberScores-scores");

  if (teamMember) {
    let params = teamMember.getAttribute("data-detail");
    let name = teamMember.childNodes[1].getAttribute("data-name");
    let image = teamMember.childNodes[0].style.backgroundImage;
    let borderColor = teamMember.childNodes[0].style.borderColor;
    window.location.href = `detail.html?name=${name}&image=${image}&borderColor=${borderColor}&${params}`;
  }
});