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
 * 后端数据管理模型
 */
export default class DataModel extends BaseModel{

    /**
     * 获取权限列表
     * @param table_name 模型表名
     * @param table_name
     * @param data
     */
    public getActionList = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'action_list', {data: data})
    }


    /**
     * 保存用户或角色权限项
     * @param table_name 模型表名
     * @param data 提交的数据
     * @param type
     */
    public savePermission = (table_name: string, data:AnyObject, type = 'role'): Promise<AnyObject> => {
        const action_type = type == 'user' ? 'set_user_permission' : 'add_permission'
        return this.request(table_name, action_type, {data: data} )
    }


    /**
     *
     * 获取角色或用户的已有权限
     * @param table_name 如 roles
     * @param data  如 {role_name: '经理', app_name: 'vuecmf'}
     * @param type 权限类型：  role = 角色， user = 用户
     */
    public getPermission = (table_name: string, data:AnyObject, type = 'role'): Promise<AnyObject> => {
        const action_type = type == 'user' ? 'get_user_permission' : 'get_permission'
        return this.request(table_name, action_type, {data: data} )
    }


    /**
     * 获取所有用户
     * @param table_name
     */
    public getAllUsers = (table_name: string): Promise<AnyObject> => {
        return this.request(table_name, 'get_all_users' )
    }

    /**
     * 获取角色的所有用户
     * @param table_name 如 roles
     * @param data  如 {role_name: '经理', app_name: 'vuecmf'}
     */
    public getAssignUsers = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'get_users', {data: data} )
    }

    /**
     * 保存角色分配的用户
     * @param table_name 模型表名
     * @param data 提交的数据
     */
    public saveAssignUsers = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'assign_users', {data: data} )
    }


    /**
     * 获取所有角色
     * @param table_name
     */
    public getAllRoles = (table_name: string): Promise<AnyObject> => {
        return this.request(table_name, 'get_all_roles' )
    }

    /**
     * 获取用户的角色
     * @param table_name 如 admin
     * @param data  如 {username: 'zhangsan', app_name: 'vuecmf'}
     */
    public getAssignRoles = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'get_roles', {data: data} )
    }


    /**
     * 保存用户分配的用户
     * @param table_name 模型表名
     * @param data 提交的数据
     */
    public saveAssignRoles = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'assign_role', {data: data} )
    }

    /**
     * 获取所有模型
     * @param table_name
     */
    public getAllModels = (table_name: string): Promise<AnyObject> => {
        return this.request(table_name, 'get_all_models' )
    }

    /**
     * 获取应用下的所有模型
     * @param table_name 如 app_config
     * @param data  如 {app_name: 'vuecmf'}
     */
    public getAssignModels = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'get_models', {data: data} )
    }

    /**
     * 保存应用分配的模型
     * @param table_name 模型表名
     * @param data 提交的数据
     */
    public saveAssignModels = (table_name: string, data:AnyObject): Promise<AnyObject> => {
        return this.request(table_name, 'assign_model', {data: data} )
    }


    /**
     * 退出系统
     */
    public logout = (): Promise<AnyObject> => {
        const data = {
            token: this.token
        }
        return this.request('admin', 'logout', {data: data})
    }


}
