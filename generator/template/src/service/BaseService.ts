// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import { ref, onMounted, nextTick, computed } from "vue"
import router from "@/router";
import {ElMessage} from "element-plus/es";
import {AnyObject} from "@/typings/vuecmf";
import DataModel from "@/model/DataModel";

/**
 * 基础服务类
 */
export default abstract class BaseService{
    public ref = ref
    public onMounted = onMounted
    public nextTick = nextTick
    public computed = computed
    token: string | null;

    public message:AnyObject

    constructor() {
        this.token = localStorage.getItem('vuecmf_token')
        this.message = ElMessage
    }

    /**
     * 退出系统
     */
    logoutEvent = ():void => {
        const model = new DataModel()
        model.logout().then((res) => {
            localStorage.clear()
            if(res.status == 200 && res.data.code == 0){
                router.push({ name: 'login' })
            }else{
                ElMessage.error(res.data.msg)
            }
        })
    }


    /**
     * 异常事件处理
     * @param msg
     */
    vuecmfException = (msg: string):void => {
        this.message.error(msg)
        this.logoutEvent()
    }

}