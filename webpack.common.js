
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const outputDir = "./dist";

module.exports = {
<<<<<<< HEAD
entry: path.resolve(__dirname, "src", "index.js"), 
=======
entry: path.resolve(__dirname, "src", "index.js"), //
>>>>>>> d2a4144ea4e2a4859e01fb2ea826c2de709ac08c
output: {
    path: path.join(__dirname, outputDir),
    filename: "[name].js",
    publicPath: "/dist/",
},
resolve: {
    extensions: [".js"], // if we were using React.js, we would include ".jsx"
},
module: {
    rules: [
    {
        test: /\.js$/, // if we were using React.js, we would use \.jsx?$/
        use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-optional-chaining"],
            exclude: /node_modules/,
        }, // if we were using React.js, we would include "react"
        },
    },
    {
        test: /\.css$/,
        use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
            // you can specify a publicPath here
            // by default it uses publicPath in webpackOptions.output
<<<<<<< HEAD
            publicPath: "../",
=======
            publicPath: "../"
            // hmr: process.env.NODE_ENV === "development",
>>>>>>> d2a4144ea4e2a4859e01fb2ea826c2de709ac08c
            },
        },
        "css-loader",
        "postcss-loader",
        ],
    },
    {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
        {
            loader: "file-loader",
            options: {
            // you can specify a publicPath here
            // by default it uses publicPath in webpackOptions.output
            name: "[name].[ext]",
            outputPath: "images/",
            publicPath: "images/",
            },
        },
        ],
    },
    {
        test: /\.scss/,
        use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
            // you can specify a publicPath here
            // by default it uses publicPath in webpackOptions.output
<<<<<<< HEAD
            publicPath: "../",
=======
            publicPath: "../"
            // hmr: process.env.NODE_ENV === "development",
>>>>>>> d2a4144ea4e2a4859e01fb2ea826c2de709ac08c
            },
        },
        "css-loader",
        "sass-loader",
        "postcss-loader",
        ],
    },
    ],
},
plugins: [
    new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // all options are optional
    filename: "[name].css",
    chunkFilename: "[id].css",
    ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    require("autoprefixer"),
],
};