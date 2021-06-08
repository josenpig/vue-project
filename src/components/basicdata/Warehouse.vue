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
						<el-form-item label="仓库名称" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="仓库编号" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="仓库地址" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="负责人" :label-width="formLabelWidth">
							<el-select v-model="selcharge" placeholder="请选择" size="mini" style="width:150px">
								<el-option v-for="item in charge" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="form.name" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
						</span>
					</template>
				</el-dialog>

			</div>
		</div>
		<!-- 表单头部 -->

		<!-- 表体内容 -->
		<div class="Warehouse-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column prop="date" label="操作" width="202">
					<template #default="scope">
						<el-button size="small" type="text" icon="el-icon-edit" circle></el-button>
						<el-button size="small" @click="del(scope.row.productId,scope.$index)" type="text" icon="el-icon-delete" circle></el-button>
						<el-button round style="background-color: orange;color: white;">禁用</el-button>
					</template>
				</el-table-column>
				<el-table-column prop="depotName" label="仓库名称" sortable width="140" />
				<el-table-column prop="depotId" label="仓库编号" sortable width="130" />
				<el-table-column prop="depotAddress" label="仓库地址" sortable width="130" />
				<el-table-column prop="chargeName" label="负责人" sortable width="120" />
				<el-table-column prop="contactNumber" label="联系电话" sortable width="120" />
				<el-table-column prop="remarks" label="备注" sortable width="120" />
				<el-table-column prop="state" label="状态" sortable width="120">
					<template #default="scope">
						<span>{{scope.row.state==1?"已启用":"禁用"}}</span>
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
	export default {
		name: "Warehouse",
		data() {
			return {
				dialogTableVisible: false,
				dialogFormVisible: false,
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: '',
					charge: ''
				},
				formLabelWidth: '120px',
				radio: '1',
				selcharge: '李明',
				SearchType: '仓库名称',
				SearchContent: '',
				type: [{
					value: '选项1',
					label: '仓库名称'
				}, {
					value: '选项2',
					label: '仓库编号'
				}],
				charge: [{
					value: '选项1',
					label: '李明'
				}, {
					value: '选项2',
					label: '张梅梅'
				}, {
					value: '选项3',
					label: '王二狗'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '王富贵'
				}],
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
			}
		},
		methods: {
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
			}
		},
		computed: {},
		created() {
			this.findpage()
		}
	};
</script>

<style lang="scss">
	.Warehouse {
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
