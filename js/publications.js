/* Progressive enhancement: the static archive stays complete without JavaScript. */
(function () {
  'use strict';
  const root = document.getElementById('publications');
  if (!root) return;
  const toolbar = root.querySelector('.publication-toolbar');
  const buttons = Array.from(root.querySelectorAll('[data-filter]'));
  const years = Array.from(root.querySelectorAll('.publication-year'));
  const status = root.querySelector('#publication-count');
  const labels = { all: 'All types', journal: 'Journal Articles', conference: 'Conference Papers', preprint: 'Preprints', thesis: 'Thesis' };
  function filter(type) {
    let total = 0;
    years.forEach(function (year) {
      let count = 0;
      year.querySelectorAll('.publication-item').forEach(function (item) {
        const visible = type === 'all' || item.dataset.type === type;
        item.hidden = !visible;
        if (visible) count += 1;
      });
      year.hidden = count === 0;
      year.querySelector('.year-count').textContent = count;
      total += count;
    });
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === type));
    });
    status.textContent = total + (total === 1 ? ' publication' : ' publications') + ' · ' + labels[type];
  }
  buttons.forEach(function (button) {
    button.addEventListener('click', function () { filter(button.dataset.filter); });
  });
  toolbar.hidden = false;
}());
