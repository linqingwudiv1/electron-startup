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
    }
  }