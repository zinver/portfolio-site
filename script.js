// Single orchestrated hero moment: type out the name on load
(function(){
  var target = document.getElementById('typed-name');
  var fullText = "Fardin Ahmed";
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ return; }
  target.childNodes[0].textContent = "";
  var i = 0;
  function type(){
    if(i <= fullText.length){
      target.childNodes[0].textContent = fullText.slice(0,i);
      i++;
      setTimeout(type, 55);
    }
  }
  type();
})();

// High-UI touch: background color drifts through the page as you scroll
(function(){
  var layer = document.getElementById('bg-layer');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ return; }

  var stops = [
    {at:0.00, rgb:[11,14,20]},   // hero — deep navy-black
    {at:0.35, rgb:[16,14,28]},   // about — hint of violet
    {at:0.62, rgb:[13,17,30]},   // stack — cooler blue
    {at:0.85, rgb:[10,20,26]},   // work — deep teal
    {at:1.00, rgb:[9,16,22]}     // contact — settle back down
  ];

  function lerp(a,b,t){ return a + (b - a) * t; }

  function colorAt(pct){
    for(var i=0;i<stops.length-1;i++){
      var s1=stops[i], s2=stops[i+1];
      if(pct>=s1.at && pct<=s2.at){
        var t=(pct-s1.at)/(s2.at-s1.at || 1);
        return [
          Math.round(lerp(s1.rgb[0], s2.rgb[0], t)),
          Math.round(lerp(s1.rgb[1], s2.rgb[1], t)),
          Math.round(lerp(s1.rgb[2], s2.rgb[2], t))
        ];
      }
    }
    return stops[stops.length-1].rgb;
  }

  var ticking = false;
  function update(){
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0;
    var c = colorAt(pct);
    layer.style.background = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
    ticking = false;
  }
  function onScroll(){
    if(!ticking){
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  update();
})();

// Reveal sections as they scroll into view
(function(){
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window)){
    items.forEach(function(el){ el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
  items.forEach(function(el){ observer.observe(el); });
})();