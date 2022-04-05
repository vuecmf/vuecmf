// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------


import BaseModel from "@/model/BaseModel";
import {AnyObject} from "@/typings/vuecmf";


/**
 * 登录模型
 */
export default class LoginModel extends BaseModel{

    /**
     * 登录后台
     * @param username
     * @param password
     */
    login = (username: string, password: string): Promise<AnyObject> => {
        return this.request('admin', 'login', {
            data: {
                login_name: username,
                password: password
            }
        })
    }

    /**
     * 获取服务器信息
     */
    getServerInfo = (): AnyObject|false => {
        const server = localStorage.getItem('vuecmf_server')
        if(server == null || server == '' || server == undefined) return false
        return JSON.parse(server)
    }

}
