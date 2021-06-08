<template>
  <!-- 主内容 -->
  <div class="returnlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">采购退货单列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="returnlist-header">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <span>筛选条件:</span>
            <el-tag :key="tag" v-for="tag in all" size="medium">
              {{ tag }}
            </el-tag>
          </template>
          <div>
            <!-- 单据日期 -->
            <span>单据日期:</span>
            <el-radio-group v-model="billdate" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="今天"></el-radio-button>
              <el-radio-button label="昨天"></el-radio-button>
              <el-radio-button label="本周"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="自定义"></el-radio-button>
            </el-radio-group>
            <div
              v-show="custom1"
              style="top: 178px; left: 730px; position: absolute"
            >
              <el-date-picker
                v-model="customtime1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>
            <!-- 收款日期 -->
            <br />
            <span>收款日期:</span>
            <el-radio-group v-model="collection" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="今天"></el-radio-button>
              <el-radio-button label="昨天"></el-radio-button>
              <el-radio-button label="本周"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
              <el-radio-button label="自定义"></el-radio-button>
            </el-radio-group>
            <div
              v-show="custom2"
              style="top: 228px; left: 730px; position: absolute"
            >
              <el-date-picker
                v-model="customtime2"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </div>

            <!-- 结案状态 -->
            <br />
            <span>结案状态:</span>
            <el-radio-group v-model="status" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="未结案"></el-radio-button>
              <el-radio-button label="结案"></el-radio-button>
            </el-radio-group>
            <!-- 客户 -->
            <br /><br />
            <span>客户:</span>
            <el-select v-model="value1" size="small" filterable>
              <el-option v-for="item in options1" :value="item.label">
              </el-option>
            </el-select>
            <!-- 仓库 -->
            <span>仓库:</span>
            <el-select v-model="value2" size="small" filterable>
              <el-option v-for="item in options2" :value="item.label">
              </el-option>
            </el-select>
            <!-- 创建人 -->
            <span>创建人:</span>
            <el-select v-model="value3" size="small" filterable>
              <el-option v-for="item in options3" :value="item.label">
              </el-option>
            </el-select>
            <!-- 销售人员 -->
            <span>销售人员:</span>
            <el-select v-model="value4" size="small" filterable>
              <el-option v-for="item in options4" :value="item.label">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="returnlist-mian">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column fixed label="操作" width="150">
          <template #default="scope">
            <el-button
              type="text"
              v-if="tableData[scope.$index].orderState == 0"
            >
              结束执行
            </el-button>
            <el-button type="text" v-else> 恢复执行 </el-button>
            <el-button type="text"> 查看入库 </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="退货订单编号"
          fixed
          width="200"
        >
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].returnId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnTime"
          label="退货日期"
          sortable
          width="150"
        />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="salesmen" label="销售人员" width="120" />
        <el-table-column
          prop="receivables"
          label="优惠后应收款(元)"
          width="150"
        />
        <el-table-column prop="returnState" label="入库状态" width="120">
          <template #default="scope">
            <span v-if="tableData[scope.$index].returnState == 0">
              未入库
            </span>
            <span v-else> 完全入库 </span>
          </template>
        </el-table-column>
        <el-table-column prop="contacts" label="联系人" width="120" />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column
          prop="foundTime"
          label="创建时间"
          sortable
          width="200"
        />
        <el-table-column prop="approvalState" label="审批状态" width="120">
          <template #default="scope">
            <span v-if="tableData[scope.$index].approvalState == 0">
              待一级审批
            </span>
            <span v-else-if="tableData[scope.$index].approvalState == -2">
              草稿
            </span>
            <span v-else-if="tableData[scope.$index].approvalState == -1">
              审批未通过
            </span>
            <span v-else> 审批通过 </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderState" label="订单状态" width="120">
          <template #default="scope">
            <span v-if="tableData[scope.$index].orderState == 0"> 执行中 </span>
            <span v-else> 已结束 </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable
          width="200"
        />
        <el-table-column
          prop="lastApprovalTime"
          label="最后审批时间"
          sortable
          width="200"
        />
        <el-table-column prop="approver" label="审批人" width="120" />
        <el-table-column prop="deliveryId" label="关联出库单" width="200" />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="returnlist-footer" v-show="paging">
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
export default {
  name: "Receivable",
  data() {
    return {
      //默认展开
      activeNames: "1",
      //筛选框
      billdate: "全部", //单据日期
      collection: "全部", //收款日期
      status: "全部", //结案状态
      customtime1: "", //自定义时间
      customtime2: "",
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: "全部", //客户
      value2: "全部", //仓库
      value3: "全部", //创建人
      value4: "全部", //销售人员
      //表单数据
      tableData: [],
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  computed: {
    paging: function () {
      return this.tableData.length > 0 ? true : false;
    },
    custom1: function () {
      return this.billdate == "自定义" ? true : false;
    },
    custom2: function () {
      return this.collection == "自定义" ? true : false;
    },
    all: function () {
      return [
        "单据日期: " + this.billdate,
        "收款日期: " + this.collection,
        "结案状态: " + this.status,
        "客户: " + this.value1,
        "仓库: " + this.value2,
        "创建人: " + this.value3,
        "销售人员: " + this.value4,
      ];
    },
  },
  methods: {
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      var fd = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
      };
      this.axios({
        url: "http://localhost:8088/frameproject/salereturn/findpage",
        method: "get",
        processData: false,
        params: fd,
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
    goorder(val) {
      sessionStorage.setItem("orderid", this.tableData[val].returnId);
      this.$router.push("/Return");
    },
  },

  created: function () {
    this.findpage();
  },
};
</script>

<style>
.returnlist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.returnlist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.returnlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlist .el-radio-group {
  margin: 10px 0px;
}
.returnlist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.returnlist .el-tag {
  color: #409eff !important;
}
.returnlist .el-collapse,
.returnlist .el-collapse-item__wrap,
.returnlist .el-collapse-item__header,
.returnlist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.returnlist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.returnlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlist th {
  color: white !important;
  background-color: #459df5 !important;
}
.returnlist .cell {
  text-align: center;
}
/* 内容表尾 */
.returnlist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>