// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------


import BaseEvent from "@/service/event/BaseEvent";
import {AnyObject} from "@/typings/vuecmf";
import {ElMessage} from "element-plus";
import store from "@/store";


export default class AppConfigEvent extends BaseEvent{
    current_app: AnyObject //当前选择的应用信息

    constructor(dataService: AnyObject,dataModel: AnyObject) {
        super(dataService, dataModel);

        this.current_app = {}

        const app_config_action_type_list = store.getters.getActionTypeByTableName('app_config')

        //若是内置模型不显示编辑按钮
        this.editBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return app_config_action_type_list.indexOf('save') != -1
            }
        }

        //若是内置模型不显示删除按钮
        this.delBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return app_config_action_type_list.indexOf('delete') != -1
            }
        }

        //列表中每行的状态切换是否可用
        this.statusDisabled = (row: AnyObject): boolean => {
            if(row.type == 10){
                return true
            }else{
                return app_config_action_type_list.indexOf('save') == -1
            }
        }

        //表格事件配置
        this.table_event.tool_event = [
        ];

        //表格行事件配置
        this.table_event.row_event = [
            { label: '设置模型', type:'primary', event: this.setModel, visible: true, showCallback: this.showCallback },
        ];



    }

    /**
     * 是否显示表格行事件按钮
     * @param row
     */
    showCallback = (row: AnyObject): boolean => true

    /**
     * 打开设置模型对话框
     * @param selectRow
     */
    setModel = (selectRow:AnyObject): void => {
        this.current_app = selectRow
        this.dataService.assign_config.assigned_data = []
        this.dataService.assign_config.assign_dlg_title = '设置(' + this.current_app.app_name + ')模型'
        this.dataService.assign_config.is_internal = this.current_app.type == 10

        this.dataModel.getAllModels(this.table_name).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                res.data.data.forEach((item:AnyObject) => {
                    item.disabled = false
                })

                this.dataService.assign_config.all_data = res.data.data

                //获取已分配的模型
                this.dataModel.getAssignModels(this.table_name, { app_id: this.current_app.id }).then((res2:AnyObject) => {
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
     * 保存应用已分配的模型
     */
    saveAssignModels = (): false => {
        this.dataModel.saveAssignModels(this.table_name, {
            app_id: this.current_app.id,
            model_id_list: this.dataService.assign_config.assigned_data
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


}
