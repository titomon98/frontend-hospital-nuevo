const webpack = require('webpack')

module.exports = {
  // Sin .map en producción: pesan ~3x el código y exponen el fuente.
  productionSourceMap: false,

  publicPath: process.env.NODE_ENV === 'production'
    ? (process.env.VUE_APP_BASE_URL || '/')
    : '/',

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl'
      })
    ]
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}
