<template>
  <div class="login-container">
    <div class="login-form">
      <h1>欢迎使用</h1>
      <div class="login-content">
        <el-form ref="login_ref" :model="loginForm" :rules="ruleLoginForm" >
          <el-form-item prop="username">
            <el-input  type="text" size="large" v-model="loginForm.username" placeholder="账号或邮箱或手机号" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input  type="password" size="large" v-model="loginForm.password" placeholder="密码" :prefix-icon="Key" />
          </el-form-item>
          <el-form-item>
            <el-button type="success" size="large" shape="circle"  long  @click="loginEvent">登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="copyright">
      <p>&copy; 2019-2022 <a target="_blank" href="http://www.vuecmf.com/">www.vuecmf.com</a>
      </p>
    </div>

  </div>

</template>

<script lang="ts">
import {defineComponent} from "vue"
import LoginService from "@/service/LoginService"
import { User, Key } from '@element-plus/icons-vue'

export default defineComponent({
  name: "Login",
  setup(){
    const loginService = new LoginService()
    const login_ref = loginService.login_ref
    const loginForm = loginService.loginForm
    const loginEvent = loginService.loginEvent
    const ruleLoginForm = loginService.ruleLoginForm

    return {
      login_ref,
      loginForm,
      loginEvent,
      User,
      Key,
      ruleLoginForm
    }
  }
})
</script>

<style lang="scss" scoped>
.login-container{
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  background-image: linear-gradient(#F2F6FC,#909399,#F2F6FC);
  font-size: 12px;
  .login-form{
    font-size: 14px;
    border: 0;
    border-radius: 12px;
    h1{
      text-align: center;
      margin: 0;
      padding: 15px 0;
      background-color: #409EFF;
      color: #ffffff;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
    .login-content{
      background-color: #ffffff;
      padding: 20px 15px 15px;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      .el-button{ width: 100%}
    }
  }
  .copyright{ width: 100%; text-align: center; color: #303133; margin-top:10px;}
  @media screen and (max-width:575px) {
    .login-form{ width: 65%}
  }
  @media screen and (min-width:576px) and (max-width: 767px) {
    .login-form{ width: 50%}
  }
  @media screen and (min-width:768px) and (max-width: 991px) {
    .login-form{ width: 40%}
  }
  @media screen and (min-width:992px) and (max-width: 1199px) {
    .login-form{ width: 30%}
  }
  @media screen and (min-width:1200px){
    .login-form{ width: 25%}
  }
}


</style>