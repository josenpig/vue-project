<template>
  <!-- 主内容 -->
  <div class="sale">
    <!-- 标题 -->
    <div class="sale-page-tag">
      <span style="float: left; margin-top: 10px">调拨单</span>
      <el-steps
        :active="formorder.state+1"
        finish-status="success"
        simple
        style="width: 50%; float: left"
      >
        <el-step title="提交订单"></el-step>
        <el-step title="一级审批"></el-step>
      </el-steps>
      <div class="sale-shenpi">
        <!-- 提交 -->
        <el-button
          size="mini"
          v-if="formorder.state == 0"
          v-has="{ action: 'approval' }"
          @click="approval(-1)"
          >驳回</el-button
        >
        <el-button
          type="primary"
          size="mini"
          v-if="formorder.state == 0"
          v-has="{ action: 'approval' }"
          @click="approval(1)"
          >审批通过</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="sale-header">
      <el-row :gutter="20">
        <el-col :span="4"
          ><div>单据编号：{{ formorder.id }}</div></el-col
        >
        <el-col :span="4"
          ><div>单据日期：{{ formorder.documentDate }}</div></el-col
        >
        <el-col :span="4"
          ><div>调拨日期：{{ formorder.transferDate }}</div></el-col
        >
        <el-col :span="4"
          ><div>入库仓库：{{ formorder.inwarehouse }}</div></el-col
        >
        <el-col :span="4"
          ><div>出库仓库：{{ formorder.outwarehouse }}</div></el-col
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
        <el-table-column prop="productUnit" label="单位" width="200" />
        <el-table-column prop="productNum" label="数量" width="200" />
        <el-table-column prop="remark" label="备注" width="200" />
        <el-table-column prop="gramHeavy" label="克重" width="200" />
        <el-table-column prop="ingredient" label="成分" width="200" />
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
          调拨单单总数量：{{ total }}
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
            ><div>创建人：{{ formorder.createPeople }}</div></el-col
          >
          <el-col :span="8"
            ><div>最后修改时间：{{ formorder.updateDate }}</div></el-col
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
    //调拨总数量
    total: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.productNum;
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
              url: "http://localhost:8088/frameproject/stockTransfer/approval",
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
        this.$router.push("/AddAllocate");
      } else {
        this.axios({
          url: "http://localhost:8088/frameproject/stockTransfer/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            console.log(response)
            _this.formorder = response.data.data.stockTransfer;
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