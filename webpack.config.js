const path = require('path');

module.exports = {
  entry: './components/index.js',
  mode: "development",
  output: {
    path: path.resolve(__dirname, 'public/dist'),
    filename: '[name].js'
  },

  optimization: { 
    runtimeChunk: 'single',
     splitChunks: {
       cacheGroups: {
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           chunks: 'all',
         },
       },
     },
  },

  module: {
      rules: [
          { test: /\.js$/, use: "babel-loader" }
      ]
  }

};