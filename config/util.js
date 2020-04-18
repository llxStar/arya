const path = require('path');

module.exports = {
  resolve: (...args) => path.join(__dirname, '..', ...args),
};
