<template>
	<!-- 主内容 -->
	<div class="salelist">
		<!-- 标题 -->
		<div class="page-tag">
			<span style="float: left">资金账户汇总表</span>
			<!-- 标签页 -->
		</div>
		<!-- 表单头部 筛选 -->
		<div class="salelist-header">
			<el-collapse accordion v-model="activeNames">
				<el-collapse-item name="1">
					<template #title>
						<span>筛选条件:</span>
						<el-tag :key="tag" v-for="tag in all" size="medium">
							{{ tag }}
						</el-tag>
					</template>
					<div>
						<!-- 单据日期 -->
						<div style="height: 50px">
							<span>单据日期:</span>
							<el-radio-group v-model="billdate" size="small" @change="findpage">
								<el-radio-button label="全部"></el-radio-button>
								<el-radio-button label="上周"></el-radio-button>
								<el-radio-button label="本月"></el-radio-button>
								<el-radio-button label="上月"></el-radio-button>
								<el-radio-button label="自定义"></el-radio-button>
							</el-radio-group>
							<div v-show="custom1" style="top: -45px; left: 485px; position: relative">
								<el-date-picker v-model="customtime1" type="daterange" range-separator="至" start-placeholder="开始日期"
								 end-placeholder="结束日期">
								</el-date-picker>
							</div>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>
		{{customtime1}}
		<!-- 表体内容 -->
		<div class="salelist-mian">

			<el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" stripe>
				<el-table-column prop="capitalId" label="资金账户编号" fixed width="200" />
				<el-table-column prop="fundAccount" label="资金账户名称" width="190" />
				<el-table-column prop="settlementType" label="结算类型名称" width="150" />
				<el-table-column prop="paymentMoney" label="支出合计(元)" width="120" />
				<el-table-column prop="receiptMoney" label="收入合计(元)" width="120" />
				<el-table-column prop="initialAmount" label="初期金额" width="120" />
				<el-table-column prop="currentAmount" label="当前金额" width="120" />
			</el-table>
		</div>
		<!-- 表尾分页显示 -->
		<div class="salelist-footer" v-show="paging">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 50px"
			 @current-change="handleCurrentChange" v-model:currentPage="currentPage">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Receivable',
		data() {
			return {
				//默认展开
				activeNames: '1',
				//筛选框
				billdate: '全部', //单据日期
				customtime1: '', //自定义时间
				date1: (() => { //上周
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
					return [start, end]
				})(),
				date2: (() => { //这个月
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
					return [start, end]
				})(),
				date3: (() => { //上个月
					const end = new Date()
					const start = new Date()
					start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
					return [start, end]
				})(),
				options1: [],
				
				//条件查询数据
				vagueorderid: '',
				condition: {
					orderTime: '' //单据日期
				},
				dialogTableVisible: false,
				pstatus: [],
				
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
			}
		},
		computed: {
			paging: function() {
				return this.tableData.length > 0 ? true : false
			},
			custom1: function() {
				return this.billdate == '自定义' ? true : false
			},
			all: function() {
				var value1 = ''
				this.options1.forEach((item) => {
					if (item.customerNumber == this.value1) {
						value1 = item.customerName
					}
				})
				return [
					'单据日期: ' + this.billdate
				]
			},
		},
		methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//分页查询
			findpage(val) {
				console.log(val)
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					startTime:'',
					endTime:''
				};
				this.axios({
						url: "http://localhost:8088/frameproject/ReportFormController/fundAllFundAccountsStatisticsVo",
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
		},
		created: function() {
			this.findpage()
		},
	}
</script>

<style>
	.salelist {
		width: 100%;
		background-color: #e9eef3 !important;
	}

	/* 顶部 */
	.salelist .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	/* 内容表头 筛选框 */
	.salelist-header {
		padding: 15px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.salelist .el-radio-group {
		margin: 10px 0px;
	}

	.salelist-header span {
		font-size: 14px;
		color: #666666;
		margin-right: 10px;
	}

	.salelist .el-tag {
		color: #409eff !important;
	}

	.salelist .el-collapse,
	.salelist .el-collapse-item__wrap,
	.salelist .el-collapse-item__header,
	.salelist .el-radio-button__inner {
		border: none !important;
		border-radius: 0px !important;
	}

	.salelist .el-select--small {
		line-height: 32px;
		margin-right: 20px;
	}

	/* 表体内容 */
	.salelist-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.salelist th {
		color: white !important;
		background-color: #459df5 !important;
	}

	.salelist-look th {
		color: #666666 !important;
		background-color: #e8e8e8 !important;
	}

	.salelist .cell {
		text-align: center;
	}

	/* 内容表尾 */
	.salelist-footer {
		padding: 25px 15px;
		background-color: white;
		text-align: center;
	}
</style>
