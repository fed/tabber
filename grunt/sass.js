module.exports = {
  options: {
    sourceMap: true,
    outputStyle: 'compressed'
  },
  dist: {
    files: {
    'src/tabber.css': 'src/tabber.scss'
    }
  }
};
