<template>
  <!-- 主内容 -->
  <div class="addreturn">
    <!-- 标题 -->
    <div class="addreturn-page-tag">
      <span>新增销售退货单</span>
      <div class="addreturn-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="examine(-2)">保存草稿</el-button>
        <el-button type="primary" size="mini" @click="examine(0)"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="addreturn-header">
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
            v-model="formorder.returnId"
            readonly="readonly"
            placeholder="编号"
          ></el-input>
        </el-form-item>
        <!-- 退货日期 -->
        <el-form-item label="退货日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.returnTime"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 销售人员 -->
        <el-form-item label="销售人员:" class="form-input">
          <el-input
            v-model="formorder.salesmen"
            readonly
            placeholder="销售员"
          />
        </el-form-item>
        <!-- 客户 -->
        <el-form-item label="*客户:">
          <el-select
            v-model="formorder.customer"
            size="mini"
            filterable
            placeholder="请选择客户"
            @change="setcontacts()"
            :disabled="istf"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.customerNumber"
              :label="item.customerName"
              :value="item.customerNumber"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 关联出库单编号 -->
        <el-form-item label="*关联出库单编号:">
          <el-select
            v-model="formorder.deliveryId"
            size="mini"
            placeholder="请选择关联出库单编号"
            @change="setdeliveryId()"
            :disabled="istf"
          >
            <el-option
              v-for="item in customercanreturn"
              :key="item.deliveryId"
              :value="item.deliveryId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 内容表体 -->
    <div class="addreturn-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
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
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="120" />
        <el-table-column prop="remark" label="备注" width="120" />
        <el-table-column prop="productSpec" label="规格" width="120" />
        <el-table-column prop="productUnit" label="单位" width="120" />
        <el-table-column prop="returnNum" label="退货数量" width="120">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].returnNum"
              :controls="false"
              :min="1"
              :max="productdata[scope.$index].productNum"
            />
          </template>
        </el-table-column>
        <el-table-column prop="saleUnitPrice" label="销售单价" width="120" />
        <el-table-column prop="saleMoney" label="销售金额" width="120">
          <template #default="scope">
            {{ saleMoney(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column prop="depot" label="仓库" width="120" />
        <el-table-column prop="ingredient" label="成分" width="120" />
        <el-table-column prop="gramHeavy" label="克量" width="120" />
        <el-table-column
          prop="productDescribe"
          label="产品描述"
          :show-overflow-tooltip="true"
          width="120"
        />
      </el-table>
      <!-- 备注 -->
      <div class="addreturn-remarks">
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
    <div class="addreturn-footer">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
        <!-- 优惠率（%） -->
        <el-form-item label="优惠率（%）:">
          <el-input
            v-model="formorder.disrate"
            readonly="readonly"
            :precision="2"
          ></el-input>
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
          <el-input v-model="formorder.contacts" readonly="readonly"></el-input>
        </el-form-item>
        <!-- 联系人电话 -->
        <el-form-item label="联系人电话:" class="form-input">
          <el-input
            v-model="formorder.contactsPhone"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <!-- 客户地址 -->
        <el-form-item label="客户地址:" class="form-input">
          <el-input v-model="formorder.contactsAddress"></el-input>
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
    next()
  },
  name: 'Addsale',
  data() {
    return {
      // 表单头部下拉列表信息
      headeroptions1: [], //关联出库单
      headeroptions2: [], //客户
      customercanreturn: [], //客户可退货单
      //订单信息
      formorder: {
        //表头单据信息
        returnId: 'XSTHD' + Date.now(), //单据编号
        returnTime: new Date(), //退货时间
        deliveryId: '', //关联出库单编号
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
      istf:false,
      //表体销售商品信息
      productdata: [],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
    }
  },
  computed: {
    //单个商品销售总价
    saleMoney() {
      return function (id) {
        this.productdata[id].saleMoney =
          Math.round(
            this.productdata[id].saleUnitPrice *
              this.productdata[id].returnNum *
              1000
          ) / 1000
        return (
          Math.round(
            this.productdata[id].saleUnitPrice *
              this.productdata[id].returnNum *
              1000
          ) / 1000
        )
      }
    },
    //销售总金额
    total: function () {
      var allmoney = 0
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].saleUnitPrice * this.productdata[i].returnNum
      }
      this.formorder.receivables =
        -Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) *
            1000
        ) / 1000
      return (
        -Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) * 100
        ) / 100
      )
    },
    //销售优惠金额
    distotal: function () {
      var allmoney = 0
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].saleUnitPrice * this.productdata[i].returnNum
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
    //移除一行
    delrow(index, rows) {
      if (this.productdata.length > 1) {
        rows.splice(index, 1) //删掉该行
      }
    },
    setcontacts() {
      this.formorder.deliveryId = ''
      this.customercanreturn = []
      this.productdata = []
      var name = ''
      this.headeroptions2.forEach((item) => {
        if (item.customerNumber == this.formorder.customer) {
          name = item.customerName
          this.formorder.contacts = item.contact
          this.formorder.contactsPhone = item.contactNumber
          this.formorder.contactsAddress = item.contactAddress
        }
      })
      this.headeroptions1.forEach((item) => {
        if (name == item.customer) {
          this.customercanreturn.push(item)
        }
      })
    },
    //选择销售出库单
    setdeliveryId() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const _this = this
      this.axios({
        url:
          'http://localhost:8088/frameproject/saledelivery/find/' +
          this.formorder.deliveryId,
        method: 'get',
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if (sessionStorage.getItem('draft') != null) {
            for (
              var i = 0;
              i < response.data.data.deliverydetails.length;
              i++
            ) {
              _this.productdata[i].productNum =
                response.data.data.deliverydetails[i].productNum
            }
          } else {
            _this.productdata = response.data.data.deliverydetails
            _this.formorder.salesmen = response.data.data.delivery.salesmen
            _this.headeroptions2.forEach((item) => {
              if (item.customerName == response.data.data.delivery.customer) {
                _this.formorder.customer = item.customerNumber
                _this.formorder.contactsAddress = item.contactAddress
                _this.formorder.contactsPhone = item.contactNumber
                _this.formorder.contacts = item.contact
              }
            })
          }
          for (var i = 0; i < _this.productdata.length; i++) {
            _this.productdata[i].returnNum = _this.productdata[i].productNum
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //提交审批
    examine(type) {
      if (this.formorder.customer == '' || this.formorder.deliveryId == '') {
        this.$notify({
          title: '警告',
          message: '请先填写*必要信息!',
          type: 'warning',
        })
      } else {
        const state = JSON.parse(sessionStorage.getItem('state'))
        const _this = this
        this.formorder.returnTime = dayjs(this.formorder.orderTime).format(
          'YYYY-MM-DD HH:mm:ss'
        )
        this.formorder.founder = state.userInfo.userName
        this.axios({
          url: 'http://localhost:8088/frameproject/salereturn/add/' + type,
          method: 'post',
          data: {
            order: JSON.stringify(_this.formorder), //_this.formorder ,
            orderdetails: JSON.stringify(_this.productdata), //_this.productdata//
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            if (response.data.code == 200) {
              sessionStorage.setItem('orderid', response.data.data)
              _this.$router.push('/Return')
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    finddeliveryId() {
      const _this = this
      const state = JSON.parse(sessionStorage.getItem('state'))
      this.axios({
        url: 'http://localhost:8088/frameproject/saledelivery/findcanreturn',
        method: 'post',
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.headeroptions1 = response.data.data
          _this.customercanreturn = _this.headeroptions1
        })
        .catch(function (error) {
          console.log(error)
        })
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
          _this.headeroptions2 = response.data.data.customers
          _this.footeroptions = response.data.data.notifiers
          //判断是否来自草稿
          if (sessionStorage.getItem('draft') != null) {
            _this.istf=true
            _this.showorder()
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    //判断是否来自草稿
    showorder() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const orderid = sessionStorage.getItem('draft')
      const _this = this
      if (orderid == null) {
        this.$router.push('/Returnlist')
      } else {
        this.axios({
          url: 'http://localhost:8088/frameproject/salereturn/find/' + orderid,
          method: 'get',
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.salereturn
            _this.productdata = response.data.data.returndetails
            _this.headeroptions2.forEach((item) => {
              if (item.customerName == _this.formorder.customer) {
                _this.formorder.customer = item.customerNumber
              }
            })
            _this.setdeliveryId()
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
  },
  created: function () {
    this.findsaleman()
    this.finddeliveryId()
  },
}
</script>

<style lang="scss">
.addreturn {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.addreturn .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.addreturn-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.addreturn-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.addreturn-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addreturn .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.addreturn-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addreturn .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.addreturn-main .el-input__inner {
  border: 0;
}
.addreturn th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.addreturn-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.addreturn-main .el-input-number {
  width: 100% !important;
}
.addreturn .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
/* 内容表尾 */
.addreturn-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>