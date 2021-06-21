<template>
	<!-- 主内容 -->
	<div class="unit">
		<!-- 标题 -->
		<div class="page-tag">
			<span>单位列表</span>
			<div class="shenpi">
				<!-- 新增单位 -->
				<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;">
					<i class="el-icon-plus"></i> 新增单位
				</el-button>

				<el-dialog title="新增单位" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="单位名称" :label-width="formLabelWidth">
							<el-input @change="pdName(form.unitName)" v-model="form.unitName" placeholder="单位名称不能重复 (必填)" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="Add">确 定</el-button>
						</span>
					</template>
				</el-dialog>

				<!--修改单位-->
				<el-dialog title="修改单位" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="单位名称" :label-width="formLabelWidth">
							<el-input v-model="updateForm.unitName" placeholder="单位名称不能重复 (必填)" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="updateDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="update">确 定</el-button>
						</span>
					</template>
				</el-dialog>


			</div>
		</div>
		<!-- 表单头部 -->

		<!-- 表体内容 -->
		<div class="unit-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column prop="date" label="操作" width="300">
					<template #default="scope">
						<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.unitId)" type="text" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
				<el-table-column prop="unitName" label="单位名称" sortable width="500" />
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
	import {
		ElMessage
	} from 'element-plus'
	export default {
		name: "unit",
		data() {
			return {
				//新增单位信息弹框
				dialogFormVisible: false,
				//修改单位信息弹框
				updateDialogFormVisible: false,
				formLabelWidth: '120px',
				//新增单位表单
				form: {
					unitName: '' //单位名称
				},
				//修改单位表单
				updateForm: {
					unitName: '', //单位名称
					unitId: '' //单位id
				},
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				judge: ''
			}
		},
		methods: {
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
					pageSize: this.pagesize,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseUnit/findAllUnit",
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
			//删除单位
			del(id) {
				var _this = this;
				this.$confirm('此操作将永久删除该单位, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					const state = JSON.parse(sessionStorage.getItem("state"));
					var uid = {
						uid: id
					}
					console.log(id)
					this.axios({
							url: "http://localhost:8088/frameproject/baseUnit/delUnit",
							method: "get",
							processData: false,
							params: uid,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
							if (response.data.data) {
								_this.$message({
									type: 'success',
									message: '删除成功'
								});
								_this.findpage()
							} else {
								ElMessage.warning({
									message: '有产品正在使用该单位，无法删除！',
									type: 'success'
								});
							}
						})
						.catch(function(error) {
							console.log(error);
						});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//判断单位名称是否重复
			pdName(val) {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var UnitName = {
					UnitName: val
				}
				this.axios({
						url: "http://localhost:8088/frameproject/baseUnit/judgeUnitName",
						method: "get",
						processData: false,
						params: UnitName,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("单位名称不重复是否通过:" + response.data)
						_this.judge = response.data
						if(!response.data){
							ElMessage.warning({
								message: '单位名称重复！',
								type: 'success'
							});
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加单位
			Add() {
				console.log(this.form)
				if (this.form.unitName == null || this.form.unitName == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.pdName(this.form.unitName)
					setTimeout(() => {
						if (this.judge) {
							const state = JSON.parse(sessionStorage.getItem("state"));
							var _this = this;
							this.dialogFormVisible = false
							//添加仓库
							this.axios({
									url: "http://localhost:8088/frameproject/baseUnit/addUnit",
									method: "post",
									processData: false,
									data: {
										Unit: JSON.stringify(_this.form)
									},
									headers: {
										JWTDemo: state.userInfo.token,
									},
								})
								.then(function(response) {
									console.log(response.data.data)
									ElMessage.success({
										message: '添加成功',
										type: 'success'
									});
									_this.form = {}
									_this.judge = {}
									_this.findpage()
								})
								.catch(function(error) {
									console.log(error);
								});
						}
					}, 200)
				}
			},
			//打开修改框
			openupdate(val) {
				this.updateDialogFormVisible = true;

				this.updateForm.unitName = val.unitName
				this.updateForm.unitId = val.unitId
			},
			//修改仓库信息
			update() {
				console.log(this.updateForm)
				if (
					this.updateForm.unitName == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false

					this.pdName(this.updateForm.unitName)
					setTimeout(() => {
						if (this.judge) {
							this.$confirm('修改后使用过该单位的相关产品、单据都会更新显示。确定修改？', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {

								this.axios({
										url: "http://localhost:8088/frameproject/baseUnit/updateUnit",
										method: "post",
										processData: false,
										data: {
											Unit: JSON.stringify(_this.updateForm)
										},
										headers: {
											JWTDemo: state.userInfo.token,
										},
									})
									.then(function(response) {
										console.log(response.data.data)
										ElMessage.success({
											message: '修改成功',
											type: 'success'
										});
										_this.updateDialogFormVisible = false;
										_this.judge = {}
										_this.findpage()
									})
									.catch(function(error) {
										console.log(error);
									});

							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消修改'
								});
							});
						} else {
							ElMessage.warning({
								message: '单位名称重复！',
								type: 'success'
							});
						}
					}, 500)
				}
			}
		},
		computed: {},
		created() {
			this.findpage()
		}
	};
</script>

<style lang="scss">
	.unit {
		width: 100%;
		background-color: white;
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
		margin: -2px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.unit-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.unit .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.unit .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.unit-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.unit th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.unit th>.cell {
		color: white !important;
	}

	.unit-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.unit .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.unit-main .el-input__inner {
		border: 0;
	}

	.unit th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.unit .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.unit-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
