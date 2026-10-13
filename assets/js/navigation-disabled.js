(function () {
  'use strict';

  var selector = 'a, area';

  function disableNavigationElement(element) {
    if (!element || !element.matches || !element.matches(selector)) return;

    element.removeAttribute('href');
    element.removeAttribute('target');
    element.removeAttribute('download');
    element.setAttribute('aria-disabled', 'true');
    element.setAttribute('tabindex', '-1');
    element.setAttribute('data-navigation-disabled', 'true');
  }

  function disableWithin(root) {
    if (!root) return;
    if (root.nodeType === 1) disableNavigationElement(root);
    if (root.querySelectorAll) {
      root.querySelectorAll(selector).forEach(disableNavigationElement);
    }
  }

  disableWithin(document);

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (target && target.nodeType === 3) target = target.parentElement;
    var link = target && target.closest ? target.closest(selector) : null;
    if (!link) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    disableNavigationElement(link);
  }, true);

  document.addEventListener('click', function (event) {
    var target = event.target;
    if (target && target.nodeType === 3) target = target.parentElement;
    if (!target || !target.closest || !target.closest('.js-gt-search-btn')) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('keydown', function (event) {
    var target = event.target;
    if (!target || !target.matches || !target.matches('input[type="search"]')) return;
    if (event.key !== 'Enter' && event.keyCode !== 13) return;

    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  document.addEventListener('submit', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  if (window.MutationObserver && document.documentElement) {
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        if (record.type === 'attributes') {
          disableNavigationElement(record.target);
          return;
        }
        record.addedNodes.forEach(disableWithin);
      });
    });

    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['href', 'target']
    });
  }
})();
