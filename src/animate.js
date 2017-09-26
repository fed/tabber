define('animate', () => {
  function show(element) {
    element.style.display = 'block';
  }

  function hide(element) {
    element.style.display = 'none';
  }

  function fadeOut(element) {
    element.style.opacity = 1;

    (function fade() {
      if ((element.style.opacity -= 0.1) < 0) {
        element.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }

  function fadeIn(element, display) {
    element.style.opacity = 0;
    element.style.display = display || 'block';

    (function fade() {
      var val = parseFloat(element.style.opacity);

      if ((val += 0.1) < 1) {
        element.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }

  return {
    show,
    hide,
    fadeIn,
    fadeOut
  };
});
