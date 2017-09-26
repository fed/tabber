module.exports = {
  all: {
    src: ['src/**/*.mustache', 'styleguide/**/*.mustache'],
    dest: 'dist/template.js',
    options: {
      binderName: 'amd'
    }
  }
};
