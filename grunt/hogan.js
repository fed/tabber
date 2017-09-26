module.exports = function () {
  return {
    all: {
      src: ['src/**/*.mustache', 'styleguide/**/*.mustache'],
      dest: 'dist/template.js',
      options: {
        binderName: 'amd'
      }
    }
  };
};
