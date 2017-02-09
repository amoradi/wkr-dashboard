"use strict";

(function () {
    "use strict";

    var scripts$detail_event_handlers$$default = document.querySelector("body").addEventListener("click", function (e) {
        if (e.target.className === "Detail-backText u-label") window.location.href = "index.html";
    });
}).call(undefined);