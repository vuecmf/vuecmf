const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = {
    publicPath : './',
    outputDir : 'admin',
    indexPath : 'index.html',
    assetsDir : 'static',
    productionSourceMap : false,
    configureWebpack: config => {
        const plugins = [];
        plugins.push(
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        )

        // 合并plugins
        config.plugins = [...config.plugins, ...plugins];
    }
}