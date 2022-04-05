// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import * as Icons from '@element-plus/icons'

/*导入vuecmf editor、vuecmf dialog和vuecmf table组件*/
import VuecmfEditor from 'vue-vuecmf-editor'
import VuecmfDialog from 'vue-vuecmf-dialog'
import VuecmfTable from "vue3-vuecmf-table"

const app = createApp(App)

app.use(store).use(router).use(VuecmfTable).use(VuecmfEditor).use(VuecmfDialog).mount('#app')
//注册全局组件
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key as keyof typeof Icons])
})


