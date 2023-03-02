const shell = require('shelljs')

module.exports = (api, options, rootOptions) => {
    console.log('\n\n欢迎使用VueCMF内容管理快速开发框架^_^\n\n')

    const path = api.resolve('./')
    let arr;
    if(path.indexOf('/') !== -1){
        arr = path.split('/')
    }else{
        arr = path.split('\\')
    }
    let project_name = arr[arr.length-1]

    // 修改 `package.json` 里的字段
    api.extendPackage({
        name: `${project_name}`,
        version: "2.0.8",
        description: "VueCMF是一款完全开源免费的内容管理快速开发框架。2.0+版本使用vue3、Element Plus和TypeScript构建，后端API基于ThinkPHP6开发。可用于快速开发CMS、CRM、WMS、OMS、ERP等管理系统，开发简单、高效易用，极大减少系统的开发周期和研发成本！甚至不用写一行代码使用VueCMF就能设计出功能强大的后台管理系统。",
        keyword: "vuecmf vue3 vuecmf开发框架",
        author: "vuecmf <tulihua2004@126.com>",
        license: "MIT",
        scripts: {
            "dev": "vue-cli-service serve",
            "test": "vue-cli-service serve --mode test",
            "build": "vue-cli-service build",
            "build:test": "vue-cli-service build --mode test",
            "lint": "vue-cli-service lint"
        },
        repository: {
            type: "git",
            url: "git+https://github.com/vuecmf/vuecmf.git"
        },
        dependencies: {
            "@types/node": "^16.11.12",
            "axios": "^0.24.0",
            "core-js": "^3.6.5",
            "element-plus": "^2.0.5",
            "qs": "^6.10.2",
            "register-service-worker": "^1.7.1",
            "vue": "^3.2.0",
            "vue-router": "^4.0.0-0",
            "vue-vuecmf-dialog": "^1.4.4",
            "vue3-vuecmf-table": "1.13.9",
            "vuex": "^4.0.0-0"
        },
        devDependencies: {
            "@typescript-eslint/eslint-plugin": "^4.18.0",
            "@typescript-eslint/parser": "^4.18.0",
            "@vue/cli-plugin-babel": "~4.5.0",
            "@vue/cli-plugin-eslint": "~4.5.0",
            "@vue/cli-plugin-pwa": "~4.5.0",
            "@vue/cli-plugin-router": "~4.5.0",
            "@vue/cli-plugin-typescript": "~4.5.0",
            "@vue/cli-plugin-vuex": "~4.5.0",
            "@vue/cli-service": "~4.5.0",
            "@vue/compiler-sfc": "^3.0.0",
            "@vue/eslint-config-typescript": "^7.0.0",
            "eslint": "^6.7.2",
            "eslint-plugin-vue": "^7.0.0",
            "sass": "^1.26.5",
            "sass-loader": "^8.0.2",
            "typescript": "~4.1.5",
            "unplugin-auto-import": "^0.5.11",
            "unplugin-vue-components": "^0.17.18"
        },
        bugs: {
            "url": "https://github.com/vuecmf/vuecmf/issues"
        },
        homepage: "http://www.vuecmf.com"
    })

    // 复制并用 ejs 渲染 `template` 内所有的文件
    api.render('./generator/template', Object.assign({BASE_URL: ''}, options))

    api.onCreateComplete(() => {
        shell.cd(api.resolve('./'))
        shell.exec('rm ./src/components/HelloWorld.vue')
        shell.exec('rm ./src/assets/logo.png')
        shell.exec('rm ./src/views/About.vue')
        shell.exec('rm ./src/views/Home.vue')

        console.log(`
    \n在命令行执行以下命令开始您的VueCMF之旅！
    \n1、切换到项目根目录
    \n    cd ${project_name}
    \n2、启动开发环境项目调试
    \n    yarn dev                                
    \n3、发布到测试环境
    \n    yarn build:test
    \n4、发布到生产环境
    \n    yarn build
    \n`)

    })

    api.exitLog('\n\n恭喜您，项目已创建完成！详细的使用教程，欢迎访问 http://www.vuecmf.com','done')

}
