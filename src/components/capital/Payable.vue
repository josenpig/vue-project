<template>
  <!-- 主内容 -->
  <div class="payable">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">付款资金管理</span>
      <!-- 标签页 -->
      <ul>
        <li><router-link to="Payable" class="active">应付</router-link></li>
        <li><router-link to="Paymentlist">付款单</router-link></li>
      </ul>
    </div>
    <!-- 表单头部 筛选 -->
    <div class="payable-header">
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
                @change="qbc()"
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
            <el-select
              v-model="value1"
              size="small"
              clearable
              filterable
              @change="qbc()"
            >
              <el-option
                v-for="item in options1"
                :key="item.vendorId"
                :label="item.vendorName"
                :value="item.vendorId"
              >
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
              <el-option
                v-for="item in options2"
                :key="item.userId"
                :value="item.userId"
                :label="item.userName"
              >
              </el-option>
            </el-select>
            <!-- 采购人员 -->
            <span>采购人员:</span>
            <el-select
              v-model="value3"
              clearable
              size="small"
              filterable
              @change="qbc()"
            >
              <el-option
                v-for="item in options3"
                :key="item.userId"
                :value="item.userId"
                :label="item.userName"
              >
              </el-option>
            </el-select>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="payable-mian">
      <div style="padding: 10px 25px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="goadd()"
          v-has="{ action: 'payment:add' }"
          >新增付款</el-button
        >
      </div>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column label="操作" width="120" fixed>
          <template #default="scope">
            <el-button
              type="text"
              v-if="tableData[scope.$index].caseState == 0"
              @click="goreceipt(scope.$index)"
              v-has="{ action: 'payment:add' }"
            >
              付款
            </el-button>
            <el-button
              type="text"
              v-if="tableData[scope.$index].caseState == 1"
            >
              已完成付款
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryId" fixed label="单据编号" width="200">
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].deliveryId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="deliveryTime" label="入库日期" width="120" />
        <el-table-column prop="deliveryType" label="单据类型" width="120" />
        <el-table-column prop="vendor" label="供应商" width="200" />
        <el-table-column prop="buyer" label="采购人员" width="120" />
        <el-table-column prop="payables" label="应付金额" width="120" />
        <el-table-column prop="paid" label="已付金额" width="120" />
        <el-table-column prop="unpaid" label="未付金额" width="120" />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column
          prop="receiptRemark"
          label="最后付款备注"
          :show-overflow-tooltip="true"
          width="200"
        />
        <el-table-column
          prop="lastCollectionTime"
          label="最后付款时间"
          width="200"
        />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="payable-footer" v-show="paging">
      <el-pagination
        background
        layout="total,prev,pager,next,sizes"
        :total="max"
        :page-sizes="[5, 8, 10, 20]"
        :page-size="pagesize"
        style="margin-top: 50px"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        v-model:currentPage="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'payable',
  data() {
    return {
      //默认展开
      activeNames: '1',
      //筛选框
      billdate: '全部', //单据日期
      collection: '全部', //付款日期
      status: '全部', //结案状态
      customtime1: '', //自定义时间
      customtime2: '',
      options1: [],
      options2: [],
      options3: [],
      value1: '', //供应商
      value2: '', //创建人
      value3: '', //采购人员
      //表单数据
      tableData: [],
      //条件查询数据
      vagueorderid: '',
      condition: {
        deliveryId: '', //订单id
        deliveryTime: '', //单据日期
        otimeState: '',
        otimeEnd: '',
        lastCollectionTime: '', //收款日期
        dtimeState: '',
        dtimeEnd: '',
        caseState: '', //结案状态
        vendor: '', //供应商
        founder: '', //创建人
        buyer: '', //采购人
      },
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    }
  },
  computed: {
    paging: function () {
      return this.tableData.length > 0 ? true : false
    },
    custom1: function () {
      return this.billdate == '自定义' ? true : false
    },
    custom2: function () {
      return this.collection == '自定义' ? true : false
    },
    all: function () {
      var value1 = ''
      this.options1.forEach((item) => {
        if (item.vendorId == this.value1) {
          value1 = item.vendorName
        }
      })
      var value2 = ''
      this.options2.forEach((item) => {
        if (item.userId == this.value2) {
          value2 = item.userName
        }
      })
      var value3 = ''
      this.options3.forEach((item) => {
        if (item.userId == this.value3) {
          value3 = item.userName
        }
      })
      return [
        '单据日期: ' + this.billdate,
        '付款日期: ' + this.collection,
        '结案状态: ' + this.status,
        '供应商: ' + value1,
        '创建人: ' + value2,
        '采购人员: ' + value3,
      ]
    },
  },
  methods: {
    goorder(val) {
      sessionStorage.setItem('orderid', this.tableData[val].deliveryId)
      this.$router.push('/PurchaseReceipt')
    },
    goreceipt(val) {
      var receipt = {
        type: '应付付款',
        orderId: this.tableData[val].deliveryId,
      }
      sessionStorage.setItem('receipt', JSON.stringify(receipt))
      this.$router.push('/Addpayment')
    },
    goadd() {
      this.$router.push('/Addpayment')
    },
    //条件查询
    qbc() {
      this.condition.deliveryTime = this.billdate
      this.condition.lastCollectionTime = this.collection
      this.condition.caseState = this.status
      this.condition.vendor = this.value1
      this.condition.founder = this.value2
      this.condition.buyer = this.value3
      if (this.customtime1 != null) {
        this.condition.otimeState = this.customtime1[0]
        this.condition.otimeEnd = this.customtime1[1]
      } else {
        this.condition.otimeState = null
        this.condition.otimeEnd = null
      }
      if (this.customtime2 != null) {
        this.condition.dtimeState = this.customtime2[0]
        this.condition.dtimeEnd = this.customtime2[1]
      } else {
        this.condition.dtimeState = null
        this.condition.dtimeEnd = null
      }
      this.findpage()
    },
    findsaleman() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/personnel/ofpeople',
        method: 'get',
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.options1 = response.data.data.vendors
          _this.options2 = response.data.data.notifiers
          _this.options3 = response.data.data.purchasemans
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    findpage() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      var _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/capitalPayable/conditionpage',
        method: 'post',
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
          _this.tableData = response.data.data.rows
          _this.tableData.forEach((item) => {
            if (item.deliveryId.match(/^[a-z|A-Z]+/gi) == 'CGRKD') {
              item.deliveryType = '采购入库单'
            } else {
              item.deliveryType = '采购退货单'
            }
          })
          _this.max = response.data.data.total
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //改变页码大小
    handleSizeChange(val) {
      this.pagesize = val
      this.findpage()
    },
    //改变页码数
    handleCurrentChange(val) {
      this.findpage()
    },
  },
  created: function () {
    this.findpage()
    this.findsaleman()
  },
}
</script>

<style>
.payable {
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
.payable-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.payable .el-radio-group {
  margin: 10px 0px;
}
.payable-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.payable .el-tag {
  color: #409eff !important;
}
.payable .el-collapse,
.payable .el-collapse-item__wrap,
.payable .el-collapse-item__header,
.payable .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.payable .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.payable-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.payable th {
  color: white !important;
  background-color: #459df5 !important;
}
.payable .cell {
  text-align: center;
}
/* 内容表尾 */
.payable-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>