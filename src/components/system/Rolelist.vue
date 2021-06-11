<template>
  <!-- 主内容 -->
  <div class="rolelist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">角色列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表体内容 -->
    <div class="rolelist-mian">
      <!-- 修改 -->
      <el-dialog title="角色修改" v-model="dialogFormVisible" width="35%">
        <el-form :model="form">
          <el-form-item label="角色名称：">
            <el-input v-model="form.roleName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="菜单权限：" />
          <el-tree
            style="margin-left: 100px; margin-top: -50px"
            :data="all"
            :props="defaultProps"
            @check-change="handleCheckChange"
            node-key="menuId"
            :default-checked-keys="current"
            show-checkbox
            ref="tree"
          ></el-tree>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeok()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
      <div style="padding: 10px 25px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="mini"
          @click="addnew()"
          plain
          >新增角色</el-button
        >
        <!-- 模糊查询 -->
        <div style="float: right">
          <el-input
            clearable
            v-model="vagueorderid"
            placeholder="请输入角色名称"
            style="width: 200px"
            size="small"
          />
          <el-button icon="el-icon-search" size="small" @click="join()"
            >查询</el-button
          >
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="roleId" label="角色编号" width="100" />
        <el-table-column prop="roleName" label="角色名称" />
        <el-table-column prop="founder" label="创建人" />
        <el-table-column prop="foundTime" label="创建时间" />
        <el-table-column prop="updateTime" label="最后更新时间" />
        <el-table-column prop="cz" label="操作">
          <template #default="scope">
            <el-button
              type="text"
              class="el-icon-edit"
              size="samll"
              @click="changeall(scope.$index)"
              >修改</el-button
            >
            <el-button
              type="text"
              class="el-icon-delete"
              size="samll"
              @click="delet(scope.$index)"
              v-if="tableData[scope.$index].roleId != 1"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="rolelist-footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="max"
        :page-size="pagesize"
        style="margin-top: 50px"
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
      >
      </el-pagination>
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
      tableData: [], //所有角色
      all: [], //所有菜单
      current: [], //当前具有菜单id
      initial: [], //当前具有菜单
      defaultProps: {
        children: "childMenu",
        label: "menuName",
        value: "menuId",
      },
      dialogFormVisible: false,
      form: {
        roleId: "", //角色id
        roleName: "", //角色名
        updatedBy: "", //更新人
        menus: [], //最新菜单
      },
      name: "", //选中行的角色名
      condition: {}, //查询条件
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  methods: {
    addnew() {},
    update() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      this.form.updatedBy = state.userInfo.userName;
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/changerolemenu",
        method: "post",
        data: {
          menus: JSON.stringify(_this.form.menus),
          roles: JSON.stringify(_this.form),
        },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if (response.data.data == true) {
            ElMessage.success({
              message: "角色信息已被修改",
              type: "success",
            });
            _this.findpage();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    delet(index) {
      this.$confirm(
        "是否确认删除用户名为‘" + this.tableData[index].userName + "’的数据项",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    changeall(index) {
      this.current = [];
      this.form.roleId = this.tableData[index].roleId;
      this.name = this.tableData[index].roleName;
      this.form.roleName = this.tableData[index].roleName;
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/findmenus",
        method: "post",
        params: { roleId: _this.tableData[index].roleId },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          //添加当前角色具有菜单id
          response.data.data.menus.forEach((item) => {
            _this.current.push(item.menuId);
          });
          _this.initial = response.data.data.menus; //添加当前角色具有菜单
          _this.form.menus = response.data.data.menus; //添加当前角色具有菜单
          _this.all = response.data.data.allmenus; //添加所有菜单
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogFormVisible = true;
    },
    //条件分页查询
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/conditionpagerole",
        method: "post",
        data: {
          currentPage: _this.currentPage,
          pageSize: _this.pagesize,
          condition: JSON.stringify(_this.condition),
        },
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
    //改变页码数
    handleCurrentChange(val) {
      this.findpage(val, this.pagesize);
    },
    //获取所有选中及半选中的值
    handleCheckChange() {
      this.form.menus = this.$refs.tree
        .getCheckedNodes()
        .concat(this.$refs.tree.getHalfCheckedNodes());
    },
    changeok() {
      //判断数据是否发生改变
      if (this.initial == this.form.menus && this.form.roleName == this.name) {
        this.dialogFormVisible = false;
      } else if (
        this.initial == this.form.menus &&
        this.form.roleName != this.name
      ) {
        this.form.menus = [];
        this.update();
      } else {
        this.update();
      }
      this.dialogFormVisible = false;
    },
  },
  created: function () {
    this.findpage();
  },
};
</script>

<style>
.rolelist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.rolelist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.rolelist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.rolelist .el-textarea .el-textarea__inner {
  resize: none;
}
/* 表体内容 */
.rolelist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.rolelist th {
  background-color: #f8f8f9 !important;
  color: #515a6e !important;
}
.rolelist-look th {
  color: #666666 !important;
  background-color: #e8e8e8 !important;
}
.rolelist .cell {
  text-align: center;
}
/* 内容表尾 */
.rolelist-footer {
  text-align: center;
}
</style>