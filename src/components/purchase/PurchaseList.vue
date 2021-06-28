<template>
  <!-- 主内容 -->
  <div class="salelist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">采购订单列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="salelist-header">
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
            <el-radio-group @change="findpage()" v-model="billdate" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="今天"></el-radio-button>
              <el-radio-button label="昨天"></el-radio-button>
              <el-radio-button label="本周"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
            </el-radio-group>

            <!-- 收货日期 -->
            <br />
            <span>收货日期:</span>
            <el-radio-group @change="findpage()" v-model="collection" size="small">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="今天"></el-radio-button>
              <el-radio-button label="昨天"></el-radio-button>
              <el-radio-button label="本周"></el-radio-button>
              <el-radio-button label="本月"></el-radio-button>
            </el-radio-group>
            

            <!-- 订单状态 -->
            <br />
            <span>订单状态:</span>
            <el-radio-group @change="findpage()" v-model="status" size="small">
               <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="执行中"></el-radio-button>
              <el-radio-button label="已结束"></el-radio-button>
            </el-radio-group>
            <!-- 订单编号 -->
            <br /><br />
            <span>订单编号:</span>
            <el-input style="width:160px" size="small" v-model="value1" filterable></el-input>
            <!-- 供应商 -->
            <span>供应商:</span>
            <el-select v-model="value2" size="small" filterable>
              <el-option v-for="item in options2" :value="item.label">
              </el-option>
            </el-select>
            <!-- 采购人 -->
            <span>采购人:</span>
            <el-select v-model="value3" size="small" filterable>
              <el-option v-for="item in options3" :value="item.label">
              </el-option>
            </el-select>
            <!-- 审批状态 -->
            <span>审批状态:</span>
            <el-select v-model="value4" size="small" filterable>
              <el-option>草稿</el-option>
              <el-option>审批不通过</el-option>
              <el-option>待审批</el-option>
              <el-option>审批通过</el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="salelist-mian">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column fixed label="操作" width="200">
          <template #default="scope">
            <el-button
              type="text"
              v-if="tableData[scope.$index].orderState == 0"
            >
              结束执行
            </el-button>
            <el-button type="text" v-else> 恢复执行 </el-button>
            <el-button type="text"> 查看出库 </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="采购订单编号"
          fixed
          width="200"
        >
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].id
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="documentsDate"
          label="单据日期"
          sortable
          width="150"
        />
        <el-table-column
          prop="deliceryDate"
          label="交货日期"
          sortable
          width="150"
        />
        <el-table-column prop="vendorName" label="供应商" width="120" />
        <el-table-column prop="buyerName" label="采购人员" width="120" />
        <el-table-column
          prop="offersPrice"
          label="优惠后应收款(元)"
          width="150"
        />
        <el-table-column prop="ostate" label="订单已收款(元)" width="200" />
        <el-table-column prop="inboundState" label="出库状态" width="200">
          <template #default="scope">
            <span v-if="tableData[scope.$index].inboundState == 0">
              未出库
            </span>
            <span v-else> 完全出库 </span>
          </template>
        </el-table-column>
        <el-table-column prop="createPeople" label="创建人" width="200" />
        <el-table-column
          prop="createDate"
          label="创建时间"
          sortable
          width="200"
        />
        <el-table-column prop="vettingState" label="审批状态" width="200">
          <template #default="scope">
            <span v-if="tableData[scope.$index].vettingState == 0">
              待一级审批
            </span>
            <span v-else-if="tableData[scope.$index].vettingState == -2">
              草稿
            </span>
            <span v-else-if="tableData[scope.$index].vettingState == -1">
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
          prop="updateDate"
          label="更新时间"
          sortable
          width="200"
        />
        <el-table-column
          prop="lastVettingDate"
          label="最后审批时间"
          sortable
          width="200"
        />
        <el-table-column prop="vettingName" label="审批人" width="120" />
        <el-table-column prop="exitOrderId" label="关联退货单" width="200" />
        <el-table-column prop="receiptOrderId" label="关联入库单" width="200" />
        <el-table-column prop="paymentOrder" label="关联付款单" width="200" />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="salelist-footer" v-show="paging">
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
      collection: "全部", //交货日期
      status: "全部", //订单状态
      customtime1: "", //自定义时间
      customtime2: "",
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: "", //订单编号
      value2: "", //供应商
      value3: "", //采购人
      value4: "全部", //审批状态

      //条件对象
      condition:{
        documentsdate:"",//单据日期
        delicerydate:"",//交货日期
        oraderstate:0,//订单状态
        orderid:"",//订单编号
        vendor:"",//供应商
        buyer:"",//采购人
        vettingstate:0,//审批状态
      },
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
        "订单状态: " + this.status,
        "订单编号: " + this.value1,
        "供应商: " + this.value2,
        "采购人: " + this.value3,
        "审批状态: " + this.value4,
      ];
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.findpage(val, this.pagesize)
    },
    findpage() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      var _this = this;
      this.condition.documentsdate=this.billdate
      this.condition.delicerydate=this.collection
      this.condition.oraderstate=this.status
      this.condition.orderid=this.value1
      this.condition.vendor=this.value2
      this.condition.buyer=this.value3
      this.condition.vettingstate=this.value4
      console.log(this.condition)
      this.axios({
        url: "http://localhost:8088/frameproject/purchaseOrder/findpage",
        method: "post",
        data:{currentPage: _this.currentPage,
              pageSize: _this.pagesize,
              condition:_this.condition
        },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if(response.data.data.rows==null){
            _this.tableDat=""
          }else{
            _this.tableData = response.data.data.rows;
          }
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    goorder(val) {
      sessionStorage.setItem("orderid", this.tableData[val].id);
      this.$router.push("/Purchase");
    },
  },

  created: function () {
    this.findpage();
  },
};
</script>

<style>
.salelist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.salelist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.salelist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.salelist .el-radio-group {
  margin: 10px 0px;
}
.salelist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.salelist .el-tag {
  color: #409eff !important;
}
.salelist .el-collapse,
.salelist .el-collapse-item__wrap,
.salelist .el-collapse-item__header,
.salelist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.salelist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.salelist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.salelist th {
  color: white !important;
  background-color: #459df5 !important;
}
.salelist .cell {
  text-align: center;
}
/* 内容表尾 */
.salelist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>