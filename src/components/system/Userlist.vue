<template>
  <!-- 主内容 -->
  <div class="userlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">用户列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表体内容 -->
    <div class="userlist-mian">
      <!-- 修改 -->
      <el-dialog title="用户修改" v-model="dialogFormVisible" width="35%">
        <el-form :model="form">
          <el-form-item label="用户名称：">
            <el-input v-model="form.userName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="用户手机：">
            <el-input v-model="form.userPhone" style="width: 250px" />
          </el-form-item>
          <el-form-item label="用户性别：">
            <el-radio v-model="form.userSex" label="男">男</el-radio>
            <el-radio v-model="form.userSex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="用户状态：" style="width: 200px">
            <el-switch
              v-model="form.userState"
              :loading="false"
              :beforeChange="beforeChange1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="正常"
              inactive-text="停用"
            />
          </el-form-item>
          <el-form-item label="所属角色：">
            <el-select v-model="form.roles" multiple placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请填写用户备注"
              v-model="form.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
              <el-button @click="dialogFormVisible=false">取 消</el-button>
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
          >新增用户</el-button
        >
        <!-- 模糊查询 -->
        <div style="float: right">
          <el-input
            clearable
            v-model="vagueorderid"
            placeholder="请输入用户名称"
            style="width: 200px"
            size="small"
          />
          <el-button icon="el-icon-search" size="small" @click="join()"
            >查询</el-button
          >
        </div>
      </div>
      <el-table :data="tableData" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="userId" label="用户编号" width="100" />
        <el-table-column prop="userName" label="用户名称" />
        <el-table-column prop="userPhone" label="用户手机号" />
        <el-table-column prop="userSex" label="用户性别" width="100px" />
        <el-table-column prop="userState" label="帐号状态">
          <template #default="scope">
            {{ tableData[scope.$index].userState == 0 ? "正常" : "禁用" }}
          </template>
        </el-table-column>
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
              v-if="tableData[scope.$index].userId != 1"
              >删除</el-button
            >
            <el-button
              type="text"
              class="el-icon-key"
              size="samll"
              @click="change(scope.$index)"
              >重置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="userlist-footer">
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
      tableData: [],
      all: [],
      dialogFormVisible: false,
      form: {
        userName: "",
        userPhone: "",
        userSex: "",
        userState: "",
        updatedBy: "",
        remark: "",
        roles: [],
      },
      options: [],
      condition: {},
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  methods: {
    addnew() {},
    update() {},
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
      this.form.roles = [];
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/findroles",
        method: "post",
        params: { username: _this.tableData[index].userName },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.options = response.data.data.allroles;
          response.data.data.roles.forEach((item) => {
            _this.form.roles.push(item.roleId);
          });
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogFormVisible = true;
      this.form.userName = this.tableData[index].userName;
      this.form.userPhone = this.tableData[index].userPhone;
      this.form.userSex = this.tableData[index].userSex;
      this.form.remark = this.tableData[index].remark;
      this.tableData[index].userState == 0
        ? (this.form.userState = true)
        : (this.form.userState = false);
    },
    change(index) {
      this.$prompt(
        "请输入‘" + this.tableData[index].userName + "’的新密码",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
          inputErrorMessage: "密码至少包含数字和英文，长度6-18",
        }
      )
        .then(({ value }) => {})
        .catch(({ value }) => {});
    },
    changeok() {
      this.dialogFormVisible = false;
    },
    //条件分页查询
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/conditionpageuser",
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
  },
  created: function () {
    this.findpage();
  },
};
</script>

<style>
.userlist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.userlist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.userlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.userlist .el-textarea .el-textarea__inner {
  resize: none;
}
/* 表体内容 */
.userlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.userlist th {
  background-color: #f8f8f9 !important;
  color: #515a6e !important;
}
.userlist-look th {
  color: #666666 !important;
  background-color: #e8e8e8 !important;
}
.userlist .cell {
  text-align: center;
}
/* 内容表尾 */
.userlist-footer {
  text-align: center;
}
</style>