// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/emei8/vuecmf-web/blob/master/LICENSE )
// +----------------------------------------------------------------------
// | Author: emei8 <2278667823@qq.com>
// +----------------------------------------------------------------------

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'
import LayoutService from "@/service/LayoutService"
import { ElMessage } from 'element-plus'


const service = new LayoutService()

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Layout.vue'),
    redirect: 'welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/Welcome.vue'),
        name: 'welcome',
        meta: { breadcrumb_list: ['欢迎页'], title: 'welcome! - Powered by www.vuecmf.com', icon: 'welcome', noCache: true,topId:0, id:0, token:'123'}
      },
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
    name: 'login',
    meta: { title: '登录系统 - Powered by www.vuecmf.com', icon: 'welcome', noCache: true,topId:0, id:0}
  },
  {
    path:'/refresh',
    component: () => import('@/views/Refresh.vue'),
  },
]

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * 进入路由前
 */
router.beforeEach( (to,from, next) => {
  const token = localStorage.getItem('vuecmf_token')

  if(to.name == 'login'){
    next()
  }else{
    if(token == '' || token == null){
      ElMessage.error('还没有登录或登录超时,请先登录！')
      next({name:'login'});
    }else if(to.name !== 'welcome' && store.state.nav_menu_list.length == 0){
      service.loadMenu().then((res:string|void)=> {
        res === 'router loaded' ? next({ path: to.path, query: to.query }) : next()
      })
    }else{
      next()
    }
  }

})

export default router
