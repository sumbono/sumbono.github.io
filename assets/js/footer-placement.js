/**
 * Footer placement for the section-overlay template.
 *
 * The template positions sections absolutely (opacity 0, out of flow), so a
 * normal-flow #footer slides underneath an opened section. This script parks
 * the footer just past the open section's bottom edge, and restores normal
 * flow (below the hero) when no section is shown.
 */
(function () {
  var footer = document.getElementById('footer');
  if (!footer) return;

  function place() {
    var sec = document.querySelector('section.section-show');
    if (!sec) {
      footer.style.position = '';
      footer.style.top = '';
      footer.style.left = '';
      footer.style.right = '';
      return;
    }
    var bottom = Math.round(sec.getBoundingClientRect().bottom + window.scrollY);
    footer.style.position = 'absolute';
    footer.style.top = bottom + 'px';
    footer.style.left = '0';
    footer.style.right = '0';
  }

  // Section show/hide is class-driven on <section> elements
  new MutationObserver(place).observe(document.body, {
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
  // Re-place when the shown section reflows (logos load, resize, fonts)
  var ro = new ResizeObserver(place);
  var watching = null;
  var mo = new MutationObserver(function () {
    var sec = document.querySelector('section.section-show');
    if (sec !== watching) {
      if (watching) ro.unobserve(watching);
      watching = sec;
      if (sec) ro.observe(sec);
      place();
    }
  });
  mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', place);
  window.addEventListener('load', place);
  place();
})();
