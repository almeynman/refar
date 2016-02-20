const path = require('path')
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')
const devServer = {
  outputPath: path.join(__dirname, './dist'),
  contentBase: path.resolve(__dirname, './'),
  colors: true,
  quiet: false,
  noInfo: false,
  publicPath: '/dist/'
}

module.exports = {
  debug: true,
  devtool: 'source-map',
  devServer: devServer,
  entry: './src/index.js',
  output: {
    path: devServer.outputPath,
    filename: 'index.js',
    publicPath: devServer.publicPath
  },
  plugins: [
    new WriteFileWebpackPlugin({
      test: /\.js$/
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  resolve: {
    // you can now require('file') instead of require('file.js')
    extensions: ['', '.js', '.css']
  }
}
