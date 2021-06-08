<template>
  <div class="workbench">
    <el-row :gutter="20">
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>销售</span>
              <el-dropdown
                style="float: right"
                trigger="click"
                @command="handleCommandPurchase"
              >
                <span class="el-dropdown-link">
                  {{ salePurchaseT }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                <el-dropdown-menu >
                  <el-dropdown-item command="天">按天</el-dropdown-item>
                  <el-dropdown-item command="周">按周</el-dropdown-item>
                  <el-dropdown-item command="月">按月</el-dropdown-item>
                </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="text item">
              <span v-text="sellPurchaseDate.previously"></span>
              <div class="ik-pull-right">
                ￥<span
                  v-text="
                    debt.deliverygBeforeM === null ? 0 : debt.deliverygBeforeM
                  "
                ></span>
                <span class="stats__badge">3笔</span>
              </div>
            </div>
            <div class="text item">
              <span v-text="sellPurchaseDate.now"></span>
              <div class="ik-pull-right">
                ￥<span
                  v-text="
                    debt.deliverygAfterM === null ? 0 : debt.deliverygAfterM
                  "
                ></span>
                <span class="stats__badge">3笔</span>
              </div>
            </div>
          </el-card>
        </div></el-col
      >
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>采购</span>
              <el-dropdown
                style="float: right"
                trigger="click"
                @command="handleCommand"
              >
                <span class="el-dropdown-link">
                  {{ saleT }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                <el-dropdown-menu >
                  <el-dropdown-item command="天">按天</el-dropdown-item>
                  <el-dropdown-item command="周">按周</el-dropdown-item>
                  <el-dropdown-item command="月">按月</el-dropdown-item>
                </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="text item">
              <span v-text="sellDate.previously"></span>
              <div class="ik-pull-right">
                ￥<span
                  v-text="debt.saleBeforeM === null ? 0 : debt.saleBeforeM"
                ></span>
                <span
                  class="stats__badge"
                  v-text="debt.saleBeforeSum + '笔'"
                ></span>
              </div>
            </div>
            <div class="text item">
              <span v-text="sellDate.now"></span>
              <div class="ik-pull-right">
                ￥<span
                  v-text="debt.saleAfterM === null ? 0 : debt.saleAfterM"
                ></span>
                <span
                  class="stats__badge"
                  v-text="debt.saleAfterSum + '笔'"
                ></span>
              </div>
            </div>
          </el-card></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>库存</span>
            </div>
            <div class="text item">
              <span>总量</span>
              <div class="ik-pull-right">
                <span v-text="debt.amount"></span>
              </div>
            </div>
            <div class="text item">
              <span>总成本</span>
              <div class="ik-pull-right">
                ￥<span v-text="debt.cost"></span>
              </div>
            </div>
          </el-card></div
      ></el-col>
      <el-col :span="6"
        ><div class="grid-content bg-purple">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>欠款</span>
            </div>
            <div class="text item">
              <span>客户</span>
              <div class="ik-pull-right">
                ￥<span v-text="debt.client === null ? 0 : debt.client"></span>
              </div>
            </div>
            <div class="text item">
              <span>供应商</span>
              <div class="ik-pull-right">
                ￥<span
                  v-text="debt.supplier === null ? 0 : debt.supplier"
                ></span>
              </div>
            </div>
          </el-card></div
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col
        :span="17"
        style="padding-left: 10px; padding-right: 10px; padding-top: 10px"
      >
        <el-tabs
          class="work-tabs"
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane label="待审批" name="awaitApprove">
            <el-table
              :data="awaitApproveData"
              style="width: 100%"
              border
              height="400"
            >
              <el-table-column fixed prop="number" label="单据编号">
              </el-table-column>
              <el-table-column prop="numberType" label="单据类型">
              </el-table-column>
              <el-table-column prop="supplier" label="客户/供应商">
              </el-table-column>
              <el-table-column prop="price" label="金额"> </el-table-column>
              <el-table-column prop="submitter" label="提交人">
              </el-table-column>
              <el-table-column prop="submitterTime" label="提交时间">
              </el-table-column>
              <el-table-column prop="operation" label="操作">
                <template slot-scope="scope">
                  <!--        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
                  <el-button
                    type="text"
                    size="small"
                    @click="passClick(scope.row), (add = true)"
                    >通过</el-button
                  >
                  <el-button
                    @click="reject(scope.row)"
                    type="text"
                    size="small"
                    style="color: red"
                    >驳回</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已通过" name="finishApprove">
            <el-table
              :data="finishApproveData"
              style="width: 100%"
              border
              height="400"
            >
              <el-table-column fixed prop="number" label="单据编号">
              </el-table-column>
              <el-table-column prop="numberType" label="单据类型">
              </el-table-column>
              <el-table-column prop="supplier" label="客户/供应商">
              </el-table-column>
              <el-table-column prop="price" label="金额"> </el-table-column>
              <el-table-column prop="submitter" label="提交人">
              </el-table-column>
              <el-table-column prop="submitterTime" label="提交时间">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="已驳回" name="awaitEnterStock">
            <el-table
              :data="rejectApproveData"
              style="width: 100%"
              border
              height="400"
            >
              <el-table-column fixed prop="number" label="单据编号">
              </el-table-column>
              <el-table-column prop="numberType" label="单据类型">
              </el-table-column>
              <el-table-column prop="supplier" label="客户/供应商">
              </el-table-column>
              <el-table-column prop="price" label="金额"> </el-table-column>
              <el-table-column prop="submitter" label="提交人">
              </el-table-column>
              <el-table-column prop="submitterTime" label="提交时间">
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="6" class="select-col">
        <el-row>
          <div>查询</div>
        </el-row>
        <el-row class="select-row">
          <el-col :span="10">库存查询：</el-col>
          <el-col :span="10"
            ><el-input
              placeholder="请输入产品名称,编号"
              v-model="queryRepertoryVal"
            ></el-input
          ></el-col>
          <el-col :span="2"
            ><el-button
              type="primary"
              icon="el-icon-search"
              @click="queryRepertory()"
            ></el-button
          ></el-col>
        </el-row>
        <el-row class="select-row">
          <el-col :span="10">客户查询：</el-col>
          <el-col :span="10"
            ><el-input
              placeholder="请输入产品名称"
              v-model="queryClientVal"
            ></el-input
          ></el-col>
          <el-col :span="2"
            ><el-button
              type="primary"
              icon="el-icon-search"
              @click="queryClient()"
            ></el-button
          ></el-col>
        </el-row>
        <el-row class="select-row">
          <el-col :span="10">供应商查询：</el-col>
          <el-col :span="10"
            ><el-input
              placeholder="请输入产品名称"
              v-model="querySupplierVal"
            ></el-input
          ></el-col>
          <el-col :span="2"
            ><el-button
              type="primary"
              icon="el-icon-search"
              @click="querySupplier()"
            ></el-button
          ></el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
    </el-row>
    <el-dialog title="库存查询" :visible.sync="dialogTableVisible">
      <el-table :data="queryRepertoryData">
        <el-table-column
          property="productNum"
          label="产品编号"
          width="150"
        ></el-table-column>
        <el-table-column
          property="productName"
          label="产品名称"
          width="200"
        ></el-table-column>
        <el-table-column property="productSpace" label="规格"></el-table-column>
        <el-table-column
          property="productCategories"
          label="产品类型"
        ></el-table-column>
        <el-table-column
          property="warehouseName"
          label="所属仓库"
        ></el-table-column>
        <el-table-column
          property="productOpeningNum"
          label="数量"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="客户查询" :visible.sync="dialogTableClientVisible">
      <el-table :data="queryClientData">
        <el-table-column
          property="clientName"
          label="客户名"
          width="150"
        ></el-table-column>
        <el-table-column
          property="clientNum"
          label="客户编号"
          width="200"
        ></el-table-column>
        <el-table-column
          property="clientContact"
          label="联系人"
        ></el-table-column>
        <el-table-column
          property="clientPhone"
          label="联系方式"
        ></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="供应商查询" :visible.sync="dialogTableSupplierVisible">
      <el-table :data="querySupplierData">
        <el-table-column
          property="clientName"
          label="客户名"
          width="150"
        ></el-table-column>
        <el-table-column
          property="clientNum"
          label="客户编号"
          width="200"
        ></el-table-column>
        <el-table-column
          property="clientContact"
          label="联系人"
        ></el-table-column>
        <el-table-column
          property="clientPhone"
          label="联系方式"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Workbench",
  data() {
    return {
      // a:"123"
      saleT: "按天",
      salePurchaseT: "按天",
      sellDate: { now: "今天", previously: "昨天" },
      sellPurchaseDate: { now: "今天", previously: "昨天" },
      sale: { afterTime: "", afterM: 100, beforeTime: "", beforeM: "100" },
      debt: {
        deliverygAfterM: null,
        saleBeforeSum: 1,
        deliverygAfterSum: 0,
        deliverygBeforeSum: 0,
        saleAfterM: 1100,
        supplier: 3,
        deliverygBeforeM: null,
        saleAfterSum: 2,
        client: 5,
        saleBeforeM: 1000,
      },
      activeName: "awaitApprove",
      finishApproveData: [],
      awaitApproveData: [],
      rejectApproveData: [],
      dialogTableVisible: false,
      dialogTableClientVisible: false,
      dialogTableSupplierVisible: false,
      queryRepertoryVal: "",
      queryClientVal: "",
      querySupplierVal: "",
      queryRepertoryData: [],
      queryClientData: [],
      querySupplierData: [],
    };
  },
  methods: {
    handleCommand(c) {
      // eslint-disable-next-line no-empty
      this.saleT = "按" + c;
      if (c === "天") {
        this.sellDate.now = "今" + c;
        this.sellDate.previously = "昨" + c;
      } else {
        this.sellDate.now = "本" + c;
        this.sellDate.previously = "上" + c;
      }
    },
    handleCommandPurchase(c) {
      // eslint-disable-next-line no-empty
      this.salePurchaseT = "按" + c;
      if (c === "天") {
        this.sellPurchaseDate.now = "今" + c;
        this.sellPurchaseDate.previously = "昨" + c;
      } else {
        this.sellPurchaseDate.now = "本" + c;
        this.sellPurchaseDate.previously = "上" + c;
      }
    }
  },
};
</script>

<style>
.workbench .el-col {
  border-radius: 4px;
}
.workbench .bg-purple-dark {
  background: #99a9bf;
}
.workbench .bg-purple {
  background: #d3dce6;
}
.workbench .bg-purple-light {
  background: #e5e9f2;
}
.workbench .grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.workbench .row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.workbench .text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
  line-height: 10px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
  line-height: 10px;
}
.clearfix:after {
  clear: both;
}

