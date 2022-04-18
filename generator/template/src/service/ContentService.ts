// +----------------------------------------------------------------------
// | Copyright (c) 2019~2022 http://www.vuecmf.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( https://github.com/vuecmf/vuecmf-web/blob/main/LICENSE )
// +----------------------------------------------------------------------
// | Author: vuecmf <tulihua2004@126.com>
// +----------------------------------------------------------------------

import BaseService from "@/service/BaseService";
import {nextTick, onMounted, onUpdated, reactive, ref, toRefs} from "vue";
import {ToRefs} from "@vue/reactivity";
import router from "@/router";
import DataModel from "@/model/DataModel";
import MenuEvent from "@/service/event/MenuEvent";
import {AnyObject} from "@/typings/vuecmf";
import DefaultEvent from "@/service/event/DefaultEvent";
import RolesEvent from "@/service/event/RolesEvent";
import AdminEvent from "@/service/event/AdminEvent";
import ModelConfigEvent from "@/service/event/ModelConfigEvent";

import store from "@/store";

/**
 * 内容服务类
 */
export default class ContentService extends BaseService{
    //列表组件后端API设置
    table_config = reactive({
        model_table_name: '',                   //当前模型列表表名
        current_row: ref<AnyObject>(),          //当前选择记录的数据
        current_table_service: ref<AnyObject>(),//当前列表表格服务类实例

        export_file_name: '',                   //列表导出文件名
        server: '',                             //获取列表的API地址
        import_server: '',                      //批量导入的API地址
        save_server: '',                        //单个保存的API地址
        del_server: '',                         //删除数据的API地址
        upload_server: '',                      //文件上传API地址
        table_list_ref: ref(),                  //列表组件ref
        table_height: 200,                      //列表表格高度
        add_btn_visible: true,                  //是否显示新增按钮
        detailBtnVisible: ():boolean => true,   //是否显示详情按钮
        editBtnVisible: ():boolean => true,     //是否显示编辑按钮
        delBtnVisible: ():boolean => true,      //是否显示删除按钮
        statusDisabled: ():boolean => false,    //列表中每行的状态切换是否可用

        operate_width: 80,                      //列表操作列宽度
        expand_action: true,                    //列表行操作是否展开
        row_expand: false,                      //是否可以行展开

        row_key: '',                            //树形列表必须设置，唯一键字段名
        default_expand_all: true,               //树形列表默认是否全部展开

        show_checkbox: false,                   //是否显示行选择框
        selectable: ()=> false                  //设置列表每行是否可选择的回调函数
    })

    //权限项管理相关设置
    permission_config = reactive({
        current_user_or_role: '',                     //当前用户或角色名称
        permission_dlg: false,                        //是否弹出添加权限对话框
        permission_action_list: ref<AnyObject>(),     //所有权限项列表
        checkedModelNameList: ref<AnyObject>(),       //已经选择的模型名称项
        checkedActionList: ref<AnyObject>(),          //已选择的权限项
        modelNameIndeterminate: ref<AnyObject>(),     //模型名称选择时复选框样式控制

        modelNameCheckChange: ()=> false,             //权限列表选择模型名称事件
        actionCheckChange: ()=> false,                //权限项选择事件
        savePermission: () => false,                  //保存权限项事件
    })


    //分配角色或用户管理相关设置
    assign_config = reactive({
        set_assign_dlg: false,                        //是否显示设置用户或对话框
        assign_dlg_title: '',                         //对话框标题
        all_data: [],                                 //所有用户或角色
        assigned_data: [],                            //已分配用户或角色

        saveAssignData: () => false,                  //保存分配的用户或角色
    })

