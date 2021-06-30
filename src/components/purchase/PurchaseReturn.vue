<template>
  <!-- 主内容 -->
  <div class="return">
    <!-- 标题 -->
    <div class="return-page-tag">
      <span style="float: left; margin-top: 10px">采购退货单</span>
      <el-steps simple
        :active="formorder.vettingState + 1"
        finish-status="success"
        simpble
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
      </div>
    </div>
    <el-dialog
      title="关联单据"
      v-model="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <div style="float: left">
        <span v-if="formorder.purchaseOrder == null">关联采购订单：无</span>
        <span v-else>
          <el-button type="text" @click="goorder(formorder.purchaseOrder, '采购单')">
          关联采购单：{{ formorder.purchaseOrder }}
          </el-button>
          </span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="formorder.receiptOrder == null">关联采购入库单：无</span>
        <span v-else>
          <el-button type="text" @click="goorder(formorder.receiptOrder, '采购入库单')">
          关联采购入库单:{{ formorder.receiptOrder }}
          </el-button>
          </span>
      </div>
      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="pamentBill == null">关联收款单：无</span>
        <span style="float: left">关联收款单：</span>
          <span v-if="pamentBill.length == 0">无</span>
          <span v-else style="float: left; width: 50%" >
            <el-button v-for="item in pamentBill"
            @click="goorder(item.paymentId, '收款单')"
              type="text"
              >{{ item.paymentId }}
              </el-button></span>
      </div>


      <div style="float: left; width: 100%; margin-top: 10px">
        <span v-if="ciaBills == null">关联核销单：无</span>
        <span style="float: left">关联核销单：</span>
          <span v-if="ciaBills.length == 0">无</span>
          <span v-else style="float: left; width: 50%" >
            <el-button v-for="item in ciaBills"
            @click="goorder(item.saleId, '核销单')"
              type="text"
              >{{ item.saleId }}
              </el-button></span>
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
        <el-col :span="5">采购退货单：{{ formorder.id }}</el-col>
        <el-col :span="5">退货日期：{{ formorder.exitDate }}</el-col>
        <el-col :span="5">客户：{{ formorder.vendorName }}</el-col>
        <el-col :span="5">销售人员：{{ formorder.buyerName }}</el-col>
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="return-main">
      <!-- 销售产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 产品详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="200" />
        <el-table-column prop="returnNum" label="退货数量" width="200" />
        <el-table-column
          prop="purchaseUnitPrice"
          label="销售单价(元)"
          width="120"
        />
        <el-table-column prop="purchaseMoney" label="退货金额(元)" width="200" />
        <el-table-column prop="depotName" label="仓库" width="200" />
        <el-table-column prop="ingredient" label="成分" width="200" />
        <el-table-column prop="gramHeavy" label="克量" width="200" />
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
          订单退货总金额：{{ total }}元
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
          <el-col :span="6">创建时间：{{ formorder.createDate }}</el-col>
        </el-row>
        <el-row
          :gutter="24"
          v-if="formorder.vettingState == 1 || formorder.vettingState == -1"
        >
          <el-col :span="5">审批人：{{ formorder.vettingName }}</el-col>
          <el-col :span="6"
            >审批时间：{{ formorder.lastVettingTime }}</el-col
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
    if (sessionStorage.getItem('orderid')!=null&&sessionStorage.getItem('orderid').match(/^[a-z|A-Z]+/gi) == 'CGTHD') {
      sessionStorage.removeItem('orderid')
    }
    next()
  },
  name: "Sale",
  data() {
    return {
      dialogVisible: false,
      //订单信息
      formorder: {},
      //表体销售商品信息
      productdata: [],
      pamentBill:[],
      ciaBills:[]
    };
  },
  computed: {
    //销售总金额
    total: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.purchaseMoney;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
  },
  methods: {
    goorder(val, type) {
      console.log(val,type)
      sessionStorage.setItem('orderid', val)
      if (type == '采购单') {
        this.$router.push('/Purchase')
      } else if (type == '采购入库单') {
        this.$router.push('/PurchaseReceipt')
      } else if(type=='核销单'){
        this.$router.push('/Writeoff')
      }
      else {
        this.$router.push('/Payment')
      }
    },
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
            id: orderid,
            type: type,
            user: state.userInfo.userName
          };
          this.axios({
            url: "http://localhost:8088/frameproject/purchaseReturn/approval",
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
          url: "http://localhost:8088/frameproject/purchaseReturn/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.returns;
            _this.productdata = response.data.data.returnsDetails;
            _this.pamentBill = response.data.data.payments;
            _this.ciaBills = response.data.data.ciaBills;
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