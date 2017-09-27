module.exports = {
  options: {
    configFile: 'grunt/conf/eslint.json'
  },
  target: [
    'Gruntfile.js',
    'grunt/{,**/}*.js',
    'test/{,**/}*.js',
    'src/{,**/}*.js',
    'styleguide/{,**/}*.js',
    '!styleguide/template.js'
  ]
};
