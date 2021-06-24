<template>
  <!-- 主内容 -->
  <div class="addsale">
    <!-- 标题 -->
    <div class="addsale-page-tag">
      <span>库存盘点</span>
      <div class="addsale-shenpi">
        <!-- 提交 -->
        <el-button size="mini" @click="examine(0)">临时保存</el-button>
        <el-button type="primary" size="mini" @click="examine(1)"
          >盘点完成</el-button
        >
      </div>
    </div>

    <!--选择仓库 -->
<el-dialog title="选择仓库" v-model="isdialog" width="300px" :show-close="false" :center="true">
    <el-select v-model="value" placeholder="请选择" :center="true">
    <el-option 
      v-for="item in depotlist"
      :key="item.depotId"
      :label="item.depotName"
      :value="item.depotId">
    </el-option>
  </el-select>
  <el-button @click="enterdepot" class="elbutton" type="success" icon="el-icon-check" circle></el-button>
  <el-button @click="exitdepot" class="elbutton" type="danger" icon="el-icon-close" circle></el-button>
</el-dialog>

    <!-- 表单头部 -->
    <div class="addsale-header">
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
        
        <!-- 盘点仓库 -->
        <el-form-item label="盘点仓库:">
          <el-input
            v-model="formorder.depotName"
            readonly="readonly"
            placeholder="盘点仓库"
          ></el-input>
        </el-form-item>

        <!-- 盘点产品量 -->
        <el-form-item label="盘点产品量:">
          <el-input
            v-model="formorder.inventorycount"
            readonly="readonly"
            placeholder="盘点产品量"
          ></el-input>
        </el-form-item>

        <!-- 盘点产品量 -->
        <el-form-item label="已盘点产品量:">
          <el-input
            v-model="calccounter"
            readonly="readonly"
            placeholder="已盘点产品量"
          ></el-input>
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
          max-height="350"
          border
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="productName" label="产品名称" width="200" />
          <el-table-column prop="productId" label="产品编号" width="120" />
          <el-table-column prop="productSpec" label="产品规格" width="120" />
          <el-table-column prop="productType" label="产品类型" width="120" />
          <el-table-column prop="productUnit" label="产品单位" width="120" />
          <el-table-column prop="systemNum" label="系统数量" width="120" />
          <el-table-column prop="productPurchaseUnit" label="采购单价" width="120" />
          <el-table-column prop="remark" label="remark" width="120" />
        </el-table>
        <!-- 表尾分页显示 -->
        <div
          style="width:100%;height:50px;text-align:center;position:absolute;left;0;bottom:0;"
        >
          <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 30, 100]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="max">
    </el-pagination>
          <div style="float: right">
            <el-button type="primary" @click="addproduct()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 内容表体 -->
    <div class="addsale-main">
      <!-- 销售产品信息table -->
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
        <el-table-column prop="productType" label="产品分类" width="200" />
        <el-table-column prop="productUnit" label="产品单位" width="200" />
        <el-table-column prop="inventoryNum" label="盘点数量" width="200">
          <template #default="scope">
            <el-input-number
              v-model="productdata[scope.$index].inventoryNum"
              :controls="false"
              placeholder=0
            />
          </template>
        </el-table-column>
        <el-table-column prop="systemNum" label="系统数量" width="200" />

        <el-table-column prop="inventoryPl" label="盘盈盘亏" width="200">
          <template #default="scope">
            {{ calcyk(scope.$index) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="250">
          <template #default="scope">
            <el-input v-model="productdata[scope.$index].remark" />
          </template>
        </el-table-column>
      </el-table>
      <!-- 备注 -->
      <div class="addsale-remarks">
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
    <div class="addsale-footer">

    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import store from "../../store";
export default {
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

      // 表单头部下拉列表信息
      headeroptions1: [],
      headeroptions2: [],
      //表体销售商品信息
      productdata: [
        {
          productName: "", //
          productId: "", //
          productSpe: "", //
          productType: "", //
          productUnit: "", //
          systemNum: 0, //
          inventoryNum: 0, //
          inventoryPl: "", //
          productPurchaseUnit:0,
          remark:0
        },
      ],
      //抄送对象信息
      footeroptions: [],
      notice: [], //抄送对象


      isdialog:false,
      value:"请选择",
      depotlist:[],
      formorder: {
        id: "KCPD" + Date.now(), //单据编号
        inventoryTime:new Date(),
        depotId:"",
        depotName:"",
        inventorycount:0,
        inventorycounter:0,
        inventorypeople:"",
        inventorypl:0,
        remarks:""
      },
      //分页
      pagesize: 5,
      max: 0,
      currentPage: 1,
      depot: {},
      depots:[]




    }
  },computed: {
    //弹出框已选产品数量计算
    thisrow: function () {
      return this.joinstockdata.length;
    },
    //计算所选产品的数量
    computedcount:function(){
      return this.productdata.length;
    },
    //计算盘盈盘亏
    calcyk:function(){
      return function(id){
       this.productdata[id].inventoryPl=
       this.productdata[id].inventoryNum-this.productdata[id].systemNum;
       return this.productdata[id].inventoryNum-this.productdata[id].systemNum;
      }
    }  
    ,
    calccounter:function(){
      var k=0;
      for(var i=0;i<this.productdata.length;i++){
        if(this.productdata[i].inventoryNum!=0){
          k++;
        }
      }
      this.formorder.inventorycounter=k;
      return k;
    },
    //单个商品销售总价
    saleMoney() {
      return function (id) {
        this.productdata[id].saleMoney =
          Math.round(
            this.productdata[id].saleUnitPrice *
              this.productdata[id].productNum *
              1000
          ) / 1000;
        return (
          Math.round(
            this.productdata[id].saleUnitPrice *
              this.productdata[id].productNum *
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
          this.productdata[i].saleUnitPrice * this.productdata[i].productNum;
      }
      this.formorder.receivables =
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
    //销售优惠金额
    distotal: function () {
      var allmoney = 0;
      for (var i = 0; i < this.productdata.length; i++) {
        allmoney +=
          this.productdata[i].saleUnitPrice * this.productdata[i].productNum;
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
      enterdepot(){
      this.isdialog=false;
      for (let i=0; i<this.depotlist.length; i++){
        if(this.depotlist[i].depotId==this.value){
          this.depot=this.depotlist[i];
        }
      }
      this.formorder.depotName=this.depot.depotName;
      this.formorder.depotId = this.depot.depotId;
    },
    exitdepot(){
      this.isdialog=false;
      this.value=null;
    },


    tfdis(time) {
      if(Date.now()-1000*3600*24 > time.getTime()){
        this.formorder.orderTime=new Date()
      }
    },
    //改变页码数
    // handleCurrentChange(val) {
    //   this.dialogopen(val, this.pagesize);
    // },
    handleSelectionChange(val) {
      this.joinstockdata = val;
    },
    handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.currentPage=val;
        this.dialogopen();
    },
    handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.pagesize=val;
        this.currentPage=1;
        this.dialogopen();
      },
    setcontacts() {
      this.headeroptions1.forEach((item) => {
        if (item.customerName == this.formorder.customer) {
          this.formorder.contacts = item.contact;
          this.formorder.contactsPhone = item.contactNumber;
          this.formorder.contactsAddress = item.contactAddress;
        }
      });
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
        url: "http://localhost:8088/frameproject/stockInventory/allProduct/"+this.formorder.depotName,
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
          console.log(response)
        })
        .catch(function (error) {
          console.log(error);
        });
      this.dialogTableVisible = true;
    },
    addproduct() {
      var productlist = [];
      this.productdata.forEach((item) => {
        productlist.push(item.productId);
      });
      this.joinstockdata.forEach((item) => {
        if (productlist.indexOf(item.productId) == -1) {
          item.productNum = 1;
          this.productdata.push(item);
        }
      });
      for (var i = this.productdata.length - 1; i >= 0; i--) {
        if (
          this.productdata[i].productId == "" &&
          this.productdata.length > 1
        ) {
          this.productdata.splice(i, 1);
        }
      }
      this.dialogTableVisible = false;
      this.formorder.inventorycount=this.computedcount;

      console.log(this.productdata)
    },
    
    //新增一行
    addrow(productdata, event) {
      productdata.push({
          productName: "", //
          productId: "", //
          productSpec: "", //
          productType: "", //
          productUnit: "", //
          systemNum: 0, //
          productPurchaseUnit: "", //
          remark: "", //
          pdyk:0,
          pdNum:0
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
      this.productdata.forEach((item) => {
        if (
          (this.formorder.depotName == "") ||
          item.productId == "" ||
          this.formorder.depotId == "" ||
          item.inventoryNum==0
        ) {
          this.$notify({
            title: "警告",
            message: "请先填写*必要信息!",
            type: "warning",
          });
          return false;
        }
        
      });
        this.formorder.inventorypeople = state.userInfo.userName;
        this.axios({
          url: "http://localhost:8088/frameproject/stockInventory/add/" + type,
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
            if(response.data.code==200){
            sessionStorage.setItem("orderid", response.data.data);
            _this.$router.push("/Inventory");
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  created: function () {
    
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
          _this.depotlist=response.data.data.depots
          _this.isdialog=true;
      })
      .catch(function (error) {
        console.log(error);
      });
  },

}
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
.elbutton{
  margin-top:10px;
  margin-left: 60px;
}
</style>