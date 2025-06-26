const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'test-instance': './test-instance/index.ts',
    'test-device': './test-device/index.ts',
    'test-pass': './test-pass/index.ts',
    'test-vertex-input': './test-vertex-input/index.ts',
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