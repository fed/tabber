module.exports = function () {
  return {
    options: {
      async: {
        parallel: false
      }
    },
    files: ['test/{,**/}*.js']
  };
};
