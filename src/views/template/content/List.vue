<template>
  <vuecmf-table
      ref="table_list_ref"
      :export_file_name="export_file_name"
      :height=" table_height + 'px' "
      :selectable="selectable"
      :checkbox="show_checkbox"
      :token="token"
      :operate_width="operate_width"
      :expand="row_expand"
      :add_btn_visible="add_btn_visible"
      :detail_btn_visible="detailBtnVisible"
      :edit_btn_visible="editBtnVisible"
      :del_btn_visible="delBtnVisible"
      :server="server"
      :import_server="import_server"
      :save_server="save_server"
      :del_server="del_server"
      :upload_server="upload_server"
      :load_form="loadForm"
      @exception="vuecmfException"
      :row_key="row_key"
      :default_expand_all="default_expand_all"
      :expand_action="expand_action"
      @beforeLoadTable="beforeLoadTable"
  >
    <!-- 表格头部左边 自定义按钮操作 -->
    <template #headerAction="selectRows">
      <template v-if=" typeof table_event.tool_event != 'undefined' ">
        <el-button :type="item.type" :key="index" @click.prevent="item.event(selectRows)" v-for="(item, index) in table_event.tool_event ">{{ item.label }}</el-button>
      </template>
    </template>

    <!-- 每行中的每个字段内容 自定义格式化内容显示： 可获取参数有 { row, field } -->
    <template #formatRow="{ row, field }">
          <span v-if=" field == 'status' ">
            <el-switch v-model="row[field]" :disabled="statusDisabled(row)" @change="(value) => changeStatus(value, row)" inline-prompt :active-value="10" active-text="开" :inactive-value="20" inactive-text="关"></el-switch>
          </span>
    </template>

    <!-- 列表每行 自定义按钮操作 -->
    <template #rowAction="{ row, service }">
      <template v-if=" typeof table_event.row_event == 'object' ">
        <template :key="idx" v-for="(item, idx) in table_event.row_event">
          <template v-if="expand_action">
            <el-button :type="item.type" @click.prevent="item.event(row, service)" v-if="item.visible && (typeof item.showCallback == 'undefined' || item.showCallback(row))">
              {{ item.label }}
            </el-button>
          </template>
          <template v-else>
            <el-dropdown-item @click.prevent="item.event(row, service)" v-if="item.visible && (typeof item.showCallback == 'undefined' || item.showCallback(row))">{{ item.label }}</el-dropdown-item>
          </template>

        </template>

      </template>
    </template>
  </vuecmf-table>


  <!-- 权限对话框 -->
  <vuecmf-dialog :model_value="permission_dlg" :title="'设置(' + current_user_or_role + ')权限'" @updateVisible="showPermissionDlg">
    <template #content>
      <template :key="key" v-for="(item, key) in permission_action_list">
        <div class="main-checkbox">
          <el-checkbox  v-model="checkedModelNameList[key]" :indeterminate="modelNameIndeterminate[key]" @change="(value) => modelNameCheckChange(value, key)" >{{ key }}</el-checkbox>
        </div>
        <div class="child-checkbox">
          <el-checkbox-group v-model="checkedActionList[key]" @change="(value) => actionCheckChange(value, key)">
            <el-checkbox :key="action_id" :label="action_id" v-for="(action_name, action_id) in item">{{ action_name }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="permission_dlg = false">取消</el-button>
        <el-button type="primary" @click="savePermission">保存</el-button>
      </span>
    </template>
  </vuecmf-dialog>

  <!-- 设置用户/角色/模型 -->
  <vuecmf-dialog :model_value="set_assign_dlg" :title="assign_dlg_title" @updateVisible="showSetAssignDlg">
    <template #content>
      <el-transfer
          v-model="assigned_data"
          filterable
          :titles="['待分配', '已分配']"
          :format="{
          noChecked: '${total}',
          hasChecked: '${checked}/${total}',
        }"
          :data="all_data"
      >
      </el-transfer>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button  @click="set_assign_dlg = false">取消</el-button>
        <el-button  type="primary" @click="saveAssignData" :disabled="is_internal">保存</el-button>
      </span>
    </template>
  </vuecmf-dialog>

  <!-- 一级弹窗（设置字段|动作|表单） -->
  <vuecmf-dialog :model_value="dlg_first.show_dlg" :title="dlg_first.dialog_title" ref="firstDlgRef" width="86%" top="10vh" @updateVisible="showFirstDlg" @toggleScreen="dlg_first.toggleScreen" @opened="dlgFirstOpened">
    <template #content>
      <vuecmf-table
          ref="dlg_first_table_list_ref"
          :export_file_name="dlg_first.export_file_name"
          :height="dlg_first.table_height"
          :selectable="dlg_first.selectable"
          :checkbox="dlg_first.show_checkbox"
          :token="token"
          :operate_width="dlg_first.operate_width"
          :expand="false"
          :add_btn_visible="dlg_first.add_btn_visible"
          :detail_btn_visible="dlg_first.detailBtnVisible"
          :edit_btn_visible="dlg_first.editBtnVisible"
          :del_btn_visible="dlg_first.delBtnVisible"
          :server="dlg_first.server"
          :import_server="dlg_first.import_server"
          :save_server="dlg_first.save_server"
          :del_server="dlg_first.del_server"
          :load_form="loadForm"
          @exception="vuecmfException"
          @beforeLoadTable="dialogBeforeLoadTable"
          :expand_action="dlg_expand_action"
      >
        <!-- 列表每行 自定义按钮操作 -->
        <template #rowAction="{ row, service }">
          <template v-if=" typeof dialog_table_event.row_event != 'undefined' ">
            <template :key="idx" v-for="(item, idx) in dialog_table_event.row_event">
              <template v-if="dlg_expand_action">
                <el-button :type="item.type" @click.prevent="item.event(row, service)" v-if="item.visible && (typeof item.showCallback == 'undefined' || item.showCallback(row))">
                  {{ item.label }}
                </el-button>
              </template>
              <template v-else>
                <el-dropdown-item @click.prevent="item.event(row, service)" v-if="item.visible && (typeof item.showCallback == 'undefined' || item.showCallback(row))">{{ item.label }}</el-dropdown-item>
              </template>

            </template>
          </template>
        </template>

      </vuecmf-table>
    </template>
  </vuecmf-dialog>

  <!-- 二级弹窗（设置字段选项|字段关联|表单验证） -->
  <vuecmf-dialog :model_value="dlg_second.show_dlg" :title="dlg_second.dialog_title" ref="secondDlgRef" width="86%" top="10vh" @updateVisible="showSecondDlg" @toggleScreen="dlg_second.toggleScreen" @opened="dlgSecondOpened">
    <template #content>
      <vuecmf-table
          ref="dlg_second_table_list_ref"
          :export_file_name="dlg_second.export_file_name"
          :height="dlg_second.table_height"
          :selectable="dlg_second.selectable"
          :checkbox="dlg_second.show_checkbox"
          :token="token"
          :operate_width="dlg_second.operate_width"
          :expand="false"
          :add_btn_visible="dlg_second.add_btn_visible"
          :detail_btn_visible="dlg_second.detailBtnVisible"
          :edit_btn_visible="dlg_second.editBtnVisible"
          :del_btn_visible="dlg_second.delBtnVisible"
          :server="dlg_second.server"
          :import_server="dlg_second.import_server"
          :save_server="dlg_second.save_server"
          :del_server="dlg_second.del_server"
          :load_form="loadForm"
          @exception="vuecmfException"
          @beforeLoadTable="secondDialogBeforeLoadTable"
          :expand_action="dlg_expand_action"
      >
      </vuecmf-table>
    </template>
  </vuecmf-dialog>


