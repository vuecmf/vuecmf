<template>
  <el-sub-menu :index="menu_item_list.mid">
    <template #title>
      <i class="el-icon" v-if="menu_item_list.icon"><component :is="menu_item_list.icon"></component></i>
      <span>{{ menu_item_list.title }}</span>
    </template>
    <template v-for="item in menu_item_list.children" >
      <el-menu-item :index="item.mid" :key="item.mid" v-if="!item.children">
        <i class="el-icon" v-if="item.icon"><component :is="item.icon"></component></i>
        <span>{{ item.title }}</span>
      </el-menu-item>
      <template v-else>
        <vuecmf-layout-aside-menu-item :menu_item_list="item" :key="item.mid"></vuecmf-layout-aside-menu-item>
      </template>
    </template>
  </el-sub-menu>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "vuecmf-layout-aside-menu-item",
  props: {
    menu_item_list: Object
  },
})
</script>

