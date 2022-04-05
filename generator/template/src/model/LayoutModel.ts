// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseModel from "./BaseModel"
import {AnyObject} from "@/typings/vuecmf";


/**
 * 布局模型
 */
export default class LayoutModel extends BaseModel {
    constructor() {
        super();
    }

    /**
     * 获取导航菜单
     */
    getNavMenu = (): Promise<AnyObject> => {
        const user = this.getLoginUser()
        if(user == false) return Promise.reject('登录异常，请重新登录！')

        return this.request('menu', 'nav', {
            data:{ username: user.username }
        }).then((res) => {
            if(res.status == 200 && res.data.code == 0){
                return Promise.resolve(res.data)
            }else{
                return Promise.reject(res.data)
            }
        })
    }



}