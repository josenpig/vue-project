<template>
	<!-- 主内容 -->
	<div class="VendorProductList">
		<!-- 标题 -->
		<div class="page-tag">
			<span style="float: left">供应商产品表</span>
			<!-- 标签页 -->
		</div>
		<!-- 表单头部 筛选 -->
		<div class="VendorProductList-header">
			<el-collapse accordion v-model="activeNames">
				<el-collapse-item name="1">
					<template #title>
						<span>筛选条件:</span>
						<el-tag :key="tag" v-for="tag in all" size="medium">
							{{ tag }}
						</el-tag>
					</template>

					<!--产品名称-->
					<div style="margin: 7px 0px">
						<span style="margin-right: 25px">产品名称:</span>
						<el-select v-model="value2" filterable placeholder="请选择" @change="findpage">
							<el-option :label="SAll" :value="SAll">
							</el-option>
							<el-option v-for="item in product" :key="item.productName" :label="item.productName" :value="item.productName">
							</el-option>
						</el-select>
					</div>
					
					<!--供应商名称-->
					<div style="margin: 7px 0px;">
						<span>供应商名称:</span>
						<el-select v-model="value1" filterable placeholder="请选择" @change="findpage">
							<el-option :label="SAll" :value="SAll">
							</el-option>
							<el-option v-for="item in Vendor" :key="item.vendorName" :label="item.vendorName" :value="item.vendorName">
							</el-option>
						</el-select>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>

		<!-- 表体内容 -->
		<div class="product-mian">
			<div class="unit-mian">
				<el-table :data="tableData" @selection-change="handleSelectionChange" border
				 stripe>
					<el-table-column prop="vendorId" label="供应商编号" sortable width="200" />
					<el-table-column prop="vendorName" label="供应商名称" sortable width="200" />
					<el-table-column prop="productId" label="产品编号" sortable width="200" />
					<el-table-column prop="productName" label="产品名称" sortable width="200" />
					<el-table-column prop="purchaseMoney" label="标准采购价格(￥)" sortable width="200" />
					<el-table-column prop="priceRatio" label="调价比例(%)" sortable width="200" />
					<el-table-column label="实际采购价格(￥)" sortable width="200">
						<template #default="scope">
							<span>{{(scope.row.purchaseMoney * scope.row.priceRatio / 100).toFixed(2)}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 表尾分页显示 -->
		<div class="VendorProductList-footer" v-show="paging">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 50px"
			 @current-change="handleCurrentChange" v-model:currentPage="currentPage">
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
				];
			},
		},
		methods: {
			// 改变页码数
			handleCurrentChange(val) {
			  this.findpage(val, this.pagesize);
			},
			//查询所有供应商
			findAllVendor() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.Vendor = response.data.data;
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
			},
			//根据供应商编号查询供应商下的产品
			findpage() {
				this.ProupdateDialogFormVisible =true
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var v=this.value1;
				var p=this.value2;
				if(this.value1=="全部"){
					v=null
				}else{
					this.Vendor.forEach((item)=>{
						if(v==item.vendorName){
							v=item.vendorId
						}
					})
				}
				if(this.value2=="全部"){
					p=null
				}else{
					this.product.forEach((item)=>{
						if(p==item.productName){
							p=item.productId
						}
					})
				}
				var fd = {
					vid: v,
					pid: p,
					pname: null,
					currentPage: this.currentPage,
					pageSize: this.pagesize,
				};
				console.log(fd)
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendorProduct/findAllbaseVendorProduct",
						method: "get",
						processData: false,
						params: fd,
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
			}
		},

		created: function() {
			this.findAllVendor();
			this.findAllProduct();
			this.findpage();
		},
	};
</script>

<style>
	.VendorProductList {
		width: 100%;
		background-color: #e9eef3 !important;
	}

	/* 顶部 */
	.VendorProductList .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	/* 内容表头 筛选框 */
	.VendorProductList-header {
		padding: 15px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.VendorProductList .el-radio-group {
		margin: 10px 0px;
	}

	.VendorProductList-header span {
		font-size: 14px;
		color: #666666;
		margin-right: 10px;
	}

	.VendorProductList .el-tag {
		color: #409eff !important;
	}

	.VendorProductList .el-collapse,
	.VendorProductList .el-collapse-item__wrap,
	.VendorProductList .el-collapse-item__header,
	.VendorProductList .el-radio-button__inner {
		border: none !important;
		border-radius: 0px !important;
	}

	.VendorProductList .el-select--small {
		line-height: 32px;
		margin-right: 20px;
	}

	/* 表体内容 */
	.VendorProductList-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.VendorProductList th {
		color: white !important;
		background-color: #459df5 !important;
	}

	.VendorProductList .cell {
		text-align: center;
	}

	/* 内容表尾 */
	.VendorProductList-footer {
		padding: 25px 15px;
		background-color: white;
		text-align: center;
	}
</style>
