<template>
	<!-- 主内容 -->
	<div class="CapitalAccount">
		<!-- 标题 -->
		<div class="page-tag">
			<span>资金账户设置</span>
			<div class="shenpi">
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
						<el-form-item label="* 结算类型 *" :label-width="formLabelWidth">
							<el-select v-model="form.selcharge" placeholder="请选择结算类型 (必选)">
								<el-option v-for="item in SettlementType" :label="item.settlementType" :value="item.settlementType">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="初期金额" :label-width="formLabelWidth">
							<el-input v-model="form.initialAmount" autocomplete="off"></el-input>
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
							<el-input :disabled="true" v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="账户名称" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="结算类型" :label-width="formLabelWidth">
							<el-select v-model="selcharge" placeholder="请选择" size="mini" style="width:150px">
								<el-option v-for="item in Settlement_Type" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="初期金额" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="form.initialAmount" autocomplete="off"></el-input>
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
		<div class="CapitalAccount-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column prop="capitalId" label="账户编号" sortable width="120" />
				<el-table-column prop="fundAccount" label="账户名称" sortable width="120"/>
				<el-table-column prop="settlementType" label="结算类型" sortable width="120" />
				<el-table-column prop="initialAmount" label="初期金额(元)" sortable width="120" />
				<el-table-column prop="currentAmount" label="当前金额(元)" sortable width="120" />
				<el-table-column prop="state" label="是否为默认" sortable width="120">
					<template #default="scope">
						<span>{{scope.row.state==1?"默认账户":" "}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="date" label="操作" width="250">
					<template #default="scope">
						<el-button type="primary" size="small " icon="el-icon-edit" circle></el-button>
						<el-button type="danger" size="small " icon="el-icon-delete" circle></el-button>
						<el-button size="small " v-if="scope.row.state==0" round style="background-color: orange;color: white;">
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
					settlementType: '', //结算类型名称
				},
				//修改资金账户表单
				updateForm: {
					capitalId: '', //资金账户编号
					fundAccount: '', //资金账户名称
					initialAmount: '', //初期金额
					currentAmount: '', //当前金额
					settlementType: '', //结算类型名称
					state: '', //是否为默认账户: （是：1；否：0）
				},
				formLabelWidth: '120px',
				radio: '1',
				selcharge: '李明',
				SearchType: '资金账户名称',
				SearchContent: '',
				
				//资金账户表单
				SettlementType: [],
				
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
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
					this.form.settlementType ) {
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
								SettlementType: JSON.stringify(_this.form)
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
				this.updateForm.settlementType = val.settlementType
				this.updateForm.state = val.state
			
			},
			//修改资金账户信息
			update() {
				console.log(this.updateForm)
				if (
					this.form.fundAccount == '' ||
					this.form.settlementType) {
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
		;
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

	.remarks {
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
