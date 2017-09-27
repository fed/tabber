module.exports = {
  options: {
    sourceMap: true,
    outputStyle: 'compressed'
  },
  dist: {
    files: {
      'dist/tabber.css': 'src/tabber.scss'
    }
  }
};
