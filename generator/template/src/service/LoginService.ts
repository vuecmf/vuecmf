// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseService from "@/service/BaseService";
import {reactive, ref} from "vue";
import {ElMessage} from "element-plus";
import LoginModel from "@/model/LoginModel";
import router from "@/router";
import {AnyObject} from "@/typings/vuecmf";


/**
 * 登录服务类
 */
export default class LoginService extends BaseService{
    login_ref = ref()
    loginForm = reactive({
        username: '',
        password: ''
    })

    /**
     * 登录表单验证规则
     */
    ruleLoginForm = reactive({
        username: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不得小于六位', trigger: 'blur' }
        ]
    })

    loginModel = new LoginModel()

    /**
     * 登录事件
     */
    loginEvent = ():void => {
        this.login_ref.value.validate((valid: boolean) => {
            if(!valid){
                ElMessage.error('登录提交数据验证不通过！')
            }else{
                this.loginModel.login(this.loginForm.username, this.loginForm.password).then((res) => {
                    if(res.status == 200 && res.data.code == 0){
                        ElMessage.success(res.data.msg)
                        localStorage.setItem('vuecmf_token', res.data.data.token)
                        localStorage.setItem('vuecmf_user', JSON.stringify(res.data.data.user))
                        localStorage.setItem('vuecmf_server', JSON.stringify(res.data.data.server))
                        router.push({ name: 'welcome' })
                    }else{
                        ElMessage.error(res.data.msg)
                        localStorage.clear()
                    }
                })
            }
        })
    }


    /**
     * 获取登录用户信息
     */
    getLoginUser = (): AnyObject|false => {
        return this.loginModel.getLoginUser()
    }

    /**
     * 获取服务器信息
     */
    getServerInfo = ():AnyObject|false => {
        return this.loginModel.getServerInfo()
    }


}