    //模型设置管理相关配置
    dialog_config = reactive({
        current_table_name: '',                       //弹窗中当前模型列表表名
        firstDlgRef: ref(),                           //一级对话框ref
        secondDlgRef: ref(),                          //二级对话框ref
        dlg_first_table_list_ref: ref(),              //一级弹窗列表组件ref
        dlg_second_table_list_ref: ref(),             //二级弹窗列表组件ref

        dlg_expand_action: true,                      //列表行操作是否展开

        //一级弹窗表格设置
        dlg_first:{
            show_dlg: false,                           //是否显示对话框
            dialog_title: '',                          //对话框标题
            export_file_name: '',                      //导出文件名
            table_height: 'calc(70VH - 110px)',        //列表表格高度
            selectable:()=> false,                     //设置列表每行是否可选择的回调函数
            show_checkbox: false,                      //是否显示行选择框
            operate_width: 80,                         //列表操作列宽度
            add_btn_visible: true,                     //是否显示新增按钮
            detailBtnVisible: ():boolean => true,      //是否显示详情按钮
            editBtnVisible: ():boolean => true,        //是否显示编辑按钮
            delBtnVisible: ():boolean => true,         //是否显示删除按钮
            server: '',                                //获取列表的API地址
            import_server: '',                         //批量导入的API地址
            save_server: '',                           //单个保存的API地址
            del_server: '',                            //删除数据的API地址
            toggleScreen: () => null,                  //最大化及还原弹窗的回调
        },
        //二级弹窗表格设置
        dlg_second: {
            show_dlg: false,                           //是否显示对话框
            dialog_title: '',                          //对话框标题
            export_file_name: '',                      //导出文件名
            table_height: 'calc(70VH - 110px)',        //列表表格高度
            selectable:()=> false,                     //设置列表每行是否可选择的回调函数
            show_checkbox: false,                      //是否显示行选择框
            operate_width: 80,                         //列表操作列宽度
            add_btn_visible: true,                     //是否显示新增按钮
            detailBtnVisible: ():boolean => true,      //是否显示详情按钮
            editBtnVisible: ():boolean => true,        //是否显示编辑按钮
            delBtnVisible: ():boolean => true,         //是否显示删除按钮
            server: '',                                //获取列表的API地址
            import_server: '',                         //批量导入的API地址
            save_server: '',                           //单个保存的API地址
            del_server: '',                            //删除数据的API地址
            toggleScreen: () => null,                  //最大化及还原弹窗的回调
        }
    })

    event_obj = ref<AnyObject>()           //事件实例

    table_event = ref<AnyObject>()          //列表事件设置

    dataModel:AnyObject                     //数据模型实例
    dialogTableService: AnyObject           //一级弹窗中的表格服务类实例（如模型设置功能中的表格服务类实例）
    secondDialogTableService: AnyObject     //二级弹窗中的表格服务类实例（如字段选项中的表格服务类实例）

    dialog_table_event = ref<AnyObject>()   //设置弹窗中列表事件(如设置字段、表单等)

