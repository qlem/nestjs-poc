var config = require('../../jest.config');

module.exports = Object.assign({}, config, {
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json'
    }
  }
});
