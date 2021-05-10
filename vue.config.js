const path = require('path')
const proxy = require('http-proxy-middleware')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = { 
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('src/styles/var.less')
      ]
    }
  },
  devServer: {
    proxy: {
      '/auth/token': {
        target: 'https://oauth.secure.pixiv.net',
        changOrigin: true,
      },
      '/v1/search/illust': {
        target: 'https://app-api.pixiv.net',
        changOrigin: true
      }
    }
  }
}
