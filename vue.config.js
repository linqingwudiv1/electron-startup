module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    css: {
      loaderOptions: {
        stylus: {
          import: "~@/assets/css/Global.styl"
        }
      }
    },
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          // options placed here will be merged with default configuration and passed to electron-builder
        }
      }
    }
  }