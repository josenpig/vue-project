<template>

	<!-- 类别列表 -->
	<div class="typelabel">
		<h4 class="title">类别列表</h4>
		<div class="type">
			<items v-for="(model, index) in list" :model="model" :key="index"></items>
		</div>
	</div>

	<!-- 主内容 -->
	<div class="product">
		<!-- 标题 -->
		<div class="page-tag">
			<span>产品列表</span>
			<div class="shenpi">
				<!-- 新增产品 -->
				<el-button type="text" size="small " @click="ToAdd" style="color: white;background-color: #459df5;width: 90px;margin: 3px;">
					<i class="el-icon-plus"></i> 新增产品
				</el-button>
			</div>
		</div>
		<!-- 表单头部 -->

		<!--批量删除-->
		<div style="float: left;padding-top: 15px;">
			<el-button size="mini" @click="batchDel"><i class="el-icon-close"></i> 批量删除</el-button>
		</div>
		<!--搜索框-->
		<div class="page-search">
			<div style="float: left;margin: 5px 0px;">
				<el-select v-model="select" size="mini" style="width:110px">
					<el-option v-for="item in SearchType" :label="item.label" :value="item.label"></el-option>
				</el-select>
			</div>
			<div class="page-search-content">
				<el-input v-model="SearchContent" placeholder="请输入内容" size="small"></el-input>
			</div>
			<div style="float: left;">
				<el-button @click="findpageByidOrName" icon="el-icon-search" circle></el-button>
			</div>
		</div>
		<!-- 表体内容 -->
		<div class="product-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column label="操作" width="120">
					<template #default="scope">
						<el-button size="small" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.productId,scope.$index)" type="text" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
				<el-table-column prop="productName" label="产品名称" sortable width="120" />
				<el-table-column prop="productId" label="产品编号" sortable width="120" />
				<el-table-column prop="productSpec" label="规格" sortable width="120" />
				<el-table-column prop="ingredient" label="成分" sortable width="120" />
				<el-table-column prop="gramHeavy" label="克重" sortable width="120" />
				<el-table-column prop="productTypeName" label="分类" sortable width="120" />
				<el-table-column prop="unitName" label="单位" sortable width="120" />
				<el-table-column prop="opingNumber" label="初期数量" sortable width="120" />
				<el-table-column prop="state" label="状态" sortable width="120">
					<template #default="scope">
						<span>{{scope.row.state==1?"已启用":"禁用"}}</span>
					</template>
				</el-table-column>
				<!---->
				<el-table-column prop="remarks" label="备注" sortable width="120" />
				<el-table-column prop="purchaseMoney" label="采购单价" sortable width="120" />
				<el-table-column prop="purchaseUnitPrice" label="销售单价" sortable width="120" />
				<el-table-column prop="userName" label="创建人" sortable width="120" />
				<el-table-column prop="creationTime" label="创建时间" sortable width="150" />
				<el-table-column prop="updateTime" label="更新时间" sortable width="150" />
			</el-table>
		</div>
		<!-- 表尾分页显示 -->
		<div class="salelist-footer">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 50px"
			 @current-change="handleCurrentChange" v-model:currentPage="currentPage">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import items from './Items.vue'
	import {
		mapState
	} from "vuex";
	export default {
		name: "product",
		data() {
			return {
				//分类数据-test
				list: [{
						"id": 1,
						"menuName": "type1",
						"childTree": [{
							"id": 101,
							"menuName": "type1-1",
							"childTree": [{
								"id": 10101,
								"menuName": "type1-1-1",
								"childTree": [{
									"id": 1010101,
									"menuName": "type1-1-1-1"
								}]
							}]
						}, {
							"id": 102,
							"menuName": "type1-2",
							"childTree": [{
								"id": 10201,
								"menuName": "type1-2-1",
							}]
						}]
					},
					{
						"id": 2,
						"menuName": "type2"
					},
					{
						"id": 3,
						"menuName": "type3"
					}
				],

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				//搜索条件
				SearchType:[{
					label: "产品名称"
				},{
					label: "产品编号"
				}],
				SearchContent: '',

				//选中数据
				select: "产品名称",
				
				//多选产品
				selectPro: []
			}
		},
		methods: {
			//添加产品
			ToAdd() {
				this.$router.push("/AddProduct")
			},
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//分页查询
			findpage() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						_this.tableData = response.data.data.rows;
						_this.max = response.data.data.total;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//根据id或name查询
			findpageByidOrName() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					SearchContent: this.SearchContent,
					select: this.select,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/ByIdOrName",
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
			},
			//删除产品
			del(id, index) {
				this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					const state = JSON.parse(sessionStorage.getItem("state"));
					var pid = {
						id: id
					};
						this.axios({
								url: "http://localhost:8088/frameproject/baseProduct/delProduct",
								method: "get",
								processData: false,
								params: pid,
								headers: {
									JWTDemo: state.userInfo.token,
								},
							})
						.then(function(response) {
							console.log(response.data.data);
						})
						.catch(function(error) {
							console.log(error);
						});
					this.tableData.splice(index, 1);
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//批量删除产品
			batchDel() {
				this.$confirm('此操作将永久删除下列'+this.selectPro.length+':条产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					var ids = new Array()
					this.selectPro.forEach(v=>{
						ids.push(v.productId)
					})
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/delProduct/batch",
							method: "delete",
							processData: false,
							data: ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log( response.data.data)
						})
						.catch(function(error) {
							console.log(error);
						});
					
					location.reload();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//复选框
			handleSelectionChange(val) {
				this.selectPro = val
			}
		},
		components: {
			items
		},
		created() {
			this.findpage()
		}
	};
</script>

<style lang="scss">
	.title {
		color: lightblue;
		background-color: rgb(249, 249, 249);
		height: 30px;
		padding: 15px;
		margin-top: 0px;
	}

	.typelabel {
		width: 23%;
		height: 100%;
		float: left;
		background-color: white;
		margin-right: 20px;
	}

	.product {
		width: 75%;
		float: right
	}

	.r-float {
		float: right;
	}

	/* 顶部 */
	.page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	.shenpi {
		float: right;
		line-height: 20px;
	}

	.page-search {
		float: right;
		padding: 13px;
	}

	.page-search-content {
		margin: 2px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.product-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.product .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.product .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.product-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.product th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.product th>.cell {
		color: white !important;
	}

	.product-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.product .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.product-main .el-input__inner {
		border: 0;
	}

	.product th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.product .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.product-footer {
		padding: 20px 15px;
		background-color: white;
	}


	/**/
	html,
	body,
	#app,
	.el-container {
		padding: 0px;
		margin: 0px;
		height: 100%;
	}
</style>
