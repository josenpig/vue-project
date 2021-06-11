<template>
  <!-- 主内容 -->
  <div class="receivable">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">收款资金管理</span>
      <!-- 标签页 -->
      <ul>
        <li><router-link to="Receivable" class="active">应收</router-link></li>
        <li><router-link to="Receiptlist">收款单</router-link></li>
      </ul>
    </div>
    <!-- 表单头部 筛选 -->
    <div class="receivable-header">
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
            <el-select
              v-model="value1"
              size="small"
              clearable
              filterable
              @change="qbc()"
            >
              <el-option v-for="item in options1" :value="item.customerName">
              </el-option>
            </el-select>
            <!-- 创建人 -->
            <span>创建人:</span>
            <el-select
              v-model="value2"
              clearable
              size="small"
              filterable
              @change="qbc()"
            >
              <el-option v-for="item in options2" :value="item.userName">
              </el-option>
            </el-select>
            <!-- 销售人员 -->
            <span>销售人员:</span>
            <el-select
              v-model="value3"
              clearable
              size="small"
              filterable
              @change="qbc()"
            >
              <el-option v-for="item in options3" :value="item.userName">
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="receivable-mian">
      <div style="padding: 10px 25px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="goadd()"
          >批量收款</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        max-height="400"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column label="操作" width="120" fixed>
          <template #default="scope">
            <el-button
              type="text"
              v-if="tableData[scope.$index].caseState == 0"
              @click="goreceipt(scope.$index)"
            >
              收款
            </el-button>
            <el-button
              type="text"
              v-if="tableData[scope.$index].caseState == 0"
            >
              结案
            </el-button>
            <el-button type="text" v-else> 反结案 </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryId" fixed label="单据编号" width="200">
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].deliveryId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="deliveryTime"
          label="出库日期"
          sortable
          width="120"
        />
        <el-table-column prop="deliveryType" label="单据类型" width="120" />
        <el-table-column prop="customer" label="客户名称" width="120" />
        <el-table-column prop="salesmen" label="销售人员" width="120" />
        <el-table-column prop="receivables" label="应收金额" width="120" />
        <el-table-column prop="received" label="已收金额" width="120" />
        <el-table-column prop="uncollected" label="未收金额" width="120" />
        <el-table-column prop="remarks" label="单据备注" width="120" />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column
          prop="receiptRemark"
          label="最后收款备注"
          :show-overflow-tooltip="true"
          width="200"
        />
        <el-table-column
          prop="lastCollectionTime"
          label="最后收款时间"
          sortable
          width="200"
        />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="receivable-footer" v-show="paging">
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
      value1: "", //客户
      value2: "", //创建人
      value3: "", //销售人员
      //表单数据
      tableData: [],
      //条件查询数据
      vagueorderid: "",
      condition: {
        orderId: "", //订单id
        orderTime: "", //单据日期
        otimeState: "",
        otimeEnd: "",
        deliveryTime: "", //交货日期
        dtimeState: "",
        dtimeEnd: "",
        approvalState: "", //审批状态
        customer: "", //客户
        founder: "", //创建人
        salesmen: "", //销售人
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
        "收款日期: " + this.collection,
        "结案状态: " + this.status,
        "客户: " + this.value1,
        "创建人: " + this.value2,
        "销售人员: " + this.value3,
      ];
    },
  },
  methods: {
    goorder(val) {
      sessionStorage.setItem("orderid", this.tableData[val].deliveryId);
      this.$router.push("/Deliver");
    },
    goreceipt(val) {
      var receipt = {
        type: "应收收款",
        orderId: this.tableData[val].deliveryId,
      };
      sessionStorage.setItem("receipt", JSON.stringify(receipt));
      this.$router.push("/Addreceipt");
    },
    goadd() {
      this.$router.push("/Addreceipt");
    },
    //条件查询
    qbc() {
      this.condition.orderTime = this.billdate;
      this.condition.deliveryTime = this.collection;
      this.condition.approvalState = this.status;
      this.condition.customer = this.value1;
      this.condition.founder = this.value2;
      this.condition.salesmen = this.value3;
      if (this.customtime1 != null) {
        this.condition.otimeState = this.customtime1[0];
        this.condition.otimeEnd = this.customtime1[1];
      } else {
        this.condition.otimeState = null;
        this.condition.otimeEnd = null;
      }
      if (this.customtime2 != null) {
        this.condition.dtimeState = this.customtime2[0];
        this.condition.dtimeEnd = this.customtime2[1];
      } else {
        this.condition.dtimeState = null;
        this.condition.dtimeEnd = null;
      }
      //this.findpage();
    },
    findsaleman() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/personnel/ofpeople",
        method: "get",
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.options1 = response.data.data.customers;
          _this.options2 = response.data.data.notifiers;
          _this.options3 = response.data.data.salemans;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.axios({
        url:
          "http://localhost:8088/frameproject/capitalReceivable/conditionpage",
        method: "post",
        data: {
          currentPage: _this.currentPage,
          pageSize: _this.pagesize,
          condition: "",
        },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.tableData = response.data.data.rows;
          _this.tableData.forEach((item) => {
            if (item.deliveryId.match(/^[a-z|A-Z]+/gi) == "XSCKD"){
              item.deliveryType = "销售出库单"
            }
          });
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.findpage();
    this.findsaleman();
  },
};
</script>

<style>
.receivable {
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
/* 内容表头 筛选框 */
.receivable-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.receivable .el-radio-group {
  margin: 10px 0px;
}
.receivable-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.receivable .el-tag {
  color: #409eff !important;
}
.receivable .el-collapse,
.receivable .el-collapse-item__wrap,
.receivable .el-collapse-item__header,
.receivable .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.receivable .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.receivable-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.receivable th {
  color: white !important;
  background-color: #459df5 !important;
}
.receivable .cell {
  text-align: center;
}
/* 内容表尾 */
.receivable-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>