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
  // Fetch use cases data
  fetch('/model/usecases.json')
    .then(response => response.json())
    .then(data => {
      // Populate the template and load the content on the html
      const container = document.getElementById('use-cases-container');

      container.innerHTML = template.usecases({
        usecases: data.usecases
      });

      // Initialize the agent for each of the use cases
      document.querySelectorAll('.tabber').forEach(element => new Tabber(element, {}));
    });
});
