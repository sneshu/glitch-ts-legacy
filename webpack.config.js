const path = require(`path`);
const webpack = require(`webpack`);
const TerserPlugin = require(`terser-webpack-plugin`);

module.exports = {
  entry: `./Source/Main.ts`,
  mode: `development`,
  devtool: `inline-source-map`,
  watch: true,
  output: {
    filename: `script.js`,
    path: path.resolve(__dirname, `public`, `js`),
    clean: true
  },
  resolve: {
    extensions: [`.ts`, `.js`],
  },
  devServer: {
    port: 1337,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          comments: false
        },
      },
      extractComments: false
    })],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: `ts-loader`,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [ 
    new webpack.BannerPlugin({ 
      banner: `Copyright (c) Sneshu 2025, All rights reserved`,
      raw: false
    })
  ],
};