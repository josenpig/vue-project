<template>
	<div class="workbench">
		<h3 style="margin: 5px;">业务数据统计</h3>
		<el-row :gutter="20">
			<el-col :span="8">
				<div class="grid-content bg-purple" >
					<el-card class="box-card" >
						<div slot="header" class="clearfix" >
							<span style="font-size: 16px;margin-top: 10px;">销售</span>
						</div>
						<div class="text item">
							<span>￥{{this.rsum}}</span>
							<div class="ik-pull-right">
								<span
								    class="stats__badge"
								    v-text="this.rcount + '笔'"
								  ></span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 16px;margin-top: 10px;">采购</span>
						</div>
						<div class="text item">
							<span>￥{{this.psum}}</span>
							<div class="ik-pull-right">
								<span
								    class="stats__badge"
								    v-text="this.pcount + '笔'"
								  ></span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 16px;">库存</span>
						</div>
						<div class="text item">
							<span>总量</span>
							<div class="text2">
								<span>{{this.ps}}</span>
							</div>
						</div>
						<div class="text item">
							<span style="size: 20px;">总成本</span>
							<div class="text2">
								<span>￥</span>
								<span>{{(this.ms).toFixed(2)}} </span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
		<div style="float: left;margin-top: 30px;">
			<!--横向条状图-->
			<div class="Echarts">
				<div id="main" style="width: 900px;height:700px;"></div>
			</div>
			<!---->
		</div>
		<div style="float: right;">
			<div id="f"></div>
			<el-calendar v-model="value" class="calen">
			</el-calendar>
		</div>
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	export default {
		name: "Workbench",
		data() {
			return {
				value: new Date(),
				//本期总收入
				rsum: 0,
				//本期总支出
				psum: 0,
				//付款总条数
				rcount:'',
				//收款总条数
				pcount:'',
				
				value1: "全部", //仓库名称
				value2: "全部", //产品名称
				value3: "全部", //产品分类
				value4: "否", //是否下架
				pagesize: 5,
				max: 0,
				currentPage: 1,

				tableData: [],

				//库存总量
				ps: 0,
				//总价值
				ms: 0,
				//产品销售top
				SalesTop:[],
				salesTop2:[],
			};
		},
		methods: {
			myEcharts() {
				var chartDom = document.getElementById('main');
				var myChart = echarts.init(chartDom);
				var option;
				
				option = {
				    title: {
				        text: '产品销售 TOP10',
				        subtext: '销售产品前十名',
				        left: 'center'
				    },
				    tooltip: {
				        trigger: 'item'
				    },
				    legend: {
				        orient: 'vertical',
				        left: 'left',
				    },
				    series: [
				        {
				            name: '产品销售',
				            type: 'pie',
				            radius: '50%',
				            data: this.salesTop2,
				            emphasis: {
				                itemStyle: {
				                    shadowBlur: 10,
				                    shadowOffsetX: 0,
				                    shadowColor: 'rgba(0, 0, 0, 0.5)'
				                }
				            }
				        }
				    ]
				};
				
				option && myChart.setOption(option);
			},
			//资金账户期间总收入和总支出
			sum() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log("time:" + this.customtime1)
				var fd = {
					startTime: null,
					endTime: null
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

						console.log("rsum:" + _this.rsum)
						console.log("psum:" + _this.psum)
						_this.myEcharts();
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//资金账户期间总条数
			count() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log("time:" + this.customtime1)
				this.axios({
						url: "http://localhost:8088/frameproject/ReportFormController/fundAllCount",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.pcount = response.data.data[0];
						_this.rcount = response.data.data[1];
			
						console.log("pcount:" + _this.pcount)
						console.log("rcount:" + _this.rcount)
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//库存
			findpagePro() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log(this.value1 + "+++" + this.value2 + "+++" + this.value3 + "+++" + this.value4)
				this.axios({
						url: "http://localhost:8088/frameproject/ReportFormController/findAllProductInventoryVo",
						method: "get",
						params: {
							depotName: _this.value1,
							productName: _this.value2,
							productTypeName: _this.value3,
							state: _this.value4,
							currentPage: _this.currentPage,
							pageSize: _this.pagesize
						},
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data.rows)
						_this.tableData = response.data.data.rows;
						_this.tableData.forEach((item) => {
							_this.ps += item.productNumber
							_this.ms += item.productNumber * item.purchaseUnitPrice
						})
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//查询产品销售top10
			findSalesTop() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/capitalPayment/findSalesTop",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.SalesTop = response.data.data;
						var f=10;
						if(_this.SalesTop.size<10){
							f=_this.SalesTop.size
						}
						for(var i=0;i<f;i++){
							_this.salesTop2.push({
								name: _this.SalesTop[i].productName,
								value: _this.SalesTop[i].psum,
							})
						}
						console.log(_this.salesTop2)
					})
					.catch(function(error) {
						console.log(error);
					});
			},
		},
		mounted() {
			this.sum();
		},
		created(){
			this.count();
			this.findpagePro();
			this.findSalesTop();
		}
	};
</script>

<style>
	.workbench .el-col {
		border-radius: 4px;
	}

	.workbench .bg-purple-dark {
		background: #99a9bf;
	}

	.workbench .bg-purple {
		background: #d3dce6;
	}

	.workbench .bg-purple-light {
		background: #e5e9f2;
	}

	.workbench .grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.workbench .row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}

	.workbench .text {
		font-size: 20px;
		margin-top: 20px;
	}

	.item {
		margin-bottom: 18px;
		line-height: 10px;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
		line-height: 10px;
	}

	.clearfix:after {
		clear: both;
	}

	.box-card {
		text-align: left;
		/*width: 250px;*/
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #409EFF;
	}

	.el-card__header {
		line-height: 10px;
		/*text-align: left;*/
		/*width: 200px;*/
	}

	.ik-pull-right {
		margin: -15px 0px 0px 80px;
	}

	.stats__badge {
		min-width: 54px;
		line-height: 20px;
		text-align: center;
		margin-left: 10px;
		font-size: 15px;
		border-radius: 2px;
		vertical-align: middle;
		display: inline-block;
		border: 1px solid #bcf2d4;
		background-color: #e5fff1;
		color: #66d598;
	}

	.work-tabs {
		background: white;
		border-radius: 1%;
	}

	.select-col {
		background-color: white;
		border-radius: 5px;
		margin: 20px 20px 20px 0;
		padding: 10px 10px;
	}

	.select-row {
		margin: 20px 5px;
	}

	.col-a {
		border: 1px solid #fcfcfc;
		min-height: 1px;
		background: transparent;
		display: block;
		float: left;
		padding: 20px 0 20px;
		color: #333333;
		text-decoration: none;
		text-align: center;
		background-color: white;
		border-bottom: 1px solid #eeeff3;
		border-right: 1px solid #eeeff3;
		width: 100%;
		transition: color 0.3s ease;
	}

	.col-a:hover {
		background-color: #fafafa;
	}

	.fast-row {
		margin-bottom: 0;
	}

	.fast-row-title {
		background-color: #eaeaea;
		padding: 5px;
		font-weight: bold;
		font-size: 14px;
	}

	.el-tabs__nav-scroll {
		margin-left: 10px;
	}

	#f {
		width: 250px;
		height: 33px;
		background-color: white;
		z-index: 99;
		position: relative;
		top: 45px;
		left: 50%;
	}
	
	.calen{
		width: 500px;
		height: 650px;
	}
	
	.text2{
		size: 20px;float: right;
	}
	
</style>
