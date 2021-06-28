<template>
	<!-- 主内容 -->
	<div class="CapitalAccount">
		<!-- 标题 -->
		<div class="page-tag">
			<span>资金账户设置</span>
			<div style="float: right;">
				<!-- 新增资金账户 -->
				<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 110px;">
					<i class="el-icon-plus"></i> 新增资金账户
				</el-button>

				<el-dialog title="资金账户信息" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 账户编号 *" :label-width="formLabelWidth">
							<el-input v-model="form.capitalId" autocomplete="off" placeholder="(必填)"></el-input>
						</el-form-item>
						<el-form-item label="* 账户名称 *" :label-width="formLabelWidth">
							<el-input v-model="form.fundAccount" autocomplete="off" placeholder="(必填)"></el-input>
						</el-form-item>
						<el-form-item label="* 结算类型 *" :label-width="formLabelWidth" >
							<el-select v-model="form.settlementTypeId" filterable placeholder="请选择结算类型 (必选)">
								<el-option v-for="item in SettlementType" :label="item.settlementType" :value="item.id" />
							</el-select>
							
							<!-- 新增结算类型 -->
							<el-button type="text" size="small " @click="dialogFormVisibleSettlement = true" style="color: white;background-color: #459df5;width: 90px;margin-left: 30px;">
								<i class="el-icon-plus"></i> 新增结算类型
							</el-button>
							
							<el-dialog title="新增结算类型" v-model="dialogFormVisibleSettlement">
								<hr style="margin-bottom: 20px;" />
								<el-form v-model="SettlementForm">
									<el-form-item label="结算类型名称" :label-width="formLabelWidth">
										<el-input v-model="SettlementForm.settlementType" placeholder="结算类型不能重复 (必填)" autocomplete="off"></el-input>
									</el-form-item>
								</el-form>
								<template #footer>
									<span class="dialog-footer">
										<el-button @click="dialogFormVisibleSettlement = false">取 消</el-button>
										<el-button type="primary" @click="AddST">确 定</el-button>
									</span>
								</template>
							</el-dialog>
							
						</el-form-item>
						<el-form-item label="初期金额 &nbsp;" :label-width="formLabelWidth">
							<el-input-number v-model="form.initialAmount" :precision="2" :step="0.1" :min="0"></el-input-number>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="pdAdd">确 定</el-button>
						</span>
					</template>
				</el-dialog>

				<!-- 修改资金账户 -->
				<el-dialog title="修改资金账户" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="账户编号" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.capitalId" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="账户名称" :label-width="formLabelWidth">
							<el-input v-model="updateForm.fundAccount" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="结算类型" :label-width="formLabelWidth">
							<el-select v-model="settlementTypeName" filterable placeholder="请选择结算类型 (必选)" @change="this.updateForm.settlementTypeId = this.settlementTypeName">
								<el-option v-for="item in SettlementType" :label="item.settlementType" :value="item.id" />
							</el-select>
							
							<!-- 新增结算类型 -->
							<el-button type="text" size="small " @click="dialogFormVisibleSettlement = true" style="color: white;background-color: #459df5;width: 90px;margin-left: 30px;">
								<i class="el-icon-plus"></i> 新增结算类型
							</el-button>
							
							<el-dialog title="新增结算类型" v-model="dialogFormVisibleSettlement">
								<hr style="margin-bottom: 20px;" />
								<el-form v-model="SettlementForm">
									<el-form-item label="结算类型名称" :label-width="formLabelWidth">
										<el-input v-model="SettlementForm.settlementType" placeholder="结算类型不能重复 (必填)" autocomplete="off"></el-input>
									</el-form-item>
								</el-form>
								<template #footer>
									<span class="dialog-footer">
										<el-button @click="dialogFormVisibleSettlement = false">取 消</el-button>
										<el-button type="primary" @click="AddST">确 定</el-button>
									</span>
								</template>
							</el-dialog>
							
						</el-form-item>
						<el-form-item label="初期金额" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.initialAmount" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="当前金额" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.currentAmount" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="账户类型" :label-width="formLabelWidth">
							<span v-if="updateForm.state==0" style="background-color: black;color: white;padding: 15px;">普通账户</span>
							<span v-if="updateForm.state==1" style="background-color: skyblue;color: white;padding: 15px;">默认账户</span>
							<el-button size="small"  @click="setState(updateForm.capitalId,1)" v-if="updateForm.state==0" round style="background-color: skyblue;color: white;margin-left: 30px;">
								设为默认
							</el-button>
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
		<!--搜索框-->
		<div class="page-search">
			<div style="float: left;margin: 7px 0px;">
				<el-select v-model="select" size="mini" style="width:120px">
					<el-option v-for="item in type" :label="item.label" :value="item.label"></el-option>
				</el-select>
			</div>
			<div class="page-search-content">
				<el-input v-model="SearchContent" placeholder="请输入内容" size="small"></el-input>
			</div>
			<div style="float: right;">
				<el-button @click="findpageByidOrName" icon="el-icon-search" circle></el-button>
			</div>
		</div>
		<!-- 表体内容 -->
		<div class="CapitalAccount-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column prop="date" label="操作" width="150">
			 	<template #default="scope">
			 		<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
			 		<el-button size="small" @click="del(scope.row.capitalId)" type="text" icon="el-icon-delete" circle></el-button>
			 	</template>
				</el-table-column>
				<el-table-column prop="capitalId" label="账户编号" sortable width="175" />
				<el-table-column prop="fundAccount" label="账户名称" sortable width="164"/>
				<el-table-column prop="settlementType" label="结算类型" sortable width="140" />
				<el-table-column prop="initialAmount" label="初期金额(元)" sortable width="120" />
				<el-table-column prop="currentAmount" label="当前金额(元)" sortable width="120" />
				<el-table-column prop="state" label="是否为默认" sortable width="150">
					<template #default="scope">
						<span style="color: red;">{{scope.row.state==1?"默认账户":" "}}</span>
						<el-button size="small" @click="setState(scope.row.capitalId,0)" v-if="scope.row.state==0" round style="background-color: skyblue;color: white;">
							设为默认
						</el-button>
					</template>
				</el-table-column>
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
		name: "CapitalAccount",
		data() {
			return {
				//新增资金账户信息弹框
				dialogFormVisible: false,
				//修改资金账户信息弹框
				updateDialogFormVisible: false,
				//新增资金账户表单
				form: {
					capitalId: '', //资金账户编号
					fundAccount: '', //资金账户名称
					initialAmount: 0, //初期金额
					settlementTypeId: '', //结算类型名称
				},
				//修改资金账户表单
				updateForm: {
					capitalId: '', //资金账户编号
					fundAccount: '', //资金账户名称
					initialAmount: '', //初期金额
					currentAmount: '', //当前金额
					settlementTypeId: '', //结算类型id
					state: '', //是否为默认账户: （是：1；否：0）
				},
				settlementTypeName:'',//结算类型名称
				formLabelWidth: '120px',
				radio: '1',
				SearchType: '资金账户名称',
				SearchContent: '',
				
				//选中搜索条件（资金账户名称）
				select: '资金账户名称',
				//搜索框中内容
				SearchContent: '',
				//搜索框条件
				type: [{
					label: '资金账户名称'
				}, {
					label: '资金账户编号'
				}],
				
				//资金账户表单
				SettlementType: [],
				
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
				
				//新增结算类型信息弹框
				dialogFormVisibleSettlement: false,
				//新增结算类型表单
				SettlementForm: {
					settlementType: '' //结算类型名称
				},
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
						url: "http://localhost:8088/frameproject/baseCapitalAccount/findAllCapitalAccountVo",
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
			//根据资金账户编号或资金账户名称查询
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
						url: "http://localhost:8088/frameproject/baseCapitalAccount/findAllCapitalAccountVo/ByIdOrName",
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
			//查询结算类型列表
			findST() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseSettlementType/findAllSettlementType/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.SettlementType = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//删除资金账户
			del(id) {
				var _this = this;
				this.$confirm('此操作将永久删除该资金账户, 是否继续?', '提示', {
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
							url: "http://localhost:8088/frameproject/baseCapitalAccount/delCapitalAccount",
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
									message: '该资金账户已存在流水记录，无法删除！',
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
			//判断资金账户ID是否重复并添加资金账户
			pdAdd() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var id = {
					id: this.form.capitalId
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseCapitalAccount/judgeCapitalId",
						method: "get",
						processData: false,
						params: id,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("id不重复是否通过:" + response.data)
						_this.judge = response.data
						if (response.data == false) {
							ElMessage.warning({
								message: '资金账户ID重复',
								type: 'success'
							});
						} else {
							_this.Add()
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加资金账户
			Add() {
				console.log(this.form)
				if (this.form.capitalId == '' ||
					this.form.fundAccount == '' ||
					this.form.settlementType == '' ||
					this.form.initialAmount  == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//添加资金账户
					this.axios({
							url: "http://localhost:8088/frameproject/baseCapitalAccount/addCapitalAccount",
							method: "post",
							processData: false,
							data: {
								CapitalAccount: JSON.stringify(_this.form)
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
							_this.form = {initialAmount: 0}
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			},
			//打开修改框
			openupdate(val) {
				this.updateDialogFormVisible = true;
			
				this.updateForm.capitalId = val.capitalId
				this.updateForm.fundAccount = val.fundAccount
				this.updateForm.initialAmount = val.initialAmount
				this.updateForm.currentAmount = val.currentAmount
				this.updateForm.settlementTypeId = val.settlementTypeId
				this.settlementTypeName = val.settlementType
				this.updateForm.state = val.state
			
			},
			//修改资金账户信息
			update() {
				console.log(this.updateForm)
				if (
					this.updateForm.fundAccount == '' ||
					this.updateForm.settlementType == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//修改资金账户
					this.axios({
							url: "http://localhost:8088/frameproject/baseCapitalAccount/updateCapitalAccount",
							method: "post",
							processData: false,
							data: {
								CapitalAccount: JSON.stringify(_this.updateForm)
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
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			},
			//设为默认账户
			setState(id,index) {
				var _this = this;
				var remind="";
				if(index==1){
					remind='设置默认账户会导致之前修改的信息丢失，如果在此之前修改了账户信息请先提交修改！              '
				}
				this.$confirm(remind+'此操作将id为:【'+id+'】的账户设为默认账户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() =>{
			
					const state = JSON.parse(sessionStorage.getItem("state"));
					var uid = {
						uid: id
					}
					console.log(id)
					this.axios({
							url: "http://localhost:8088/frameproject/baseCapitalAccount/setState",
							method: "get",
							processData: false,
							params: uid,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("设置该账户为默认账号是否成功：" + response.data.data);
							if (response.data.data) {
								_this.$message({
									type: 'success',
									message: '设置成功'
								})
								};
							if (index==1) {
								_this.updateDialogFormVisible = false;
								};
								_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
			
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消设置'
					});
				});
			},
			
			//判断结算类型名称是否重复
			pdName(val) {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var settlementType = {
					settlementType: val
				}
				this.axios({
						url: "http://localhost:8088/frameproject/baseSettlementType/judgeSettlementType",
						method: "get",
						processData: false,
						params: settlementType,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("结算类型名称不重复是否通过:" + response.data)
						_this.judge = response.data
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加结算类型
			AddST() {
				console.log(this.SettlementForm)
				if (this.SettlementForm.settlementType == null || this.SettlementForm.settlementType == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.pdName(this.SettlementForm.settlementType)
					setTimeout(() => {
						if (this.judge) {
							const state = JSON.parse(sessionStorage.getItem("state"));
							var _this = this;
							this.dialogFormVisibleSettlement = false
							//添加仓库
							this.axios({
									url: "http://localhost:8088/frameproject/baseSettlementType/addSettlementType",
									method: "post",
									processData: false,
									data: {
										settlementType: JSON.stringify(_this.SettlementForm)
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
									_this.SettlementForm = {}
									_this.judge = {}
									_this.findST()
								})
								.catch(function(error) {
									console.log(error);
								});
						} else {
							ElMessage.warning({
								message: '结算类型名称重复！',
								type: 'success'
							});
						}
					}, 200)
				}
			}
		},
		computed: {},
		created() {
			this.findpage()
			this.findST()
		}
	};
</script>

<style lang="scss">
	.CapitalAccount {
		width: 100%;
		background-color: white;
	}

	.CapitalAccount .r-float {
		float: right;
	}

	/* 顶部 */
	.CapitalAccount .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	.CapitalAccount .shenpi {
		float: right;
		line-height: 20px;
	}

	.CapitalAccount .page-search {
		float: left;
		padding: 13px;
	}

	.CapitalAccount .page-search-content {
		margin: 4px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.CapitalAccount-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.CapitalAccount .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.CapitalAccount .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.CapitalAccount-mian {
		background-color: #e9eef3;
		padding-top: 10px;
	}

	.CapitalAccount th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.CapitalAccount th>.cell {
		color: white !important;
	}

	.CapitalAccount-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.CapitalAccount .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.CapitalAccount-main .el-input__inner {
		border: 0;
	}

	.CapitalAccount th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.CapitalAccount .remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.CapitalAccount .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.CapitalAccount-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
