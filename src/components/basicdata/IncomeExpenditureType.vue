<template>
	<!-- 主内容 -->
	<div class="IncomeExpenditureType">
		<!-- 标题 -->
		<div class="page-tag">
			<span>收支类型列表</span>
		</div>
		<!-- 表单头部 -->

		<!-- 表体内容 -->
		  <el-tabs v-model="activeName" style="padding:10px 20px;">
		    <el-tab-pane label="收入类别" name="first">
				<div class="shenpi">
					<!-- 新增收入类型 -->
					<el-button type="text" size="mini" @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 110px;">
						<i class="el-icon-plus"></i> 新增收入类型
					</el-button>
				
					<el-dialog title="新增收入类型" v-model="dialogFormVisible">
						<hr style="margin-bottom: 20px;" />
						<el-form :model="form">
							<el-form-item label="收入类型名称" :label-width="formLabelWidth">
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
				<div>
					<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
					 stripe>
						<el-table-column type="selection" width="55" />
						<el-table-column prop="date" label="操作" width="150">
							<el-button size="small " type="primary" icon="el-icon-edit" circle></el-button>
							<el-button size="small " type="danger" icon="el-icon-delete" circle></el-button>
						</el-table-column>
						<el-table-column prop="name" label="收入类别" sortable width="170" />
					</el-table>
				</div>
			</el-tab-pane>
		    <el-tab-pane label="支出类别" name="second">
				<div class="shenpi">
					<!-- 新增支出类别 -->
					<el-button type="text" size="mini" @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 110px;">
						<i class="el-icon-plus"></i> 新增支出类别
					</el-button>
				
					<el-dialog title="新增支出类别" v-model="dialogFormVisible">
						<hr style="margin-bottom: 20px;" />
						<el-form :model="form">
							<el-form-item label="支出类别名称" :label-width="formLabelWidth">
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
				<div>
					<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
					 stripe>
						<el-table-column type="selection" width="55" />
						<el-table-column prop="date" label="操作" width="150">
							<el-button size="small " type="primary" icon="el-icon-edit" circle></el-button>
							<el-button size="small " type="danger" icon="el-icon-delete" circle></el-button>
						</el-table-column>
						<el-table-column prop="name" label="支出类别" sortable width="170" />
					</el-table>
				</div>
			</el-tab-pane>
		  </el-tabs>
		<!-- 表尾分页显示 -->
		<div class="IncomeExpenditureType-footer" v-show="paging">
			<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
			 :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next" :total="400">
			</el-pagination>
		</div>


	</div>
</template>
<script>
	export default {
		name: "IncomeExpenditureType",
		data() {
			return {
				activeName:'first',
				dialogTableVisible: false,
				dialogFormVisible: false,
				formLabelWidth: '120px',
				name: '',
				form: [{
					name: ''
				}],
				tableData: [{
					name: '支付宝'
				}, {
					name: '微信'
				}, {
					name: '银行卡'
				}, {
					name: '现金'
				}]
			}
		},
		computed: {},
		methods: {

		}
	};
</script>

<style lang="scss">
	.IncomeExpenditureType {
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
	.IncomeExpenditureType-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.IncomeExpenditureType .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.IncomeExpenditureType .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */

	.IncomeExpenditureType th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.IncomeExpenditureType th>.cell {
		color: white !important;
	}

	.IncomeExpenditureType-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.IncomeExpenditureType .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.IncomeExpenditureType-main .el-input__inner {
		border: 0;
	}

	.IncomeExpenditureType th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.IncomeExpenditureType .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.IncomeExpenditureType-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
