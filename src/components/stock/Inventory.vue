<template>
  <!-- 主内容 -->
  <div class="sale">
    <!-- 标题 -->
    <div class="sale-page-tag">
      <span style="float: left; margin-top: 10px">库存盘点</span>
      <div class="sale-shenpi">
        <!-- 提交 -->
        <el-button size="mini"
          >导出</el-button
        >
        <el-button
          size="mini"
          >删除</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="sale-header">
      <el-row :gutter="20">
        <el-col :span="4">单据编号：{{ formorder.id }}</el-col>
        <el-col :span="4">盘点时间：{{ formorder.inventoryTime }}</el-col>
        <el-col :span="4">盘点仓库：{{ formorder.depotName }}</el-col>
        <el-col :span="4">盘点产品量：{{ formorder.inventorycount }}</el-col>
        <el-col :span="4">已盘点产品量：{{ formorder.inventorycounter }}</el-col>
      </el-row>
    </div>
    <!-- 内容表体 -->
    <div class="sale-main">
      <!-- 产品信息table -->
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 产品详细信息 -->
        <el-table-column type="index" width="40" />
        <el-table-column prop="productName" label="产品名称" width="200" />
        <el-table-column prop="productId" label="产品编号" width="200" />
        <el-table-column prop="productSpe" label="产品规格" width="200" />
        <el-table-column prop="productType" label="产品分类" width="200" />
        <el-table-column prop="productUnit" label="产品单位" width="200" />
        <el-table-column prop="systemNum" label="系统数量" width="200" />
        <el-table-column prop="inventoryNum" label="盘点数量" width="200" />
        <el-table-column prop="unitPl" label="盘盈盘亏" width="200" />
        <el-table-column prop="remarks" label="备注" width="200" />
        </el-table
      ><span>
        <el-alert
          style="font-size: 35px"
          class="el-icon-s-finance"
          center
          :closable="false"
        >
          库存盘点总数量：{{ total }}
        </el-alert>
      </span>
      <span>
        <el-alert
          style="font-size: 35px"
          class="el-icon-s-finance"
          center
          :closable="false"
        >
          盘盈盘亏总和：{{ total }}
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
          <el-col :span="5">盘点人：{{ formorder.inventorypeople }}</el-col>
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
    inventorypl: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.unitPl;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
    total: function () {
      var allmoney = 0;
      this.productdata.forEach((money) => {
        allmoney += money.inventoryNum;
      });
      return Math.round(allmoney * 1000) / 1000;
    },
  },
  methods: {
    //收款
    goreceipt() {
      var receipt = {
        type: "订单收款",
        orderId: this.formorder.orderId,
      };
      sessionStorage.setItem("receipt", JSON.stringify(receipt));
      this.$router.push("/Addreceipt");
    },
    //审批
    approval(type) {
      if (type == 2) {
        var obj = { order: this.formorder, product: this.productdata };
        sessionStorage.setItem("saledeliver", JSON.stringify(obj));
        this.$router.push("/Adddeliver");
      } else {
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
              url: "http://localhost:8088/frameproject/saleorder/approval",
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
        this.$router.push("/Salelist");
      } else {
        this.axios({
          url: "http://localhost:8088/frameproject/stockInventory/find/" + orderid,
          method: "get",
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            _this.formorder = response.data.data.stockInventory;
            _this.productdata = response.data.data.list;
            console.log(response)
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
.sale .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
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
  background-color: #f7fbfe;
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
  font-size: 14px !important;
  color: black;
}
/* 内容表尾 */
.sale-footer {
  font-weight: bold;
  font-size: 14px;
  color: #666666;
  padding: 20px 15px;
  background-color: white;
}
</style>