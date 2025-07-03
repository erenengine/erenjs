const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'test-pass': './test-pass/index.ts',
    'test-vertex-buffer': './test-vertex-buffer/index.ts',
    'test-index-buffer': './test-index-buffer/index.ts',
    'test-uniform-buffer': './test-uniform-buffer/index.ts',
    'test-depth-buffer': './test-depth-buffer/index.ts',
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