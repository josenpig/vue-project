<template>
  <!-- 主内容 -->
  <div class="deliverlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">销售出库单列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="deliverlist-header">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item name="1">
          <template #title>
            <span>筛选条件:</span>
            <el-tag :key="tag" v-for="tag in all" size="medium">
              {{ tag }}
            </el-tag>
          </template>
          <div>
            <!-- 出库日期 -->
            <div style="height: 50px">
              <span>出库日期:</span>
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
                style="top: -45px; left: 485px; position: relative"
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
            </div>
            <!-- 结案状态 -->
            <span>审批状态:</span>
            <el-radio-group v-model="status" size="small" @change="qbc()">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="废弃"></el-radio-button>
              <el-radio-button label="草稿"></el-radio-button>
              <el-radio-button label="待审批"></el-radio-button>
              <el-radio-button label="已驳回"></el-radio-button>
              <el-radio-button label="审批通过"></el-radio-button>
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
              <el-option
                v-for="item in options1"
                :key="item.customerNumber"
                :label="item.customerName"
                :value="item.customerNumber"
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
            <!-- 销售人员 -->
            <span>销售人员:</span>
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
    <div class="deliverlist-mian">
      <div style="padding: 10px 25px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="goadd()"
          >新增销售出库单</el-button
        >
        <!-- 模糊查询 -->
        <div style="float: right">
          <el-input
            clearable
            v-model="vagueorderid"
            placeholder="请输入订单编号"
            style="width: 200px"
            size="small"
          />
          <el-button icon="el-icon-search" size="small" @click="join()"
            >查询</el-button
          >
        </div>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        stripe
      >
        <el-table-column
          prop="deliveryId"
          label="销售出库单编号"
          fixed
          width="200"
        >
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].deliveryId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="deliveryTime"
          label="出库日期"
          fixed
          width="150"
        />
        <el-table-column prop="customer" label="客户" width="120" />
        <el-table-column prop="salesmen" label="销售人员" width="120" />
        <el-table-column
          prop="receivables"
          label="优惠后应收款(元)"
          width="150"
        />
        <el-table-column prop="deliveryState" label="出库状态" width="120">
          <template #default="scope">
            <span v-if="tableData[scope.$index].deliveryState == 0">
              未出库
            </span>
            <span v-else> 完全出库 </span>
          </template>
        </el-table-column>
        <el-table-column prop="contacts" label="联系人" width="120" />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column prop="foundTime" label="创建时间" width="200" />
        <el-table-column prop="approvalState" label="审批状态" width="120">
          <template #default="scope">
            <span v-if="tableData[scope.$index].approvalState == 0">
              待二级审批
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
        <el-table-column prop="updateTime" label="更新时间" width="200" />
        <el-table-column
          prop="lastApprovalTime"
          label="最后审批时间"
          width="200"
        />
        <el-table-column prop="approver" label="审批人" width="120" />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="deliverlist-footer" v-show="paging">
      <el-pagination
        background
        layout="total,prev,pager,next,sizes"
        :total="max"
        :page-sizes="[5,8,10,20]"
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
  name: 'Receivable',
  data() {
    return {
      //默认展开
      activeNames: '1',
      //筛选框
      billdate: '全部', //单据日期
      collection: '全部', //收款日期
      status: '全部', //结案状态
      customtime2: '', //自定义时间
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: '', //客户
      value2: '', //创建人
      value3: '', //销售人员
      //条件查询数据
      vagueorderid: '',
      condition: {
        orderId: '', //订单id
        deliveryTime: '', //交货日期
        dtimeState: '',
        dtimeEnd: '',
        approvalState: '', //审批状态
        customer: '', //客户
        founder: '', //创建人
        salesmen: '', //销售人
      },
      //表单数据
      tableData: [],
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
    custom2: function () {
      return this.collection == '自定义' ? true : false
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
        '出库日期: ' + this.collection,
        '审批状态: ' + this.status,
        '客户: ' + value1,
        '创建人: ' + value2,
        '销售人员: ' + value3,
      ]
    },
  },
  methods: {
    //新增订单
    goadd() {
      this.$router.push('/Addsale')
    },
    //分页查询
    findpage() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      var _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/saledelivery/conditionpage',
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
    goadd() {
      this.$router.push('/Adddeliver')
    },
    //条件查询
    qbc() {
      this.condition.deliveryTime = this.collection
      this.condition.approvalState = this.status
      this.condition.customer = this.value1
      this.condition.founder = this.value2
      this.condition.salesmen = this.value3
      if (this.customtime2 != null) {
        this.condition.dtimeState = this.customtime2[0]
        this.condition.dtimeEnd = this.customtime2[1]
      } else {
        this.condition.dtimeState = null
        this.condition.dtimeEnd = null
      }
      this.findpage()
    },
    //订单模糊查询
    join() {
      this.condition.orderId = this.vagueorderid
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
          _this.options1 = response.data.data.customers
          _this.options2 = response.data.data.notifiers
          _this.options3 = response.data.data.salemans
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    goorder(val) {
      sessionStorage.setItem('orderid', this.tableData[val].deliveryId)
      this.$router.push('/Deliver')
    },
  },
  created: function () {
    this.findsaleman()
    this.findpage()
  },
}
</script>

<style>
.deliverlist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.deliverlist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.deliverlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.deliverlist .el-radio-group {
  margin: 10px 0px;
}
.deliverlist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.deliverlist .el-tag {
  color: #409eff !important;
}
.deliverlist .el-collapse,
.deliverlist .el-collapse-item__wrap,
.deliverlist .el-collapse-item__header,
.deliverlist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.deliverlist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.deliverlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.deliverlist th {
  color: white !important;
  background-color: #459df5 !important;
}
.deliverlist .cell {
  text-align: center;
}
/* 内容表尾 */
.deliverlist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>