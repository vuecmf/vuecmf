<template>
  <el-affix :offset="0">
    <div class="vuecmf-logo" v-show="!is_side_collapse">VueCMF</div>
    <div class="vuecmf-logo" v-show="is_side_collapse">VC</div>

    <div class="collapse-menu" @click.prevent="collapse" >
      <el-icon :size="16" title="展开" v-show="is_side_collapse"><expand /></el-icon>
      <el-icon :size="16" title="折叠" v-show="!is_side_collapse"><fold /></el-icon>
    </div>
  </el-affix>

  <el-menu
      router
      ref="vuecmf_aside_menu"
      background-color="#303133"
      text-color="#fff"
      active-text-color="#409EFF"
      class="vuecmf-aside-menu"
      :unique-opened="true"
      :default-active="aside_menu_active"
      :collapse="is_side_collapse"
      @select="addTab"
  >
    <template v-for="item in aside_menu_list" >
      <el-menu-item :index="item.mid" :key="item.mid" v-if="!item.children">
        <i class="el-icon" v-if="item.icon"><component :is="item.icon"></component></i>
        <template #title>{{ item.title }}</template>
      </el-menu-item>
      <vuecmf-layout-aside-menu-item :menu_item_list="item" :key="item.mid" v-else></vuecmf-layout-aside-menu-item>
    </template>

  </el-menu>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import VuecmfLayoutAsideMenuItem from "@/components/LayoutAsideMenuItem.vue"

export default defineComponent({
  name: "LayoutAsideMenu",
  components:{ VuecmfLayoutAsideMenuItem },
  props:{
    aside_menu_active: String,
    is_side_collapse: Boolean,
    aside_menu_list: Object,
    collapse: Function,
    addTab: Function,
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/vuecmf-base.scss';

/* 整体菜单的宽高与高度设置 */
.vuecmf-aside-menu{ height: - $header_height - 32; border: 0; margin-top: 5px; }
.vuecmf-aside-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 200px;
}

/* LOGO 设置 */
.vuecmf-logo{
  height: $header_height;
  line-height: $header_height;
  text-align: center;
  color: #fff;
  background-color: $menu_background_color;
  font-size: 20px;
}

/* 展开与折叠动作图标设置 */
.collapse-menu{
  color: #fff;
  height: 32px;
  line-height: 36px;
  text-align: center;
  background-color: #606266;
  cursor: pointer;
}

.el-sub-menu :deep(.el-sub-menu__title){
  height: $header_height - 8;
  line-height: $header_height - 8;
}

/* 菜单折叠后宽度及图标居中 */
.el-menu--collapse{
  width: $header_height;
  .el-menu-item :deep(div){
    padding: 0 !important;
    text-align: center !important;
    justify-content: center;
  }
  .el-sub-menu :deep(.el-sub-menu__title){
     display: inherit;
     padding: 0 !important;
     text-align: center !important;
   }
}



/* 菜单展开时的菜单项设置 */
.vuecmf-aside-menu :deep(.el-menu-item){
  height: $header_height - 8;
  line-height: $header_height - 8;
}



</style>

<style lang="scss" >
.el-menu--vertical{
  .el-menu--popup {
    .el-menu-item{
      height: 38px !important;
      line-height: 38px !important;
    }
  }
}
</style>
