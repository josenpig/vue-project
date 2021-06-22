<template>
  <!-- 主内容 -->
  <div class="addreturn">
    <!-- 标题 -->
    <div class="addreturn-page-tag">
      <span>新增采购退货单</span>
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
            v-model="formorder.id"
            readonly="readonly"
            placeholder="编号"
          ></el-input>
        </el-form-item>
        <!-- 退货日期 -->
        <el-form-item label="退货日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.exitDate"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 采购人员 -->
        <el-form-item label="*采购人员:" class="form-input">
          <el-input
            v-model="formorder.buyerName"
            readonly
            placeholder="采购员"
          />
        </el-form-item>
        <!-- 客户 -->
        <el-form-item label="*供应商:">
          <el-select
            v-model="formorder.vendorName"
            size="mini"
            filterable
            placeholder="请选择供应商"
            @change="setcontacts()"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.vendorName"
              :value="item.vendorId"
              :label="item.vendorName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 关联出库单编号 -->
        <el-form-item label="*关联入库单编号:">
          <el-select
            v-model="formorder.receiptOrder"
            size="mini"
            placeholder="请选择关联入库单编号"
            @change="setdeliveryId()"
          >
            <el-option
              v-for="item in customercanreturn"
              :key="item.id"
              :value="item.id"
              :label="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 内容表体 -->
    <div class="addreturn-main">
      <!-- 采购产品信息table -->
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
        <el-table-column prop="productId" label="产品编号" width="200" />
        <el-table-column prop="productUnit" label="单位" width="200" />
        <el-table-column prop="returnNum" label="退货数量" width="200">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].returnNum"
              :controls="false"
              :min="1"
              :max="productdata[scope.$index].productNum"
            />
          </template>
        </el-table-column>
        <el-table-column prop="purchaseUnitPrice" label="采购单价" width="200" />
        <el-table-column prop="purchaseMoney" label="退货金额" width="200">
          <template #default="scope">
            {{ saleMoney(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column prop="depotName" label="仓库" width="200" />
        <el-table-column prop="gramHeavy" label="克重" width="200" />
        <el-table-column prop="productDescribe" label="产品描述" width="200" />

        <el-table-column
          prop="productDescribe"
          label="产品描述"
          :show-overflow-tooltip="true"
          width="200"
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
import { ElMessage } from "element-plus";
import store from "../../store";
export default {
  name: "Addsale",
  data() {
    return {
      // 表单头部下拉列表信息
      headeroptions1: [], //关联入库单
      headeroptions2: [], //供应商
      customercanreturn: [], //客户可退货单
      //订单信息
      formorder: {
        //表头单据信息
        id: "CGTHD" + Date.now(), //单据编号
        exitDate: new Date(), //退货时间
        receiptOrder: "", //关联入库单编号
        purchaseOrder:"",
        vendorName:"",
        buyerName:"",
        offersPrice:0,
        createDate:new Date(),
        disrate:0,
        dismoney:0
      },
      //表体销售商品信息
      productdata: [],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
    };
  },
  computed: {
    //单个商品销售总价
    saleMoney() {
      return function (id) {
        this.productdata[id].saleMoney =
          Math.round(
            this.productdata[id].purchaseUnitPrice *
              this.productdata[id].returnNum *
              1000
          ) / 1000;
        return (
          Math.round(
            this.productdata[id].purchaseUnitPrice *
              this.productdata[id].returnNum *
              1000
          ) / 1000
        );
      };
    },
    //销售总金额
    total: function () {
      var allmoney = 0;
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].purchaseUnitPrice * this.productdata[i].returnNum;
      }
      this.formorder.offersPrice =-
        Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) *
            1000
        ) / 1000;
      return (
        -Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) * 100
        ) / 100
      );
    },
    //销售优惠金额
    distotal: function () {
      var allmoney = 0;
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].purchaseUnitPrice * this.productdata[i].returnNum;
      }
      this.formorder.dismoney =
        Math.round((parseInt(this.formorder.disrate) / 100) * allmoney * 100) /
        100;
      return (
        Math.round((parseInt(this.formorder.disrate) / 100) * allmoney * 100) /
        100
      );
    },
  },
  methods: {
    //移除一行
    delrow(index, rows) {
      if (this.productdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    setcontacts() {
      this.formorder.receiptOrder = "";
      this.customercanreturn = [];
      this.productdata = [];
      console.log(this.headeroptions1)
      console.log(this.customercanreturn)
      this.headeroptions1.forEach((item) => {
        if (this.formorder.vendorName == item.vendorName) {
          this.customercanreturn.push(item);
        }
      });
    },
    //选择采购入库单
    setdeliveryId() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      this.axios({
        url:
          "http://localhost:8088/frameproject/purchaseReceipt/find/" +
          this.formorder.receiptOrder,
        method: "get",
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.productdata = response.data.data.receiptDetails;
          _this.formorder.vendorName=response.data.data.receipt.vendorName
          _this.formorder.buyerName=response.data.data.receipt.buyerName
          _this.formorder.receiptOrder=response.data.data.receipt.id
          _this.formorder.offersPrice=response.data.data.receipt.offersPrice        
          _this.formorder.disrate=response.data.data.receipt.disrate
          for(var i=0;i<_this.productdata.length;i++){
            _this.productdata[i].returnNum=0;
          }
       })
        .catch(function (error) {
          console.log(error);
        });
    },
    //提交审批
    examine(type) {
      if (this.formorder.customer == "" || this.formorder.deliveryId == "") {
        this.$notify({
          title: "警告",
          message: "请先填写*必要信息!",
          type: "warning",
        });
      } else {
        const state = JSON.parse(sessionStorage.getItem("state"));
        const _this = this;
        this.formorder.exitDate = dayjs(this.formorder.exitDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.formorder.founder = state.userInfo.userName;
        this.axios({
          url: "http://localhost:8088/frameproject/purchaseReturn/add/" + type,
          method: "post",
          data: {
            order: JSON.stringify(_this.formorder), //_this.formorder ,
            orderdetails: JSON.stringify(_this.productdata), //_this.productdata//
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
              sessionStorage.setItem("orderid", response.data.data);
              _this.$router.push("/PurchaseReturn");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    finddeliveryId() {
      const _this = this;
      const state = JSON.parse(sessionStorage.getItem("state"));
      this.axios({
        url: "http://localhost:8088/frameproject/purchaseReturn/findcanReturn",
        method: "post",
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.headeroptions1 = response.data.data;
          _this.customercanreturn = _this.headeroptions1;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findsaleman() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/personnel/ofpeople",
        method: "get",
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.headeroptions2 = response.data.data.vendors;
          _this.footeroptions = response.data.data.notifiers;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.finddeliveryId();
    this.findsaleman();
  },
};
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