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
								<el-radio-button @click="this.customtime1=''" label="全部"></el-radio-button>
								<el-radio-button @click="this.customtime1=this.date1" label="上周"></el-radio-button>
								<el-radio-button @click="this.customtime1=this.date2" label="本月"></el-radio-button>
								<el-radio-button @click="this.customtime1=this.date3" label="上月"></el-radio-button>
								<el-radio-button label="自定义"></el-radio-button>
							</el-radio-group>
							<div v-show="custom1" style="top: -45px; left: 485px; position: relative">
								<el-date-picker @change="findpage" v-model="customtime1" type="daterange" range-separator="至" start-placeholder="开始日期"
								 end-placeholder="结束日期" format="YYYY 年 MM 月 DD 日" value-format="YYYY-MM-DD HH:mm:ss">
								</el-date-picker>
							</div>
						</div>
					</div>
				</el-collapse-item>
			</el-collapse>
		</div>

		<!--横向条状图-->
		<div class="Echarts">
			<div id="main" style="width: 540px;height:250px;padding: 10px 0px 0px 230px;"></div>
		</div>
		<!---->

		<!-- 表体内容 -->
		<div class="salelist-mian">

			<el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" stripe>
				<el-table-column prop="capitalId" label="资金账户编号" fixed width="200" />
				<el-table-column prop="fundAccount" label="资金账户名称" width="250" />
				<el-table-column prop="settlementType" label="结算类型名称" width="200" />
				<el-table-column prop="receiptMoney" label="收入合计(元)" width="150" />
				<el-table-column prop="paymentMoney" label="支出合计(元)" width="150" />
				<el-table-column prop="initialAmount" label="初期金额" width="150" />
				<el-table-column prop="currentAmount" label="当前金额" width="150" />
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
	import * as echarts from 'echarts'
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
					const start = new Date()
					const end = new Date()
					const day = [7, 1, 2, 3, 4, 5, 6][end.getDay()];
					end.setTime(end.getTime() - (day) * 24 * 60 * 60 * 1000)
					start.setTime(end.getTime() - 24 * 60 * 60 * 1000 * 6)
					start.setHours(0)
					start.setMinutes(0)
					start.setSeconds(0)
					end.setHours(23)
					end.setMinutes(59)
					end.setSeconds(59)
					const start1 = (start.getYear() + 1900) + "-" + start.getMonth() + "-" + start.getDate() + " " + start.getHours() +
						":" + start.getMinutes() + ":" + start.getSeconds()
					const end1 = (end.getYear() + 1900) + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " " + end.getHours() +
						":" + end.getMinutes() + ":" + end.getSeconds()
					return [start1, end1]
				})(),
				date2: (() => { //这个月
					const end = new Date()
					const start = new Date()
					start.setTime(end.getTime() - 24 * 60 * 60 * 1000 * (end.getDate()))
					start.setHours(24)
					start.setMinutes(0)
					start.setSeconds(0)
					const start1 = (start.getYear() + 1900) + "-" + (start.getMonth() + 1) + "-" + start.getDate() + " " + start.getHours() +
						":" + start.getMinutes() + ":" + start.getSeconds()
					const end1 = (end.getYear() + 1900) + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " " + end.getHours() +
						":" + end.getMinutes() + ":" + end.getSeconds()
					return [start1, end1]
				})(),
				date3: (() => { //上个月
					const end = new Date()
					const start = new Date()
					end.setTime(end.getTime() - 24 * 60 * 60 * 1000 * (end.getDate() - 1))
					end.setHours(-24)
					end.setMinutes(0)
					end.setSeconds(0)
					start.setTime(end.getTime() - 24 * 60 * 60 * 1000 * 29)
					start.setHours(-24)
					start.setMinutes(0)
					start.setSeconds(0)
					const start1 = (start.getYear() + 1900) + "-" + start.getMonth() + "-" + start.getDate() + " " + start.getHours() +
						":" + start.getMinutes() + ":" + start.getSeconds()
					const end1 = (end.getYear() + 1900) + "-" + (end.getMonth() + 1) + "-" + end.getDate() + " " + end.getHours() +
						":" + end.getMinutes() + ":" + end.getSeconds()
					return [start1, end1]
				})(),
				options1: [],

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
				
				//本期总收入
				rsum:0,
				//本期总支出
				psum:0
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
			}
		},
		methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//分页查询
			findpage() {
				console.log(this.billdate)
				console.log(this.customtime1[0])
				console.log(this.customtime1[1])
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					startTime: this.customtime1[0],
					endTime: this.customtime1[1]
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
						
						_this.sum()
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			myEcharts() {
				var chartDom = document.getElementById('main');
				var myChart = echarts.init(chartDom);
				var option;
				
				option = {
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: ['收入', '支出']
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value',
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: 'category',
						data: ['本期收支汇总']
					},
					series: [{
							name: '收入',
							type: 'bar',
							data: [this.rsum]
						},
						{
							name: '支出',
							type: 'bar',
							data: [this.psum]
						}
					]
				};
				
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
			},
			//资金账户期间总收入和总支出
			sum(){
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log("time:"+this.customtime1)
				var fd = {
					startTime: this.customtime1[0],
					endTime: this.customtime1[1]
				};
				this.axios({
						url: "http://localhost:8088/frameproject/ReportFormController/fundAllRsumAndPsum",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.rsum = response.data.data[0];
						_this.psum = response.data.data[1];
						
						console.log("rsum:"+_this.rsum)
						console.log("psum:"+_this.psum)
						_this.myEcharts();
					})
					.catch(function(error) {
						console.log(error);
					});
			}

		},
		mounted() {
			this.findpage()
			setTimeout(()=>{
				this.sum();
			},500)
		},
		created: function() {
		},
	}
</script>
<style>
	.salelist {
		width: 100%;
		background-color: #e9eef3 !important;
	}

	.Echarts {
		height: 270px;
		padding-left: 70px;
		background-color: white;
		margin: 10px 0px;
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
