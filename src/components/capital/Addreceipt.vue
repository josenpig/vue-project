<template>
  <!-- 主内容 -->
  <div class="addreceipt">
    <!-- 标题 -->
    <div class="addreceipt-page-tag">
      <span>新增收款</span>
      <div class="addreceipt-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="examine(-2)">保存草稿</el-button>
        <el-button type="primary" size="mini" @click="examine(0)"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="addreceipt-header">
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
            v-model="formorder.receiptId"
            readonly="readonly"
          ></el-input>
        </el-form-item>
        <!-- 收款日期 -->
        <el-form-item label="收款日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.receiptTime"
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
            :disabled="tfhas"
            placeholder="请选择客户"
            @change="changetype()"
          >
            <el-option
              v-for="item in headeroptions1"
              :key="item.customerName"
              :value="item.customerName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 收款人员 -->
        <el-form-item label="*收款人员:" class="form-input">
          <el-select
            v-model="formorder.payee"
            size="mini"
            filterable
            placeholder="请选择收款人员"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.userName"
              :value="item.userId"
              :label="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 收款类别 -->
        <el-form-item label="收款类别:">
          <el-select
            v-model="formorder.incomeType"
            placeholder="请选择"
            :disabled="tfhas"
            @change="changetype()"
          >
            <el-option
              v-for="item in incomeType"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 查询单据表 -->
    <el-dialog title="选择单据" v-model="dialogTableVisible" width="50%">
      <div style="width: 100%; height: 500px; position: relative">
        <div style="width: 100%; height: 50px">
          已选<span style="color: #409eff">{{ thisrow }}</span
          >个单据
          <!-- 模糊查询 -->
          <div style="float: right">
            <el-input
              v-model="findstock"
              placeholder="请输入订单编号"
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
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="saleId" label="单据编号" width="200" />
          <el-table-column prop="saleType" label="单据类型" />
          <el-table-column prop="saleTime" label="单据日期" />
          <el-table-column prop="receiptMoney" label="应收金额" />
          <el-table-column prop="receivedMoney" label="已收金额" />
          <el-table-column
            prop="uncollectedMoney"
            label="未收金额"
            width="120"
          />
        </el-table>
        <!-- 表尾分页显示 -->
        <div
          style="width:100%;height:50px;text-align:center;position:absolute;left;0;bottom:0;"
        >
          <el-pagination
            style="float: left"
            background
            layout="prev, pager, next"
            :total="max"
          >
          </el-pagination>
          <div style="float: right">
            <el-button type="primary" @click="addproduct()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <el-divider content-position="left">{{
      formorder.incomeType == "应收收款" ? "应收单据列表:" : "销售订单列表:"
    }}</el-divider>
    <div class="addreceipt-main">
      <!-- 销售产品信息table -->
      <el-table :data="billdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="dialogopen()"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow(scope.$index, billdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 单据详细信息 -->
        <el-table-column prop="saleId" label="单据编号" width="200" />
        <el-table-column prop="saleType" label="单据类型" />
        <el-table-column prop="saleTime" label="单据日期" />
        <el-table-column prop="receiptMoney" label="应收款金额" />
        <el-table-column prop="receivedMoney" label="已收金额" />
        <el-table-column prop="uncollectedMoney" label="未收金额" />
        <el-table-column prop="thisMoney" label="本次收款">
          <template #default="scope">
            <el-input-number
              v-model="billdata[scope.$index].thisMoney"
              :controls="false"
              :max="billdata[scope.$index].uncollectedMoney"
              :precision="2"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        style="font-size: 40px"
        class="el-icon-s-finance"
        :closable="false"
      >
        单据总计收款：{{ billtotal }}元
      </el-alert>
      <!-- 备注 -->
      <div class="addreceipt-remarks">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写单据备注"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
      <!-- 本次收款 -->
      <el-divider content-position="left">本次收款</el-divider>
      <el-table :data="accountdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addrow()"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow1(scope.$index, accountdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 账户详细信息 -->
        <el-table-column prop="fundAccount" label="*资金账户">
          <template #default="scope">
            <el-select
              style="width: 405px"
              v-model="accountdata[scope.$index].fundAccount"
              filterable
              placeholder="请选择资金账户"
              @change="settype(scope.$index)"
            >
              <el-option
                v-for="item in options"
                :key="item.fundAccount"
                :label="item.fundAccount"
                :value="item.capitalId"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="settlementTypeName" label="账户类型" />
        <el-table-column prop="thisMoney" label="本次收款金额">
          <template #default="scope">
            <el-input-number
              v-model="accountdata[scope.$index].thisMoney"
              :controls="false"
              :precision="2"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        style="font-size: 40px"
        class="el-icon-s-finance"
        :closable="false"
      >
        账户总计收款：{{ accounttotal }}元
      </el-alert>
    </div>
    <div class="addreceipt-footer">
      本次预收金额：<el-input v-model="ciaMoney" readonly style="width: 15%" />
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
  beforeRouteLeave(to, form, next) {
    sessionStorage.removeItem("receipt");
    next();
  },
  name: "Addreceipt",
  data() {
    return {
      //订单div
      dialogTableVisible: false,
      findstock: "", //库存产品名称查询
      stockdata: [], //库存产品--信息
      joinstockdata: [], //已选库存产品
      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      //订单信息
      formorder: {
        //表头单据信息
        receiptId: "SKD" + Date.now(), //单据编号
        receiptTime: new Date(), //单据时间
        customer: "", //客户
        payee: "", //收款人员
        incomeType: "应收收款", //收款类别
        receiptMoney: "", //收款金额
        ciaMoney: "", //预收金额
        ciaBalance: "", //预收余额
        founder: "", //订单创建人
        remarks: "", //订单备注
      },
      //表体单据信息
      billdata: [
        {
          saleId: "", //单据编号
          saleType: "", //单据类型
          saleTime: "", //单据日期
          receiptMoney: "", //应收款金额
          receivedMoney: "", //已收金额
          uncollectedMoney: "", //未收金额
          thisMoney: 0.00, //本次收款
        },
      ],
      //表体本次收款信息
      accountdata: [
        {
          fundAccount: "", //资金账户
          settlementTypeName: "", //账户收款类型
          settlementType: "", //账户收款类型
          thisMoney: 0.00, //本次收款
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
      options: [], //资金账户
      incomeType: [{ value: "应收收款" }, { value: "订单收款" }],
      tfhas: false,
      //条件查询订单
      condition: {
        customer: "",
        saleId: "",
      },
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  computed: {
    //单据收款
    billtotal: function () {
      var allmoney = 0;
      this.billdata.forEach((item) => {
        allmoney += item.thisMoney;
      });
      return allmoney;
    },
    //账户收款
    accounttotal: function () {
      var allmoney = 0;
      this.accountdata.forEach((item) => {
        allmoney += item.thisMoney;
      });
      this.formorder.receiptMoney = allmoney;
      return allmoney;
    },
    //预收款
    ciaMoney: function () {
      if (this.formorder.incomeType == "应收收款") {
        this.formorder.ciaMoney = this.accounttotal - this.billtotal;
        return this.accounttotal - this.billtotal;
      } else {
        this.formorder.ciaMoney = this.accounttotal;
        return this.accounttotal;
      }
    },
    //已选产品
    thisrow: function () {
      return this.joinstockdata.length;
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.joinstockdata = val;
    },
    //新增一行
    addrow() {
      this.accountdata.push({
        fundAccount: "",
        settlementTypeName: "",
        settlementType: "",
        thisMoney:0.00,
      });
    },
    //改变收款方式
    changetype() {
      this.billdata = [
        {
          saleId: "", //单据编号
          thisMoney: "0.00", //本次收款
        },
      ];
    },
    findbill() {
      this.condition.customer = this.formorder.customer;
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      var url = "";
      this.formorder.incomeType == "应收收款"
        ? (url =
            "http://localhost:8088/frameproject/capitalReceivable/finddeliverypage")
        : (url =
            "http://localhost:8088/frameproject/capitalReceivable/findsalepage");
      this.axios({
        url: url,
        method: "post",
        data: {
          currentPage: _this.currentPage,
          pageSize: _this.pagesize,
          condition: JSON.stringify(_this.condition),
        },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          response.data.data.rows.forEach((item) => {
            if (item.saleId.match(/^[a-z|A-Z]+/gi) == "XSCKD") {
              item.saleType = "销售出库单";
            } else if (item.saleId.match(/^[a-z|A-Z]+/gi) == "XSTHD") {
              item.saleType = "销售退货单";
            } else {
              item.saleType = "销售订单";
            }
          });
          _this.stockdata = response.data.data.rows;
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //选择订单
    dialogopen() {
      if (this.formorder.customer == "") {
        ElMessage.warning({
          message: "请先选择一位客户",
          type: "warning",
        });
      } else {
        this.findbill();
        this.dialogTableVisible = true;
      }
    },
    //添加订单
    addproduct() {
      var productlist = [];
      this.billdata.forEach((item) => {
        productlist.push(item.saleId);
      });
      this.joinstockdata.forEach((item) => {
        if (productlist.indexOf(item.saleId) == -1) {
          item.thisMoney = item.uncollectedMoney;
          this.billdata.push(item);
        }
      });
      for (var i = this.billdata.length - 1; i >= 0; i--) {
        if (this.billdata[i].saleId == "" && this.billdata.length > 1) {
          this.billdata.splice(i, 1);
        }
      }
      this.dialogTableVisible = false;
    },
    //移除一行
    delrow(index, rows) {
      if (this.billdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    //移除一行
    delrow1(index, rows) {
      if (this.accountdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    settype(index) {
      this.options.forEach((item) => {
        if (item.capitalId == this.accountdata[index].fundAccount) {
          this.accountdata[index].settlementTypeName = item.settlementType;
          this.accountdata[index].settlementType = item.settlementTypeId;
        }
      });
    },
    //提交审批（生成订单）
    examine(type) {
      var tfok = true;
      if (tfok == true) {
        this.accountdata.forEach((item) => {
          if (
            item.fundAccount == "" ||
            this.formorder.payee == "" ||
            this.formorder.customer == "" ||
            (this.billdata.length == 1 && this.billdata[0].saleId == "")
          ) {
            this.$notify({
              title: "警告",
              message: "请先填写*必要信息!",
              type: "warning",
            });
            tfok = false;
          }
        });
      }
      this.billdata.forEach((item) => {
        if (item.thisMoney > item.uncollectedMoney && tfok == true) {
          this.$notify({
            title: "警告",
            message: "本次收款金额不能大于未收金额",
            type: "warning",
          });
          tfok = false;
        } else if (item.uncollectedMoney == 0 && tfok == true) {
          this.$notify({
            title: "警告",
            message: "订单" + item.saleId + "的未收金额不足",
            type: "warning",
          });
          tfok = false;
        }
      });
      if (this.accounttotal < this.billtotal && tfok == true) {
        this.$notify({
          title: "警告",
          message: "账户总计收款不能小于单据总计收款",
          type: "warning",
        });
        tfok = false;
      }
      if (tfok == true) {
        const state = JSON.parse(sessionStorage.getItem("state"));
        const _this = this;
        this.formorder.receiptTime = dayjs(this.formorder.receiptTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.formorder.founder = state.userInfo.userName;
        this.formorder.ciaBalance = this.formorder.ciaMoney;
        this.axios({
          url:
            "http://localhost:8088/frameproject/capitalReceipt/addreceipt/" +
            type,
          method: "post",
          data: {
            receipt: JSON.stringify(_this.formorder),
            bill: JSON.stringify(_this.billdata),
            account: JSON.stringify(_this.accountdata),
          },
          headers: {
            JWTDemo: state.userInfo.token,
          },
        })
          .then(function (response) {
            sessionStorage.setItem("orderid", response.data.data);
            _this.$router.push("/Receipt");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    findcan() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const receipt = JSON.parse(sessionStorage.getItem("receipt"));
      const _this = this;
      this.tfhas = true;
      var url = "";
      this.formorder.incomeType = receipt.type;
      receipt.type == "应收收款"
        ? (this.type = "应收单据列表:")
        : (this.type = "销售订单:");
      receipt.type == "应收收款"
        ? (url =
            "http://localhost:8088/frameproject/capitalReceivable/deliverythisReceipt")
        : (url =
            "http://localhost:8088/frameproject/capitalReceivable/salethisReceipt");
      this.axios({
        url: url,
        method: "get",
        params: { saleId: receipt.orderId },
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          if (receipt.orderId.match(/^[a-z|A-Z]+/gi) == "XSCKD") {
            response.data.data.saleType = "销售出库单";
          } else if (receipt.orderId.match(/^[a-z|A-Z]+/gi) == "XSTHD") {
            response.data.data.saleType = "销售退货单";
          } else {
            response.data.data.saleType = "销售订单";
          }
          response.data.data.thisMoney = response.data.data.uncollectedMoney;
          _this.formorder.customer = response.data.data.customer;
          _this.billdata.push(response.data.data);
          _this.billdata.splice(0, 1);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findoptions() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      this.axios({
        url: "http://localhost:8088/frameproject/capitalReceivable/findaccount",
        method: "get",
        processData: false,
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.options = response.data.data;
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
          _this.headeroptions1 = response.data.data.customers;
          _this.headeroptions2 = response.data.data.salemans;
          _this.footeroptions = response.data.data.notifiers;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    const receipt = JSON.parse(sessionStorage.getItem("receipt"));
    if (receipt != null) {
      this.findcan();
    }
    this.findoptions();
    this.findsaleman();
  },
};
</script>

<style lang="scss">
.addreceipt {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.addreceipt .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.addreceipt-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.addreceipt-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.addreceipt-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addreceipt .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.addreceipt-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addreceipt .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.addreceipt-main .el-input__inner {
  border: 0;
}
.addreceipt th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.addreceipt-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.addreceipt .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.addreceipt-main .el-input-number {
  width: 100% !important;
}
.addreceipt .el-alert__description {
  font-size: 15px !important;
  color: black;
}
/* 内容表尾 */
.addreceipt-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>