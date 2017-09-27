module.exports = {
  server: {
    options: {
      hostname: '*',
      port: process.env.PORT || 4567,
      base: ['.', 'styleguide']
    }
  }
};
