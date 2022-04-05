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
            this.dataService.dialogTableService,
            'model_field',
            selectRows,
            '字段',
            () => {
                this.dataService.dialogTableService.table_config.filter_form['model_id'] = selectRows.id
            }
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
            this.dataService.secondDialogTableService,
            'model_relation',
            selectRows,
            '模型关联',
            () => {
                delete this.dataService.secondDialogTableService.table_config.filter_form['model_form_id']
                this.dataService.secondDialogTableService.table_config.filter_form['model_field_id'] = selectRows.id
                this.dataService.secondDialogTableService.table_config.filter_form['model_id'] = selectRows.model_id

                //获取关联模型信息的过滤设置
                this.dataService.secondDialogTableService.table_config.field_filter['model_id'] = selectRows.model_id
            }
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
            this.dataService.secondDialogTableService,
            'field_option',
            selectRows,
            '字段选项',
            () => {
                delete this.dataService.secondDialogTableService.table_config.filter_form['model_form_id']
                this.dataService.secondDialogTableService.table_config.filter_form['model_field_id'] = selectRows.id
                this.dataService.secondDialogTableService.table_config.filter_form['model_id'] = selectRows.model_id

                //获取关联模型信息的过滤设置
                this.dataService.secondDialogTableService.table_config.field_filter['model_id'] = selectRows.model_id
            }
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
            this.dataService.dialogTableService,
            'model_index',
            selectRows,
            '索引',
            () => {
                this.dataService.dialogTableService.table_config.filter_form['model_id'] = selectRows.id
                //获取关联模型信息的过滤设置
                this.dataService.dialogTableService.table_config.field_filter['model_id'] = selectRows.id
            }
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
            this.dataService.dialogTableService,
            'model_action',
            selectRows,
            '动作',
            () => {
                this.dataService.dialogTableService.table_config.filter_form['model_id'] = selectRows.id
            }
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
            this.dataService.dialogTableService,
            'model_form',
            selectRows,
            '表单',
            () => {
                this.dataService.dialogTableService.table_config.filter_form['model_id'] = selectRows.id
                //获取关联模型信息的过滤设置
                this.dataService.dialogTableService.table_config.field_filter['model_id'] = selectRows.id
            }
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
            this.dataService.secondDialogTableService,
            'model_form_rules',
            selectRows,
            '模型表单验证',
            () => {
                delete this.dataService.secondDialogTableService.table_config.filter_form['model_field_id']
                this.dataService.secondDialogTableService.table_config.filter_form['model_form_id'] = selectRows.id
                this.dataService.secondDialogTableService.table_config.filter_form['model_id'] = selectRows.model_id

                //获取关联模型信息的过滤设置
                this.dataService.secondDialogTableService.table_config.field_filter['model_id'] = selectRows.model_id
            }
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
            this.dataService.secondDialogTableService,
            'model_form_linkage',
            selectRows,
            '表单联动',
            () => {
                delete this.dataService.secondDialogTableService.table_config.filter_form['model_form_id']
                this.dataService.secondDialogTableService.table_config.filter_form['model_field_id'] = selectRows.model_field_id
                this.dataService.secondDialogTableService.table_config.filter_form['model_id'] = selectRows.model_id

                //获取关联模型信息的过滤设置
                this.dataService.secondDialogTableService.table_config.field_filter['model_id'] = selectRows.model_id
            }
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
        }
        return label
    }


}
