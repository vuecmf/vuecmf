<template>
  <div class="title"><h1>欢迎使用</h1></div>
  <el-descriptions
      title="系统信息"
      :column="1"
      border
  >
  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        登录账号
      </div>
    </template>
    {{ user_info.username }}
  </el-descriptions-item>
  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        角色
      </div>
    </template>
    {{ user_info.role }}
  </el-descriptions-item>
  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        最后登录IP
      </div>
    </template>
    {{ user_info.last_login_ip }}
  </el-descriptions-item>
  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        最后登录时间
      </div>
    </template>
    {{ user_info.last_login_time }}
  </el-descriptions-item>
  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        VueCMF版本
      </div>
    </template>
    {{ server_info.version }}
  </el-descriptions-item>

  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        服务器运行环境
      </div>
    </template>
    {{ server_info.os }} {{ server_info.software }}
  </el-descriptions-item>

  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        服务器数据库
      </div>
    </template>
    mysql {{ server_info.mysql }}
  </el-descriptions-item>

  <el-descriptions-item>
    <template #label>
      <div class="cell-item">
        最大上传文件大小
      </div>
    </template>
    {{ server_info.upload_max_size }}
  </el-descriptions-item>


  </el-descriptions>
</template>

<script>
import {defineComponent} from "vue";
import LoginService from "../service/LoginService";

export default defineComponent({
  name: "Welcome",
  setup(){
    const loginService = new LoginService()
    const user_info = loginService.getLoginUser()
    const server_info = loginService.getServerInfo()

    return {
      user_info,
      server_info
    }

  }
})
</script>

<style lang="scss" scoped>
.title{ text-align: center; font-size: 32px; color: #606266;}
</style>