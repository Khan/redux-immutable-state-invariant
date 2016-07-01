const webpack = require('webpack');

module.exports = {
    context: __dirname,
    entry: "./dist/index.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.dev.js",
        libraryTarget: "commonjs2"
    }
}
