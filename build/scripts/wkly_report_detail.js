"use strict";

(function () {
  "use strict";

  (function () {
    function getParameterByName(name, url) {
      if (!url) {
        url = window.location.href;
      }
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    document.querySelector(".Detail-name").innerHTML = getParameterByName("name");
    document.querySelector(".Detail-image").style.backgroundImage = getParameterByName("image");
    document.querySelector(".Detail-image").style.borderColor = getParameterByName("borderColor");
  })();
}).call(undefined);