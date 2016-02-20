const webpack = require('webpack')
const env = process.env.NODE_ENV

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

const falcorExternal = {
  root: 'Falcor',
  commonjs2: 'falcor',
  commonjs: 'falcor',
  amd: 'falcor'
}

const rxjsExternal = {
  root: 'Rxjs',
  commonjs2: 'rxjs',
  commonjs: 'rxjs',
  amd: 'rxjs'
}

const config = {
  externals: {
    'react': reactExternal,
    'falcor': falcorExternal,
    'rxjs': rxjsExternal
  },
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'Refar',
    libraryTarget: 'umd'
  },
  plugins: [
    {
      // TODO find out what does this do
      apply: function apply(compiler) {
        compiler.parser.plugin('expression global', function expressionGlobalPlugin() {
          this.state.module.addVariable('global', "(function() { return this; }()) || Function('return this')()")
          return false
        })
      }
    },
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config
