require.config({
  baseUrl: '.',
  paths: {
    jquery: '../node_modules/jquery/dist/jquery.min',
    lodash: '../node_modules/lodash/index',
    hogan: '../node_modules/hogan.js/dist/hogan-3.0.2.min.amd',
    animate: '../src/animate',
    tabber: '../src/tabber',
    template: '../dist/template'
  }
});

requirejs(['jquery', 'template', 'tabber'], function ($, template, tabber) {
  // Fetch use cases data
  $.getJSON('/model/usecases.json').done(function (data) {
    // Populate the template and load the content on the html
    $('#use-cases-container').html(template.usecases({
      usecases: data.usecases
    }));

    // Initialize the agent for each of the use cases
    document.querySelectorAll('.tabber').forEach(element => new tabber(element, {}));
  });
});
