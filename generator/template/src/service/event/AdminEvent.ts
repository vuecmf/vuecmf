// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseEvent from "@/service/event/BaseEvent";
import {AnyObject} from "@/typings/vuecmf";
import {ElMessage} from "element-plus/es";
import store from "@/store";


/**
 * 管理员事件服务类
 */
export default class AdminEvent extends BaseEvent{
    current_user: AnyObject //当前选择的用户信息

    constructor(dataService: AnyObject,dataModel: AnyObject) {
        super(dataService, dataModel);

        //表格事件配置
        this.table_event.tool_event = [
            // { label: '添加管理员', type:'primary', event: this.add }
        ]
        //表格行事件配置
        this.table_event.row_event = [
            { label: '设置角色', type:'primary', event: this.setRoles, visible: true, showCallback: this.showCallback },
            { label: '设置权限', type:'success', event: this.setUserPermission, visible: true, showCallback: this.showCallback },
        ]

        this.current_user = {}

        //表格行事件权限控制
        const action_type_list = store.getters.getActionTypeByTableName('admin')

        //行删除按钮是否显示
        this.delBtnVisible = (row: AnyObject): boolean => {
            if(row.is_super != 10){
                return action_type_list.indexOf('delete') != -1
            }else{
                return false
            }
        }

        this.table_event.row_event.forEach((item: AnyObject) => {
            if(item.label == '设置角色'){
                item.visible = action_type_list.indexOf('assign_role') != -1
            }else if(item.label == '设置权限'){
                item.visible = action_type_list.indexOf('set_user_permission') != -1
            }
        })

    }


    /**
     * 是否显示表格行事件按钮
     * @param row
     */
    showCallback = (row: AnyObject): boolean => row.is_super != 10


    /**
     * 打开设置角色对话框
     * @param selectRow
     */
    setRoles = (selectRow:AnyObject): void => {
        this.current_user = selectRow
        this.dataService.assign_config.assigned_data = []
        this.dataService.assign_config.assign_dlg_title = '设置(' + this.current_user.username + ')角色'

        this.dataModel.getAllRoles(this.table_name).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                res.data.data.forEach((item:AnyObject) => {
                    item.disabled = false
                })

                this.dataService.assign_config.all_data = res.data.data

                //获取已分配用户
                this.dataModel.getAssignRoles(this.table_name, {username: this.current_user.username}).then((res2:AnyObject) => {
                    if(res2.status == 200 && res2.data.code == 0){
                        this.dataService.assign_config.assigned_data = res2.data.data
                        this.dataService.assign_config.set_assign_dlg = true
                    }else{
                        ElMessage.error(res2.data.msg)
                    }
                })

            }else{
                ElMessage.error(res.data.msg)
            }
        })


    }

    /**
     * 保存用户已分配的角色
     */
    saveAssignRoles = (): false => {
        this.dataModel.saveAssignRoles(this.table_name, {
            username: this.current_user.username,
            role_id_list: this.dataService.assign_config.assigned_data
        }).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                ElMessage.success(res.data.msg)
                this.dataService.assign_config.set_assign_dlg = false
            }else{
                ElMessage.error(res.data.msg)
            }
        })

        return false
    }


    /**
     * 打开设置权限对话框
     * @param selectRow
     */
    setUserPermission = (selectRow:AnyObject):void => {
        this.current_user = selectRow
        this.dataService.permission_config.current_user_or_role = this.current_user.username

        this.setPermission({
            username: this.current_user.username
        }, 'user')
    }

    /**
     * 保存用户权限项
     */
    saveUserPermission = ():false => {
        this.savePermission({username: this.current_user.username}, 'user')
        return false
    }

}
