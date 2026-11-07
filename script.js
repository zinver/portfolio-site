(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Reveals */
  var items = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* Scroll-driven background: blend between each section's mood colour */
  function hex(h) { return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]; }
  var secs = Array.prototype.slice.call(document.querySelectorAll("section[data-bg]"));
  var stops = secs.map(function (s) { return hex(s.getAttribute("data-bg")); });
  function tint() {
    var y = window.scrollY + window.innerHeight * 0.5, a = 0, i;
    for (i = 0; i < secs.length; i++) { if (secs[i].offsetTop <= y) a = i; }
    var s = secs[a], next = Math.min(a + 1, secs.length - 1);
    var t = a === next ? 0 : Math.min(1, Math.max(0, (y - s.offsetTop) / Math.max(1, s.offsetHeight)));
    t = t * t * (3 - 2 * t);
    var c = stops[a].map(function (v, k) { return Math.round(v + (stops[next][k] - v) * t); });
    root.style.setProperty("--bg", "rgb(" + c.join(",") + ")");
  }
  window.addEventListener("scroll", tint, { passive: true });
  window.addEventListener("resize", tint);
  tint();

  /* Drifting particle field */
  var cv = document.getElementById("fx"), ctx = cv.getContext("2d"), pts = [], W = 0, H = 0;
  function size() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.round(Math.min(70, W * H / 16000));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25 });
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      ctx.fillStyle = "rgba(155,140,255,.8)";
      ctx.fillRect(p.x, p.y, 1.8, 1.8);
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
        if (d2 < 14000) { ctx.strokeStyle = "rgba(155,140,255," + (0.22 * (1 - d2 / 14000)) + ")"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  size(); frame();
  window.addEventListener("resize", function () { size(); if (reduce) frame(); });

  /* Copy email */
  var btn = document.getElementById("copy"), em = document.getElementById("email");
  btn.addEventListener("click", function () {
    function done(ok) { btn.textContent = ok ? "Copied" : "Select it"; setTimeout(function () { btn.textContent = "Copy"; }, 1600); }
    function fallback() {
      try { var r = document.createRange(); r.selectNodeContents(em); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) {}
      done(false);
    }
    try { navigator.clipboard.writeText(em.textContent).then(function () { done(true); }, fallback); } catch (e) { fallback(); }
  });
})();