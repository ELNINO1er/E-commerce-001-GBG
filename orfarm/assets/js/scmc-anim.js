/* ============================================================================
   SCMC — Animations d'apparition au scroll (léger, sans dépendance)
   Amélioration progressive : si JS off ou reduced-motion, tout reste visible.
   ========================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { return; }

  document.documentElement.classList.add("scmc-anim");

  var SEL = [
    ".tpsection", ".tpproduct", ".tpbrandproduct__item", ".tpblog__item",
    ".scmc-card", ".scmc-value", ".scmc-step", ".tpabout__item",
    ".tpbanner__main", ".scmc-reveal", "[data-reveal]"
  ].join(",");

  function run() {
    var els = Array.prototype.slice.call(document.querySelectorAll(SEL));
    if (!els.length) { return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) { return; }
        var el = e.target;
        // petit décalage en cascade selon la position parmi les frères
        var sibs = el.parentNode ? Array.prototype.slice.call(el.parentNode.children) : [el];
        var i = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = Math.min(i * 90, 450) + "ms";
        el.classList.add("scmc-in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", run); }
  else { run(); }
})();
