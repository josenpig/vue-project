<template>
	<!-- 主内容 -->
	<div class="vendor">
		<!-- 标题 -->
		<div class="page-tag">
			<span>供应商列表</span>
			<div class="shenpi">
				<!-- 新增供应商 -->
				<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;">
					<i class="el-icon-plus"></i> 新增供应商
				</el-button>

				<el-dialog title="供应商信息" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 供应商编号 *" :label-width="formLabelWidth">
							<el-input v-model="form.vendorId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 供应商名称 *" :label-width="formLabelWidth">
							<el-input v-model="form.vendorName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="地址" :label-width="formLabelWidth">
							<el-input v-model="form.address" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="* 供应商类型 *" :label-width="formLabelWidth">
							<el-select v-model="form.vendorType" placeholder="请选择供应商类型 (必选)">
								<el-option label="批发" value="批发"></el-option>
								<el-option label="一级供供应商" value="一级供供应商"></el-option>
								<el-option label="二级供供应商" value="二级供供应商"></el-option>
								<el-option label="个体" value="个体"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth">
							<el-select v-model="form.charge" placeholder="请选择负责人 (必选)">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="form.contactName" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="form.contactAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="form.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="pdCID">确 定</el-button>
						</span>
					</template>
				</el-dialog>
				
				<!--修改供应商-->
				<el-dialog title="修改供应商信息" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 供应商编号 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.vendorId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 供应商名称 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.vendorName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.address" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="* 供应商类型 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.vendorType" placeholder="请选择供应商类型 (必选)">
								<el-option label="批发" value="批发"></el-option>
								<el-option label="一级供供应商" value="一级供供应商"></el-option>
								<el-option label="二级供供应商" value="二级供供应商"></el-option>
								<el-option label="个体" value="个体"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.charge" placeholder="请选择 (必选)" style="width:150px" @change="findpageByTypeOrCharge">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactName" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="updateDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updateVendor">确 定</el-button>
						</span>
					</template>
				</el-dialog>

			</div>
		</div>
		<!-- 表单头部 -->
		<div style="font-size: 15px;padding: 15px;">
			<div>
				<span style="font-size: 14.5px;">供应商类型：</span>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="全部">全部</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="批发">批发</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="一级供应商">一级供应商</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="二级供应商">二级供应商</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="个体">个体</el-radio>
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
			<el-button @click="batchDel" size="mini"><i class="el-icon-close"></i> 批量删除</el-button>
		</div>
		<!--搜索框-->
		<div class="page-search">
			<div style="float: left;margin: 5px 0px;">
				<el-select v-model="select" size="mini" style="width:110px">
					<el-option v-for="item in type" :key="item.label" :label="item.label" :value="item.label"></el-option>
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
		<div class="vendor-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column fixed label="操作" width="120">
					<template #default="scope">
						<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.vendorId,scope.$index)" type="text" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
				<el-table-column fixed prop="vendorId" label="供应商编号" sortable width="120" />
				<el-table-column prop="vendorName" label="供应商名称" sortable width="120" />
				<el-table-column prop="vendorType" label="供应商类型" sortable width="120" />
				<el-table-column prop="accountsPayable" label="应付款金额(元)" sortable width="150" />
				<el-table-column prop="address" label="地址"  width="120" />
				<el-table-column prop="charge" label="负责人" sortable width="120" />
				<el-table-column prop="contactName" label="联系人姓名"  width="120" />
				<el-table-column prop="contactNumber" label="联系人电话"  width="120" />
				<el-table-column prop="contactAddress" label="联系人地址"  width="120" />
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
		name: "vendor",
		data() {
			return {
				//新增供应商信息弹框
				dialogFormVisible: false,
				//修改供应商信息弹框
				updateDialogFormVisible: false,
				//新增供应商表单
				form: {
					vendorId: '',//供应商编号
					vendorName: '',//供应商名称
					vendorType: '',//供应商类型:类型： 批发、一级供应商、二级供应商、个体
					address: '',//地址
					charge: '',//负责人
					contactName: '',//联系人姓名
					contactAddress: '',//联系人地址
					contactNumber: '',//联系人电话
					user: ''//创建人
				},
				//修改供应商表单
				updateForm: {
					vendorId: '',//供应商编号
					vendorName: '',//供应商名称
					vendorType: '',//供应商类型:类型： 批发、一级供应商、二级供应商、个体
					address: '',//地址
					charge: '',//负责人
					contactName: '',//联系人姓名
					contactAddress: '',//联系人地址
					contactNumber: '',//联系人电话
				},
				formLabelWidth: '120px',
				radio: '1',
				
				//选中搜索条件（默认仓库名称）
				select: '供应商名称',
				//搜索框中内容
				SearchContent: '',
				//搜索框条件
				type: [{
					label: '供应商名称'
				}, {
					label: '供应商编号'
				}],
				//选中客户类型
				selVendorType: '全部',

				//负责人
				charge: [],
				//选中负责人 （默认全部）
				selcharge: '全部',
				//全部负责人
				selectAll: '全部',

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				//多选供应商
				selectCus: [],

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
						console.log(response.data.data)
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
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor",
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
			//根据供应商类型或负责人查询
			findpageByTypeOrCharge() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					selcharge: this.selcharge,
					selVendorType: this.selVendorType,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/ByTypeOrCharge",
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
			//根据供应商编号或供应商名称查询
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
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/ByIdOrName",
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
			//删除供应商
			del(id, index) {
				var _this = this;
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
							url: "http://localhost:8088/frameproject/baseVendor/delVendor",
							method: "get",
							processData: false,
							params: pid,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
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
			//批量删除供应商
			batchDel() {
				this.$confirm('此操作将永久删除下列' + this.selectCus.length + ':个供应商, 是否继续?', '提示', {
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
						ids.push(v.vendorId)
					})
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/delVendor/batch",
							method: "delete",
							processData: false,
							data: ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
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
			//判断供应商ID是否重复并添加供应商
			pdCID() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var id = {
					id: this.form.vendorId
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/judgeVendorId",
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
						if (response.data==false) {
							ElMessage.warning({
								message: '供应商ID重复',
								type: 'success'
							});
						}else{
							_this.AddVendor()
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加供应商
			AddVendor() {
				console.log(this.form)
				if (this.form.vendorId == '' ||
					this.form.vendorName == '' ||
					this.form.vendorType == '' ||
					this.form.charge == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.form.user = state.userInfo.userName;
					this.dialogFormVisible = false
					//添加供应商
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/addVendor",
							method: "post",
							processData: false,
							data: {
								vendor: JSON.stringify(_this.form)
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
			openupdate(val){
				this.updateDialogFormVisible= true;
				
				this.updateForm.vendorId= val.vendorId
				this.updateForm.vendorName= val.vendorName
				this.updateForm.vendorType= val.vendorType
				this.updateForm.address= val.address
				this.updateForm.charge= val.charge
				this.updateForm.contactName= val.contactName 
				this.updateForm.contactAddress= val.contactAddress
				this.updateForm.contactNumber= val.contactNumber
				
			},
			//修改供应商信息
			updateVendor(){
				console.log(this.updateForm)
				if (
					this.updateForm.vendorType == '' ||
					this.updateForm.charge == '' ) {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//修改供应商
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/updateVendor",
							method: "post",
							processData: false,
							data: {
								vendor: JSON.stringify(_this.updateForm)
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
	.vendor {
		width: 100%;
		background-color: white;
	}

	.vendor .r-float {
		float: right;
	}

	/* 顶部 */
	.vendor .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	.vendor .shenpi {
		float: right;
		line-height: 20px;
	}

	.vendor .page-search {
		float: right;
		padding: 13px;
	}

	.vendor .page-search-content {
		margin: 4px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.vendor-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.vendor .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.vendor .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.vendor-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.vendor th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.vendor th>.cell {
		color: white !important;
	}

	.vendor-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.vendor .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.vendor-main .el-input__inner {
		border: 0;
	}

	.vendor th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.vendor .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.vendor-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
