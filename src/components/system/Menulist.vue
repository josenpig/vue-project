<template>
  <!-- 主内容 -->
  <div class="menulist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">菜单列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表体内容 -->
    <div class="menulist-mian">
      <!-- 修改 -->
      <el-dialog title="菜单修改" v-model="dialogFormVisible" width="25%">
        <el-form :model="form">
          <el-form-item label="菜单名称：" style="width: 300px">
            <el-input v-model="form.menuName"></el-input>
          </el-form-item>

          <el-form-item label="菜单图标：" style="width: 300px">
            <el-input v-model="form.icon" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单排序：" >
            <el-input-number v-if="form.menuId != 1" v-model="form.orderNum" :min="1"/>
            <span v-else>系统默认无法修改</span>
          </el-form-item>
          <el-form-item label="显示状态：" style="width: 200px">
            <el-switch v-if="form.menuId != 9 && form.parentId !=9 && form.menuId!=1"
              v-model="form.visible"
              :loading="false"
              :beforeChange="beforeChange1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="显示"
              inactive-text="隐藏"
            />
            <span v-else>系统默认无法修改</span>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeok()">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="menuId"
        :tree-props="{ children: 'childMenu' }"
        :current-row-key="menuId"
      >
        <el-table-column prop="menuName" label="菜单名称" />
        <el-table-column prop="icon" label="菜单图标" width="100px">
          <template #default="scope">
            <i :class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="菜单排序" width="100px" />
        <el-table-column prop="perms" label="权限标识" />
        <el-table-column prop="component" label="组件路径" />
        <el-table-column label="菜单显示状态">
          <template #default="scope">
            {{ scope.row.visible == 0 ? "显示" : "隐藏" }}
          </template>
        </el-table-column>
        <el-table-column prop="cz" label="操作">
          <template #default="scope">
            <el-button icon="el-icon-edit" @click="change(scope.row)"
              >修改菜单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
export default {
  name: "Receivable",
  data() {
    return {
      //表单数据
      tableData: [],
      dialogFormVisible: false,
      form: {},
    };
  },
  methods: {
    change(index) {
      console.log(index);
      this.dialogFormVisible = true;
      this.form.menuName = index.menuName;
      this.form.orderNum = index.orderNum;
      this.form.icon = index.icon;
      this.form.menuId = index.menuId;
      this.form.parentId = index.parentId;
      index.visible == 0
        ? (this.form.visible = true)
        : (this.form.visible = false);
    },
    changeok() {
      this.dialogFormVisible = false;
      this.form.visible == true
        ? (this.form.visible = 0)
        : (this.form.visible = 1);
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url:
          "http://localhost:8088/frameproject/systempower/changemenu/" +
          state.userInfo.userName,
        method: "post",
        data: _this.form,
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if (response.data.data != false) {
            _this.$store.commit("setmenulists", response.data.data);
            _this.findpage();
            ElMessage.success({
              message: "菜单信息已被修改",
              type: "success",
            });
            setTimeout(function () {
              window.location.reload();
            }, 1000);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //条件分页查询
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/findmenulist",
        method: "post",
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.tableData = response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.findpage();
  },
};
</script>

<style>
.menulist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.menulist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.menulist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.menulist .el-radio-group {
  margin: 10px 0px;
}
.menulist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.menulist .el-tag {
  color: #409eff !important;
}
.menulist .el-collapse,
.menulist .el-collapse-item__wrap,
.menulist .el-collapse-item__header,
.menulist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.menulist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.menulist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.menulist th {
  background-color: #f8f8f9 !important;
  color: #515a6e !important;
}
.menulist-look th {
  color: #666666 !important;
  background-color: #e8e8e8 !important;
}
.menulist .cell {
  text-align: center;
}
/* 内容表尾 */
.menulist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>