const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'test-instance': './test-instance/index.ts',
    'test-device': './test-device/index.ts',
    'test-pass': './test-pass/index.ts',
    'test-vertex-buffer': './test-vertex-buffer/index.ts',
    'test-index-buffer': './test-index-buffer/index.ts',
    'test-uniform-buffer': './test-uniform-buffer/index.ts',
    'test-storage-buffer': './test-storage-buffer/index.ts',
    'test-depth-buffer': './test-depth-buffer/index.ts',
    'test-compute-shader': './test-compute-shader/index.ts',
    'test-shadow': './test-shadow/index.ts',
  },
  output: {
    filename: '[name]/bundle.js',
    path: path.resolve(__dirname, './')
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.wgsl/,
        loader: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  devServer: {
    client: {
      logging: 'none',
    },
  },
};