    constructor() {
        super();
        //当前模型默认动作
        this.table_config.model_table_name = router.currentRoute.value.meta.table_name as string
        const default_ation_type = router.currentRoute.value.meta.default_action_type

        //当前模型所有动作列表
        const current_action_list = store.getters.getActionTypeByTableName(this.table_config.model_table_name)

        //列表组件后端API设置, 有权限的则取出URL, 否则设置为空
        this.dataModel = new DataModel()
        //列表API
        this.table_config.server = current_action_list.indexOf('list') != -1 ? this.dataModel.getApiUrl(this.table_config.model_table_name, default_ation_type as string) : ''
        //保存数据API
        this.table_config.save_server = current_action_list.indexOf('save') != -1 ? this.dataModel.getApiUrl(this.table_config.model_table_name, 'save') : ''
        //删除数据API
        this.table_config.del_server = current_action_list.indexOf('delete') != -1 ? this.dataModel.getApiUrl(this.table_config.model_table_name, 'delete') : ''
        //批量导入API
        this.table_config.import_server = this.dataModel.getApiUrl(this.table_config.model_table_name, 'save_all')
        //文件上传API
        this.table_config.upload_server = process.env.VUE_APP_BASE_API + this.dataModel.getApiUrl('upload_file', 'upload')

        //导出文件名
        this.table_config.export_file_name = router.currentRoute.value.meta.title as string

        //初始化表格相关事件
        switch (router.currentRoute.value.meta.table_name){
            case 'menu':
                this.event_obj.value = new MenuEvent()
                break;
            case 'roles':
                this.event_obj.value = new RolesEvent(this, this.dataModel)
                this.permission_config.modelNameCheckChange = this.event_obj.value.modelNameCheckChange
                this.permission_config.actionCheckChange = this.event_obj.value.actionCheckChange
                this.permission_config.savePermission = this.event_obj.value.saveRolePermission
                this.assign_config.saveAssignData = this.event_obj.value.saveAssignUsers
                break;
            case 'admin':
                this.event_obj.value = new AdminEvent(this, this.dataModel)
                this.permission_config.modelNameCheckChange = this.event_obj.value.modelNameCheckChange
                this.permission_config.actionCheckChange = this.event_obj.value.actionCheckChange
                this.assign_config.saveAssignData = this.event_obj.value.saveAssignRoles
                this.permission_config.savePermission = this.event_obj.value.saveUserPermission
                break;
            case 'model_config':
                this.event_obj.value = new ModelConfigEvent(this, this.dataModel)
                break;
            default:
                this.event_obj.value = new DefaultEvent()
        }

        if(typeof this.event_obj.value != 'undefined'){
            this.table_event.value = this.event_obj.value.table_event
            this.dialog_table_event.value = this.event_obj.value.dialog_table_event

            //树形列表必须设置，唯一键字段名
            this.table_config.row_key = router.currentRoute.value.meta.is_tree == 10 ? 'id' : ''

            //列表中行操作中按钮是否显示处理
            this.table_config.detailBtnVisible = this.event_obj.value.detailBtnVisible
            this.table_config.add_btn_visible = this.event_obj.value.add_btn_visible
            this.table_config.editBtnVisible = this.event_obj.value.editBtnVisible
            this.table_config.delBtnVisible = this.event_obj.value.delBtnVisible
            this.table_config.statusDisabled = this.event_obj.value.statusDisabled

        }

        this.dialogTableService = {}
        this.secondDialogTableService = {}

    }

    /**
     * 获取配置参数并导出
     * @param config_name 配置名称
     */
    getConfig = (config_name?: string): ToRefs => {
        switch (config_name){
            case 'permission_config':
                return toRefs(this.permission_config)
            case 'assign_config':
                return toRefs(this.assign_config)
            case 'dialog_config':
                return toRefs(this.dialog_config)
            default:
                return toRefs(this.table_config)
        }
    }

    /**
     * 列表表格数据加载前的回调处理
     * @param tableService
     */
    beforeLoadTable = (tableService: AnyObject): void => {
        this.table_config.current_table_service = tableService

        //模型配置中的 设置字段、设置动作及表单列表的 过滤设置
        if(router.currentRoute.value.meta.table_name == 'model_config'){
            //获取关联模型信息的过滤设置
            if(typeof this.table_config.current_row != 'undefined'){
                tableService.table_config.field_filter['model_id'] = this.table_config.current_row.id
            }else{
                tableService.table_config.field_filter['model_id'] = 0;
            }
        }
    }


    /**
     * 一级弹窗中表格数据加载前的回调函数，获取表格中服务类实例（如模型设置）
     * @param tableService
     */
    dialogBeforeLoadTable = (tableService: AnyObject): void => {
        this.dialogTableService = tableService

        //模型配置中的 设置字段、设置动作及表单列表的 过滤设置
        if(router.currentRoute.value.meta.table_name == 'model_config' && typeof this.table_config.current_row != 'undefined'){
            this.dialogTableService.table_config.filter_form['model_id'] = this.table_config.current_row.id

            if(['model_index','model_form'].indexOf(this.dialog_config.current_table_name) != -1){
                //获取关联模型信息的过滤设置
                this.dialogTableService.table_config.field_filter['model_id'] = this.table_config.current_row.id
            }
        }
    }


