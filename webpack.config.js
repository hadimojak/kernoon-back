const path = require('path');

module.exports = function (options) {
  const externals = options.externals;
  return {
    ...options,
    externals: [
      ...(Array.isArray(externals) ? externals : externals ? [externals] : []),
      { pg: 'commonjs pg', ioredis: 'commonjs ioredis' },
    ],
    resolve: {
      ...options.resolve,
      alias: {
        ...(options.resolve && options.resolve.alias),
        '@app/common': path.resolve(__dirname, 'libs/common/src/index.ts'),
        '@app/contracts': path.resolve(__dirname, 'libs/contracts/src/index.ts'),
      },
    },
  };
};
