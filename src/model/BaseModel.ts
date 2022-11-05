// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import axios, {Method} from "axios";
import qs from "qs";
import {AnyObject} from "@/typings/vuecmf";
import store from '@/store';


/**
 * 基础模型
 */
export default abstract class Model {

    public token: string  //登录后的token

    constructor() {
        axios.defaults.baseURL = process.env.VUE_APP_BASE_API
        axios.defaults.timeout = 5000
        //允许跨域携带cookie信息
        axios.defaults.withCredentials = true
        axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
        axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

        this.token = localStorage.getItem('vuecmf_token') as string
        axios.defaults.headers.common['token'] = this.token

        //请求拦截
        axios.interceptors.request.use((config) => {
            if(config.method === "post" || config.method === "put" || config.method === "delete"){
                // qs序列化
                config.data = qs.parse(config.data)
            }
            return config
        }, error => {
            return Promise.reject(error.data.error.message)
        })

        //响应拦截
        axios.interceptors.response.use((config) => {
            if (config.status === 200 || config.status === 204) {
                return Promise.resolve(config);
            } else {
                return Promise.reject(config);
            }
        }, error => {
            return Promise.reject(error.data.error.message)
        })

    }

    /**
     * GET请求
     * @param url
     * @param data
     */
    public async get(url: string, data: AnyObject): Promise<AnyObject> {
        return await axios.request({
            method: 'get',
            url,
            data: data,
        })
    }

    /**
     * POST请求
     * @param url
     * @param data
     */
    public async post(url: string, data: AnyObject): Promise<AnyObject> {
        return await axios.request({
            method: 'post',
            url,
            data: data,
        })
    }

    /**
     * 公共API请求
     * @param table_name
     * @param action_type
     * @param data
     * @param method
     */
    public request = async (table_name: string,action_type: string,data?:AnyObject, method?: Method): Promise<AnyObject> => {
        if(typeof method == 'undefined') method = 'post'
        const api_maps = store.getters.apiMaps

        if(typeof api_maps[table_name] == 'undefined' || typeof api_maps[table_name][action_type] == 'undefined'){
            return await axios.request({
                method: 'post',
                url: '/vuecmf/model_action/get_api_map',
                data: {
                    data: {
                        table_name: table_name,
                        action_type: action_type
                    }
                }
            }).then(async (res) => {
                if(res.status === 200 && res.data.code == 0){
                    if(typeof api_maps[table_name] == 'undefined') api_maps[table_name] = []
                    api_maps[table_name][action_type] = res.data.data
                    await store.dispatch('setApiMaps', api_maps)
                    return await axios.request({
                        method: method,
                        url: res.data.data,
                        data: data,
                    })
                }else{
                    return res
                }
            })

        }else{
            return await axios.request({
                method: method,
                url: api_maps[table_name][action_type],
                data: data,
            })
        }
    }

    /**
     * 根据模型表名及动作类型获取API请求URL
     * @param table_name
     * @param action_type
     */
    public getApiUrl = (table_name: string,action_type: string): string => {
        const api_maps = store.getters.apiMaps
        if(typeof api_maps[table_name] != 'undefined' && typeof api_maps[table_name][action_type] != 'undefined'){
            return api_maps[table_name][action_type]
        }else{
            return ''
        }
    }

    /**
     * 获取用户登录信息
     */
    public getLoginUser = (): AnyObject|false => {
        const user = localStorage.getItem('vuecmf_user')
        if(user == null || user == '' || user == undefined) return false
        return JSON.parse(user)
    }


}


