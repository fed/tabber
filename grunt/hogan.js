module.exports = function () {
  return {
    all: {
      src: ['src/**/*.mustache', 'preview/**/*.mustache'],
      dest: 'preview/template.js',
      options: {
        binderName: 'amd'
      }
    }
  };
};
