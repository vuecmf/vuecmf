// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------


import BaseEvent from "@/service/event/BaseEvent";
import {AnyObject} from "@/typings/vuecmf";
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

    }



}
