<template>
	<!-- 主内容 -->
	<div class="Warehouse">
		<!-- 标题 -->
		<div class="page-tag">
			<span>仓库列表</span>
			<div class="shenpi">
				<!-- 新增仓库 -->
				<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;">
					<i class="el-icon-plus"></i> 新增仓库
				</el-button>
				<el-dialog title="仓库信息" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 仓库编号 *" :label-width="formLabelWidth">
							<el-input v-model="form.depotId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 仓库名称 *" :label-width="formLabelWidth">
							<el-input v-model="form.depotName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="仓库地址" :label-width="formLabelWidth">
							<el-input v-model="form.depotAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="负责人" :label-width="formLabelWidth" >
							<el-select v-model="form.chargeName" filterable placeholder="请选择负责人 (必选)">
								<el-option v-for="item in charge" :key="item.chargeName" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" :label-width="formLabelWidth">
							<el-input v-model="form.remarks" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="form.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="pdID">确 定</el-button>
						</span>
					</template>
				</el-dialog>

				<!--修改仓库信息-->
				<el-dialog title="修改仓库信息" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 仓库编号 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.depotId" autocomplete="off" placeholder="(必填)" maxlength="20"
							 show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 仓库名称 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.depotName" autocomplete="off" placeholder="(必填)" maxlength="20"
							 show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="仓库地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.depotAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="负责人" :label-width="formLabelWidth">
							<el-select v-model="updateForm.chargeName" placeholder="请选择负责人 (必选)">
								<el-option v-for="item in charge" :key="item.chargeName" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" :label-width="formLabelWidth">
							<el-input v-model="updateForm.remarks" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="状态" :label-width="formLabelWidth">
							<span v-if="updateForm.state==0" style="color: orangered;padding: 15px;">已禁用</span>
							<span v-if="updateForm.state==1" style="color: seagreen;padding: 15px;">已启用</span>
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
		<div class="Warehouse-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column prop="date" fixed label="操作" width="100">
					<template #default="scope">
						<el-button size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.depotId)" type="text" icon="el-icon-delete" circle></el-button>
					</template>
				</el-table-column>
				<el-table-column prop="date" fixed label="修改状态" width="100">
					<template #default="scope">
						<el-button v-if="scope.row.state==1" @click="disableOrEnable(scope.row)" round style="background-color: rgba(255,127,80,0.7);color: white;">禁用</el-button>
						<el-button v-if="scope.row.state==0" @click="disableOrEnable(scope.row)" round style="background-color: rgba(144,238,144,0.6) ;color: white;">启用</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="state" label="状态" sortable width="100">
					<template #default="scope">
						<span v-if="scope.row.state==0" style="color: orangered;">禁用</span>
						<span v-if="scope.row.state==1" style="color: seagreen;">启用</span>
					</template>
				</el-table-column>
				<el-table-column prop="depotId" fixed label="仓库编号" sortable width="130" />
				<el-table-column prop="depotName" label="仓库名称" sortable width="140" />
				<el-table-column :show-overflow-tooltip="true" prop="depotAddress" label="仓库地址"  width="130" />
				<el-table-column :show-overflow-tooltip="true" prop="chargeName" label="负责人" sortable width="100" />
				<el-table-column prop="contactNumber" label="联系电话"  width="110" />
				<el-table-column :show-overflow-tooltip="true" prop="remarks" label="备注"  width="109" />
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
		name: "Warehouse",
		data() {
			return {
				//新增仓库信息弹框
				dialogFormVisible: false,
				//修改仓库信息弹框
				updateDialogFormVisible: false,
				//新增仓库表单
				form: {
					depotId: '', //仓库编号
					depotName: '', //仓库名称
					depotAddress: '', //仓库地址
					chargeName: '', //负责人
					contactNumber: '', //联系电话
					remarks: '', //备注
				},
				//修改仓库表单
				updateForm: {
					depotId: '', //仓库编号
					depotName: '', //仓库名称
					depotAddress: '', //仓库地址
					chargeName: '', //负责人
					contactNumber: '', //联系电话
					remarks: '', //备注
					state: '' //状态: （已启用：1；已禁用：0）
				},
				formLabelWidth: '120px',

				//选中搜索条件（默认仓库名称）
				select: '仓库名称',
				//搜索框中内容
				SearchContent: '',
				//搜索框条件
				type: [{
					label: '仓库名称'
				}, {
					label: '仓库编号'
				}],
				//负责人数据
				charge: [],
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
						url: "http://localhost:8088/frameproject/baseDepot/findAllDepot",
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
						url: "http://localhost:8088/frameproject/baseDepot/findAllDepot/ByIdOrName",
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
			//删除仓库
			del(id) {
				var _this = this;
				this.$confirm('此操作将永久删除该仓库, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					const state = JSON.parse(sessionStorage.getItem("state"));
					var depotId = {
						depotId: id
					};
					console.log(id)
					this.axios({
							url: "http://localhost:8088/frameproject/baseDepot/delDepot",
							method: "get",
							processData: false,
							params: depotId,
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
							} else {
								ElMessage.warning({
									message: '该仓库存在关联产品，无法删除！',
									type: 'success'
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
						message: '已取消删除'
					});
				});
			},
			//判断仓库ID是否重复并添加仓库
			pdID() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var id = {
					id: this.form.depotId
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseDepot/judgeDepotId",
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
								message: '仓库ID重复',
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
			//添加仓库
			Add() {
				console.log(this.form)
				if (this.form.depotId == '' ||
					this.form.depotName == '' ||
					this.form.chargeName == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.form.user = state.userInfo.userName;
					this.dialogFormVisible = false
					//添加仓库
					this.axios({
							url: "http://localhost:8088/frameproject/baseDepot/addDepot",
							method: "post",
							processData: false,
							data: {
								Depot: JSON.stringify(_this.form)
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

				this.updateForm.depotId = val.depotId
				this.updateForm.depotName = val.depotName
				this.updateForm.depotAddress = val.depotAddress
				this.updateForm.chargeName = val.chargeName
				this.updateForm.contactNumber = val.contactNumber
				this.updateForm.remarks = val.remarks
				this.updateForm.state = val.state

			},
			//修改仓库信息
			update() {
				console.log(this.updateForm)
				if (
					this.updateForm.charge == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//修改仓库
					this.axios({
							url: "http://localhost:8088/frameproject/baseDepot/updateDepot",
							method: "post",
							processData: false,
							data: {
								Depot: JSON.stringify(_this.updateForm)
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
				this.$confirm('是否'+able+'该仓库！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
				
					const state = JSON.parse(sessionStorage.getItem("state"));
					console.log(val)
					var Dstate = {
						Did: val.depotId,
						Dstate: val.state
					};
					this.axios({
							url: "http://localhost:8088/frameproject/baseDepot/disableOrEnable",
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
									message: able+'成功'
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
						message: '已取消'+able
					});
				});
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
	.Warehouse .Warehouse {
		width: 100%;
		background-color: white;
	}

	.Warehouse .r-float {
		float: right;
	}

	/* 顶部 */
	.Warehouse .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	.Warehouse .shenpi {
		float: right;
		line-height: 20px;
	}

	.Warehouse .page-search {
		float: left;
		padding: 10px;
	}

	.Warehouse .page-search-content {
		margin: 4px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.Warehouse-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.Warehouse .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.Warehouse .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.Warehouse-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.Warehouse th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.Warehouse th>.cell {
		color: white !important;
	}

	.Warehouse-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.Warehouse .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.Warehouse-main .el-input__inner {
		border: 0;
	}

	.Warehouse th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.Warehouse .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.Warehouse-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
