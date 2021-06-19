<template>
  <!-- 主内容 -->
  <div class="paymentlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">付款资金管理</span>
      <!-- 标签页 -->
      <ul>
        <li><router-link to="Payable">应付</router-link></li>
        <li>
          <router-link to="Paymentlist" class="active">付款单</router-link>
        </li>
      </ul>
    </div>
    <!-- 表单头部 筛选 -->
    <div class="paymentlist-header">
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
            <el-radio-group v-model="billdate" size="small" @change="qbc()">
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
            <!-- 付款日期 -->
            <br />
            <span>付款日期:</span>
            <el-radio-group v-model="collection" size="small" @change="qbc()">
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
            <el-radio-group v-model="status" size="small" @change="qbc()">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="未结案"></el-radio-button>
              <el-radio-button label="结案"></el-radio-button>
            </el-radio-group>
            <!-- 供应商 -->
            <br /><br />
            <span>供应商:</span>
            <el-select v-model="value1" size="small" filterable @change="qbc()">
              <el-option v-for="item in options1" :value="item.label">
              </el-option>
            </el-select>
            <!-- 创建人 -->
            <span>创建人:</span>
            <el-select v-model="value3" size="small" filterable @change="qbc()">
              <el-option v-for="item in options3" :value="item.label">
              </el-option>
            </el-select>
            <!-- 销售人员 -->
            <span>销售人员:</span>
            <el-select v-model="value4" size="small" filterable @change="qbc()">
              <el-option v-for="item in options4" :value="item.label">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="paymentlist-mian">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          prop="paymentId"
          label="付款单据编号"
          fixed
          width="200"
        >
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].paymentId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="paymentTime"
          label="付款日期"
          sortable
          width="150"
        />
        <el-table-column
          prop="vendor"
          label="供应商名称"
          sortable
          width="150"
        />
        <el-table-column prop="drawee" label="付款人" width="120" />
        <el-table-column prop="paymentType" label="付款类别" width="120" />
        <el-table-column prop="paymentMoney" label="付款金额(元)" width="150" />
        <el-table-column prop="piaMoney" label="预付金额(元)" width="120" />
        <el-table-column prop="piaBalance" label="预付余额(元)" width="120" />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column prop="remarks" label="单据备注" width="120" />
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
        <el-table-column prop="approver" label="当前审批人" width="120" />
        <el-table-column
          prop="lastApprovalTime"
          label="最后审批时间"
          sortable
          width="200"
        />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="paymentlist-footer" v-show="paging">
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
      collection: "全部", //付款日期
      status: "全部", //结案状态
      customtime1: "", //自定义时间
      customtime2: "",
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: "", //供应商
      value2: "", //仓库
      value3: "", //创建人
      value4: "", //销售人员
      //表单数据
      tableData: [],
      //条件查询数据
      condition: {
        orderTime: "",
        deliveryTime: "",
        vendor: "",
        founder: "",
        salesmen: "",
      },
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
        "付款日期: " + this.collection,
        "结案状态: " + this.status,
        "供应商: " + this.value1,
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
      this.axios({
        url: "http://localhost:8088/frameproject/capitalPayment/conditionpage",
        method: "post",
        processData: false,
        data: {
          currentPage: this.currentPage,
          pageSize: this.pagesize,
          condition: "",
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
    goorder(val) {
      sessionStorage.setItem("orderid", this.tableData[val].paymentId);
      this.$router.push("/Payment");
    },
    qbc() {
      this.condition.orderTime = this.billdate;
      console.log(this.condition);
    },
  },
  created: function () {
    this.findpage();
  },
};
</script>

<style>
.paymentlist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.page-tag ul {
  float: left;
  list-style-type: none;
  margin: 0px;
}
.page-tag ul li {
  float: left;
  height: 100%;
}
.page-tag ul li a {
  display: block;
  margin-right: 2px;
  width: 120px;
  text-align: center;
  color: #26344b;
  font-size: 13px;
  background-color: #d6dde3;
  line-height: 40px;
  text-decoration: none;
}
.page-tag ul li a.active {
  line-height: 38px;
  font-size: 14px;
  border-top: 2px solid #459df5;
  background-color: #f7fbfe;
}
/* 顶部 */
.paymentlist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.paymentlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.paymentlist .el-radio-group {
  margin: 10px 0px;
}
.paymentlist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.paymentlist .el-tag {
  color: #409eff !important;
}
.paymentlist .el-collapse,
.paymentlist .el-collapse-item__wrap,
.paymentlist .el-collapse-item__header,
.paymentlist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.paymentlist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.paymentlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.paymentlist th {
  color: white !important;
  background-color: #459df5 !important;
}
.paymentlist .cell {
  text-align: center;
}
/* 内容表尾 */
.paymentlist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>