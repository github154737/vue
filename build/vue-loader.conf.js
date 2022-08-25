'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  output: {//这里开始是高德地图api的
         path: config.build.assetsRoot,
         filename: '[name].js',
         publicPath: process.env.NODE_ENV === 'production'
         ? config.build.assetsPublicPath
          : config.dev.assetsPublicPath
      },
      externals:{
        'AMap':'AMap'
      }
}
