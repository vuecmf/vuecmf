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


export default class AppConfigEvent extends BaseEvent{
    current_app: AnyObject //当前选择的应用信息

    constructor() {
        super({}, {});

        this.current_app = {}

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
    showCallback = (row: AnyObject): boolean => row.type != 10

    /**
     * 打开设置模型对话框
     * @param selectRow
     */
    setModel = (selectRow:AnyObject): void => {
        this.current_app = selectRow
        this.dataService.assign_config.assigned_data = []
        this.dataService.assign_config.assign_dlg_title = '设置(' + this.current_app.app_name + ')角色'

        this.dataModel.getAllModels(this.table_name).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                res.data.data.forEach((item:AnyObject) => {
                    item.disabled = false
                })

                this.dataService.assign_config.all_data = res.data.data

                //获取已分配的模型
                this.dataModel.getAssignModels(this.table_name, { app_name: this.current_app.app_name }).then((res2:AnyObject) => {
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


}
