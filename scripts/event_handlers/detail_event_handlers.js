export default document.querySelector("body")
  .addEventListener("click", function(e){
    if (e.target.className === "Detail-backText u-label") {
      window.location.href = "dashboard";
    }
});