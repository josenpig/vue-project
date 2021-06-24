<template>
  <!-- 主内容 -->
  <div class="sale">
    <!-- 标题 -->
    <div class="sale-page-tag">
      <span style="float: left; margin-top: 10px">采购订单</span>
      <el-steps
        :active="formorder.vettingState+1+formorder.orderState"
        finish-status="success"
        simple
        style="width: 50%; float: left"
      >
        <el-step title="提交订单"></el-step>
        <el-step title="一级审批"></el-step>
        <el-step title="生成入库"></el-step>
      </el-steps>
      <div class="sale-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="dialogVisible = true"
          >查看关联单据</el-button
        >
        <el-button size="mini" v-if="formorder.vettingState == 1" @click="goreceipt()"
          >付款</el-button
        >
        <el-button
          size="mini"
          v-if="formorder.vettingState == 0"
          v-has="{ action: 'approval' }"
          @click="approval(-1)"
          >驳回</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.vettingState == -2"
          @click="approval(0)"
          >提交审批</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.vettingState == 0"
          v-has="{ action: 'approval' }"
          @click="approval(1)"
          >审批通过</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.vettingState == 1 && formorder.orderState == 0"
          @click="approval(2)"
          >生成入库单</el-button
        >
      </div>
    </div>
    <el-dialog
      title="关联单据"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="float: left">
        <span v-if="formorder.deliveryId == null">关联采购入库单：无</span>
        <span v-else>关联采购入库单：{{ formorder.receiptOrderId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.returnId == null">关联采购退货单：无</span>
        <span v-else>关联采购退货单：{{ formorder.exitOrderId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.receiptId == null">关联收款单：无</span>
        <span v-else>关联收款单：{{ formorder.paymentOrder }}</span>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 表单头部 -->
    <div class="sale-header">
      <el-row :gutter="20">
        <el-col :span="4"
          ><div>单据编号：{{ formorder.id }}</div></el-col
        >
        <el-col :span="4"
          ><div>单据日期：{{ formorder.documentsDate }}</div></el-col
        >
        <el-col :span="4"
          ><div>交货时间：{{ formorder.deliceryDate }}</div></el-col
        >
        <el-col :span="4"
          ><div>供应商：{{ formorder.vendorName }}</div></el-col
        >
        <el-col :span="4"
          ><div>采购员：{{ formorder.buyerName }}</div></el-col
        >
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="sale-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 产品详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="200" />
        <el-table-column prop="remark" label="备注" width="200" />
        <el-table-column prop="productUnit" label="单位" width="200" />
        <el-table-column prop="productNum" label="数量" width="230">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].productNum"
              :controls="false"
              :min="1"
              width="120"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="purchaseUnitPrice"
          label="采购单价(元)"
          width="200"
        />
        <el-table-column prop="purchaseMoney" label="采购金额(元)" width="200" />
        <el-table-column prop="depotName" label="仓库" width="200" />
        <el-table-column
          :show-overflow-tooltip="true"
          prop="productDescribe"
          label="产品描述"
          width="200"
        /> </el-table
      ><span>
        <el-alert
          style="font-size: 35px"
          class="el-icon-s-finance"
          center
          :closable="false"
        >
          采购订单总金额：{{ total }}元
        </el-alert>
      </span>
      <!-- 备注 -->

      <el-divider content-position="left">订单备注</el-divider>
      <div class="sale-remarks">
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
      <div class="sale-footer">
        <el-row :gutter="24">
          <el-col :span="8"
            ><div>优惠率(%)：{{ formorder.disrate }} %</div></el-col
          >
          <el-col :span="8"
            ><div>优惠金额(元)： {{ formorder.dismoney }}元</div></el-col
          >
          <el-col :span="8"
            ><div>应收款(元)： {{ formorder.offersPrice }}元</div></el-col
          >
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8"
            ><div>创建人：{{ formorder.createPeople }}</div></el-col
          >
          <el-col :span="8"
            ><div>创建时间：{{ formorder.createDate }}</div></el-col
          >
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
  name: "Purchase",
  data() {
    return {
      dialogVisible: false,
      //订单信息
      formorder: {},
      //表体销售商品信息
      productdata: [],
    };
  },
  computed: {
    //采购总金额
    total: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.purchaseMoney;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
  },
  methods: {
    //付款
    goreceipt() {
      var receipt = {
        type: "订单付款",
        orderId: this.formorder.id,
      };
      sessionStorage.setItem("receipt", JSON.stringify(receipt));
      this.$router.push("/Addpayment");
    },
    //审批
    approval(type) {
      if (type == 2) {
        var obj={order:this.formorder,product:this.productdata}
        sessionStorage.setItem("receipt",JSON.stringify(obj));
        this.$router.push("/AddPurchaseReceipt");
      } else {
        const state = JSON.parse(sessionStorage.getItem("state"));
        const orderid = sessionStorage.getItem("orderid");
        var _this = this;
        var fd = {
          id: orderid,
          type: type,
          user: state.userInfo.userName,
        };
        this.$prompt("请输入备注", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            this.axios({
              url: "http://localhost:8088/frameproject/purchaseOrder/approval",
              method: "get",
              processData: false,
              params: fd,
              headers: {
                JWTDemo: state.userInfo.token,
              },
            })
              .then(function (response) {
                if (response.data.code == 200) {
                  _this.$notify({
                    title: "操作成功",
                    message: "订单信息已被修改",
                    type: "success",
                  });
                  _this.showorder();
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
        this.$router.push("/AddPurchase");
      } else {
        this.axios({
          url: "http://localhost:8088/frameproject/purchaseOrder/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            console.log(response)
            _this.formorder = response.data.data.purchaseOrder;
            _this.productdata = response.data.data.list;
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
.sale {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.sale-page-tag {
  height: 40px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #323232;
  font-size: 18px;
  background: #e9eef3// #f5f7fa;
}
.sale-shenpi {
  float: right;
  line-height: 35px;
}
/* 内容表头 */
.sale-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
  font-size: 13px;
  font-weight: bold;
}
.sale .el-steps--simple {
  background: none !important;
}
/* 内容表体 */
.sale-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.sale .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.sale-main .el-input__inner {
  border: 0;
}

.sale th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.sale-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.sale-footer .el-col {
  margin-bottom: 20px !important;
}
.sale .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.sale .el-alert__description {
  font-size: 15px !important;
  color: black;
}
/* 内容表尾 */
.sale-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>