    /**
     * 二级弹窗中表格数据加载前的回调函数，获取表格中服务类实例
     * @param tableService
     */
    secondDialogBeforeLoadTable = (tableService: AnyObject): void => {
        this.secondDialogTableService = tableService

        //过滤设置
        if(typeof this.table_config.current_row != 'undefined' && router.currentRoute.value.meta.table_name == 'model_config'){
            //模型设置中的二级弹窗列表的搜索表单初始化
            this.secondDialogTableService.table_config.filter_form['model_id'] = this.table_config.current_row.model_id

            switch (this.dialog_config.current_table_name){
                case 'model_form_rules':
                    this.secondDialogTableService.table_config.filter_form['model_form_id'] = this.table_config.current_row.id
                    break;
                case 'model_relation':
                case 'field_option':
                    this.secondDialogTableService.table_config.filter_form['model_field_id'] = this.table_config.current_row.id
                    break;
                default:
                    this.secondDialogTableService.table_config.filter_form['model_field_id'] = this.table_config.current_row.model_field_id
            }

            //获取关联模型信息的过滤设置
            this.secondDialogTableService.table_config.field_filter['model_id'] = this.table_config.current_row.model_id

        }
    }


    /**
     * 打开一级弹窗列表后
     */
    dlgFirstOpened = ():void => {
        const dlg_dom = this.dialog_config.firstDlgRef.$refs.vuecmf_dlg_ref
        const dlg_footer = dlg_dom.querySelector('.el-dialog__footer')

        if(dlg_footer.innerHTML == '') dlg_footer.style.padding = 0

        //弹窗中DOM加载完后, 重置弹窗中的表格高度
        if(typeof this.event_obj.value == 'object'){
            this.event_obj.value.commonResizeDlgTable(this.dialog_config.firstDlgRef, this.dialog_config.dlg_first)
        }
    }

    /**
     * 打开二级弹窗列表后
     */
    dlgSecondOpened = ():void => {
        const dlg_dom = this.dialog_config.secondDlgRef.$refs.vuecmf_dlg_ref
        const dlg_footer = dlg_dom.querySelector('.el-dialog__footer')

        if(dlg_footer.innerHTML == '') dlg_footer.style.padding = 0

        //弹窗中DOM加载完后, 重置弹窗中的表格高度
        if(typeof this.event_obj.value == 'object'){
            this.event_obj.value.commonResizeDlgTable(this.dialog_config.secondDlgRef, this.dialog_config.dlg_second)
        }
    }


    /**
     * 加载表单中的下拉选项
     * @param tableService  列表服务实例
     * @param select_row  当前选择行记录
     */
    loadFormOption = (tableService:AnyObject, select_row: AnyObject): void => {
        const linkage:AnyObject = tableService.table_config.relation_info.linkage

        Object.keys(linkage).forEach((field_id) => {
            let form_field_name = ''
            const form_info:AnyObject = tableService.table_config.form_info
            const form_field_info:AnyObject = []  //表单字段信息
            Object.values(form_info).forEach((form_item) => {
                if(form_item.field_id == field_id) form_field_name = form_item.field_name
                form_field_info[form_item.field_id] = form_item.field_name
            })

            const sel_val = select_row != null && typeof select_row[form_field_name] != 'undefined' ? select_row[form_field_name] : ''
            const data:AnyObject = {}
            data[form_field_name] = sel_val

            const linkage_list:AnyObject = linkage[field_id]

            Object.values(linkage_list).forEach((item)=>{
                this.dataModel.request(item.action_table_name, item.action_type, {data: data}).then((res:AnyObject)=>{
                    if(res.status == 200){
                        if(res.data.code == 0){
                            const form_list: string[] = []
                            const res_list:AnyObject = res.data.data

                            Object.keys(res_list).forEach((key) => {
                                if(typeof res_list[key].id == 'number'){
                                    res_list[key].id = res_list[key].id.toString()
                                }
                                form_list.push(res_list[key].id)
                            })


                            tableService.table_config.relation_info.options[item.relation_field_id] = res_list

                            //先找到关联下拉框的字段名, 然后根据当前字段名找到当前选择的值，再在判断在拉取的下拉列表数据中是否存在， 不存在则删除当前选择的值
                            const relation_field_name = typeof form_field_info[item.relation_field_id] != 'undefined' ? form_field_info[item.relation_field_id] : ''
                            if(relation_field_name != '' && typeof select_row[relation_field_name] != 'undefined'){


                                if(typeof select_row[relation_field_name] == 'object'){
                                    const tmp_sel:string[] = []
                                    if(select_row[relation_field_name] != null){
                                        select_row[relation_field_name].forEach((sub_id:string) => {
                                            if(form_list.indexOf(sub_id) != -1){
                                                tmp_sel.push(sub_id)
                                            }
                                        })
                                    }
                                    select_row[relation_field_name] = tmp_sel
                                }else{
                                    if(form_list.indexOf(select_row[relation_field_name]) == -1){
                                        select_row[relation_field_name] = null
                                    }
                                }
                            }

                        }else{
                            this.message.error('获取下拉选项失败:' + res.data.msg)
                        }
                    }else{
                        this.vuecmfException('获取下拉选项失败')
                    }
                })
            })
        })
    }


