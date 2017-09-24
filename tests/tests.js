casper.test.begin('ui-component-example', function (test) {
  'use strict';

  casper.start('http://localhost:4567', function () {
    this.echo('you should write some tests!', 'RED_BAR');
    test.assert(true);
    this.wait(1000);
  });

  casper.run(function () {
    test.done();
  });
});
