const path = require('path')
const resolve = (dir) => {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    publicPath: '',
    css: {},
    devServer: {},
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('base', resolve('src/style/base'))
            .set('style', resolve('src/style'))
            .set('utils', resolve('src/utils'))
            .set('components', resolve('src/components'))
            .set('public', resolve('public'))
    },
    configureWebpack: {
        plugins: []
    }
}
