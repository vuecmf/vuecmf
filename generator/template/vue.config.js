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
    },
    chainWebpack(config) {
        if (process.env.NODE_ENV === 'production') {
            config.optimization.splitChunks({
                cacheGroups: {
                    common: {//commons 一般是是个人定义的
                        name: 'chunk-common', // 打包后的文件名
                        chunks: 'initial',
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        priority: 1,
                        reuseExistingChunk: true
                    },
                    vendors: {//vendor 是导入的 npm 包
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        maxSize: 300000,
                        maxInitialRequests: 20,
                        priority: 2,
                        reuseExistingChunk: true,
                        enforce: true
                    }
                }
            })
        }
    }

}