</template>

<script lang="ts" setup>
import ContentService from "@/service/ContentService";

const service = new ContentService()
const {
  server,
  import_server,
  save_server,
  del_server,
  upload_server,
  table_list_ref,
  export_file_name,
  row_key,
  default_expand_all,
  table_height,
  add_btn_visible,
  detailBtnVisible,
  editBtnVisible,
  delBtnVisible,
  statusDisabled,
  operate_width,
  selectable,
  show_checkbox,
  row_expand,
  expand_action
} = service.getConfig()

const {
  permission_dlg,
  current_user_or_role,
  permission_action_list,
  checkedModelNameList,
  checkedActionList,
  modelNameIndeterminate,

  modelNameCheckChange,
  actionCheckChange,
  savePermission
} = service.getConfig('permission_config')

const {
  set_assign_dlg,
  assign_dlg_title,
  all_data,
  assigned_data,
  is_internal,
  //事件
  saveAssignData,
} = service.getConfig('assign_config')

const {
  firstDlgRef,
  secondDlgRef,
  dlg_first_table_list_ref,
  dlg_second_table_list_ref,

  dlg_first,
  dlg_second,

  dlg_expand_action

} = service.getConfig('dialog_config')

service.init()

const token = service.token
const table_event = service.table_event.value
const dialog_table_event = service.dialog_table_event.value



const beforeLoadTable = service.beforeLoadTable
const vuecmfException = service.vuecmfException
const dialogBeforeLoadTable = service.dialogBeforeLoadTable
const secondDialogBeforeLoadTable = service.secondDialogBeforeLoadTable
const loadForm = service.loadForm
const dlgFirstOpened = service.dlgFirstOpened
const dlgSecondOpened = service.dlgSecondOpened
const changeStatus = service.changeStatus

const showSetAssignDlg = () => set_assign_dlg.value = false
const showPermissionDlg = () => permission_dlg.value = false
const showFirstDlg = () => dlg_first.value.show_dlg = false
const showSecondDlg = () => dlg_second.value.show_dlg = false


</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "ContentList"
})
</script>

<style lang="scss" scoped>
.main-checkbox{ background-color: #EBEEF5; }
.main-checkbox, .child-checkbox { padding: 6px 8px;}
.child-checkbox {
  .el-checkbox{ height: 26px; margin: 0 6px 2px 0; width: 200px; overflow: hidden; text-overflow: ellipsis; }
}

</style>

<style lang="scss">
.cell{
  .el-button{ margin: 3px;}
}
</style>
