<template>
  <!-- 主内容 -->
  <div class="addpayment">
    <!-- 标题 -->
    <div class="addpayment-page-tag">
      <span>新增付款</span>
      <div class="addpayment-shenpi">
        <!-- 提交 -->
        <el-button
          size="mini"
          @click="examine(-2)"
          v-has="{ action: 'payment:add' }"
          >保存草稿</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="examine(0)"
          v-has="{ action: 'payment:add' }"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="addpayment-header">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
        <!-- 编号 -->
        <el-form-item label="编号:">
          <el-input
            v-model="formorder.paymentId"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <!-- 付款日期 -->
        <el-form-item label="付款日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.paymentTime"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 供应商 -->
        <el-form-item label="*供应商:">
          <el-select
            v-model="formorder.vendor"
            size="mini"
            filterable
            :disabled="tfhas"
            placeholder="请选择供应商"
            @change="changetype()"
          >
            <el-option
              v-for="item in headeroptions1"
              :key="item.vendorId"
              :label="item.vendorName"
              :value="item.vendorId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 付款人员 -->
        <el-form-item label="*付款人员:" class="form-input">
          <el-select
            v-model="formorder.drawee"
            size="mini"
            filterable
            placeholder="请选择付款人员"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.userName"
              :value="item.userId"
              :label="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 付款类别 -->
        <el-form-item label="付款类别:">
          <el-select
            v-model="formorder.paymentType"
            placeholder="请选择"
            :disabled="tfhas"
            @change="changetype()"
          >
            <el-option
              v-for="item in paymentType"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 查询单据表 -->
    <el-dialog title="选择单据" v-model="dialogTableVisible" width="50%">
      <div style="width: 100%; height: 500px; position: relative">
        <div style="width: 100%; height: 50px">
          已选<span style="color: #409eff">{{ thisrow }}</span
          >个单据
          <!-- 模糊查询 -->
          <div style="float: right">
            <el-input
              v-model="findstock"
              placeholder="请输入订单编号"
              style="width: 250px"
              size="small"
              clearable
            />
            <el-button icon="el-icon-search" size="small" @click="join()">查询</el-button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          :data="stockdata"
          style="width: 100%"
          max-height="350"
          border
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="purchaseId" label="单据编号" width="200" />
          <el-table-column prop="purchaseType" label="单据类型" />
          <el-table-column prop="purchaseTime" label="单据日期" />
          <el-table-column prop="payableMoney" label="应付金额" />
          <el-table-column prop="paidMoney" label="已付金额" />
          <el-table-column prop="unpaidMoney" label="未付金额" width="120" />
        </el-table>
        <!-- 表尾分页显示 -->
        <div
          style="width:100%;height:50px;text-align:center;position:absolute;left;0;bottom:0;"
        >
          <el-pagination
            style="float: left"
            background
            layout="prev, pager, next"
            :total="max"
          >
          </el-pagination>
          <div style="float: right">
            <el-button type="primary" @click="addproduct()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <el-divider content-position="left">{{
      formorder.paymentType == '应付付款' ? '应付单据列表:' : '采购订单列表:'
    }}</el-divider>
    <div class="addpayment-main">
      <!-- 采购产品信息table -->
      <el-table :data="billdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="dialogopen()"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow(scope.$index, billdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 单据详细信息 -->
        <el-table-column prop="purchaseId" label="单据编号" width="200" />
        <el-table-column prop="purchaseType" label="单据类型" />
        <el-table-column prop="purchaseTime" label="单据日期" />
        <el-table-column prop="payableMoney" label="应付款金额" />
        <el-table-column prop="paidMoney" label="已付金额" />
        <el-table-column prop="unpaidMoney" label="未付金额" />
        <el-table-column prop="thisMoney" label="本次付款">
          <template #default="scope">
            <el-input-number
              v-model="billdata[scope.$index].thisMoney"
              :controls="false"
              :precision="2"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        style="font-size: 40px"
        class="el-icon-s-finance"
        :closable="false"
      >
        单据总计付款：{{ billtotal }}元
      </el-alert>
      <!-- 备注 -->
      <div class="addpayment-remarks">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写单据备注"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
      <!-- 本次付款 -->
      <el-divider content-position="left">本次付款</el-divider>
      <el-table :data="accountdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addrow()"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow1(scope.$index, accountdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 账户详细信息 -->
        <el-table-column prop="fundAccount" label="*资金账户">
          <template #default="scope">
            <el-select
              style="width: 405px"
              v-model="accountdata[scope.$index].fundAccount"
              filterable
              placeholder="请选择资金账户"
              @change="settype(scope.$index)"
            >
              <el-option
                v-for="item in options"
                :key="item.fundAccount"
                :label="item.fundAccount"
                :value="item.capitalId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="账户类型" />
        <el-table-column prop="thisMoney" label="本次付款金额">
          <template #default="scope">
            <el-input-number
              v-model="accountdata[scope.$index].thisMoney"
              :controls="false"
              :precision="2"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        style="font-size: 40px"
        class="el-icon-s-finance"
        :closable="false"
      >
        账户总计付款：{{ accounttotal }}元
      </el-alert>
    </div>
    <div class="addpayment-footer">
      本次预付金额：<el-input v-model="piaMoney" readonly style="width: 15%" />
      <el-divider></el-divider>
      <p style="font-size: 14px">
        抄送对象
        <span style="color: #999999; margin-left: 10px"
          >单据最终审批通过后发送消息通知</span
        >
      </p>
      <el-select
        v-model="notice"
        multiple
        placeholder="请选择"
        style="width: 500px"
      >
        <el-option
          v-for="item in footeroptions"
          :key="item.userName"
          :value="item.userName"
        >
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import store from '../../store'
export default {
  beforeRouteLeave(to, form, next) {
    sessionStorage.removeItem('receipt')
    sessionStorage.removeItem('draft')
    next()
  },
  name: 'addpayment',
  data() {
    return {
      //订单div
      dialogTableVisible: false,
      findstock: '', //库存产品名称查询
      stockdata: [], //库存产品--信息
      joinstockdata: [], //已选库存产品
      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      //订单信息
      formorder: {
        //表头单据信息
        paymentId: 'FKD' + Date.now(), //单据编号
        paymentTime: new Date(), //单据时间
        vendor: '', //供应商
        drawee: '', //付款人员
        paymentType: '应付付款', //付款类别
        paymentMoney: '', //付款金额
        piaMoney: '', //预付金额
        piaBalance: '', //预付余额
        founder: '', //订单创建人
        remarks: '', //订单备注
      },
      //表体单据信息
      billdata: [
        {
          purchaseId: '', //单据编号
          purchaseType: '', //单据类型
          purchaseTime: '', //单据日期
          payableMoney: '', //应付款金额
          paidMoney: '', //已付金额
          unpaidMoney: '', //未付金额
          thisMoney: 0.0, //本次付款
        },
      ],
      //表体本次付款信息
      accountdata: [
        {
          fundAccount: '', //资金账户
          settlementTypeName: '', //账户付款类型
          settlementType: '', //账户付款类型
          thisMoney: 0.0, //本次付款
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
      options: [], //资金账户
      paymentType: [{ value: '应付付款' }, { value: '订单付款' }],
      tfhas: false,
      //条件查询订单
      condition: {
        vendor: '',
        purchaseId: '',
      },
      //分页
      pagesize: 8,
      max: 0,
      currentPage: 1,
    }
  },
  computed: {
    //单据付款
    billtotal: function () {
      var allmoney = 0
      this.billdata.forEach((item) => {
        allmoney += item.thisMoney
      })
      return allmoney
    },
    //账户付款
    accounttotal: function () {
      var allmoney = 0
      this.accountdata.forEach((item) => {
        allmoney += item.thisMoney
      })
      this.formorder.paymentMoney = allmoney
      return allmoney
    },
    //预付款
    piaMoney: function () {
      if (this.formorder.paymentType == '应付付款') {
        this.formorder.piaMoney = this.accounttotal - this.billtotal
        return this.accounttotal - this.billtotal
      } else {
        this.formorder.piaMoney = this.accounttotal
        return this.accounttotal
      }
    },
    //已选产品
    thisrow: function () {
      return this.joinstockdata.length
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.joinstockdata = val
    },
    //新增一行
    addrow() {
      this.accountdata.push({
        fundAccount: '',
        settlementTypeName: '',
        settlementType: '',
        thisMoney: 0.0,
      })
    },
    //改变付款方式
    changetype() {
      this.billdata = [
        {
          purchaseId: '', //单据编号
          thisMoney: '0.00', //本次付款
        },
      ]
    },
    //模糊查询单据
    join(){
      this.condition.purchaseId = this.findstock
      this.findbill();
    },
    //查询可付款单
    findbill() {
      this.condition.vendor = this.formorder.vendor
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      var url = ''
      this.formorder.paymentType == '应付付款'
        ? (url =
            'http://localhost:8088/frameproject/capitalPayable/findreceiptpage')
        : (url =
            'http://localhost:8088/frameproject/capitalPayable/findpurchasepage')
      this.axios({
        url: url,
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
          response.data.data.rows.forEach((item) => {
            if (item.purchaseId.match(/^[a-z|A-Z]+/gi) == 'CGRKD') {
              item.purchaseType = '采购入库单'
            } else if (item.purchaseId.match(/^[a-z|A-Z]+/gi) == 'CGTHD') {
              item.purchaseType = '采购退货单'
            } else {
              item.purchaseType = '采购订单'
            }
          })
          _this.stockdata = response.data.data.rows
          _this.max = response.data.data.total
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //选择订单
    dialogopen() {
      if (this.formorder.vendor == '') {
        ElMessage.warning({
          message: '请先选择一位供应商',
          type: 'warning',
        })
      } else {
        this.findbill()
        this.dialogTableVisible = true
      }
    },
    //添加订单
    addproduct() {
      var productlist = []
      this.billdata.forEach((item) => {
        productlist.push(item.purchaseId)
      })
      this.joinstockdata.forEach((item) => {
        if (productlist.indexOf(item.purchaseId) == -1) {
          item.thisMoney = item.unpaidMoney
          this.billdata.push(item)
        }
      })
      for (var i = this.billdata.length - 1; i >= 0; i--) {
        if (this.billdata[i].purchaseId == '' && this.billdata.length > 1) {
          this.billdata.splice(i, 1)
        }
      }
      this.dialogTableVisible = false
    },
    //移除一行
    delrow(index, rows) {
      if (this.billdata.length > 1) {
        rows.splice(index, 1) //删掉该行
      }
    },
    //移除一行
    delrow1(index, rows) {
      if (this.accountdata.length > 1) {
        rows.splice(index, 1) //删掉该行
      }
    },
    //修改付款账户
    settype(index) {
      this.options.forEach((item) => {
        if (item.capitalId == this.accountdata[index].fundAccount) {
          this.accountdata[index].settlementTypeName = item.settlementType
          this.accountdata[index].settlementType = item.settlementTypeId
        }
      })
    },
    //提交审批（生成订单）
    examine(type) {
      var tfok = true
      if (tfok == true) {
        this.accountdata.forEach((item) => {
          if (
            item.fundAccount == '' ||
            this.formorder.drawee == '' ||
            this.formorder.vendor == '' ||
            (this.billdata.length == 1 && this.billdata[0].purchaseId == '')
          ) {
            this.$notify({
              title: '警告',
              message: '请先填写*必要信息!',
              type: 'warning',
            })
            tfok = false
          }
        })
      }
      this.billdata.forEach((item) => {
        if (item.thisMoney > item.unpaidMoney && tfok == true) {
          this.$notify({
            title: '警告',
            message: '本次付款金额不能大于未付金额',
            type: 'warning',
          })
          tfok = false
        } else if (item.unpaidMoney == 0 && tfok == true) {
          this.$notify({
            title: '警告',
            message: '订单' + item.purchaseId + '的未付金额不足',
            type: 'warning',
          })
          tfok = false
        }
      })
      if (this.accounttotal < this.billtotal && tfok == true) {
        this.$notify({
          title: '警告',
          message: '账户总计付款不能小于单据总计付款',
          type: 'warning',
        })
        tfok = false
      }
      if (tfok == true) {
        const state = JSON.parse(sessionStorage.getItem('state'))
        const _this = this
        this.formorder.paymentTime = dayjs(this.formorder.paymentTime).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.formorder.founder = state.userInfo.userName
        this.formorder.piaBalance = this.formorder.piaMoney
        this.axios({
          url:
            'http://localhost:8088/frameproject/capitalPayment/addpayment/' +
            type,
          method: 'post',
          data: {
            payment: JSON.stringify(_this.formorder),
            bill: JSON.stringify(_this.billdata),
            account: JSON.stringify(_this.accountdata),
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            sessionStorage.setItem('orderid', response.data.data)
            _this.$router.push('/Payment')
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    //查询本次付款
    findcan() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const receipt = JSON.parse(sessionStorage.getItem('receipt'))
      const _this = this
      this.tfhas = true
      var url = ''
      this.formorder.paymentType = receipt.type
      receipt.type == '应付付款'
        ? (this.type = '应付单据列表:')
        : (this.type = '采购订单:')
      receipt.type == '应付付款'
        ? (url =
            'http://localhost:8088/frameproject/capitalPayable/receiptthisPayment')
        : (url =
            'http://localhost:8088/frameproject/capitalPayable/purchasethisPayment')
      this.axios({
        url: url,
        method: 'get',
        params: { purchaseId: receipt.orderId },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if (receipt.orderId.match(/^[a-z|A-Z]+/gi) == 'CGRKD') {
            response.data.data.purchaseType = '采购入库单'
          } else if (receipt.orderId.match(/^[a-z|A-Z]+/gi) == 'CGTHD') {
            response.data.data.purchaseType = '采购退货单'
          } else {
            response.data.data.purchaseType = '采购订单'
          }
          response.data.data.thisMoney = response.data.data.unpaidMoney
          _this.formorder.vendor = response.data.data.vendor
          _this.billdata.push(response.data.data)
          _this.billdata.splice(0, 1)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //显示单据----编辑单
    showorder() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const orderid = sessionStorage.getItem('draft')
      const _this = this
      this.axios({
        url:
          'http://localhost:8088/frameproject/capitalPayment/find/' + orderid,
        method: 'get',
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.formorder = response.data.data.payment
          _this.headeroptions1.forEach((item) => {
            if (item.vendorName == _this.formorder.vendor) {
              _this.formorder.vendor = item.vendorId
            }
          })
          _this.headeroptions2.forEach((item) => {
            if (item.userName == _this.formorder.drawee) {
              _this.formorder.drawee = item.userId
            }
          })
          _this.billdata = response.data.data.bills
          _this.accountdata = response.data.data.accounts
          for (var i = 0; i < _this.options.length; i++) {
            for (var j = 0; j < _this.accountdata.length; j++) {
              if (
                _this.accountdata[j].fundAccount == _this.options[i].fundAccount
              ) {
                _this.accountdata[j].fundAccount = _this.options[i].capitalId
                _this.accountdata[j].settlementTypeName =
                  _this.options[i].settlementType
              }
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //查询账户
    findoptions() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/capitalPayable/findaccount',
        method: 'get',
        processData: false,
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.options = response.data.data
          _this.options.forEach((item) => {
            if (item.state == 1) {
              console.log(item);
              _this.accountdata[0].fundAccount = item.capitalId
              _this.accountdata[0].settlementType = item.settlementTypeId
              _this.accountdata[0].settlementTypeName = item.settlementType
            }
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //查询人员
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
          _this.headeroptions1 = response.data.data.vendors
          _this.headeroptions2 = response.data.data.capitals
          //默认当前用户
          _this.headeroptions2.forEach((item) => {
            if (item.userName == state.userInfo.userName) {
              _this.formorder.drawee = item.userId
            }
          })
          _this.footeroptions = response.data.data.notifiers
          if (sessionStorage.getItem('draft') != null) {
            _this.showorder()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
  created: function () {
    this.findoptions()
    this.findsaleman()
    if (sessionStorage.getItem('receipt') != null) {
      this.findcan()
    }
  },
}
</script>

<style lang="scss">
.addpayment {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.addpayment .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.addpayment-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.addpayment-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.addpayment-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addpayment .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.addpayment-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addpayment .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.addpayment-main .el-input__inner {
  border: 0;
}
.addpayment th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.addpayment-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.addpayment .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.addpayment-main .el-input-number {
  width: 100% !important;
}
.addpayment .el-alert__description {
  font-size: 15px !important;
  color: black;
}
/* 内容表尾 */
.addpayment-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>