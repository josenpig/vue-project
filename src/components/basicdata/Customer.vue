<template>
	<!-- 主内容 -->
	<div class="customer">
		<!-- 标题 -->
		<div class="page-tag">
			<span>客户列表</span>
			<div class="shenpi">
				<!-- 新增客户 -->
				<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;">
					<i class="el-icon-plus"></i> 新增客户
				</el-button>

				<el-dialog title="新增客户信息" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 客户编号 * " :label-width="formLabelWidth">
							<el-input v-model="form.customerNumber" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 客户名称 *" :label-width="formLabelWidth">
							<el-input v-model="form.customerName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 客户类型 *" :label-width="formLabelWidth">
							<el-select v-model="form.customerType" placeholder="请选择客户类型  (必选)">
								<el-option label="大客户" value="大客户"></el-option>
								<el-option label="普通" value="普通"></el-option>
								<el-option label="经销商" value="经销商"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 调价比例(%) *" :label-width="formLabelWidth">
							<el-input-number v-model="form.ratio" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth">
							<el-select v-model="form.chargeName" placeholder="请选择负责人  (必选)">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" :label-width="formLabelWidth">
							<el-input v-model="form.remarks" autocomplete="off"></el-input>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="form.contact" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="form.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="form.contactAddress" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="pdCID">确 定</el-button>
						</span>
					</template>
				</el-dialog>
				
				<!--修改客户信息-->
				<el-dialog title="修改客户信息" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="updateForm">
						<el-form-item label="* 客户编号 * " :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.customerNumber" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 客户名称 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.customerName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 客户类型 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.customerType" placeholder="请选择客户类型  (必选)">
								<el-option label="大客户" value="大客户"></el-option>
								<el-option label="普通" value="普通"></el-option>
								<el-option label="经销商" value="经销商"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 调价比例(%) *" :label-width="formLabelWidth">
							<el-input-number v-model="updateForm.ratio" :precision="2" :step="0.1" :min="0" :max="100"></el-input-number>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.chargeName" placeholder="请选择负责人  (必选)">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" :label-width="formLabelWidth">
							<el-input v-model="updateForm.remarks" autocomplete="off"></el-input>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contact" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactAddress" autocomplete="off"></el-input>
							</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="updateDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updateCustomer">确 定</el-button>
						</span>
					</template>
				</el-dialog>
				
			</div>
		</div>
		<!-- 表单头部 -->
		<div style="font-size: 15px;padding: 15px;">
			<div>
				<span style="font-size: 14.5px;">客户类型：</span>
				<el-radio @change="findpageByTypeOrCharge" v-model="selCustomerType" label="全部">全部</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selCustomerType" label="大客户">大客户</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selCustomerType" label="普通">普通</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selCustomerType" label="经销商">经销商</el-radio>
			</div>
			<div>
				<p />
				<span style="font-size: 14.5px;">负责人：</span>
				<el-select v-model="selcharge" placeholder="请选择" size="mini" style="width:150px" @change="findpageByTypeOrCharge">
					<el-option :label="selectAll" :value="selectAll"></el-option>
					<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
					</el-option>
				</el-select>
			</div>
		</div>
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
				<el-button icon="el-icon-search" @click="findpageByidOrName" circle></el-button>
			</div>
		</div>
		<!-- 表体内容 -->
		<div class="customer-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column label="操作" width="120">
					<template #default="scope">
						<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.customerNumber,scope.$index)" type="text" icon="el-icon-delete"
						 circle></el-button>
					</template>
				</el-table-column>
				<el-table-column prop="customerName" label="客户名称" sortable width="120" />
				<el-table-column prop="customerNumber" label="客户编号" sortable width="120" />
				<el-table-column prop="customerType" label="客户类型" sortable width="120" />
				<el-table-column prop="ratio" label="调价比例(%)" sortable width="120" />
				<el-table-column prop="chargeName" label="负责人" sortable width="120" />
				<el-table-column prop="contact" label="联系人姓名"  width="120" />
				<el-table-column prop="contactNumber" label="联系人电话"  width="120" />
				<el-table-column prop="contactAddress" label="联系人地址"  width="120" />
				<el-table-column prop="remarks" label="备注"  width="120" />
				<el-table-column prop="user" label="创建人" sortable width="120" />
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
	import {
		ElMessage
	} from 'element-plus'
	export default {
		name: "Customer",
		data() {
			return {
				//新增客户信息弹框
				dialogFormVisible: false,
				//修改客户信息弹框
				updateDialogFormVisible: false,
				//修改客户信息表单
				updateForm:{
					customerName: '', //客户名称
					customerNumber: '', //客户编号
					customerType: '', //客户类型: 类型：大客户、普通、经销商
					chargeName: '', //负责人
					ratio: 100, //调价比例（%）
					remarks: '', //备注
					contact: '', //联系人姓名
					contactAddress: '', //联系人地址
					contactNumber: '', //联系人电话
				},
				//新增客户信息表单
				form: {
					customerName: '', //客户名称
					customerNumber: '', //客户编号
					customerType: '', //客户类型: 类型：大客户、普通、经销商
					chargeName: '', //负责人
					ratio: 100, //调价比例（%）
					remarks: '', //备注
					contact: '', //联系人姓名
					contactAddress: '', //联系人地址
					contactNumber: '', //联系人电话
					user: '' //创建人名称
				},
				formLabelWidth: '120px',

				//选中客户类型
				selCustomerType: '全部',

				//负责人
				charge: [],
				//选中负责人 （默认全部）
				selcharge: '全部',
				//全部负责人
				selectAll: '全部',

				//选中搜索条件（默认客户名称）
				select: '客户名称',
				//搜索条件
				SearchType: [{
					label: "客户名称"
				}, {
					label: "客户编号"
				}],
				//输入数据
				SearchContent: '',

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				//多选产品
				selectCus: [],

				//判断
				judge: ''
			}
		},
		methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//查询所有负责人
			findAllCharge() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseCharge/selectAll",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						_this.charge = response.data.data;
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
					pageSize: this.pagesize,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseCustomer/findAllCustomer",
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
			//根据客户类型或负责人查询
			findpageByTypeOrCharge() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					selcharge: this.selcharge,
					selCustomerType: this.selCustomerType,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseCustomer/findAllCustomer/ByTypeOrCharge",
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
			//根据客户编号或客户名称查询
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
						url: "http://localhost:8088/frameproject/baseCustomer/findAllCustomer/ByIdOrName",
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
			//删除客户
			del(id, index) {
				var _this=this;
				this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
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
							url: "http://localhost:8088/frameproject/baseCustomer/delCustomer",
							method: "get",
							processData: false,
							params: pid,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log(response.data.data);
							_this.findpage()
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
			//批量删除客户
			batchDel() {
				this.$confirm('此操作将永久删除下列' + this.selectCus.length + ':个客户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$message({
						type: 'success',
						message: '删除成功'
					});
					var ids = new Array()
					this.selectCus.forEach(v => {
						ids.push(v.customerNumber)
					})
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseCustomer/delCustomer/batch",
							method: "delete",
							processData: false,
							data: ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log(response.data.data)
							_this.findpage()
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
			//复选框
			handleSelectionChange(val) {
				this.selectCus = val
			},
			//判断客户ID是否重复并添加客户
			pdCID() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var cid = {
					cid: this.form.customerNumber
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseCustomer/judgeCustomerId",
						method: "get",
						processData: false,
						params: cid,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("cid不重复是否通过:" + response.data)
						_this.judge = response.data
						if (response.data==false) {
							ElMessage.warning({
								message: '客户ID重复',
								type: 'success'
							});
						}else{
							_this.AddCustomer()
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加客户
			AddCustomer() {
				console.log(this.form)
				if (this.form.customeNumber == '' ||
					this.form.customerName == '' ||
					this.form.customerType == '' ||
					this.form.chargeName == '' ||
					this.form.ratio == null || this.form.ratio == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.form.user = state.userInfo.userName;
					this.dialogFormVisible = false
					//添加客户
					this.axios({
							url: "http://localhost:8088/frameproject/baseCustomer/addCustomer",
							method: "post",
							processData: false,
							data: {
								customer: JSON.stringify(_this.form)
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
							_this.form = {ratio: 100}
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			},
			//打开修改框
			openupdate(val){
				this.updateDialogFormVisible= true;
				
				this.updateForm.customerName= val.customerName
				this.updateForm.customerNumber= val.customerNumber
				this.updateForm.customerType= val.customerType
				this.updateForm.chargeName= val.chargeName
				this.updateForm.ratio= val.ratio 
				this.updateForm.remarks= val.remarks
				this.updateForm.contact= val.contact
				this.updateForm.contactAddress= val.contactAddress
				this.updateForm.contactNumber= val.contactNumber
			},
			//修改客户信息
			updateCustomer(){
				console.log(this.updateForm)
				if (
					this.updateForm.customerType == '' ||
					this.updateForm.chargeName == '' ||
					this.updateForm.ratio == null || this.updateForm.ratio == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//修改客户
					this.axios({
							url: "http://localhost:8088/frameproject/baseCustomer/updateCustomer",
							method: "post",
							processData: false,
							data: {
								customer: JSON.stringify(_this.updateForm)
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
							_this.updateDialogFormVisible= false;
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
			this.findAllCharge()
		}
	};
</script>

<style lang="scss">
	.customer {
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
		margin: 4px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.customer-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.customer .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.customer .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.customer-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.customer th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.customer th>.cell {
		color: white !important;
	}

	.customer-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.customer .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.customer-main .el-input__inner {
		border: 0;
	}

	.customer th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.customer .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.customer-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
