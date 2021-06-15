<template>

	<!-- 类别列表 -->
	<div class="typelabel">
		<h4 class="title">产品分类</h4>
		<div >
			<div>
				<el-button @click="findByType(AllId)" class="allType">
					<i class="el-icon-caret-bottom" style="padding-right: 5px;"></i>全部
					<a @click="append(AllId)" style="float: right;">
						<i class="el-icon-circle-plus-outline"></i>
						<span style="font-size: 10px;">新增子分类</span>
					</a>
					</el-button>
			</div>
			<el-tree :data="ProType" node-key="1000" @node-click="findByType" :expand-on-click-node="false" style="font-size: 15px;padding: 5px 0px;">
				<template #default="{ node, data }">
					<span class="custom-tree-node">
						<span>{{ node.label }}</span>
						<span style="padding: 20px;">
							<a @click="append(data)" style="padding: 8px;">
								<i class="el-icon-circle-plus-outline"></i>
							</a>
							<a @click="remove(node, ProType)">
								<i class="el-icon-delete"></i>
							</a>
						</span>
					</span>
				</template>
			</el-tree>
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
				<el-table-column fixed label="操作" width="150">
					<template #default="scope">
						<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.depotId)" type="text" icon="el-icon-delete" circle></el-button>
						<el-button v-if="scope.row.state==1" @click="disableOrEnable(scope.row)" round style="background-color: coral;color: white;padding: 7px;">禁用</el-button>
						<el-button v-if="scope.row.state==0" @click="disableOrEnable(scope.row)" round style="background-color: lightgreen ;color: white;padding: 7px;">启用</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed prop="productId" label="产品编号" sortable width="120" />
				<el-table-column prop="productName" label="产品名称" sortable width="120" />
				<el-table-column prop="productSpec" label="规格" width="120" />
				<el-table-column prop="ingredient" label="成分" width="120" />
				<el-table-column prop="gramHeavy" label="克重" width="120" />
				<el-table-column prop="productTypeName" label="分类" sortable width="120" />
				<el-table-column prop="unitName" label="单位" sortable width="120" />
				<el-table-column prop="opingNumber" label="初期数量" sortable width="120" />
				<el-table-column prop="state" label="状态" sortable width="120">
					<template #default="scope">
						<span v-if="scope.row.state==0" style="color: orangered;">禁用</span>
						<span v-if="scope.row.state==1" style="color: seagreen;">启用</span>
					</template>
				</el-table-column>
				<!---->
				<el-table-column prop="remarks" label="备注" width="120" />
				<el-table-column prop="purchaseMoney" label="采购单价" sortable width="120" />
				<el-table-column prop="purchaseUnitPrice" label="销售单价" sortable width="120" />
				<el-table-column prop="userName" label="创建人" sortable width="120" />
				<el-table-column prop="creationTime" label="创建时间" sortable width="150" />
				<el-table-column prop="updateTime" label="更新时间" sortable width="150" />
			</el-table>
		</div>
		<!-- 表尾分页显示 -->
		<div class="salelist-footer">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 10px"
			 @current-change="handleCurrentChange" v-model:currentPage="currentPage">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: "product",
		data() {
			return {
				AllId:'',
				
				// 分类数据
				ProType: [],

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				//搜索条件
				SearchType: [{
					label: "产品名称"
				}, {
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
			//查询所有产品分类
			findAllProType() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/findProType",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.ProType = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
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
				this.$confirm('此操作将永久删除下列' + this.selectPro.length + ':条产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					var ids = new Array()
					this.selectPro.forEach(v => {
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
							console.log(response.data.data)
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
			},
			//禁用或启用
			disableOrEnable(val) {
				var _this = this;
				var able;
				if (val.state == 1) {
					able = '禁用'
				};
				if (val.state == 0) {
					able = '启用'
				};
				this.$confirm('是否' + able + '该产品！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					const state = JSON.parse(sessionStorage.getItem("state"));
					console.log(val)
					var Dstate = {
						Did: val.productId,
						Dstate: val.state
					};
					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/disableOrEnable",
							method: "get",
							processData: false,
							params: Dstate,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log(response.data.data);
							if (response.data.data) {
								_this.$message({
									type: 'success',
									message: able + '成功'
								});
							}
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消' + able
					});
				});
			},
			//根据分类查询商品
			findByType(data) {
				console.log(data)

				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					id: data.id,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/ByTpye",
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

			append(node, data) {
				console.log("append:")
				console.log(node.id)
			},

			remove(node, data) {
				console.log("remove:")
				console.log(node.id)
			},

		},
		components: {},
		created() {
			this.findpage()
			this.findAllProType()
		}
	};
</script>

<style lang="scss">
	.product {
		width: 75%;
		float: right
	}

	.title {
		color: #459df5;
		background-color: #f9f9f9;
		height: 30px;
		padding: 15px;
		margin-top: 0px;
	}

	.allType {
		padding: 4px;
		width: 222px;
		text-align: left;
		font-size: 17px;
		color: white;
		background: lightblue;
	}

	.typelabel {
		width: 22%;
		height: 100%;
		float: left;
		background-color: white;
		margin: -17px;
		border-right: 2px solid gainsboro;
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
