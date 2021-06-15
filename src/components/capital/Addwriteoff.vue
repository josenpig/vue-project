<template>
  <!-- 主内容 -->
  <div class="addwriteoff">
    <!-- 标题 -->
    <div class="addwriteoff-page-tag">
      <span>新增核销单</span>
      <div class="addwriteoff-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="examine(-2)">保存草稿</el-button>
        <el-button type="primary" size="mini" @click="examine(0)"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="addwriteoff-header">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
        <!-- 编号 -->
        <el-form-item label="编号:">
          <el-input v-model="formorder.cavId" readonly="readonly"></el-input>
        </el-form-item>
        <!-- 核销方式 -->
        <el-form-item label="核销方式:">
          <el-select
            v-model="formorder.cavType"
            placeholder="请选择"
            @change="changetype(0)"
          >
            <el-option
              v-for="item in cavType"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 客户 -->
        <el-form-item label="*客户:" v-if="formorder.cavType == '预收冲应收'">
          <el-select
            v-model="formorder.otherParty"
            size="mini"
            filterable
            placeholder="请选择"
            @change="changetype(1)"
          >
            <el-option
              v-for="item in headeroptions1"
              :key="item.customerName"
              :value="item.customerName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 客户 -->
        <el-form-item label="*供应商:" v-if="formorder.cavType == '预付冲应付'">
          <el-select
            v-model="formorder.otherParty"
            size="mini"
            filterable
            placeholder="请选择"
            @change="changetype(1)"
          >
            <el-option
              v-for="item in headeroptions3"
              :key="item.vendorName"
              :value="item.vendorName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 单据日期 -->
        <el-form-item label="单据日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.orderTime"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 核销人 -->
        <el-form-item label="*核销人:" class="form-input">
          <el-select
            v-model="formorder.cavBy"
            size="mini"
            filterable
            placeholder="请选择核销人"
          >
            <el-option
              v-for="item in headeroptions2"
              :key="item.userName"
              :value="item.userName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 查询应收付单据表 -->
    <el-dialog title="选择单据" v-model="dialogbill" width="50%">
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
          :data="allbilldata"
          style="width: 100%"
          max-height="350"
          border
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="saleId" label="单据编号" width="200" />
          <el-table-column prop="saleType" label="单据类型" />
          <el-table-column prop="saleTime" label="单据日期" />
          <el-table-column prop="shouldMoney" :label="formorder.cavType == '预收冲应收' ?'应收金额':'应付金额'" />
          <el-table-column prop="alreadyMoney" :label="formorder.cavType == '预收冲应收' ?'已收金额':'已付金额'" />
          <el-table-column
            prop="notMoney"
            :label="formorder.cavType == '预收冲应收' ?'未收金额':'未付金额'"
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
            <el-button type="primary" @click="adddata()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 查询收付款单据列表 -->
    <el-dialog title="选择单据" v-model="dialogcap" width="50%">
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
          :data="allcapdata"
          style="width: 100%"
          max-height="350"
          border
        >
          <el-table-column type="selection" width="50" />
          <el-table-column prop="capitalId" label="流水号" width="200" />
          <el-table-column prop="capitalType" label="类型" />
          <el-table-column prop="capitalTime" label="流水日期" />
          <el-table-column prop="beforeMoney" :label="formorder.cavType == '预收冲应收' ?'预收金额':'预付金额'" />
          <el-table-column prop="writtenMoney" label="已核销金额" />
          <el-table-column
            prop="unwrittenMoney"
            label="未核销金额"
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
            <el-button type="primary" @click="adddata()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <el-divider content-position="left">{{
      formorder.cavType == "预收冲应收" ? "应收单据:" : "应付单据:"
    }}</el-divider>
    <div class="addwriteoff-main">
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
                @click="billopen()"
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
        <el-table-column
          prop="shouldMoney"
          :label="formorder.cavType == '预收冲应收' ? '应收金额' : '应付金额'"
        />
        <el-table-column
          prop="alreadyMoney"
          :label="formorder.cavType == '预收冲应收' ? '已收金额' : '已款金额'"
        />
        <el-table-column
          prop="notMoney"
          :label="formorder.cavType == '预收冲应收' ? '未收金额' : '未付金额'"
        />
        <el-table-column prop="thisMoney" label="本次核销金额">
          <template #default="scope">
            <el-input-number
              v-model="billdata[scope.$index].thisMoney"
              :controls="false"
              :min="0"
              :max="billdata[scope.$index].notMoney"
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
        单据总计核销金额：{{ billtotal }}元
      </el-alert>
      <!-- 备注 -->
      <div class="addwriteoff-remarks">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写单据备注"
          v-model="formorder.remarks"
        >
        </el-input>
      </div>
      <!-- 本次收款 -->
      <el-divider content-position="left">{{
        formorder.cavType == "预收冲应收" ? "预收款列表:" : "预付款列表:"
      }}</el-divider>
      <el-table :data="capdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="capopen()"
                type="primary"
                circle
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                size="mini"
                icon="el-icon-delete"
                @click="delrow1(scope.$index, capdata)"
                type="primary"
                circle
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 收付款详细信息 -->
        <el-table-column prop="capitalId" label="流水号" width="200" />
        <el-table-column prop="capitalType" label="类型" />
        <el-table-column prop="capitalTime" label="流水日期" />
        <el-table-column
          prop="beforeMoney"
          :label="formorder.cavType == '预收冲应收' ? '预收金额' : '预付金额'"
        />
        <el-table-column prop="writtenMoney" label="已核销金额" />
        <el-table-column prop="unwrittenMoney" label="未核销金额" />
        <el-table-column prop="thisMoney" label="本次核销金额">
          <template #default="scope">
            <el-input-number
              v-model="capdata[scope.$index].thisMoney"
              :controls="false"
              :min="0"
              :precision="2"
              :max="capdata[scope.$index].unwrittenMoney"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-alert
        style="font-size: 40px"
        class="el-icon-s-finance"
        :closable="false"
      >
        资金总计核销金额：{{ captotal }}元
      </el-alert>
    </div>
    <div class="addwriteoff-footer">
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
  name: "addwriteoff",
  data() {
    return {
      //订单div
      dialogbill: false,
      dialogcap: false,
      findstock: "", //查询
      allbilldata: [], //库存产品--信息
      joinallbilldata: [], //已选库存产品
      allcapdata:[],
      joinallcapdata:[],
      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      headeroptions3:[],
      //订单信息
      formorder: {
        //表头单据信息
        cavId: "HXD" + Date.now(), //单据编号
        orderTime: new Date(), //单据时间
        otherParty: "", //客户
        cavBy: "", //核销人
        cavType: "预收冲应收", //核销方式
        thisMoney: "", //本次核销余额
        founder: "", //订单创建人
        remarks: "", //订单备注
      },
      //表体单据信息
      billdata: [
        {
          saleId: "", //单据编号
          saleType: "", //单据类型
          saleTime: "", //单据日期
          shouldMoney: "", //应收付款金额
          alreadyMoney: "", //已收付金额
          notMoney: "", //未收付金额
          thisMoney: "0.00", //本次收付款金额
        },
      ],
      //表体本次收付款信息
      capdata: [
        {
          capitalId: "", //收付款单编号
          capitalType: "", //收付款类型
          capitalTime: "", //收付款日期
          beforeMoney: "", //预收付金额
          writtenMoney: "", //已核销金额
          unwrittenMoney: "", //未核销金额
          thisMoney: "0.00", //本次核销金额
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
      options: [], //资金账户
      type: "应收单据列表", //收款方式
      cavType: [{ value: "预收冲应收" }, { value: "预付冲应付" }],
      //条件查询订单
      condition: {
        otherParty: "",
        saleId: "",
      },
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
    };
  },
  computed: {
    //单据核销金额
    billtotal: function () {
      var allmoney = 0;
      this.billdata.forEach((item) => {
        allmoney += item.thisMoney;
      });
      return allmoney;
    },
    //资金核销金额
    captotal: function () {
      var allmoney = 0;
      this.capdata.forEach((item) => {
        allmoney += item.thisMoney;
      });
      this.formorder.thisMoney = allmoney;
      return allmoney;
    },
    //已选产品
    thisrow: function () {
      if(this.dialogbill==true){
      return this.joinallbilldata.length;
      }else{
        return this.joinallcapdata.length;
      }
    },
  },
  methods: {
    handleSelectionChange(val) {
      if(this.dialogbill==true){
      this.joinallbilldata = val;
      }else{
        this.joinallcapdata=val
      }
    },
    //改变收款方式
    changetype(type) {
      if(type==0){
        this.formorder.otherParty=''
        }
      this.billdata = [{saleId: "", thisMoney: 0.0 }];
      this.capdata = [{capitalId: "", thisMoney: 0.0 }];
    },
    findcap() {
      this.condition.otherParty = this.formorder.otherParty;
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      var url = "";
      this.formorder.cavType == "预收冲应收"
        ? (url =
            "http://localhost:8088/frameproject/capitalCavCia/receiptpage")
        : (url =
            "http://localhost:8088/frameproject/capitalCavCia/receiptpage");
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
          _this.allcapdata = response.data.data.rows;
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    findbill() {
      this.condition.otherParty = this.formorder.otherParty;
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      var url = "";
      this.formorder.cavType == "预收冲应收"
        ? (url =
            "http://localhost:8088/frameproject/capitalCavCia/receivablepage")
        : (url =
            "http://localhost:8088/frameproject/capitalCavCia/receivablepage");
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
            if (item.saleId.match(/^[a-z|A-Z]+/gi) == "XSCKD"){
              item.saleType = "销售出库单"
            }else{
              item.saleType = "销售退货单"
            }
          });
          _this.allbilldata = response.data.data.rows;
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    //选择应收付单
    billopen() {
      var message
      this.formorder.cavType=='预收冲应收'?message='请先选择一位客户':message='请先选择一位供应商'
      if (this.formorder.otherParty == "") {
        ElMessage.warning({
          message: message,
          type: "warning",
        });
      } else {
        this.findbill();
        this.dialogbill = true;
      }
    },
    //选择收付单
    capopen() {
      var message
      this.formorder.cavType=='预收冲应收'?message='请先选择一位客户':message='请先选择一位供应商'
      if (this.formorder.otherParty == "") {
        ElMessage.warning({
          message: message,
          type: "warning",
        });
      } else {
        this.findcap();
        this.dialogcap = true;
      }
    },
    //添加订单
    adddata() {
      if(this.dialogbill==true){
      var productlist = [];
      this.billdata.forEach((item) => {
        productlist.push(item.saleId);
      });
      this.joinallbilldata.forEach((item) => {
        if (productlist.indexOf(item.saleId) == -1) {
          item.thisMoney = item.notMoney;
          this.billdata.push(item);
        }
      });
      for (var i = this.billdata.length - 1; i >= 0; i--) {
        if (this.billdata[i].saleId == "" && this.billdata.length > 1) {
          this.billdata.splice(i, 1);
        }
      }
      this.dialogbill = false;
      }else{
        var productlist = [];
      this.capdata.forEach((item) => {
        productlist.push(item.capitalId);
      });
      this.joinallcapdata.forEach((item) => {
        if (productlist.indexOf(item.capitalId) == -1) {
          item.thisMoney = item.unwrittenMoney;
          this.capdata.push(item);
        }
      });
      for (var i = this.capdata.length - 1; i >= 0; i--) {
        if (this.capdata[i].capitalId == "" && this.capdata.length > 1) {
          this.capdata.splice(i, 1);
        }
      }
      this.dialogcap = false;
      }
    },
    //移除一行
    delrow(index, rows) {
      if (this.billdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    //移除一行
    delrow1(index, rows) {
      if (this.capdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    //提交审批（生成订单）
    examine(type) {
      var tfok = true;
      if (tfok == true) {
        
      }
      if (tfok == true) {
        const state = JSON.parse(sessionStorage.getItem("state"));
        const _this = this;
        this.formorder.saleTime = dayjs(this.formorder.saleTime).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.formorder.founder = state.userInfo.userName;
        this.formorder.ciaBalance = this.formorder.ciaMoney;
        this.axios({
          url:
            "http://localhost:8088/frameproject/capitalCavCia/add/" +
            type,
          method: "post",
          data: {
            order: JSON.stringify(_this.formorder),
            bill: JSON.stringify(_this.billdata),
            cap: JSON.stringify(_this.capdata),
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
          _this.headeroptions3 = response.data.data.vendors;
          _this.footeroptions = response.data.data.notifiers;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  created: function () {
    this.findsaleman();
  },
};
</script>

<style lang="scss">
.addwriteoff {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.addwriteoff .el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
.addwriteoff-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.addwriteoff-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.addwriteoff-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addwriteoff .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.addwriteoff-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addwriteoff .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.addwriteoff-main .el-input__inner {
  border: 0;
}
.addwriteoff th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.addwriteoff-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.addwriteoff .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.addwriteoff-main .el-input-number {
  width: 100% !important;
}
.addwriteoff .el-alert__description {
  font-size: 15px !important;
  color: black;
}
/* 内容表尾 */
.addwriteoff-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>