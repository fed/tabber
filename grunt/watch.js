module.exports = {
  files: [
    'model/*.json',
    'src/{,**/}*.{mustache,css,sass,scss,js,json}',
    'test/{,**/}*.js',
    'styleguide/{,**/}*.{html,css,js}',
    '!styleguide/template.js'
  ],
  options: {
    livereload: true
  },
  tasks: ['build']
};
