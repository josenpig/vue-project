<template>
  <!-- 主内容 -->
  <div class="receiptlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">收款资金管理</span>
      <!-- 标签页 -->
      <ul>
        <li><router-link to="Receivable">应收</router-link></li>
        <li>
          <router-link to="Receiptlist" class="active">收款单</router-link>
        </li>
      </ul>
    </div>
    <!-- 表单头部 筛选 -->
    <div class="receiptlist-header">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <span>筛选条件:</span>
            <el-tag :key="tag" v-for="tag in all" size="medium">
              {{ tag }}
            </el-tag>
          </template>
          <div>
            <!-- 收款日期 -->
            <span>收款日期:</span>
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
            <!-- 收款类型 -->
            <br />
            <span>收款类型:</span>
            <el-radio-group v-model="collection" size="small" @change="qbc()">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="应收收款"></el-radio-button>
              <el-radio-button label="订单收款"></el-radio-button>
            </el-radio-group>
            <br />
            <!-- 审批状态 -->
            <span>审批状态:</span>
            <el-radio-group v-model="status" size="small" @change="qbc()">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="草稿"></el-radio-button>
              <el-radio-button label="待审批"></el-radio-button>
              <el-radio-button label="已驳回"></el-radio-button>
              <el-radio-button label="审批通过"></el-radio-button>
            </el-radio-group>
            <!-- 客户 -->
            <br /><br />
            <span>客户:</span>
            <el-select v-model="value1" size="small" clearable filterable @change="qbc()">
              <el-option
                v-for="item in options1"
                :key="item.customerNumber"
                :label="item.customerName"
                :value="item.customerNumber"
              >
              </el-option>
            </el-select>
            <!-- 收款人 -->
            <span>收款人:</span>
            <el-select v-model="value2" size="small" clearable filterable @change="qbc()">
              <el-option
                v-for="item in options2"
                :key="item.userId"
                :value="item.userId"
                :label="item.userName"
              >
              </el-option>
            </el-select>
            <!-- 创建人 -->
            <span>创建人:</span>
            <el-select v-model="value3" size="small" clearable filterable @change="qbc()">
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
    <div class="receiptlist-mian">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          prop="receiptId"
          label="收款单据编号"
          fixed
          width="200"
        >
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].receiptId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="receiptTime"
          label="收款日期"
          sortable
          width="150"
        />
        <el-table-column
          prop="customer"
          label="客户名称"
          sortable
          width="150"
        />
        <el-table-column prop="payee" label="收款人" width="120" />
        <el-table-column prop="incomeType" label="收款类别" width="120" />
        <el-table-column prop="receiptMoney" label="收款金额(元)" width="150" />
        <el-table-column prop="ciaMoney" label="预收金额(元)" width="120" />
        <el-table-column prop="ciaBalance" label="预收余额(元)" width="120" />
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
    <div class="receiptlist-footer" v-show="paging">
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
  name: 'Receivable',
  data() {
    return {
      //默认展开
      activeNames: '1',
      //筛选框
      billdate: '全部', //收款日期
      collection: '全部', //收款日期
      status: '全部', //结案状态
      customtime1: '', //自定义时间
      customtime2: '',
      options1: [],
      options2: [],
      options3: [],
      value1: '', //客户
      value2: '', //收款人
      value3: '', //创建人
      //表单数据
      tableData: [],
      //条件查询数据
      condition: {
        deliveryId:'',
        deliveryTime: '',
        incomeType: '',
        customer: '',
        founder: '',
        payee: '',
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
    all: function () {
      var value1 = ''
      this.options1.forEach((item) => {
        if (item.customerNumber == this.value1) {
          value1 = item.customerName
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
        '收款日期: ' + this.billdate,
        '收款类型: ' + this.collection,
        '审批状态: ' + this.status,
        '客户: ' + value1,
        '收款人: ' +value2,
        '创建人: ' +value3,
      ]
    },
  },
  methods: {
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
          _this.options1 = response.data.data.customers
          _this.options2 = response.data.data.notifiers
          _this.options3 = response.data.data.salemans
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    findpage() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      var _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/capitalReceipt/conditionpage',
        method: 'post',
        processData: false,
        data: {
          currentPage: this.currentPage,
          pageSize: this.pagesize,
          condition: '',
        },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.tableData = response.data.data.rows
          _this.max = response.data.data.total
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //改变页码数
    handleCurrentChange(val) {
      this.findpage(val, this.pagesize)
    },
    goorder(val) {
      sessionStorage.setItem('orderid', this.tableData[val].receiptId)
      this.$router.push('/Receipt')
    },
    qbc() {
      this.condition.orderTime = this.billdate
      console.log(this.condition)
    },
  },
  created: function () {
    this.findpage()
    this.findsaleman()
  },
}
</script>

<style>
.receiptlist {
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
.receiptlist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.receiptlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.receiptlist .el-radio-group {
  margin: 10px 0px;
}
.receiptlist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.receiptlist .el-tag {
  color: #409eff !important;
}
.receiptlist .el-collapse,
.receiptlist .el-collapse-item__wrap,
.receiptlist .el-collapse-item__header,
.receiptlist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.receiptlist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.receiptlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.receiptlist th {
  color: white !important;
  background-color: #459df5 !important;
}
.receiptlist .cell {
  text-align: center;
}
/* 内容表尾 */
.receiptlist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>