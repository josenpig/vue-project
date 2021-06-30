<template>
	<!-- 主内容 -->
	<div class="salelist">
		<!-- 标题 -->
		<div class="page-tag">
			<span style="float: left">产品库存表</span>
			<!-- 标签页 -->
		</div>
		<!-- 表单头部 筛选 -->
		<div class="salelist-header">
			<el-collapse accordion v-model="activeNames">
				<el-collapse-item name="1">
					<template #title>
						<span>筛选条件:</span>
						<el-tag :key="tag" v-for="tag in all" size="medium">
							{{ tag }}
						</el-tag>
					</template>
					<!--仓库名称-->
					<div style="margin: 7px 0px;">
						<span>仓库名称:</span>
						<el-select v-model="value1" filterable placeholder="请选择" @change="findpage">
							<el-option :label="SAll" :value="SAll">
							</el-option>
							<el-option v-for="item in depot" :key="item.depotName" :label="item.depotName" :value="item.depotName">
							</el-option>
						</el-select>
					</div>

					<!--产品名称-->
					<div style="margin: 7px 0px;">
						<span>产品名称:</span>
						<el-select v-model="value2" filterable placeholder="请选择" @change="findpage">
							<el-option :label="SAll" :value="SAll">
							</el-option>
							<el-option v-for="item in product" :key="item.productName" :label="item.productName" :value="item.productName">
							</el-option>
						</el-select>
					</div>

					<!--产品分类-->
					<div style="margin: 7px 0px;">
						<span>产品分类:</span>
						<el-select v-model="value3" filterable placeholder="请选择" @change="findpage">
							<el-option :label="SAll" :value="SAll">
							</el-option>
							<el-option v-for="item in proType" :key="item.label" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</div>

					<!--是否禁用-->
					<div style="margin: 7px 0px;" >
						<span>是否下架:</span>
						<el-select v-model="value4" filterable placeholder="请选择" @change="findpage">
							<el-option v-for="item in states" :label="item.label" :value="item.label">
							</el-option>
						</el-select>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>

		<!-- 表体内容 -->
		<div class="product-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column fixed :show-overflow-tooltip="true" prop="depotName" label="仓库名称" sortable width="180" />
				<el-table-column fixed prop="productId" label="产品编号" sortable width="120" />
				<el-table-column :show-overflow-tooltip="true" prop="productName" label="产品名称" sortable width="180" />
				<el-table-column prop="openingNumber" label="期初数量" sortable width="140" />
				<el-table-column prop="productNumber" label="当前库存" sortable width="140" />
				<el-table-column prop="expectNumber" label="预计可用量" sortable width="140" />
				<el-table-column prop="state" label="状态" sortable width="120">
					<template #default="scope">
						<span v-if="scope.row.state==0" style="color: orangered;">下架</span>
						<span v-if="scope.row.state==1" style="color: seagreen;">上架</span>
					</template>
				</el-table-column>
				<el-table-column  :show-overflow-tooltip="true"  prop="productSpec" label="规格" width="120" />
				<el-table-column  :show-overflow-tooltip="true"  prop="ingredient" label="成分" width="180" />
				<el-table-column prop="gramHeavy" label="克重" width="120" />
				<el-table-column prop="productTypeName" label="分类" sortable width="120" />
				<el-table-column prop="unitName" label="单位" sortable width="120" />
				<el-table-column :show-overflow-tooltip="true" prop="productDescribe" label="产品描述" width="120" />
				<el-table-column :show-overflow-tooltip="true" prop="remarks" label="备注" width="120" />
				<el-table-column prop="purchaseMoney" label="采购单价(元)" sortable width="120" />
				<el-table-column prop="purchaseUnitPrice" label="销售单价(元)" sortable width="120" />
			</el-table>
		</div>
		<!-- 表尾分页显示 -->
		<div class="salelist-footer" v-show="paging">
			<!-- 表尾分页显示 -->
			  <el-pagination
			  @size-change="handleSizeChange"
			  @current-change="handleCurrentChange"
			  :current-page="currentPage"
			  :page-sizes="[5, 10, 30, 100]"
			  :page-size="pagesize"
			  layout="total, sizes, prev, pager, next, jumper"
			  :total="max">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: "Receivable",
		data() {
			return {
				//全部
				SAll:"全部",
				//默认展开
				activeNames: "1",
				//筛选框
				value1: "全部", //仓库名称
				value2: "全部", //产品名称
				value3: "全部", //产品分类
				value4: "否", //是否下架
				//禁用条件
				states: [{
					label: "是",
					value: 0
				}, {
					label: "否",
					value: 1
				}],

				//表单数据
				tableData: [],
				
				//所有产品分类
				proType:[],
				//所有仓库
				depot:[],
				//所有产品
				product:[],
				
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
			};
		},
		computed: {
			paging: function() {
				return this.tableData.length > 0 ? true : false;
			},
			all: function() {
				return [
					"仓库名称: " + this.value1,
					"产品名称: " + this.value2,
					"产品分类: " + this.value3,
					"是否下架: " + this.value4
				];
			},
		},
		methods: {
			findpage() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log(this.value1+"+++"+this.value2+"+++"+this.value3+"+++"+this.value4)
				this.axios({
						url: "http://localhost:8088/frameproject/ReportFormController/findAllProductInventoryVo",
						method: "get",
						params: {
							depotName: _this.value1,
							productName: _this.value2,
							productTypeName: _this.value3,
							state: _this.value4,
							currentPage: _this.currentPage,
							pageSize: _this.pagesize
						},
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data.rows)
						_this.tableData = response.data.data.rows;
						_this.max = response.data.data.total;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//改变页码数
			handleSelectionChange(val) {
			  this.joinstockdata = val;
			},
			handleCurrentChange(val) {
			    this.currentPage=val;
			    this.findpage();
			},
			handleSizeChange(val) {
			    this.pagesize=val;
			    this.currentPage=1;
			    this.findpage();
			  },
			//查询所有产品分类
			findAllProType() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/findProType/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.proType = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//查询所有仓库
			findAllDepot() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseDepot/findAllDepot/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.depot = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//查询所有产品
			findAllProduct() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.product = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		},

		created: function() {
			this.findpage();
			this.findAllProType();
			this.findAllDepot();
			this.findAllProduct();
		},
	};
</script>

<style>
	.salelist {
		width: 100%;
		background-color: #e9eef3 !important;
	}

	/* 顶部 */
	.salelist .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	/* 内容表头 筛选框 */
	.salelist-header {
		padding: 15px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.salelist .el-radio-group {
		margin: 10px 0px;
	}

	.salelist-header span {
		font-size: 14px;
		color: #666666;
		margin-right: 10px;
	}

	.salelist .el-tag {
		color: #409eff !important;
	}

	.salelist .el-collapse,
	.salelist .el-collapse-item__wrap,
	.salelist .el-collapse-item__header,
	.salelist .el-radio-button__inner {
		border: none !important;
		border-radius: 0px !important;
	}

	.salelist .el-select--small {
		line-height: 32px;
		margin-right: 20px;
	}

	/* 表体内容 */
	.salelist-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.salelist th {
		color: white !important;
		background-color: #459df5 !important;
	}

	.salelist .cell {
		text-align: center;
	}

	/* 内容表尾 */
	.salelist-footer {
		padding: 25px 15px;
		background-color: white;
		text-align: center;
	}
</style>
