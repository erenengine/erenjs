const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
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
        test: /\.(vert|frag)$/,
        loader: 'raw-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    client: {
      logging: 'none',
    },
  },
};