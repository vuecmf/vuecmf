<template>
  <el-container>
    <!-- 左侧菜单 -->
    <el-aside :width="aside_width" >
      <vuecmf-layout-aside-menu
          :aside_menu_active="aside_menu_active"
          :is_side_collapse="is_side_collapse"
          :aside_menu_list="aside_menu_list"
          :collapse="collapse"
          :addTab="addTab"
      ></vuecmf-layout-aside-menu>
    </el-aside>

    <el-container>
      <!-- 顶部菜单 -->
      <el-header height="46px">
        <vuecmf-layout-header
            :main_menu_active="main_menu_active"
            :is_ellipsis="is_ellipsis"
            :nav_menu_list="nav_menu_list"
            :selectMainMenu="selectMainMenu"
        ></vuecmf-layout-header>
      </el-header>

      <!-- 主体开始 -->
      <el-main>
        <!-- 标签页 -->
        <vuecmf-layout-tabs
            ref="vuecmf_tabs"
            :current_tab_index="current_tab_index"
            :left_disabled="left_disabled"
            :right_disabled="right_disabled"

            :scroll_x="scroll_x"
            :tags_list="tags_list"
            :scrollLeft="scrollLeft"
            :scrollRight="scrollRight"
            :closeTag="closeTag"
            :manageVuecmfTabs="manageVuecmfTabs"
            :selectTab="selectTab"
            :fullScreen="fullScreen"
            :reloadTabPage="reloadTabPage"
        ></vuecmf-layout-tabs>

        <div class="vuecmf-main">
          <el-breadcrumb :separator-icon="ArrowRight" >
            <el-breadcrumb-item :key="index" v-for="(item,index) in breadcrumb_list"><span v-if="index == 0">当前位置：</span>{{ item }}</el-breadcrumb-item>
          </el-breadcrumb>

          <el-config-provider :locale="locale">
            <router-view :key="view_key" />
          </el-config-provider>

        </div>

      </el-main>
      <!-- 主体结束 -->

      <el-footer height="32px">&copy; VueCMF. Powered by <el-link type="primary" target="_blank" href="http://www.vuecmf.com/">www.vuecmf.com</el-link></el-footer>

    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import LayoutService from "@/service/LayoutService"
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const service = new LayoutService()

const aside_width = service.aside_width
const view_key = service.view_key
const breadcrumb_list = service.breadcrumb_list

//子组件(VuecmfLayoutTabs)
const vuecmf_tabs = service.vuecmf_tabs
const current_tab_index = service.current_tab_index
const left_disabled = service.left_disabled
const right_disabled = service.right_disabled
const tags_list = service.tags_list
const scroll_x = service.scroll_x

//子组件(VuecmfLayoutHeader)
const main_menu_active = service.main_menu_active
const nav_menu_list = service.nav_menu_list
const is_ellipsis = service.is_ellipsis
const selectMainMenu = service.selectMainMenu

//子组件(VuecmfLayoutAsideMenu)
const aside_menu_active = service.aside_menu_active
const is_side_collapse = service.is_side_collapse
const aside_menu_list = service.aside_menu_list
const collapse = service.collapse
const addTab = service.addTab


//模板使用的方法
const scrollLeft = service.scrollLeft
const scrollRight = service.scrollRight
const closeTag = service.closeTag
const manageVuecmfTabs = service.manageVuecmfTabs
const selectTab = service.selectTab
const fullScreen = service.fullScreen
const reloadTabPage = service.reloadTabPage

//element plus 本地中文
const locale = zhCn


//实例挂载完后，页面显示初始化
service.init()

</script>

<script lang="ts">
import { defineComponent } from "vue"
import VuecmfLayoutHeader from "@/components/LayoutHeader.vue"
import VuecmfLayoutAsideMenu from "@/components/LayoutAsideMenu.vue"
import VuecmfLayoutTabs from "@/components/LayoutTabs.vue"
import { ElConfigProvider } from 'element-plus'


export default defineComponent({
  name: "Layout",
  components:{
    VuecmfLayoutHeader,
    VuecmfLayoutAsideMenu,
    VuecmfLayoutTabs,
    ElConfigProvider,
  },
})
</script>

<style lang="scss">
.el-breadcrumb__separator.el-icon{
  color: #909399;
}
.el-dialog__header .min_btn{
  line-height: 8px; display: inline-flex;
}
</style>
<style lang="scss" scoped>
@import '@/assets/vuecmf-base.scss';

.el-header{ padding-left: 0; padding-right: 10px; background-color: $menu_background_color; }
.el-aside{ background-color: $menu_background_color;  transition: width .3s ease-in; }
.el-main{
  padding: 0;
  .vuecmf-main{
    padding: 8px 8px 0;
  }
  .el-breadcrumb{
    padding: 0 0 8px;
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 10px;
    :deep(.el-breadcrumb__inner){
      color: #909399;
      font-size: 12px;
    }

  }
}

.el-footer{
  color: #666;
  text-align: center;
  line-height: 30px;
  box-shadow: 0 -2px 2px #ddd;
  z-index: 0;
  font-size: 12px;
  padding: 0;
}
</style>
