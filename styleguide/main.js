require.config({
  baseUrl: '.',
  paths: {
    hogan: '../node_modules/hogan.js/dist/hogan-3.0.2.min.amd',
    lodash: '../node_modules/lodash-amd',
    animate: '../src/animate',
    tabber: '../src/tabber',
    template: '../dist/template'
  }
});

requirejs(['template', 'tabber'], (template, Tabber) => {
  // Fetch use cases data.
  // This is polyfilled for old browsers via polyfill.io (see ./index.html)
  fetch('/model/usecases.json')
    .then(response => response.json())
    .then(data => {
      // First hydrate the template with the use cases data.
      const container = document.getElementById('use-cases-container');

      container.innerHTML = template.usecases({
        usecases: data
      });

      // Then initialise the agent for each of the use cases.
      const instances = document.querySelectorAll('[data-tabber]');

      instances.forEach(element => new Tabber(element, {}));
    });
});
