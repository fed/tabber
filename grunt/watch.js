module.exports = function () {
  return {
    files: [
      'model/*.json',
      'src/{,**/}*.{mustache,css,sass,scss,js,json}',
      'test/{,**/}*.js',
      'preview/{,**/}*.{html,css,js}',
      '!preview/template.js'
    ],
    options: {
      livereload: true
    },
    tasks: ['build']
  };
};
