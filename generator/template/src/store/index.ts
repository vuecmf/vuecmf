// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import { createStore } from 'vuex'

export default createStore({
  state: {
    nav_menu_list: [], //系统导航菜单列表
    api_maps: [], //后端API映射列表
  },
  mutations: {
    setNavMenuList(state, menuList){
      state.nav_menu_list = menuList
    },
    setApiMaps(state, apiMaps){
      state.api_maps = apiMaps
    }
  },
  actions: {
    setNavMenuList(context, menuList){
      context.commit('setNavMenuList', menuList)
    },
    setApiMaps(context, apiMaps){
      context.commit('setApiMaps', apiMaps)
    }
  },
  getters:{
    navMenuList: (state) => {
      return state.nav_menu_list
    },
    apiMaps: (state) => {
      return state.api_maps
    },
    getActionTypeByTableName: (state) => (table_name:number) => {
      let action_type:string[] = []

      if(typeof table_name != 'undefined' && typeof state.api_maps[table_name] != 'undefined'){
        action_type = Object.keys(state.api_maps[table_name])
      }

      return action_type
    }
  },
  modules: {
  }
})
