<template>
  <!-- 主内容 -->
  <div class="writeofflist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left">资金核销单列表</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="writeofflist-header">
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
            <div style="height: 50px">
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
                style="top: -45px; left: 485px; position: relative"
              >
                <el-date-picker
                  v-model="customtime1"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="qbc()"
                >
                </el-date-picker>
              </div>
            </div>
            <!-- 核算方式 -->
            <div style="height: 50px">
              <span>核算方式:</span>
              <el-radio-group v-model="collection" size="small" @change="qbc()">
                <el-radio-button label="预收冲应收"></el-radio-button>
                <el-radio-button label="预付冲应付"></el-radio-button>
              </el-radio-group>
            </div>
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
            <!-- 供应商 -->
            <span>供应商:</span>
            <el-select
              v-model="value2"
              size="small"
              clearable
              filterable
              @change="qbc()"
            >
              <el-option
                v-for="item in options2"
                :key="item.vendorId"
                :label="item.vendorName"
                :value="item.vendorId"
              >
              </el-option>
            </el-select>
            <!-- 创建人 -->
            <span>创建人:</span>
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
            <!-- 核销人 -->
            <span>核销人:</span>
            <el-select
              v-model="value4"
              clearable
              size="small"
              filterable
              @change="qbc()"
            >
              <el-option
                v-for="item in options4"
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
    <div class="writeofflist-mian">
      <div style="padding: 10px 25px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          size="small"
          @click="goadd()"
          >新增核销单</el-button
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
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column prop="cavId" label="核销单编号" fixed width="200">
          <template #default="scope">
            <el-button type="text" @click="goorder(scope.$index)">{{
              tableData[scope.$index].cavId
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="orderTime" label="单据日期" width="150" />
        <el-table-column prop="cavType" label="核销方式" width="120" />
        <el-table-column
          prop="otherParty"
          :label="collection == '预收冲应收' ? '客户' : '供应商'"
          width="200"
        />
        <el-table-column prop="cavBy" label="核销人" width="120" />
        <el-table-column
          prop="thisMoney"
          label="本次核销金额(元)"
          width="150"
        />
        <el-table-column prop="founder" label="创建人" width="120" />
        <el-table-column prop="foundTime" label="创建时间" width="200" />
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
        <el-table-column prop="approver" label="审批人" width="120" />
        <el-table-column
          prop="lastApprovalTime"
          label="最后审批时间"
          width="200"
        />
        <el-table-column prop="updateTime" label="最后更新时间" width="200" />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="writeofflist-footer" v-show="paging">
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
      billdate: '全部', //单据日期
      collection: '预收冲应收', //核算方式
      status: '全部', //结案状态
      customtime1: '', //自定义时间
      options1: [],
      options2: [],
      options3: [],
      options4: [],
      value1: '', //客户
      value2: '', //供应商
      value3: '', //创建人
      value4: '', //核销人
      //表单数据
      tableData: [],
      //条件查询数据
      vagueorderid: '',
      condition: {
        cavId: '', //订单id
        orderTime: '', //单据日期
        otimeState: '',
        otimeEnd: '',
        cavType: '预收冲应收', //核算方式
        approvalState: '', //审批状态
        customer: '', //客户
        vendor: '', //供应商
        founder: '', //创建人
        cavBy: '', //核销人
      },
      dialogTableVisible: false,
      pstatus: [],
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
        if (item.vendorId == this.value2) {
          value2 = item.vendorName
        }
      })
      var value3 = ''
      this.options3.forEach((item) => {
        if (item.userId == this.value3) {
          value3 = item.userName
        }
      })
      var value4 = ''
      this.options4.forEach((item) => {
        if (item.userId == this.value4) {
          value4 = item.userName
        }
      })
      return [
        '单据日期: ' + this.billdate,
        '核算方式:' + this.collection,
        '审批状态: ' + this.status,
        '客户: ' + value1,
        '供应商: ' + value2,
        '创建人: ' + value3,
        '核销人: ' + value4,
      ]
    },
  },
  methods: {
    //新增单据
    goadd() {
      this.$router.push('/Addwriteoff')
    },
    //条件分页查询
    findpage() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      var _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/capitalCavCia/conditionpage',
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
    //改变页码数
    handleCurrentChange(val) {
      this.findpage(val, this.pagesize)
    },
    //前往订单详情
    goorder(val) {
      var order = {
        cavId: this.tableData[val].cavId,
        cavType: this.tableData[val].cavType,
      }
      sessionStorage.setItem('orderid', JSON.stringify(order))
      this.$router.push('/Writeoff')
    },
    //条件查询
    qbc() {
      this.condition.orderTime = this.billdate
      this.condition.cavType = this.collection
      this.condition.approvalState = this.status
      this.condition.customer = this.value1
      this.condition.vendor = this.value2
      this.condition.founder = this.value3
      this.condition.cavBy = this.value4
      if (this.customtime1 != null) {
        this.condition.otimeState = this.customtime1[0]
        this.condition.otimeEnd = this.customtime1[1]
      } else {
        this.condition.otimeState = null
        this.condition.otimeEnd = null
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
          _this.options2 = response.data.data.vendors
          _this.options3 = response.data.data.notifiers
          _this.options4 = response.data.data.salemans
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
  created: function () {
    this.findpage()
    this.findsaleman()
  },
}
</script>

<style>
.writeofflist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.writeofflist .page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.writeofflist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.writeofflist .el-radio-group {
  margin: 10px 0px;
}
.writeofflist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.writeofflist .el-tag {
  color: #409eff !important;
}
.writeofflist .el-collapse,
.writeofflist .el-collapse-item__wrap,
.writeofflist .el-collapse-item__header,
.writeofflist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.writeofflist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.writeofflist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.writeofflist th {
  color: white !important;
  background-color: #459df5 !important;
}
.writeofflist-look th {
  color: #666666 !important;
  background-color: #e8e8e8 !important;
}
.writeofflist .cell {
  text-align: center;
}
/* 内容表尾 */
.writeofflist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
</style>