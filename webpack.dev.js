const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    contentBase: "./",
    watchContentBase: true,
<<<<<<< HEAD
    open: "Chrome", // use "chrome" for PC
=======
    open: "Google Chrome", // use "google-chrome" for PC
>>>>>>> d2a4144ea4e2a4859e01fb2ea826c2de709ac08c
  },
});