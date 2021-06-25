<template>
  <!-- 主内容 -->
  <div class="adddeliver">
    <!-- 标题 -->
    <div class="adddeliver-page-tag">
      <span>新增销售出库单</span>
      <div class="adddeliver-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="examine(-2)">保存草稿</el-button>
        <el-button type="primary" size="mini" @click="examine(0)"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="adddeliver-header">
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
            v-model="formorder.deliveryId"
            readonly
            placeholder="编号"
          ></el-input>
        </el-form-item>
        <!-- 出库日期 -->
        <el-form-item label="出库日期:" class="form-input">
          <el-date-picker
            v-model="formorder.deliveryTime"
            type="date"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 客户 -->
        <el-form-item label="*客户:">
          <el-select
            v-model="formorder.customer"
            size="mini"
            filterable
            placeholder="请选择客户"
            @change="setcontacts()"
            :disabled="issale"
          >
            <el-option
              v-for="item in headeroptions1"
              :key="item.customerNumber"
              :label="item.customerName"
              :value="item.customerNumber"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 销售人员 -->
        <el-form-item label="*销售人员:" class="form-input">
          <el-select
            v-model="formorder.salesmen"
            size="mini"
            filterable
            placeholder="请选择销售员"
            :disabled="issale"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.userId"
              :value="item.userId"
              :label="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 查询库存表 -->
    <el-dialog title="选择库存产品" v-model="dialogTableVisible" width="65%">
      <!-- 分类 -->
      <div style="width: 20%; height: 500px; float: left">
        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <!-- 。。。库存产品 -->
      <div
        style="width: 80%; height: 500px; margin-left: 20%; position: relative"
      >
        <div style="width: 100%; height: 50px">
          <el-button icon="el-icon-plus" type="primary" size="small"
            >新增产品</el-button
          >
          已选<span style="color: #409eff">{{ thisrow }}</span
          >个商品
          <!-- 模糊查询 -->
          <div style="float: right">
            <el-input
              v-model="findstock"
              placeholder="请输入产品名称"
              style="width: 250px"
              size="small"
            />
            <el-button icon="el-icon-search" size="small">查询</el-button>
          </div>
        </div>
        <el-table
          ref="multipleTable"
          @selection-change="handleSelectionChange"
          :data="stockdata"
          style="width: 100%"
          max-height="350"
          border
          ><el-table-column type="selection" width="55" />
          <el-table-column prop="productName" label="产品名称" width="200" />
          <el-table-column prop="productId" label="产品编号" width="120" />
          <el-table-column prop="productType" label="产品类别" width="120" />
          <el-table-column prop="remark" label="备注" width="120" />
          <el-table-column prop="productSpec" label="规格" width="120" />
          <el-table-column prop="productUnit" label="单位" width="120" />
          <el-table-column prop="productNum" label="库存总量" width="120" />
          <el-table-column prop="expectNum" label="预计可用量" width="120" />
          <el-table-column prop="saleUnitPrice" label="销售单价" width="120" />
          <el-table-column prop="ingredient" label="成分" width="120" />
          <el-table-column prop="gramHeavy" label="克量" width="120" />
          <el-table-column
            prop="productDescribe"
            label="产品描述"
            width="150"
            :show-overflow-tooltip="true"
          />
        </el-table>
        <!-- 表尾分页显示 -->
        <div
          style="width:100%;height:50px;text-align:center;position:absolute;left;0;bottom:0;"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :total="max"
            :page-size="pagesize"
            style="float: left"
            @current-change="handleCurrentChange"
            v-model:currentPage="currentPage"
          >
          </el-pagination>
          <div style="float: right">
            <el-button type="primary" @click="addproduct()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <div class="adddeliver-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed v-if="issale == false">
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addrow(productdata)"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow(scope.$index, productdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 产品详细信息 -->
        <el-table-column prop="productName" label="产品名称" width="200">
          <template #default="scope">
            <el-input
              v-model="productdata[scope.$index].productName"
              style="width: 155px"
              readonly
            />
            <el-tooltip
              content="查看库存"
              placement="top"
              v-if="issale == false"
            >
              <el-button
                icon="el-icon-more"
                type="text"
                style="font-size: 20px"
                @click="dialogopen()"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="产品编号" width="120" />
        <el-table-column prop="productSpec" label="规格" width="120" />
        <el-table-column prop="productUnit" label="单位" width="120" />
        <el-table-column prop="productNum" label="数量" width="120">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].productNum"
              :controls="false"
              :min="1"
              :disabled="issale"
            />
          </template>
        </el-table-column>
        <el-table-column prop="saleUnitPrice" label="销售单价" width="120">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].saleUnitPrice"
              :controls="false"
              :precision="2"
              :min="0"
              :disabled="issale"
            />
          </template>
        </el-table-column>
        <el-table-column prop="saleMoney" label="销售金额" width="120">
          <template #default="scope">
            {{ saleMoney(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column prop="depot" label="仓库" width="150">
          <template #default="scope">
            <el-select
              v-model="productdata[scope.$index].depot"
              size="mini"
              filterable
              :disabled="issale"
            >
              <el-option
                v-for="item in productdata[scope.$index].baseOpenings"
                :key="item.depotName"
                :value="item.depotName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ingredient" label="成分" width="120" />
        <el-table-column prop="gramHeavy" label="克量" width="120" />
        <el-table-column prop="remark" label="产品备注" width="120" />
        <el-table-column
          prop="productDescribe"
          label="产品描述"
          :show-overflow-tooltip="true"
          width="120"
        />
      </el-table>
      <!-- 备注 -->
      <div class="adddeliver-remarks">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写单据备注"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
    </div>
    <!-- 表单表尾 -->
    <div class="adddeliver-footer">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
        <!-- 优惠率（%） -->
        <el-form-item label="优惠率（%）:">
          <el-input-number
            v-model="formorder.disrate"
            :max="100"
            :precision="2"
            :controls="false"
            :min="0"
            :disabled="issale"
          ></el-input-number>
        </el-form-item>
        <!-- 优惠金额（元） -->
        <el-form-item label="优惠金额（元）:" class="form-input">
          <el-input
            v-model="distotal"
            readonly="readonly"
            :precision="2"
          ></el-input>
        </el-form-item>
        <!-- 优惠后应收款（元） -->
        <el-form-item label="优惠后应收款（元）:" class="form-input">
          <el-input
            :precision="2"
            v-model="total"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <!-- 客户联系人 -->
        <el-form-item label="客户联系人:">
          <el-input v-model="formorder.contacts" readonly="readonly" />
        </el-form-item>
        <!-- 联系人电话 -->
        <el-form-item label="联系人电话:" class="form-input">
          <el-input v-model="formorder.contactsPhone" readonly="readonly" />
        </el-form-item>
        <!-- 客户地址 -->
        <el-form-item label="客户地址:" class="form-input">
          <el-input v-model="formorder.contactsAddress" :readonly="issale" />
        </el-form-item>
      </el-form>
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
    sessionStorage.removeItem('draft')
    sessionStorage.removeItem('saledeliver')
    next()
  },
  name: 'Addsale',
  data() {
    return {
      //库存商品div
      dialogTableVisible: false,
      //库存产品--分类
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      findstock: '', //库存产品名称查询
      stockdata: [], //库存产品--信息
      joinstockdata: [], //已选库存产品
      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      //订单信息
      formorder: {
        //表头单据信息
        deliveryId: 'XSCKD' + Date.now(), //单据编号
        deliveryTime: new Date(), //交货时间
        customer: '', //客户
        salesmen: '', //销售人员
        remarks: '', // 订单备注
        //表尾买家信息
        disrate: 0, //优惠率
        dismoney: 0, //优惠金额
        receivables: 0, //应收款
        contacts: '', //客户联系人
        contactsPhone: '', //客户联系人电话
        contactsAddress: '', //客户地址
        //订单信息额外
        founder: '',
      },

      //表体销售商品信息
      productdata: [
        {
          productId: '', //产品编号
          productName: '', //产品名称
          remark: '', //备注
          productSpec: '', //规格
          productUnit: '', //单位
          productNum: '', //数量
          saleUnitPrice: '', //销售单价
          saleMoney: '', //销售金额
          depot: '', //仓库
          ingredient: '', //成分
          gramHeavy: '', //克量
          productDescribe: '', //产品描述
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
      //分页
      pagesize: 8,
      max: 0,
      currentPage: 1,
      //判断是否为销售订单生成出库
      issale: false,
    }
  },
  computed: {
    //已选产品
    thisrow: function () {
      return this.joinstockdata.length
    },
    //单个商品销售总价
    saleMoney() {
      return function (id) {
        this.productdata[id].saleMoney =
          this.productdata[id].saleUnitPrice * this.productdata[id].productNum
        return (
          this.productdata[id].saleUnitPrice * this.productdata[id].productNum
        )
      }
    },
    //销售总金额
    total: function () {
      var allmoney = 0
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].saleUnitPrice * this.productdata[i].productNum
      }
      this.formorder.receivables =
        Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) * 100
        ) / 100
      return (
        Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) *
            1000
        ) / 1000
      )
    },
    //销售优惠金额
    distotal: function () {
      var allmoney = 0
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].saleUnitPrice * this.productdata[i].productNum
      }
      this.formorder.dismoney =
        Math.round((parseInt(this.formorder.disrate) / 100) * allmoney * 100) /
        100
      return (
        Math.round((parseInt(this.formorder.disrate) / 100) * allmoney * 100) /
        100
      )
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.joinstockdata = val
    },
    //获取客户关联数据
    setcontacts() {
      this.headeroptions1.forEach((item) => {
        if (item.customerNumber == this.formorder.customer) {
          this.formorder.contacts = item.contact
          this.formorder.contactsPhone = item.contactNumber
          this.formorder.contactsAddress = item.contactAddress
          this.formorder.disrate = item.ratio
        }
      })
    },
    //选择产品
    dialogopen() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      var fd = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
      }
      this.axios({
        url: 'http://localhost:8088/frameproject/baseProduct/allsaleproduct',
        method: 'get',
        processData: false,
        params: fd,
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.stockdata = response.data.data.rows
          _this.max = response.data.data.total
        })
        .catch(function (error) {
          console.log(error)
        })
      this.dialogTableVisible = true
    },
    //改变页码数
    handleCurrentChange(val) {
      this.dialogopen(val, this.pagesize)
    },
    //确认添加产品
    addproduct() {
      var productlist = []
      this.productdata.forEach((item) => {
        productlist.push(item.productId)
      })
      this.joinstockdata.forEach((item) => {
        if (productlist.indexOf(item.productId) == -1) {
          item.productNum = 1
          this.productdata.push(item)
        }
      })
      for (var i = this.productdata.length - 1; i >= 0; i--) {
        if (
          this.productdata[i].productId == '' &&
          this.productdata.length > 1
        ) {
          this.productdata.splice(i, 1)
        }
      }
      this.dialogTableVisible = false
    },
    //新增一行
    addrow(productdata, event) {
      productdata.push({
        productId: '', //产品编号
        productName: '', //产品名称
        remark: '', //备注
        productSpec: '', //规格
        productUnit: '', //单位
        productNum: '', //数量
        saleUnitPrice: '', //销售单价
        saleMoney: '', //销售金额
        depot: '', //仓库
        ingredient: '', //成分
        gramHeavy: '', //克量
        productDescribe: '', //产品描述
      })
    },
    //移除一行
    delrow(index, rows) {
      if (this.productdata.length > 1) {
        rows.splice(index, 1) //删掉该行
      }
    },
    //提交审批
    examine(type) {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      var ifnum = true
      const sale = JSON.parse(sessionStorage.getItem('saledeliver')) //获取是否绑定销售订单
      //如果销售出库单不来自销售订单 则判断库存是否足够
      if (sale == null) {
        this.productdata.forEach((item) => {
          if (
            (ifnum == true && this.formorder.salesmen == '') ||
            item.productId == '' ||
            item.depot == null ||
            this.formorder.customer == ''
          ) {
            this.$notify({
              title: '警告',
              message: '请先填写*必要信息!',
              type: 'warning',
            })
            ifnum = false
            return false
          }
          item.baseOpenings.forEach((items) => {
            if (
              items.depotName == item.depot &&
              ifnum == true &&
              items.expectNumber < item.productNum
            ) {
              ElMessage.warning({
                message:
                  '警告,产品:' + item.productName + '的预计可用库存不足!',
                type: 'warning',
              })
              ifnum = false
            }
          })
        })
      }
      if (ifnum != false) {
        this.formorder.deliveryTime = dayjs(this.formorder.deliveryTime).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.formorder.founder = state.userInfo.userName
        this.axios({
          url: 'http://localhost:8088/frameproject/saledelivery/add/' + type,
          method: 'post',
          data: {
            delivery: JSON.stringify(_this.formorder), //_this.formorder ,
            deliverydetails: JSON.stringify(_this.productdata), //_this.productdata//
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            if (response.data.code == 200) {
              sessionStorage.setItem('orderid', response.data.data)
              _this.$router.push('/Deliver')
              sessionStorage.removeItem('saledeliver')
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    //查询人员
    findmen() {
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
          _this.headeroptions1 = response.data.data.customers
          _this.headeroptions2 = response.data.data.salemans
          _this.footeroptions = response.data.data.notifiers
          //判断是否来自订单
          const sale = JSON.parse(sessionStorage.getItem('saledeliver'))
          if (sale != null) {
            _this.issale = true
            _this.productdata = sale.product
            _this.formorder = sale.order
            _this.formorder.approver = null
            _this.formorder.receiptId = null
            _this.formorder.deliveryId = 'XSCKD' + Date.now()
            _this.headeroptions1.forEach((item) => {
              if (item.customerName == _this.formorder.customer) {
                _this.formorder.customer = item.customerNumber
              }
            })
            _this.headeroptions2.forEach((item) => {
              if (item.userName == _this.formorder.salesmen) {
                _this.formorder.salesmen = item.userId
              }
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //查询是否来自草稿单
    showorder() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const orderid = sessionStorage.getItem('draft')
      const _this = this
      this.axios({
        url: 'http://localhost:8088/frameproject/saledelivery/find/' + orderid,
        method: 'get',
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          var productlist = []
          response.data.data.deliverydetails.forEach((item) => {
            productlist.push(item.productId)
          })
          _this.productdata.splice(0, 1)
          response.data.data.saleProductVos.forEach((item) => {
            if (productlist.indexOf(item.productId) != -1) {
              _this.productdata.push(item)
            }
          })
          for (var i = 0; i < response.data.data.deliverydetails.length; i++) {
            for (var j = 0; j < _this.productdata.length; j++) {
              if (
                _this.productdata[j].productId ==
                response.data.data.deliverydetails[i].productId
              ) {
                _this.productdata[j].productNum =
                  response.data.data.deliverydetails[i].productNum
                _this.productdata[j].depot =
                  response.data.data.deliverydetails[i].depot
              }
            }
          }
          _this.formorder = response.data.data.delivery
          _this.headeroptions1.forEach((item) => {
            if (item.customerName == _this.formorder.customer) {
              _this.formorder.customer = item.customerNumber
            }
          })
          _this.headeroptions2.forEach((item) => {
            if (item.userName == _this.formorder.salesmen) {
              _this.formorder.salesmen = item.userId
            }
          })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
  },
  created: function () {
    this.findmen()
    if (sessionStorage.getItem('draft') != null) {
      this.showorder()
    }
  },
}
</script>

<style lang="scss">
.adddeliver {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.adddeliver .el-carousel__arrow--right,
.el-notification.right {
  background-color: #f2dede;
  border-color: #ebccd1;
  top: 110px !important;
}
.adddeliver-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.adddeliver-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.adddeliver-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.adddeliver .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.adddeliver-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.adddeliver .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.adddeliver-main .el-input__inner {
  border: 0;
}
.adddeliver th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.adddeliver-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.adddeliver .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.adddeliver-main .el-input-number {
  width: 100% !important;
}
/* 内容表尾 */
.adddeliver-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>