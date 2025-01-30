var WebpackNotifierPlugin = require("webpack-notifier");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const mode = process.argv.find(arg => arg.startsWith('--mode=')).split('=')[1];
const isProduction = mode === 'production';

module.exports = {
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      fs: require.resolve("browserify-fs"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      vm: require.resolve("vm-browserify")
    },
  },
  devtool: isProduction ? false : "source-map",
  entry: {
    app: "./src/entry/app.js",
  },
  output: {
    path: __dirname + "/src/build/bundles",
    filename: "[name].bundle.js",
  },
  performance: {
    hints: false,
  },
  watchOptions: {
    ignored: ["node_modules", "src/build/**/*"],
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "javascript/auto",
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        loader: "strip-sourcemap-loader",
        // options: {
        //     // For `underscore` library, it can be `_.map map` or `_.map|map`
        //     exposes: "strip-sourcemap-loader",
        //   },
      },
      {
        loader: "babel-loader",
        exclude: /node_modules/,
        test: /\.jsx?$/,
        // options: {
        //     // For `underscore` library, it can be `_.map map` or `_.map|map`
        //     exposes: "babel-loader",
        //   },
        // query: {
        //     presets: ['es2015', 'stage-3']
        // }
      },
    ],
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new WebpackNotifierPlugin({
      title: "ScratchJr",
      alwaysNotify: true,
    }),
    // new FilerWebpackPlugin(),
  ],
};
