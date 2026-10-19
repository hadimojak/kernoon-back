const path = require('path');

module.exports = function (options) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        ...(options.resolve && options.resolve.alias),
        '@app/common': path.resolve(__dirname, 'libs/common/src'),
        '@app/contracts': path.resolve(__dirname, 'libs/contracts/src'),
      },
    },
  };
};
