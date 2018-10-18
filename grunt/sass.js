const sass = require('node-sass');

module.exports = {
  options: {
    implementation: sass,
    sourceMap: true,
    outputStyle: 'compressed'
  },
  dist: {
    files: {
      'dist/tabber.css': 'src/tabber.scss'
    }
  }
};