.box-card {
  text-align: left;
  /*width: 250px;*/
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
.el-card__header {
  line-height: 10px;
  /*text-align: left;*/
  /*width: 200px;*/
}
.ik-pull-right {
  float: right;
}
.stats__badge {
  min-width: 48px;
  line-height: 16px;
  text-align: center;
  margin-left: 10px;
  font-size: 12px;
  border-radius: 2px;
  vertical-align: middle;
  display: inline-block;
  border: 1px solid #bcf2d4;
  background-color: #e5fff1;
  color: #66d598;
}
.work-tabs {
  background: white;
  border-radius: 1%;
}
.select-col {
  background-color: white;
  border-radius: 5px;
  margin: 20px 20px 20px 0;
  padding: 10px 10px;
}
.select-row {
  margin: 20px 5px;
}
.col-a {
  border: 1px solid #fcfcfc;
  min-height: 1px;
  background: transparent;
  display: block;
  float: left;
  padding: 20px 0 20px;
  color: #333333;
  text-decoration: none;
  text-align: center;
  background-color: white;
  border-bottom: 1px solid #eeeff3;
  border-right: 1px solid #eeeff3;
  width: 100%;
  transition: color 0.3s ease;
}
.col-a:hover {
  background-color: #fafafa;
}
.fast-row {
  margin-bottom: 0;
}
.fast-row-title {
  background-color: #eaeaea;
  padding: 5px;
  font-weight: bold;
  font-size: 14px;
}
.el-tabs__nav-scroll {
  margin-left: 10px;
}
</style>
