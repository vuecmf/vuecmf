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


/**
 * 模型事件服务类
 */
export default class ModelConfigEvent extends BaseEvent{
    constructor(dataService: AnyObject,dataModel: AnyObject) {
        super(dataService, dataModel);

        const model_config_action_type_list = store.getters.getActionTypeByTableName('model_config')

        //若是内置模型不显示编辑按钮
        this.editBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return model_config_action_type_list.indexOf('save') != -1
            }
        }

        //若是内置模型不显示删除按钮
        this.delBtnVisible = (row: AnyObject): boolean => {
            if(row.type == 10){
                return false
            }else{
                return model_config_action_type_list.indexOf('delete') != -1
            }
        }

        //列表中每行的状态切换是否可用
        this.statusDisabled = (row: AnyObject): boolean => {
            if(row.type == 10){
                return true
            }else{
                return model_config_action_type_list.indexOf('save') == -1
            }
        }

        //表格事件配置
        this.table_event.tool_event = []
        //表格行事件配置
        this.table_event.row_event = [
            { label: '字段', type:'primary', event: this.setField, visible: true, table_name: 'model_field' },
            { label: '索引', type:'primary', event: this.setFieldIndex, visible: true, table_name: 'model_index' },
            { label: '动作', type:'success', event: this.setAction, visible: true, table_name: 'model_action' },
            { label: '表单', type:'warning', event: this.setForm, visible: true, table_name: 'model_form' },
        ]

        //表格行事件权限控制
        this.table_event.row_event.forEach((item: AnyObject) => {
            const action_type_list = store.getters.getActionTypeByTableName(item.table_name)
            item.visible = action_type_list.indexOf('list') != -1
        })

    }


    /**
     * 设置字段
     * @param selectRows 当前选择行记录
     */
    setField = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_first.dialog_title = '设置('+ selectRows.label +')字段'

        this.current_model_config.value = selectRows

        this.dialog_table_event.row_event = [
            { label: '选项', type:'success', event: this.setFieldOption, visible: true, table_name: 'field_option'  },
            { label: '关联', type:'warning', event: this.setFieldRelation, visible: true, table_name: 'model_relation'  },
        ]

        //按钮权限控制
        this.dialog_table_event.row_event.forEach((item: AnyObject) => {
            const action_type_list = store.getters.getActionTypeByTableName(item.table_name)
            item.visible = action_type_list.indexOf('list') != -1
        })

        this.initTable(
            this.dataService.dialog_config.firstDlgRef,
            this.dataService.dialog_config.dlg_first,
            'model_field',
            selectRows,
            '字段'
        )

    }


    /**
     * 设置模型字段关联（二级弹窗）
     * @param selectRows
     */
    setFieldRelation = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_second.dialog_title = '设置('+ selectRows.label +')字段的模型关联'

        this.initTable(
            this.dataService.dialog_config.secondDlgRef,
            this.dataService.dialog_config.dlg_second,
            'model_relation',
            selectRows,
            '模型关联'
        )
    }

    /**
     * 设置字段选项（二级弹窗）
     * @param selectRows
     */
    setFieldOption = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_second.dialog_title = '设置('+ selectRows.label +')字段选项'

        this.initTable(
            this.dataService.dialog_config.secondDlgRef,
            this.dataService.dialog_config.dlg_second,
            'field_option',
            selectRows,
            '字段选项'
        )
    }


    /**
     * 设置字段索引
     * @param selectRows
     */
    setFieldIndex = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_first.dialog_title = '设置('+ selectRows.label +')索引'
        this.dialog_table_event.row_event = []

        this.current_model_config.value = selectRows

        this.initTable(
            this.dataService.dialog_config.firstDlgRef,
            this.dataService.dialog_config.dlg_first,
            'model_index',
            selectRows,
            '索引'
        )
    }

    /**
     * 设置动作
     * @param selectRows 当前选择行记录
     */
    setAction = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_first.dialog_title = '设置('+ selectRows.label +')动作'
        this.dialog_table_event.row_event = []

        this.current_model_config.value = selectRows

        this.initTable(
            this.dataService.dialog_config.firstDlgRef,
            this.dataService.dialog_config.dlg_first,
            'model_action',
            selectRows,
            '动作'
        )
    }


    /**
     * 设置表单
     * @param selectRows 当前选择行记录
     */
    setForm = (selectRows:AnyObject): void => {
        this.dataService.dialog_config.dlg_first.dialog_title = '设置('+ selectRows.label +')表单'

        this.current_model_config.value = selectRows

        this.dialog_table_event.row_event = [
            { label: '验证', type:'primary', event: this.setFormRules, visible: true, table_name: 'model_form_rules' },
            {
                label: '联动',
                type:'success',
                event: this.setFormLinkage,
                visible: true,
                table_name: 'model_form_linkage',
                showCallback: (current_row:AnyObject) => {
                    return ['radio','checkbox','select','select_mul'].indexOf(current_row.type) != -1
                }
            },
        ]

        //按钮权限控制
        this.dialog_table_event.row_event.forEach((item: AnyObject) => {
            const action_type_list = store.getters.getActionTypeByTableName(item.table_name)
            item.visible = action_type_list.indexOf('list') != -1
        })


        this.initTable(
            this.dataService.dialog_config.firstDlgRef,
            this.dataService.dialog_config.dlg_first,
            'model_form',
            selectRows,
            '表单'
        )
    }



    /**
     * 设置模型表单验证（二级弹窗）
     * @param selectRows
     */
    setFormRules = (selectRows:AnyObject): void => {
        const label = this.getFormLabel(selectRows.model_field_id)
        this.dataService.dialog_config.dlg_second.dialog_title = '设置('+ label +')表单验证'

        this.initTable(
            this.dataService.dialog_config.secondDlgRef,
            this.dataService.dialog_config.dlg_second,
            'model_form_rules',
            selectRows,
            '模型表单验证'
        )
    }

    /**
     * 设置表单联动（二级弹窗）
     * @param selectRows
     */
    setFormLinkage = (selectRows:AnyObject): void => {
        const label = this.getFormLabel(selectRows.model_field_id)
        this.dataService.dialog_config.dlg_second.dialog_title = '设置('+ label +')表单联动'

        this.initTable(
            this.dataService.dialog_config.secondDlgRef,
            this.dataService.dialog_config.dlg_second,
            'model_form_linkage',
            selectRows,
            '表单联动'
        )
    }


    /**
     * 根据模型字段ID获取对应label名称
     * @param model_field_id
     */
    private getFormLabel = (model_field_id: number): string => {
        let label = ''
        if(typeof this.dataService.dialogTableService.table_config != 'undefined' && typeof this.dataService.dialogTableService.table_config.form_info != 'undefined'){
            const form_info: AnyObject = this.dataService.dialogTableService.table_config.form_info

            Object.values(form_info).forEach((item) => {
                if(item.field_id == model_field_id){
                    label = item.label
                }
            })

            //若没有找到，就从列表字段信息中关联信息（relation_info）中的字段选项（options）查找标签
            if(label == ''){
                let field_id = ''
                Object.values(form_info).forEach((item) => {
                    if(item.field_name == 'model_field_id'){
                        field_id = item.field_id
                    }
                })

                if(field_id != '' && typeof this.dataService.dialogTableService.table_config.relation_info.options[field_id] == 'object'){
                    this.dataService.dialogTableService.table_config.relation_info.options[field_id].forEach((row:AnyObject) => {
                        if(row.value == model_field_id)  label = row.label
                    })
                }

            }
        }
        return label
    }


}
