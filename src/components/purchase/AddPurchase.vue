<template>
  <!-- 主内容 -->
  <div class="addsale">
    <!-- 标题 -->
    <div class="addsale-page-tag">
      <span>新增采购订单</span>
      <div class="addsale-shenpi">
        <!-- 提交 -->
        <el-button type="primary" size="mini" @click="examine(0)"
          >提交审批</el-button
        >
      </div>
    </div>
    <!-- 表单头部 -->
    <div class="addsale-header">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
      <el-row>
        <!-- 编号 -->
        <el-form-item label="编号:">
          <el-input
            v-model="formorder.id"
            readonly="readonly"
            placeholder="编号"
          ></el-input>
        </el-form-item>
        <!-- 单据日期 -->
        <el-form-item label="单据日期:" class="form-input">
          <el-date-picker
            type="date"
            v-model="formorder.documentsDate"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <!-- 入库日期 -->
        <el-form-item label="入库日期:" class="form-input">
          <el-date-picker
            v-model="formorder.deliceryDate"
            type="date"
            placeholder="选择日期"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        </el-row>
        <!-- 供应商 -->
        <el-form-item label="*供应商:">
          <el-select
            v-model="formorder.vendorName"
            size="mini"
            filterable
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in headeroptions1"
              :key="item.vendorName"
              :value="item.vendorId"
              :label="item.vendorName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 采购人员 -->
        <el-form-item label="*采购人员:" class="form-input">
          <el-select
            v-model="formorder.buyerName"
            size="mini"
            filterable
            placeholder="请选择采购员"
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


        <el-form-item label="*默认仓库:" class="form-input">
          <el-select
            v-model="depot"
            size="mini"
            filterable
            placeholder="请选择默认仓库"
          >
            <el-option
              v-for="item in depotlist"
              :key="item.depotName"
              :value="item.depotName"
              :label="item.depotName"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单表体 -->
    <!-- 查询库存表 -->
    <el-dialog title="选择库存产品" v-model="dialogTableVisible" width="65%">
      <!-- 分类 -->
      <div style="width: 20%; height: 500px; float: left">
        <el-tree
          :data="data"
          :props="defaultProps"
          accordion
          @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
      <!-- 。。。库存产品 -->
      <div
        style="width: 80%; height: 500px; margin-left: 20%; position: relative"
      >
        <div style="width: 100%; height: 50px">
          <el-button icon="el-icon-plus" type="primary" size="small"
            >新增产品</el-button
          >
          已选<span style="color: #409eff">{{ thisrow }}</span
          >个商品
          <!-- 模糊查询 -->
          <div style="float: right">
            <el-input
              v-model="findstock"
              placeholder="请输入产品名称"
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
          :row-class-name="tableRowClassName"
          max-height="350"
          border
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="productName" label="产品名称" width="200" />
          <el-table-column prop="productId" label="产品编号" width="120" />
          <el-table-column prop="product_type_name" label="产品类别" width="120" />
          <el-table-column prop="remark" label="备注" width="120" />
          <el-table-column prop="productUnit" label="单位" width="120" />
          <el-table-column prop="productNum" label="库存总量" width="120" />
          <el-table-column prop="expectNum" label="预计可用量" width="120" />
          <el-table-column prop="purchaseUnitPrice" label="采购单价" width="120" />
          <el-table-column
            prop="productDescribe"
            label="产品描述"
            width="150"
            :show-overflow-tooltip="true"
          />
        </el-table>
        <!-- 表尾分页显示 -->
        <div
          style="width:100%;height:50px;text-align:center;position:absolute;left;0;bottom:0;"
        >
          <el-pagination
            background
            layout="prev, pager, next"
            :total="max"
            :page-size="pagesize"
            style="float: left"
            @current-change="handleCurrentChange"
            v-model:currentPage="currentPage"
          >
          </el-pagination>
          <div style="float: right">
            <el-button type="primary" @click="addproduct()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <div class="addsale-main">
      <el-table :data="productdata" style="width: 100%" border stripe>
        <!-- 序列操作栏 -->
        <el-table-column type="index" width="40" fixed />
        <el-table-column label="操作" width="100" fixed>
          <template #default="scope">
            <el-tooltip content="新增" placement="top">
              <el-button
                size="mini"
                icon="el-icon-plus"
                @click="addrow(productdata)"
                type="primary"
                circle
              />
            </el-tooltip>
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
        <el-table-column prop="productName" label="产品名称" width="200">
          <template #default="scope">
            <el-input
              v-model="productdata[scope.$index].productName"
              style="width: 155px"
              readonly
            />
            <el-tooltip content="查看库存" placement="top">
              <el-button
                icon="el-icon-more"
                type="text"
                style="font-size: 20px"
                @click="dialogopen()"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="productId" label="产品编号" width="200" />
        <el-table-column prop="productUnit" label="单位" width="200" />
        <el-table-column prop="productNum" label="数量" width="200">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].productNum"
              :controls="false"
              :min="1"
            />
          </template>
        </el-table-column>
        <el-table-column prop="purchaseUnitPrice" label="采购单价" width="200">
          <template #default="scope">
            <el-input-number
              :disabled="true"
              v-model="productdata[scope.$index].purchaseUnitPrice"
              :controls="false"
              :precision="2"
              :min="0"
            />
          </template>
        </el-table-column>
        <el-table-column prop="purchaseMoney" label="采购金额" width="200">
          <template #default="scope">
            {{ saleMoney(scope.$index)}}
          </template>
        </el-table-column>
        <el-table-column prop="depot" label="仓库" width="200">
          <template #default="scope">
            <el-select
              v-model="productdata[scope.$index].depotName"
              size="mini"
              filterable
            >
              <el-option
                v-for="item in productdata[scope.$index].baseDepots"
                :key="item.depotName"
                :value="item.depotName"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="203">
          <template #default="scope">
            <el-input v-model="productdata[scope.$index].remark" />
          </template>
        </el-table-column>
        <el-table-column
          prop="productDescribe"
          label="产品描述"
          :show-overflow-tooltip="true"
          width="120"
        />
      </el-table>
      <!-- 备注 -->
      <div class="addsale-remarks">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请填写单据备注"
        >
        </el-input>
      </div>
    </div>
    <!-- 表单表尾 -->
    <div class="addsale-footer">
      <el-form
        :inline="true"
        size="mini"
        class="demo-form-inline"
        style="width: 75%; font-weight: bold"
        :model="formorder"
      >
        <!-- 优惠率（%） -->
        <el-form-item label="优惠率（%）:">
          <el-input-number
            v-model="formorder.disrate"
            :max="100"
            :precision="2"
            :controls="false"
            :min="0"
          ></el-input-number>
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
          :key="item.value"
          :label="item.label"
          :value="item.value"
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
  name: "AddPurchase",
  data() {
    return {
      //库存商品div
      dialogTableVisible: false,
      //库存产品--分类
      data: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      findstock: "", //库存产品名称查询
      stockdata: [], //库存产品--信息
      joinstockdata: [], //已选库存产品

      depot:"",//默认仓库
      depotlist:[],//仓库列表

      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      //订单信息
      formorder: {
        //表头单据信息
        id:"CGDD" + Date.now(), //单据编号
        deliceryDate:new Date(), //交货日期
        vendorName:"",//供应商用户名
        documentsDate:new Date(), //单据时间
        buyerName:"",//采购人员姓名
        disrate:0,//优惠率
        dismoney:0,//优惠金额
        offersPrice:0,//优惠后付款
        createPeople:""
      },

      //表体销售商品信息
      productdata: [
        {
         productId: "", //产品编号
          productName: "", //产品名称
          remark: "", //备注
          productUnit: "", //单位
          productNum: 0, //数量
          purchaseUnitPrice: 0, //采购单价
          purchaseMoney: 0, //采购金额
          depotName: "", //仓库
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
      depots: [],
    };
  },
  computed: {
    //已选产品
    thisrow: function () {
      return this.joinstockdata.length;
    },
    //单个商品采购总价
    saleMoney() {
      return function (id) {
        this.productdata[id].purchaseMoney =
          Math.round(this.productdata[id].purchaseUnitPrice * this.productdata[id].productNum*1000)/1000
        return (
          Math.round(this.productdata[id].purchaseUnitPrice * this.productdata[id].productNum*1000)/1000
        );
      };
    },
    //采购总金额
    total: function () {
      var allmoney = 0;
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].purchaseUnitPrice * this.productdata[i].productNum;
      }
      this.formorder.offersPrice =
        Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) *
            1000
        ) / 1000;
      return (
        Math.round(
          (allmoney - (parseInt(this.formorder.disrate) / 100) * allmoney) *
            1000
        ) / 1000
      );
    },
    //采购优惠金额
    distotal: function () {
      var allmoney = 0;
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].purchaseUnitPrice * this.productdata[i].productNum;
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
     tableRowClassName({row, rowIndex}) {
       console.log(row)
        console.log(rowIndex)
        if (rowIndex == 1) {
          return 'warning-row';
        } else if (rowIndex == 3) {
          return 'success-row';
        }
        return '';
      },
    handleCurrentChange(val) {
      this.dialogopen(val, this.pagesize);
    },
    handleSelectionChange(val) {
      this.joinstockdata = val;
    },
    //选择产品
    dialogopen() {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      var fd = {
        currentPage: this.currentPage,
        pageSize: this.pagesize,
      };
      this.axios({
        url: "http://localhost:8088/frameproject/baseProduct/allpurchaseproduct",
        method: "get",
        processData: false,
        params: fd,
        headers: {
          JWTDemo: state.userInfo.token,
        },
      })
        .then(function (response) {
          _this.stockdata = response.data.data.rows;
          _this.max = response.data.data.total;
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogTableVisible = true;
    },
    //添加采购产品
    addproduct() {
      var productlist=[]
      this.productdata.forEach(item=>{
        productlist.push(item.productId)
      })
      this.joinstockdata.forEach(item=>{
        if(productlist.indexOf(item.productId)==-1){
          item.productNum=1
          this.productdata.push(item)
        }
      })
      for (var i = this.productdata.length - 1; i >= 0; i--) {
        if (
          this.productdata[i].productId == "" &&
          this.productdata.length > 1
        ) {
          this.productdata.splice(i, 1);
        }
      }
      for(var i=this.productdata.length-1;i>=0;i--){
        this.productdata[i].depotName=this.depot;
      }
      this.dialogTableVisible = false;
    },
    //新增一行
    addrow(productdata, event) {
      productdata.push({
        productId: "", //产品编号
          productName: "", //产品名称
          remark: "", //备注
          productUnit: "", //单位
          productNum: 0, //数量
          purchaseUnitPrice: 0, //采购单价
          purchaseMoney: 0, //采购金额
          depotName: "", //仓库
      });
    },
    //移除一行
    delrow(index, rows) {
      if (this.productdata.length > 1) {
        rows.splice(index, 1); //删掉该行
      }
    },
    
    //提交审批（生成订单）
    examine(type) {
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      //判断库存是否足够
      var ifnum = true;
      this.productdata.forEach((item) => {
        if (
          this.formorder.vendorName == ""
        ) {
          this.$notify({
            title: "警告",
            message: "请选择供应商！！！",
            type: "warning",
            position: "top-left",
          });
          ifnum = false;
          return false;
        }
        if (
          this.formorder.buyerName == ""
        ) {
          this.$notify({
            title: "警告",
            message: "请选择采购员",
            type: "warning",
            position: "top-left",
          });
          ifnum = false;
          return false;
        }
        if(item.productId == ""){
          this.$notify({
            title: "警告",
            message: "产品ID错误，请重新删除产品或重新选择产品!",
            type: "warning",
            position: "top-left",
          });
          ifnum = false;
          return false;
        }
        if(item.depotName == null){
          this.$notify({
            title: "警告",
            message: "请选择产品采购时的公司仓库",
            type: "warning",
            position: "top-left",
          });
          ifnum = false;
          return false;
        }

      });
      if (ifnum != false) {
        this.formorder.deliceryDate = dayjs(this.formorder.deliceryDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.formorder.documentsDate = dayjs(this.formorder.documentsDate).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.formorder.createPeople = state.userInfo.userName;
        this.axios({
          url: "http://localhost:8088/frameproject/purchaseOrder/add/" + type,
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
            _this.$router.push("/Purchase");
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    infopfpeople(){
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
          _this.headeroptions1 = response.data.data.vendors;
          _this.headeroptions2 = response.data.data.purchasemans;
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    infodepot(){
      const state = JSON.parse(sessionStorage.getItem("state"));
      const _this = this;
      this.axios({
      url: "http://localhost:8088/frameproject/stockInventory/allDepot",
      method: "get",
      headers: {
        JWTDemo: state.userInfo.token,
      },
      })
      .then(function (response) {
          _this.depotlist = response.data.data.depots;
          _this.depot = _this.depotlist[_this.depotlist.length-1].depotName;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  created: function () {
    this.infopfpeople()
    this.infodepot()
  },
};
</script>

<style lang="scss">
.addsale {
  width: 100%;
  background-color: white;
}
/* 顶部 */
.addsale-page-tag {
  height: 40px;
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
.addsale-shenpi {
  float: right;
  line-height: 20px;
}
/* 内容表头 */
.addsale-header {
  padding: 25px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addsale .el-form--inline .el-form-item {
  margin-right: 20px !important;
}
/* 内容表体 */
.addsale-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.addsale .cell {
  text-align: center;
  color: black !important;
  font-size: 8px !important;
}
.addsale-main .el-input__inner {
  border: 0;
}
.addsale th {
  color: black !important;
  background-color: #e8e8e8 !important;
}
.addsale-remarks {
  margin-top: 15px;
  height: 100%;
  width: 100%;
}
.addsale .el-textarea .el-textarea__inner {
  resize: none;
  border: 0;
}
.addsale-main .el-input-number {
  width: 100% !important;
}
/* 内容表尾 */
.addsale-footer {
  padding: 20px 15px;
  background-color: white;
}
</style>