<template>
  <div class="header-inner">
  <!-- main-menu start -->
  <el-menu
      :default-active="main_menu_active"
      :ellipsis="is_ellipsis"
      class="vuecmf-layout-header-menu"
      mode="horizontal"
      background-color="#303133"
      text-color="#fff"
      active-text-color="#409EFF"
      @select="selectMainMenu"
  >
    <el-menu-item :index="item.mid" :key="key" v-for="(item,key) in nav_menu_list">
      <i class="el-icon" v-if="item.icon"><component :is="item.icon"></component></i>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </el-menu>
  <!-- main-menu end -->

  <!-- user-info start -->
  <el-dropdown @command="logout">
    <span class="el-dropdown-link">
      <el-avatar :size="38" :icon="Avatar"  ></el-avatar>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>账号：{{ user_info.username }}</el-dropdown-item>
        <el-dropdown-item>角色：{{ user_info.role }}</el-dropdown-item>
        <el-dropdown-item command="logout" divided><el-icon><circle-close-filled /></el-icon>退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- user-info end -->
  </div>

</template>

<script lang="ts">
import {defineComponent} from "vue"
import LoginService from "@/service/LoginService";
import { Avatar } from '@element-plus/icons-vue'


export default defineComponent({
  name: "LayoutHeader",
  props:{
    main_menu_active: String,
    is_ellipsis: Boolean,
    nav_menu_list: Object,
    selectMainMenu: Function,
  },
  setup() {
    const loginService = new LoginService()
    const user_info = loginService.getLoginUser()

    const logout = (command:string):void => {
      if(command == 'logout'){
        loginService.logoutEvent()
      }
    }

    return {
      Avatar,
      user_info,
      logout
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/vuecmf-base.scss';

/* 顶部菜单设置 */
.header-inner{
  display: flex;
  align-items: center;
  text-align: center;
  height: $header_height;
  .el-menu{
    flex-grow: 1;
    height: $header_height;
    --el-menu-border-color: none;
    .el-menu-item { height: $header_height; }
  }

  .el-avatar{
    --el-avatar-bg-color:none;
  }
  .el-avatar--icon{
    font-size: 26px;
  }

  /* 头像下拉 */
  .el-dropdown{
    width: $header_height - 4;
    height: $header_height - 4;
    top: 2px;
  }

}

/* 修复头像下拉最后一项位置显示异常 */
.el-dropdown-menu__item {
  display: inherit;
}

/* 菜单过多时，出现的省略号高度设置 */
:deep(.el-menu--horizontal){
  .el-sub-menu .el-sub-menu__title{
    height: $header_height;
    line-height: $header_height;
  }
}




</style>