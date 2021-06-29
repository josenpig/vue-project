<template>
	<div class="workbench">
		<el-row :gutter="20">
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 24px;margin-top: 10px;">总收入</span>
						</div>
						<div class="text item">
							<span>{{this.rsum}}</span>
							<div class="ik-pull-right">
								￥
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 24px;margin-top: 10px;">总支出</span>
						</div>
						<div class="text item">
							<span>{{this.psum}}</span>
							<div class="ik-pull-right">
								￥
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span style="font-size: 24px;">库存</span>
						</div>
						<div class="text item">
							<span>总量</span>
							<div class="ik-pull-right">
								<span>{{this.ps}}</span>
							</div>
						</div>
						<div class="text item">
							<span style="size: 20px;">总成本</span>
							<div class="ik-pull-right" style="size: 20px;">
								<span>{{(this.ms).toFixed(2)}}</span>￥
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
		</el-row>
		
		<el-calendar v-model="value" style="width: 500px;height: 650px;">
		</el-calendar>
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
				rsum:0,
				//本期总支出
				psum:0,
				
				value1: "全部", //仓库名称
				value2: "全部", //产品名称
				value3: "全部", //产品分类
				value4: "否", //是否下架
				pagesize: 5,
				max: 0,
				currentPage: 1,
				
				tableData:[],
				
				//库存总量
				ps:0,
				//总价值
				ms:0
			};
		},
		methods: {
			
			//资金账户期间总收入和总支出
			sum(){
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log("time:"+this.customtime1)
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
						
						console.log("rsum:"+_this.rsum)
						console.log("psum:"+_this.psum)
						
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//库存
			findpagePro() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				console.log(this.value1+"+++"+this.value2+"+++"+this.value3+"+++"+this.value4)
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
						_this.tableData.forEach((item)=>{
							_this.ps+=item.productNumber
							_this.ms+=item.productNumber * item.purchaseUnitPrice
						})
					})
					.catch(function(error) {
						console.log(error);
					});
			},
		},
		mounted() {
			this.sum();
			this.findpagePro();
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
		float: right;
	}

	.stats__badge {
		min-width: 48px;
		line-height: 16px;
		text-align: center;
		margin-left: 10px;
		font-size: 12px;
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
</style>
