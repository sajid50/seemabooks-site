// Books page: subject filter buttons.
document.querySelectorAll(".filters button").forEach(function (b) {
  b.addEventListener("click", function () {
    var f = b.dataset.f;
    document.querySelectorAll(".filters button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
    document.querySelectorAll("[data-group]").forEach(function (g) { g.hidden = !(f === "all" || g.dataset.group === f); });
  });
});
