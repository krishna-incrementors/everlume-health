// Everlume Health mock-up interactions
(function(){
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    document.querySelectorAll('.has-menu > a').forEach(function(a){
      a.addEventListener('click', function(e){
        if (window.innerWidth <= 1020) { e.preventDefault(); a.parentElement.classList.toggle('expand'); }
      });
    });
  }

  // Reveal on scroll
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:.12}) : null;
  document.querySelectorAll('.reveal').forEach(function(el){ io ? io.observe(el) : el.classList.add('in'); });

  // Life stage path: a smooth line of light drawn through every stage
  var stage = document.querySelector('.stage-path');
  function drawPath(){
    if (!stage) return;
    var svg = stage.querySelector('svg.path');
    var box = stage.getBoundingClientRect();
    var pts = Array.prototype.map.call(stage.querySelectorAll('.node'), function(n){
      var r = n.getBoundingClientRect();
      return [r.left - box.left + r.width/2, r.top - box.top + r.height/2];
    });
    if (pts.length < 2) return;
    var d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || p2;
      var c1x = p1[0] + (p2[0]-p0[0])/6, c1y = p1[1] + (p2[1]-p0[1])/6;
      var c2x = p2[0] - (p3[0]-p1[0])/6, c2y = p2[1] - (p3[1]-p1[1])/6;
      d += ' C' + c1x + ',' + c1y + ' ' + c2x + ',' + c2y + ' ' + p2[0] + ',' + p2[1];
    }
    svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
    svg.querySelectorAll('path').forEach(function(p){ p.setAttribute('d', d); });
  }
  if (stage) { drawPath(); window.addEventListener('resize', drawPath); window.addEventListener('load', drawPath); }

  // "Where should I start?" finder
  var finder = document.getElementById('finder');
  if (finder) {
    var B = '';
    var built = {'conditions/perimenopause/': 1};
    var go = function(u){ return B + (built[u] ? 'perimenopause.html' : 'planned.html?u=' + encodeURIComponent(u)); };
    var map = {
      'hot-flashes': ['Hot flashes and night sweats','symptoms/hormones-energy/hot-flashes/','Perimenopause','conditions/perimenopause/'],
      'heavy-periods': ['Heavy or irregular periods','symptoms/menstrual-problems/heavy-bleeding/','Iron deficiency','conditions/iron-deficiency/'],
      'fatigue': ['Low energy and brain fog','symptoms/hormones-energy/fatigue/','Thyroid disease','conditions/thyroid-disease/'],
      'pelvic-pain': ['Pelvic pain or pressure','symptoms/pelvic-symptoms/pelvic-pain/','Chronic pelvic pain','conditions/chronic-pelvic-pain/'],
      'mood': ['Mood changes and anxiety','symptoms/emotional-wellness/mood-changes/','Perimenopause','conditions/perimenopause/'],
      'weight': ['Weight changes that will not budge','symptoms/digestive-metabolic/weight-gain/','Insulin resistance','conditions/insulin-resistance/'],
      'dryness': ['Vaginal dryness or painful sex','symptoms/pelvic-symptoms/vaginal-dryness/','Vaginal atrophy (GSM)','conditions/vaginal-atrophy/'],
      'sleep': ['Trouble sleeping','symptoms/hormones-energy/sleep-problems/','Menopause','conditions/menopause/']
    };
    finder.addEventListener('submit', function(e){
      e.preventDefault();
      var s = finder.symptom.value, st = finder.stage;
      var m = map[s], stageLabel = st.options[st.selectedIndex].dataset.label, stageUrl = st.value;
      var out = document.getElementById('finder-result');
      out.innerHTML =
        '<a href="' + go(m[1]) + '"><span>Symptom guide</span>' + m[0] + '</a>' +
        '<a href="' + go(m[3]) + '"><span>Related condition</span>' + m[2] + '</a>' +
        '<a href="' + go(stageUrl) + '"><span>Life stage</span>' + stageLabel + '</a>';
      out.classList.add('show');
      // Privacy: the selected symptom is never sent to analytics. Only a generic event fires.
      if (window.gtag) gtag('event','finder_used');
    });
  }
})();
