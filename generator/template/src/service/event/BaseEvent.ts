// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/emei8/vuecmf-web/blob/master/LICENSE )
// +----------------------------------------------------------------------
// | Author: emei8 <2278667823@qq.com>
// +----------------------------------------------------------------------

import {reactive, ref} from "vue";
import router from "@/router";
import {AnyObject} from "@/typings/vuecmf";
import {ElMessage} from "element-plus/es";
import store from "@/store";

/**
 * 事件服务基类
 */
export default abstract class BaseEvent{
    default_expand_all = true                                //树形列表默认是否全部展开
    detailBtnVisible = (row:AnyObject):boolean => true       //列表中每行是否显示详情按钮
    add_btn_visible = true                                   //列表中是否显示新增按钮
    editBtnVisible = (row:AnyObject):boolean => true         //列表中每行是否显示编辑按钮
    delBtnVisible = (row:AnyObject):boolean => true          //列表中每行是否显示删除按钮
    statusDisabled = (row:AnyObject):boolean => false        //列表中每行的状态切换是否可用

    current_model_config = ref()  //当前模型配置信息

    dataService: AnyObject //服务类实例
    dataModel: AnyObject  //数据模型实例

    //当前模型表名
    table_name = router.currentRoute.value.meta.table_name

    //表格事件配置
    table_event = reactive({
        tool_event: ref(),      //表格头部左边操作按钮
        row_event: ref(),       //表格行操作按钮
        fields_event: ref()     //表格字段事件处理
    })

    //弹窗中表格事件配置
    dialog_table_event = reactive({
        tool_event: ref(),      //表格头部左边操作按钮
        row_event: ref(),       //表格行操作按钮
        fields_event: ref()     //表格字段事件处理
    })

    protected constructor(dataService: AnyObject, dataModel: AnyObject) {
        this.dataService = dataService
        this.dataModel = dataModel

        //新增、编辑、删除按钮权限控制
        const action_type_list = store.getters.getActionTypeByTableName(this.table_name)
        this.delBtnVisible = (row:AnyObject):boolean => action_type_list.indexOf('list') != -1
        this.add_btn_visible = action_type_list.indexOf('save') != -1
        this.editBtnVisible = (row:AnyObject):boolean => action_type_list.indexOf('save') != -1
        this.delBtnVisible = (row:AnyObject):boolean => action_type_list.indexOf('delete') != -1

        if(router.currentRoute.value.meta.is_tree == 10 && this.add_btn_visible){
            //表格行事件配置
            this.table_event.row_event = [
                { label: '添加子项', type:'primary', event: this.addSub, visible: true },
            ]
        }

    }


    /**
     * 添加子项
     * @param selectRow
     * @param tableService
     */
    addSub = (selectRow:AnyObject, tableService: AnyObject): void => {
        tableService.addRow()
        tableService.loadDataService.loadTableField()
        tableService.table_config.current_select_row.pid = selectRow.id.toString()
    }



    /**
     * 权限列表选择模型名称事件
     */
    modelNameCheckChange = ():false => {
        if(typeof this.dataService.permission_config.checkedModelNameList != 'undefined'){
            Object.keys(this.dataService.permission_config.checkedModelNameList).forEach((key) => {
                if(typeof this.dataService.permission_config.checkedModelNameList != 'undefined' &&
                    typeof this.dataService.permission_config.checkedModelNameList[key] != 'undefined' &&
                    typeof this.dataService.permission_config.checkedActionList != 'undefined' &&
                    typeof this.dataService.permission_config.permission_action_list != 'undefined'
                ){
                    if(this.dataService.permission_config.checkedModelNameList[key]){
                        const action_list: string[] = []
                        Object.keys(this.dataService.permission_config.permission_action_list[key]).forEach((action_id) => {
                            action_list.push(action_id)
                        })
                        this.dataService.permission_config.checkedActionList[key] = action_list
                    }else{
                        this.dataService.permission_config.checkedActionList[key] = []
                    }
                }
            })
        }
        return false
    }


