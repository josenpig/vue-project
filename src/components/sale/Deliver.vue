<template>
  <!-- 主内容 -->
  <div class="deliver">
    <!-- 标题 -->
    <div class="deliver-page-tag">
      <span style="float: left; margin-top: 10px">销售出库单</span>
      <el-steps
        :active="formorder.approvalState + 1"
        finish-status="success"
        simple
        style="width: 50%; float: left"
      >
        <el-step title="提交订单"></el-step>
        <el-step title="二级审批"></el-step>
        <el-step title="订单收款"></el-step>
      </el-steps>
      <div class="deliver-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="dialogVisible = true"
          >查看关联单据</el-button
        >
        <el-button
          size="mini"
          v-if="formorder.approvalState == 0"
          v-has="{ action: 'delivery:approval' }"
          @click="approval(-1)"
          >驳回</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-if="formorder.approvalState < 0"
          v-has="{ action: 'delivery:delete' }"
          @click="del()"
          >删除</el-button
        >
        <el-button
          type="danger"
          size="mini"
          v-if="formorder.approvalState == 1"
          v-has="{ action: 'delivery:approval' }"
          @click="cancel(-3)"
          >废弃</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.approvalState != 1 && formorder.orderId == null"
          v-has="{ action: 'delivery:add' }"
          @click="change"
          >编辑</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.approvalState == 0"
          v-has="{ action: 'delivery:approval' }"
          @click="approval(1)"
          >审批通过</el-button
        >
      </div>
    </div>
    <el-dialog
      title="关联单据"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div class="deliver-dialog">
        <div style="float: left">
          <span style="float: left">关联销售订单：</span>
          <span v-if="formorder.orderId == null">无</span>
          <span v-else style="float: left; width: 50%"
            ><el-button
              @click="goorder(formorder.orderId, '销售订单')"
              type="text"
              >{{ formorder.orderId }}</el-button
            ></span
          >
        </div>
        <div style="float: left; width: 100%; margin-top: 10px">
          <span style="float: left">关联销售退货单：</span>
          <span v-if="formorder.returnId == null">无</span>
          <span v-else style="float: left; width: 50%"
            ><el-button
              @click="goorder(formorder.returnId, '销售退货单')"
              type="text"
              >{{ formorder.returnId }}</el-button
            ></span
          >
        </div>
        <div style="float: left; width: 100%; margin-top: 10px">
          <span style="float: left">关联收款单：</span>
          <span v-if="formorder.receipts.length == 0">无</span>
          <span v-else style="float: left; width: 50%"
            ><el-button
              @click="goorder(item.receiptId, '收款单')"
              v-for="item in formorder.receipts"
              type="text"
              >{{ item.receiptId }}</el-button
            ></span
          >
        </div>
        <div style="float: left; width: 100%; margin-top: 10px">
          <span style="float: left">关联核销单：</span>
          <span v-if="formorder.cavcias.length == 0">无</span>
          <span v-else style="float: left; width: 50%"
            ><el-button
              @click="goorder(item.cavId, '核销单')"
              v-for="item in formorder.cavcias"
              type="text"
            >
              {{ item.cavId }}</el-button
            ></span
          >
        </div>
      </div>

      <template #footer>
        <el-button type="primary" @click="dialogVisible = false"
          >知道了</el-button
        >
      </template>
    </el-dialog>
    <!-- 表单头部 -->
    <div class="deliver-header">
      <el-row :gutter="20">
        <el-col :span="5">单据编号：{{ formorder.deliveryId }}</el-col>
        <el-col :span="5">交货时间：{{ formorder.deliveryTime }}</el-col>
        <el-col :span="5">客户：{{ formorder.customer }}</el-col>
        <el-col :span="5">销售人员：{{ formorder.salesmen }}</el-col>
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="deliver-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 产品详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="120" />
        <el-table-column
          prop="remark"
          label="备注"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="productSpec"
          label="规格"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="productUnit"
          label="单位"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column prop="productNum" label="数量" width="120" />
        <el-table-column
          prop="saleUnitPrice"
          label="销售单价(元)"
          width="120"
        />
        <el-table-column prop="saleMoney" label="销售金额(元)" width="120" />
        <el-table-column prop="depot" label="仓库" width="120" />
        <el-table-column
          prop="ingredient"
          label="成分"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="gramHeavy"
          label="克量"
          width="120"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="productDescribe"
          label="产品描述"
          width="150"
        /> </el-table
      ><span>
        <el-alert
          style="font-size: 35px"
          class="el-icon-s-finance"
          center
          :closable="false"
        >
          订单销售总金额：{{ total }}元
        </el-alert>
      </span>
      <!-- 备注 -->

      <el-divider content-position="left">订单备注</el-divider>
      <div class="deliver-remarks">
        <el-input
          readonly="readonly"
          type="textarea"
          :rows="5"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
      <el-divider content-position="left">其他信息</el-divider>
      <!-- 表单表尾 -->
      <div class="deliver-footer">
        <el-row :gutter="24">
          <el-col :span="5">优惠率(%)：{{ formorder.disrate }} %</el-col>
          <el-col :span="6">优惠金额(元)： {{ formorder.dismoney }}元</el-col>
          <el-col :span="6">应收款(元)： {{ formorder.receivables }}元</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="5">客户联系人：{{ formorder.contacts }}</el-col>
          <el-col :span="6"
            >客户联系人电话：{{ formorder.contactsPhone }}</el-col
          >
          <el-col :span="6">客户地址：{{ formorder.contactsAddress }}</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="5">创建人：{{ formorder.founder }}</el-col>
          <el-col :span="6">创建时间：{{ formorder.foundTime }}</el-col>
        </el-row>
        <el-row
          :gutter="24"
          v-if="formorder.approvalState == 1 || formorder.approvalState == -1"
        >
          <el-col :span="5">二级审批人：{{ formorder.approver }}</el-col>
          <el-col :span="6"
            >二级审批时间：{{ formorder.lastApprovalTime }}</el-col
          >
          <el-col :span="6"
            >二级审批备注：{{ formorder.approvalRemarks }}</el-col
          >
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import store from '../../store'
export default {
  beforeRouteLeave(to, form, next) {
    if (sessionStorage.getItem('orderid').match(/^[a-z|A-Z]+/gi) == 'XSCKD') {
      sessionStorage.removeItem('orderid')
    }
    next()
  },
  name: 'Sale',
  data() {
    return {
      dialogVisible: false,
      //订单信息
      formorder: {},
      //表体销售商品信息
      productdata: [],
    }
  },
  computed: {
    total: function () {
      var allmoney = 0
      this.productdata.forEach((money) => {
        allmoney += money.saleMoney
      })
      return Math.round(allmoney * 1000) / 1000
    },
  },
  methods: {
    goorder(val, type) {
      sessionStorage.setItem('orderid', val)
      if (type == '销售订单') {
        this.$router.push('/Sale')
      } else if (type == '销售退货单') {
        this.$router.push('Return')
      } else if (type == '收款单') {
        this.$router.push('Receipt')
      } else {
        this.$router.push('Writeoff')
      }
    },
    //删除
    del() {
      this.$confirm('此操作将永久删除该单据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          const state = JSON.parse(sessionStorage.getItem('state'))
          const _this = this
          this.axios({
            url:
              'http://localhost:8088/frameproject/saledelivery/detele/' +
              _this.formorder.deliveryId,
            method: 'post',
            headers: {
              JWTDemo: state.userInfo.token,
            },
          })
            .then(function (response) {
              if (response.data.data == true) {
                _this.$router.push('/Deliverlist')
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    //废弃
    cancel(type) {
      this.$confirm('确认废弃该单据？', '废弃', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //判断单据是否可作废
          if (this.formorder.receipts.length > 0) {
            this.$notify({
              title: '警告',
              message: '该单据已产生收款记录，无法废弃。',
              type: 'warning',
            })
          } else if (this.formorder.returnId != null) {
            this.$notify({
              title: '警告',
              message: '该单据已产生退货记录，无法废弃。',
              type: 'warning',
            })
          } else if (this.formorder.cavcias.length > 0) {
            this.$notify({
              title: '警告',
              message: '该单据已产生核销记录，无法废弃。',
              type: 'warning',
            })
          } else {
            const state = JSON.parse(sessionStorage.getItem('state'))
            const _this = this
            this.axios({
              url: 'http://localhost:8088/frameproject/saledelivery/update',
              method: 'post',
              params: {
                id: _this.formorder.deliveryId,
                type: type,
              },
              headers: {
                JWTDemo: state.userInfo.token,
              },
            })
              .then(function (response) {
                if (response.data.code == 200) {
                  _this.$notify({
                    title: '操作成功',
                    message: '订单信息已被修改',
                    type: 'success',
                  })
                  _this.showorder()
                }
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        })
        .catch(() => {})
    },
    //编辑
    change() {
      sessionStorage.setItem('draft', this.formorder.deliveryId)
      this.$router.push('/Adddeliver')
    },
    //提交审批
    approval(type) {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const orderid = sessionStorage.getItem('orderid')
      var _this = this
      var inputPattern
      var inputErrorMessage
      if (type == -1) {
        inputPattern = /\s\S+|S+\s|\S/
        inputErrorMessage = '驳回理由不能为空'
      }
      this.$prompt('请输入审批备注', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: inputPattern,
        inputErrorMessage: inputErrorMessage,
      })
        .then(({ value }) => {
          var fd = {
            orderid: orderid,
            type: type,
            user: state.userInfo.userName,
            approvalremarks: value,
          }
          this.axios({
            url: 'http://localhost:8088/frameproject/saledelivery/approval',
            method: 'get',
            processData: false,
            params: fd,
            headers: {
              JWTDemo: state.userInfo.token,
            },
          })
            .then(function (response) {
              if (response.data.code == 200) {
                _this.$notify({
                  title: '操作成功',
                  message: '订单信息已被修改',
                  type: 'success',
                })
                _this.showorder()
              }
            })
            .catch(function (error) {
              console.log(error)
            })
        })
        .catch(() => {})
    },
    showorder() {
      const state = JSON.parse(sessionStorage.getItem('state'))
      const orderid = sessionStorage.getItem('orderid')
      const _this = this
      if (orderid == null) {
        this.$router.push('/Deliverlist')
      } else {
        this.axios({
          url:
            'http://localhost:8088/frameproject/saledelivery/find/' + orderid,
          method: 'get',
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.delivery
            _this.productdata = response.data.data.deliverydetails
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
  },

  created: function () {
    this.showorder()
  },
}
</script>

<style lang="scss">
.deliver {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.deliver-dialog .el-button {
  min-height: unset !important;
  margin-left: unset !important;
  padding: 0px 0px 10px 0px !important ;
}
.deliver .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.deliver-page-tag {
  height: 40px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #323232;
  font-size: 18px;
  background: #e9eef3// #f5f7fa;
}
.deliver-shenpi {
  float: right;
  line-height: 35px;
}
/* 内容表头 */
.deliver-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: #f7fbfe;
  font-size: 13px;
  font-weight: bold;
}
.deliver .el-steps--simple {
  background: none !important;
}
/* 内容表体 */
.deliver-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.deliver .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.deliver-main .el-input__inner {
  border: 0;
}

.deliver th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.deliver-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.deliver-footer .el-col {
  margin-bottom: 20px !important;
}
.deliver .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.deliver .el-alert__description {
  font-size: 14px !important;
  color: black;
}
/* 内容表尾 */
.deliver-footer {
  font-weight: bold;
  font-size: 14px;
  color: #666666;
  padding: 20px 15px;
  background-color: white;
}
</style>