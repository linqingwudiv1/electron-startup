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

        }
      },
      express: {
        shouldServeApp: true,
        serverDir: './DebugServer'
      }
    }
  }
