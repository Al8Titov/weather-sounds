const { merge } = require("webpack-merge");
const path = require("path");
const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },
    ],
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: true,
    },
    watchFiles: ["src/**/*"],
  },
});