    /**
     * 表单加载时的回调处理
     * @param tableService
     * @param select_row
     */
    loadForm = (tableService: AnyObject, select_row: AnyObject): boolean => {
        this.loadFormOption(tableService, select_row)

        //设置表单中组件的change事件回调函数， 如在联动下拉框中使用
        tableService.import_config.changeEvent = ():void => {
            this.loadFormOption(tableService, select_row)
        }

        return true
    }


    /**
     * 修改行数据的状态
     * @param value 状态更新后的值
     * @param row  当前选择行数据
     */
    changeStatus = (value: string|number, row: AnyObject): void => {
        if(value != '' && typeof row.id != 'undefined' && row.id != '' && row.id != null && typeof this.table_config.current_table_service == 'object'){
            this.table_config.current_table_service.uploadDataService.saveRow(row)
        }
    }


    /**
     * 更新表格高度, 列表行操作功能是否展开
     */
    resizeVuecmfTable = ():void => {
        nextTick(() => {
            //有无分页条时设置表格高度的处理
            let pagination_height = 92
            if(this.table_config.row_key != ''){
                pagination_height = 42
            }

            setTimeout(() => {
                this.table_config.table_height = document.documentElement.clientHeight - this.table_config.table_list_ref.$refs.vuecmf_table_ref.$el.offsetTop - pagination_height
            }, 200)

            const doc_width = document.documentElement.offsetWidth

            if (router.currentRoute.value.meta.table_name == 'menu'){
                this.table_config.operate_width = doc_width < 769 ? 120 : 168
            }else{
                this.table_config.operate_width = doc_width < 769 ? 110 : 223
            }

            //列表行操作是否展开
            if(doc_width < 769){
                this.table_config.expand_action = false
                this.dialog_config.dlg_expand_action = false

                this.dialog_config.dlg_first.operate_width = 110
                this.dialog_config.dlg_second.operate_width = 110
            }else{
                this.table_config.expand_action = true
                this.dialog_config.dlg_expand_action = true

                this.dialog_config.dlg_first.operate_width = 223
                this.dialog_config.dlg_second.operate_width = 223
            }

        })
    }


    /**
     * 列表初始化
     */
    init = ():void => {
        onUpdated(()=>{
            nextTick(() => {
                //重新渲染表格
                this.table_config.table_list_ref.$refs.vuecmf_table_ref.doLayout()
            })
        })

        onMounted(() => {
            this.resizeVuecmfTable()
            //监听窗口大小变化，实时更新表格高度, 列表行操作功能是否展开
            window.onresize = () => {
                this.resizeVuecmfTable()
            }
        })
    }


}