    /**
     * 权限项选择事件
     */
    actionCheckChange = ():false => {
        if(typeof this.dataService.permission_config.checkedModelNameList != 'undefined'){
            Object.keys(this.dataService.permission_config.checkedModelNameList).forEach((key) => {
                if(typeof this.dataService.permission_config.checkedModelNameList != 'undefined' &&
                    typeof this.dataService.permission_config.checkedModelNameList[key] != 'undefined' &&
                    typeof this.dataService.permission_config.checkedActionList != 'undefined' &&
                    typeof this.dataService.permission_config.permission_action_list != 'undefined'
                ){
                    let action_list_num = 0
                    Object.keys(this.dataService.permission_config.permission_action_list[key]).forEach(() => {
                        action_list_num = action_list_num + 1
                    })

                    const checkedCount = this.dataService.permission_config.checkedActionList[key].length

                    this.dataService.permission_config.checkedModelNameList[key] = action_list_num === checkedCount

                    if(typeof this.dataService.permission_config.modelNameIndeterminate != 'undefined'){
                        this.dataService.permission_config.modelNameIndeterminate[key] = checkedCount > 0 && checkedCount < action_list_num
                    }

                }
            })
        }
        return false
    }


    /**
     * 打开设置权限对话框
     * @param permission_param 获取已有权限的参数
     * @param permission_type  权限类型 role = 角色， user = 用户
     */
    setPermission = (permission_param:AnyObject, permission_type = 'role'):void => {
        const action_param = typeof permission_param['role_name'] != 'undefined' ? permission_param : {}

        //获取所有权限列表
        this.dataModel.getActionList(this.table_name, action_param).then((res:AnyObject) => {
            if(res.status == 200 && res.data.code == 0){
                this.dataService.permission_config.permission_action_list = res.data.data

                if(typeof this.dataService.permission_config.permission_action_list != 'undefined'){
                    const modelNameList = [] as AnyObject
                    const checkedActionList = [] as AnyObject
                    const modelNameIndeterminate = [] as AnyObject

                    Object.keys(this.dataService.permission_config.permission_action_list).forEach((index) => {
                        modelNameList[index] = false
                        checkedActionList[index] = []
                        modelNameIndeterminate[index] = false
                    })

                    this.dataService.permission_config.checkedModelNameList = modelNameList
                    this.dataService.permission_config.checkedActionList = checkedActionList
                    this.dataService.permission_config.modelNameIndeterminate = modelNameIndeterminate

                    //获取角色的已有权限
                    this.dataModel.getPermission(this.table_name, permission_param, permission_type).then((res:AnyObject) => {
                        if(res.status == 200 && res.data.code == 0){

                            Object.keys(res.data.data).forEach((index) => {
                                checkedActionList[index] = res.data.data[index]
                            })

                            this.dataService.permission_config.checkedActionList = checkedActionList
                            this.actionCheckChange()

                        }else{
                            ElMessage.error(res.data.msg)
                        }
                    })

                    this.dataService.permission_config.permission_dlg = true
                }else{
                    ElMessage.error('没有获取到权限项记录')
                }

            }else{
                ElMessage.error(res.data.msg)
            }

        })

    }

    /**
     * 保存权限项
     * @param permission_param 获取已有权限的参数
     * @param permission_type  权限类型 role = 角色， user = 用户
     */
    savePermission = (permission_param:AnyObject, permission_type = 'role'):false => {
        const action_arr: unknown[]  = []

        setTimeout(()=>{
            Object.values(this.dataService.permission_config.checkedActionList).forEach((item) => {
                if((item as Array<string>).length > 0) {
                    (item as Array<string>).forEach((val) => {
                        action_arr.push(val)
                    })
                }
            })

            permission_param['action_id'] = action_arr.join(',')

            this.dataModel.savePermission(this.table_name, permission_param, permission_type).then((res:AnyObject) => {
                if(res.status == 200 && res.data.code == 0){
                    ElMessage.success(res.data.msg)
                    this.dataService.permission_config.permission_dlg = false
                }else{
                    ElMessage.error(res.data.msg)
                }
            })
        }, 300)

        return false
    }

