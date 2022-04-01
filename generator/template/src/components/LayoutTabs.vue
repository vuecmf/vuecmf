<template>
  <div class="vuecmf-tabs">
    <el-button type="text" title="左移动" class="vuecmf-tabs-arrow" @click="scrollLeft" :disabled="left_disabled"><el-icon><arrow-left-bold /></el-icon></el-button>
    <div class="vuecmf-tabs-main" ref="vuecmf_tabs_main">
      <div class="vuecmf-tabs-wrap" ref="vuecmf_tabs_wrap" :style="'transform: translateX(' + scroll_x + 'px)'">
        <el-tag
            :id=" 'vucmf_tag_' + tag.path + '_' + idx "
            v-for="(tag,idx) in tags_list"
            :key="'vucmf_tag_' + tag.path"
            :type=" current_tab_index === idx ? '' : 'info' "
            effect="plain"
            :closable=" idx > 0 "
            :disable-transitions
                ="true"
            @close="closeTag(tag)"
            @click="selectTab"
        >
          {{ tag.title }}
        </el-tag>
      </div>
    </div>
    <el-button type="text" title="右移动" class="vuecmf-tabs-arrow" @click="scrollRight" :disabled="right_disabled"><el-icon><arrow-right-bold /></el-icon></el-button>
    <div class="vuecmf-tabs-menu">
      <el-dropdown @command="manageVuecmfTabs">
              <span class="el-dropdown-link">
                <el-icon><more /></el-icon>
              </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="close-left">关闭当前左边</el-dropdown-item>
            <el-dropdown-item command="close-right">关闭当前右边</el-dropdown-item>
            <el-dropdown-item command="close-current">关闭当前</el-dropdown-item>
            <el-dropdown-item command="close-no-current">关闭非当前</el-dropdown-item>
            <el-dropdown-item command="close-all">关闭全部</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
    <div class="vuecmf-tabs-refresh" title="刷新当前页" @click="reloadTabPage">
      <el-icon><refresh /></el-icon>
    </div>
    <div class="vuecmf-tabs-fullscreen" title="全屏" @click="fullScreen">
      <el-icon><monitor /></el-icon>
    </div>



  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "LayoutTabs",
  props:{
    current_tab_index: Number,
    left_disabled: Boolean,
    right_disabled: Boolean,
    tags_list: Object,
    scroll_x: Number,
    scrollLeft: Function,
    scrollRight: Function,
    closeTag: Function,
    manageVuecmfTabs: Function,
    selectTab: Function,
    fullScreen: Function,
    reloadTabPage: Function,
  },
})
</script>



<style lang="scss" scoped>
.vuecmf-tabs{
  display: flex;
  align-items: center;
  position: relative;
  height: 31px;
  border-bottom: 1px solid #d3d4d6;
  background-color: #F2F6FC;
  .vuecmf-tabs-arrow, .vuecmf-tabs-menu, .vuecmf-tabs-refresh, .vuecmf-tabs-fullscreen{
    padding: 0 8px;
    text-align: center;
    cursor: pointer;
  }
  .vuecmf-tabs-main{
    flex-grow: 1;
    height: 32px;
    margin-top: 1px;
    overflow: hidden;
    .vuecmf-tabs-wrap{
      margin-top: 3px;
      height: 28px;
      white-space: nowrap;
      float: left;
      transition: transform .3s;
      .el-tag{
        display: inline-block;
        position: relative;
        margin-right: 3px;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        height: 29px;
        line-height: 26px;
        cursor: pointer;
      }
      /* 选中 */
      .el-tag--plain{
        border-bottom-color: #ffffff;
      }
      /* 未选中 */
      .el-tag--info{
        border-bottom-color: #d3d4d6;
      }
    }
  }
}
</style>