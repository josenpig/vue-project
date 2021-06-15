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
            <el-input
              v-model.trim="form.roleName"
              maxlength="8"
              show-word-limit
              style="width: 250px"
            />
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
      <!-- 新增 -->
      <el-dialog title="角色新增" v-model="dialogaddVisible" width="35%">
        <el-form :model="add">
          <el-form-item label="角色名称：">
            <el-input
              v-model.trim="add.roleName"
              maxlength="8"
              show-word-limit
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="菜单权限：" />
          <el-tree
            style="margin-left: 100px; margin-top: -50px"
            :data="newadd"
            :props="defaultProps"
            @check-change="handleCheckChange1"
            node-key="menuId"
            :default-checked-keys="[1]"
            show-checkbox
            ref="tree1"
          ></el-tree>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogaddVisible = false">取 消</el-button>
            <el-button type="primary" @click="addnewok()">确 定</el-button>
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
      all: [], //所有菜
      newadd: [],
      current: [], //当前具有菜单id
      initial: [], //当前具有菜单
      defaultProps: {
        children: "childMenu",
        label: "menuName",
        value: "menuId",
      },
      dialogFormVisible: false,
      dialogaddVisible: false,
      //修改
      form: {
        roleId: "", //角色id
        roleName: "", //角色名
        delFlag: "", //删除标识
        updatedBy: "", //更新人
        menus: [], //最新菜单
      },
      //新增
      add: {
        roleName: "", //角色名
        founder: "", //创建人
        menus: [], //菜单
      },

      name: "", //选中行的角色名
      condition: { roleName: "" }, //查询条件
      vagueorderid: "",
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  methods: {
    //模糊查询
    join() {
      this.condition.roleName = this.vagueorderid;
      this.findpage();
    },
    //删除角色
    delet(index) {
      this.$confirm(
        "是否确认删除角色名为‘" + this.tableData[index].roleName + "’的数据项",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        this.form.delFlag = -1;
        this.form.roleId = this.tableData[index].roleId;
        this.update(-1);
      });
    },
    //修改完成
    update(type) {
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
          if (type == -1) {
            if (response.data.data != false) {
              ElMessage.success({
                message: "角色信息已被删除",
                type: "success",
              });
            } else {
              ElMessage.warning({
                message: "该角色下存在用户无法删除",
                type: "warning",
              });
            }
          } else {
            if (response.data.data == true) {
              ElMessage.success({
                message: "角色信息已被修改",
                type: "success",
              });
            } else {
              ElMessage.warning({
                message: "角色信息修改失败",
                type: "warning",
              });
            }
          }
          _this.findpage();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //修改
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
            if (item.menuType == 'C') {
              _this.current.push(item.menuId);
            }
          });
          _this.all = response.data.data.allmenus; //添加所有菜单
          _this.initial = response.data.data.menus; //添加当前角色具有菜单
          _this.form.menus = response.data.data.menus; //添加当前角色具有菜单
          _this.all[0].disabled = true;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogFormVisible = true;
    },
    //新增
    addnew() {
      this.add = {
        roleName: "", //角色名
        founder: "", //创建人
        menus: [], //菜单
      };
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/systempower/findmenus",
        method: "post",
        params: { roleId: 0 },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.newadd = response.data.data.allmenus; //添加所有菜单
          _this.add.menus.push(_this.newadd[0]);
          _this.newadd[0].disabled = true;
          _this.dialogaddVisible = true;
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
          _this.tableData = response.data.data.rows;
          _this.max = response.data.data.total;
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
    //获取所有选中及半选中的值
    handleCheckChange1() {
      this.add.menus = this.$refs.tree1
        .getCheckedNodes()
        .concat(this.$refs.tree1.getHalfCheckedNodes());
    },
    //确认新增
    addnewok() {
      if (this.add.roleName == "") {
        ElMessage.warning({
          message: "角色名不能为空",
          type: "warning",
        });
      } else {
        const state = JSON.parse(sessionStorage.getItem("state"));
        this.add.founder = state.userInfo.userName;
        var _this = this;
        this.axios({
          url: "http://localhost:8088/frameproject/systempower/addnewrole",
          method: "post",
          data: {
            menus: JSON.stringify(_this.add.menus),
            roles: JSON.stringify(_this.add),
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            if (response.data.data == true) {
              ElMessage.success({
                message: "角色信息添加成功",
                type: "success",
              });
              _this.findpage();
            } else {
              ElMessage.warning({
                message: "角色信息添加失败",
                type: "warning",
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        _this.dialogaddVisible = false;
      }
    },
    //确认修改
    changeok() {
      if (this.form.roleName == "") {
        ElMessage.warning({
          message: "角色名不能为空",
          type: "warning",
        });
      } else if (
        this.initial == this.form.menus &&
        this.form.roleName == this.name
      ) {
        //判断数据是否发生改变
        this.dialogFormVisible = false;
      } else if (
        this.initial == this.form.menus &&
        this.form.roleName != this.name
      ) {
        this.form.menus = [];
        this.update();
        this.dialogFormVisible = false;
      } else {
        this.update();
        this.dialogFormVisible = false;
      }
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