    /**
     * 初始化列表
     * @param dlg_ref            弹窗ref
     * @param dlg_config            弹窗配置对象
     * @param dialogTableService    弹窗中的列表服务类实例
     * @param table_name            模型表名
     * @param selectRows            当前选择的行数据
     * @param export_file_name      导出文件名
     * @param callback              回调函数
     */
    initTable = (dlg_ref: AnyObject,
                 dlg_config: AnyObject,
                 dialogTableService: AnyObject,
                 table_name: string,
                 selectRows: AnyObject,
                 export_file_name: string,
                 callback: () => void
                 ):void => {
        //设置列表后端相关接口地址
        const api_url = this.dataModel.getApiUrl(table_name, 'list')
        const del_api_url = this.dataModel.getApiUrl(table_name, 'delete')
        const import_api_url = this.dataModel.getApiUrl(table_name, 'save_all')
        const save_api_url = this.dataModel.getApiUrl(table_name, 'save')

        const download_filename = export_file_name + '(' + selectRows.label + ')'

        this.dataService.dialog_config.current_table_name = table_name

        //列表按钮权限控制
        this.tablePermission(table_name, dlg_config)

        //设置行操作列宽度
        if(this.current_model_config.value.type == 10 &&
            ['model_index','model_action','field_option','model_relation','model_form_rules','model_form_linkage'].indexOf(table_name) != -1
        ){
            dlg_config.operate_width = 89
        }else{
            this.dataService.resizeVuecmfTable()
        }

        dlg_config.show_dlg = true

        if(typeof dialogTableService.search == 'function'){
            //弹窗二次弹出时处理

            //刷新列表数据
            //设置当前选择的模型ID
            callback()

            //设置列表后端相关接口地址
            dialogTableService.table_config.api_url = api_url
            dialogTableService.table_config.del_api_url = del_api_url
            dialogTableService.import_config.import_api_url = import_api_url
            dialogTableService.import_config.save_api_url = save_api_url

            //列表导出文件名
            dialogTableService.export_config.export_file_name = download_filename

            dialogTableService.loadDataService.loadTableField() //加载列表表头字段
            dialogTableService.search(); //加载列表数据

        } else {
            //弹窗首次创建时处理， 部分在 DataService 中dialogBeforeLoadTable 及 secondDialogBeforeLoadTable 回调中处理

            //设置当前选择的行数据, 供弹窗回调函数 dialogTableCallback 使用
            this.dataService.table_config.current_row = selectRows

            //设置列表后端相关接口地址
            dlg_config.server = api_url
            dlg_config.del_server = del_api_url
            dlg_config.import_server = import_api_url
            dlg_config.save_server = save_api_url

            //列表导出文件名
            dlg_config.export_file_name = download_filename

        }

    }


    /**
     * 重置对话框中表格的高度
     * @param dlg_ref  对话框的 ref
     * @param dlg_config  对话框配置
     */
    resizeDlgTable = (dlg_ref: AnyObject, dlg_config: AnyObject):void => {
        const dlg_dom = dlg_ref.$refs.vuecmf_dlg_ref
        const dlg_header = dlg_dom.querySelector('.el-dialog__header')
        const dlg_body = dlg_dom.querySelector('.el-dialog__body')
        const table_header = dlg_body.querySelector('.el-row')
        //102
        //console.log()
        dlg_config.table_height = (dlg_body.clientHeight - table_header.clientHeight - dlg_header.clientHeight - 27).toString()
    }

    /**
     * 重置对话框中表格的高度公共方法
     * @param dlg_ref  对话框的 ref
     * @param dlg_config  对话框配置
     */
    commonResizeDlgTable = (dlg_ref: AnyObject, dlg_config: AnyObject):void => {
        dlg_config.toggleScreen = () => {
            this.resizeDlgTable(dlg_ref, dlg_config)
            return null
        }
        this.resizeDlgTable(dlg_ref, dlg_config)
    }

    /**
     * 弹窗列表中按钮权限控制
     * @param table_name  模型表名
     * @param dlg_config  弹窗配置信息
     */
    tablePermission = (table_name: string, dlg_config: AnyObject):void => {
        const action_type_list = store.getters.getActionTypeByTableName(table_name)

        //详情按钮功能
        dlg_config.detailBtnVisible = () => action_type_list.indexOf('list') != -1

        if(this.current_model_config.value.type == 10){
            //若模型是内置类型，则不允许新增、编辑和删除
            dlg_config.add_btn_visible = false
            dlg_config.editBtnVisible = () => false
            dlg_config.delBtnVisible = () => false
        }else{
            //行新增和编辑功能权限控制
            dlg_config.add_btn_visible = action_type_list.indexOf('save') != -1
            dlg_config.editBtnVisible = () => action_type_list.indexOf('save') != -1

            //行删除功能权限控制
            dlg_config.delBtnVisible = () => action_type_list.indexOf('delete') != -1
        }

    }


}