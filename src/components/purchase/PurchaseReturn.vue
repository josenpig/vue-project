<template>
  <!-- 主内容 -->
  <div class="return">
    <!-- 标题 -->
    <div class="return-page-tag">
      <span style="float: left; margin-top: 10px">采购退货单</span>
      <el-steps
        :active="formorder.approvalState + 1"
        finish-status="success"
        simple
        style="width: 50%; float: left"
      >
        <el-step title="提交订单"></el-step>
        <el-step title="一级审批"></el-step>
      </el-steps>
      <div class="return-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="dialogVisible = true"
          >查看关联单据</el-button
        >
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
    <el-dialog
      title="关联单据"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="float: left">
        <span v-if="formorder.deliveryId == null">关联销售订单：无</span>
        <span v-else>关联销售订单：{{ formorder.orderId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.returnId == null">关联销售出库单：无</span>
        <span v-else>关联销售出库单：{{ formorder.deliveryId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.receiptId == null">关联收款单：无</span>
        <span v-else>关联收款单：{{ formorder.receiptId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.cavId == null">关联核销单：无</span>
        <span v-else>关联核销单：{{ formorder.cavId }}</span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.billingId == null">关联销售开票：无</span>
        <span v-else>关联销售开票：{{ formorder.billingId }}</span>
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
    <div class="return-header">
      <el-row :gutter="20">
        <el-col :span="5">销售退货单：{{ formorder.returnId }}</el-col>
        <el-col :span="5">退货日期：{{ formorder.returnTime }}</el-col>
        <el-col :span="5">客户：{{ formorder.customer }}</el-col>
        <el-col :span="5">销售人员：{{ formorder.salesmen }}</el-col>
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="return-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 产品详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="120" />
        <el-table-column prop="remark" label="备注" width="120" />
        <el-table-column prop="productSpec" label="规格" width="120" />
        <el-table-column prop="productUnit" label="单位" width="120" />
        <el-table-column prop="returnNum" label="退货数量" width="120" />
        <el-table-column
          prop="saleUnitPrice"
          label="销售单价(元)"
          width="120"
        />
        <el-table-column prop="saleMoney" label="销售金额(元)" width="120" />
        <el-table-column prop="depot" label="仓库" width="120" />
        <el-table-column prop="ingredient" label="成分" width="120" />
        <el-table-column prop="gramHeavy" label="克量" width="120" />
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
      <div class="return-footer">
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
          <el-col :span="5">一级审批人：{{ formorder.approver }}</el-col>
          <el-col :span="6"
            >一级审批时间：{{ formorder.lastApprovalTime }}</el-col
          >
          <el-col :span="6"
            >一级审批备注：{{ formorder.approvalRemarks }}</el-col
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
  name: "Sale",
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
    //销售总金额
    total: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.saleMoney;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
  },
  methods: {
    //审批
    approval(type) {
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
            url: "http://localhost:8088/frameproject/salereturn/approval",
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
    },
    showorder() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const orderid = sessionStorage.getItem("orderid");
      const _this = this;
      if (orderid == null) {
        this.$router.push("/Returnlist");
      } else {
        this.axios({
          url: "http://localhost:8088/frameproject/salereturn/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.salereturn;
            _this.productdata = response.data.data.returndetails;
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
.return {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.return .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.return-page-tag {
  height: 40px;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #323232;
  font-size: 18px;
  background: #e9eef3// #f5f7fa;
}
.return-shenpi {
  float: right;
  line-height: 35px;
}
/* 内容表头 */
.return-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: #f7fbfe;
  font-size: 13px;
  font-weight: bold;
}
.return .el-steps--simple {
  background: none !important;
}
/* 内容表体 */
.return-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.return .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.return-main .el-input__inner {
  border: 0;
}

.return th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.return-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.return-footer .el-col {
  margin-bottom: 20px !important;
}
.return .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.return .el-alert__description {
  font-size: 14px !important;
  color: black;
}
/* 内容表尾 */
.return-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>