<template>
  <!-- 主内容 -->
  <div class="payment">
    <!-- 标题 -->
    <div class="payment-page-tag">
      <span style="float: left; margin-top: 10px">资金付款</span>
      <el-steps
        :active="formorder.approvalState + 1"
        finish-status="success"
        simple
        style="width: 50%; float: left"
      >
        <el-step title="提交订单"></el-step>
        <el-step title="审批通过"></el-step>
      </el-steps>
      <div class="payment-shenpi">
        <!-- 提交 -->
        <el-button
          size="mini"
          v-if="formorder.approvalState == 0"
          v-has="{ action: 'approval' }"
          @click="approval(-1)"
          >驳回</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.approvalState == -2"
          @click="approval(0)"
          >提交审批</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.approvalState == 0"
          v-has="{ action: 'approval' }"
          @click="approval(1)"
          >审批通过</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="payment-header">
      <el-row :gutter="24">
        <el-col :span="5">付款编号：{{ formorder.receiptId }}</el-col>
        <el-col :span="5">付款日期：{{ formorder.receiptTime }}</el-col>
        <el-col :span="4">供应商：{{ formorder.customer }}</el-col>
        <el-col :span="4">付款人：{{ formorder.payee }}</el-col>
        <el-col :span="4">付款类别：{{ formorder.incomeType }}</el-col>
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="payment-main">
      <!-- 单据列表 -->
      <el-divider content-position="left">单据列表</el-divider>
      <el-table :data="billdata" style="width: 100%" border stripe>
        <!-- 单据列表详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="saleId" label="单据编号" width="200" />
        <el-table-column prop="saleType" label="单据类型" />
        <el-table-column prop="saleTime" label="单据日期" />
        <el-table-column prop="receiptMoney" label="应付款金额" />
        <el-table-column prop="receivedMoney" label="已付金额" />
        <el-table-column prop="uncollectedMoney" label="未付金额" />
        <el-table-column prop="thisMoney" label="本次付款" />
      </el-table>
      <el-alert
        style="font-size: 25px"
        class="el-icon-s-finance"
        :closable="false"
      >
        单据付款总金额：{{ billtotal }}元
      </el-alert>
      <!-- 本次付款 -->
      <el-divider content-position="left">本次付款</el-divider>
      <el-table :data="accountdata" style="width: 100%" border stripe>
        <!-- 账户列表详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="fundAccount" label="资金账户" />
        <el-table-column prop="settlementType" label="账户类型" />
        <el-table-column prop="thisMoney" label="本次付款金额" />
      </el-table>
      <el-alert
        style="font-size: 25px"
        class="el-icon-s-finance"
        :closable="false"
      >
        账户付款总金额：{{ accounttotal }}元
      </el-alert>
      <!-- 备注 -->
      <el-divider content-position="left">订单备注</el-divider>
      <div class="payment-remarks">
        <el-input
          readonly="readonly"
          type="textarea"
          :rows="3"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
      <el-divider content-position="left">其他信息</el-divider>
      <!-- 表单表尾 -->
      <div class="payment-footer">
        <el-row :gutter="24">
          <el-col :span="24">本次预付金额：{{ formorder.ciaMoney }}</el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="5">创建人：{{ formorder.founder }}</el-col>
          <el-col :span="6">创建时间：{{ formorder.foundTime }}</el-col>
        </el-row>
        <el-row
          :gutter="24"
          v-if="formorder.approvalState == 1 || formorder.approvalState == -1"
        >
          <el-col :span="5">审批人：{{ formorder.approver }}</el-col>
          <el-col :span="6">审批时间：{{ formorder.lastApprovalTime }}</el-col>
          <el-col :span="6">审批备注：{{ formorder.approvalRemarks }}</el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import store from "../../store";
export default {
  beforeRouteLeave(to, form, next) {
    sessionStorage.removeItem("orderid");
    next();
  },
  name: "Sale",
  data() {
    return {
      dialogVisible: false,
      //单据信息
      formorder: {},
      //表体单据信息
      billdata: [],
      //表体本次付款信息
      accountdata: [],
    };
  },
  computed: {
    //单据总金额
    billtotal: function () {
      var allmoney = 0;
      this.billdata.forEach((money) => {
        allmoney += money.receiptMoney;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
    accounttotal: function () {
      var allmoney = 0;
      this.accountdata.forEach((money) => {
        allmoney += money.thisMoney;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
  },
  methods: {
    //审批
    approval(type) {
      var tfok = true;
      // this.billdata.forEach((item) => {
      //   if (item.uncollectedMoney == 0 && tfok == true) {
      //     var massage = "";
      //     item.saleType == "销售出库单"
      //       ? (massage = "订单：" + item.saleId + "已结案")
      //       : (massage = "订单：" + item.saleId + "预付款金额不足");
      //     this.$notify({
      //       title: "操作失败",
      //       message: massage,
      //       type: "warning",
      //     });
      //     tfok = false;
      //   }
      // });
      if (tfok == true) {
        const state = JSON.parse(sessionStorage.getItem("state"));
        const orderid = sessionStorage.getItem("orderid");
        var _this = this;
        this.$prompt("请输入备注", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            var fd = {
              orderid: orderid,
              type: type,
              user: state.userInfo.userName,
              approvalremarks: value,
            };
            this.axios({
              url: "http://localhost:8088/frameproject/capitalReceipt/approval",
              method: "get",
              params: fd,
              headers: {
                JWTDemo: state.userInfo.token,
              },
            })
              .then(function (response) {
                if (response.data.code == 200 && response.data.data == true) {
                  _this.$notify({
                    title: "操作成功",
                    message: "订单信息已被修改",
                    type: "success",
                  });
                  _this.showorder();
                }else{
                  _this.$notify({
                    title: "操作失败",
                    message:response.data.data,
                    type: "warning",
                  });
                }
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(() => {});
      }
    },
    showorder() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const orderid = sessionStorage.getItem("orderid");
      const _this = this;
      if (orderid == null) {
        this.$router.push("/Receiptlist");
      } else {
        this.axios({
          url:
            "http://localhost:8088/frameproject/capitalReceipt/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.payment;
            _this.billdata = response.data.data.bills;
            _this.accountdata = response.data.data.accounts;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },

  created: function () {
    this.showorder();
  },
};
</script>

<style lang="scss">
.payment {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.payment .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.payment-page-tag {
  height: 40px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #323232;
  font-size: 18px;
  background: #e9eef3// #f5f7fa;
}
.payment-shenpi {
  float: right;
  line-height: 35px;
}
/* 内容表头 */
.payment-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: #f7fbfe;
  font-size: 13px;
  font-weight: bold;
}
.payment .el-steps--simple {
  background: none !important;
}
/* 内容表体 */
.payment-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.payment .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.payment-main .el-input__inner {
  border: 0;
}
.payment th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.payment-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.payment-footer .el-col {
  margin-bottom: 20px !important;
}
.payment .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.payment .el-alert__description {
  font-size: 14px !important;
  color: black;
}
/* 内容表尾 */
.payment-footer {
  font-weight: bold;
  font-size: 14px;
  color: #666666;
  padding: 20px 15px;
  background-color: white;
}
</style>