<template>
	<div class="workbench">
		<el-row :gutter="20">
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>总收入</span>
						</div>
						<div class="text item">
							<span></span>
							<div class="ik-pull-right">
								￥<span v-text="debt.cost"></span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>总支出</span>
						</div>
						<div class="text item">
							<span></span>
							<div class="ik-pull-right">
								￥<span v-text="debt.cost"></span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>
			<el-col :span="8">
				<div class="grid-content bg-purple">
					<el-card class="box-card">
						<div slot="header" class="clearfix">
							<span>库存</span>
						</div>
						<div class="text item">
							<span>总量</span>
							<div class="ik-pull-right">
								<span v-text="debt.amount"></span>
							</div>
						</div>
						<div class="text item">
							<span>总成本</span>
							<div class="ik-pull-right">
								￥<span v-text="debt.cost"></span>
							</div>
						</div>
					</el-card>
				</div>
			</el-col>

		</el-row>
		
	</div>
</template>

<script>
	export default {
		name: "Workbench",
		data() {
			return {
				// a:"123"
				saleT: "按天",
				salePurchaseT: "按天",
				sellDate: {
					now: "今天",
					previously: "昨天"
				},
				sellPurchaseDate: {
					now: "今天",
					previously: "昨天"
				},
				sale: {
					afterTime: "",
					afterM: 100,
					beforeTime: "",
					beforeM: "100"
				},
				debt: {
					deliverygAfterM: null,
					saleBeforeSum: 1,
					deliverygAfterSum: 0,
					deliverygBeforeSum: 0,
					saleAfterM: 1100,
					supplier: 3,
					deliverygBeforeM: null,
					saleAfterSum: 2,
					client: 5,
					saleBeforeM: 1000,
				},
				activeName: "awaitApprove",
				finishApproveData: [],
				awaitApproveData: [],
				rejectApproveData: [],
				dialogTableVisible: false,
				dialogTableClientVisible: false,
				dialogTableSupplierVisible: false,
				queryRepertoryVal: "",
				queryClientVal: "",
				querySupplierVal: "",
				queryRepertoryData: [],
				queryClientData: [],
				querySupplierData: [],
			};
		},
		methods: {
			handleCommand(c) {
				// eslint-disable-next-line no-empty
				this.saleT = "按" + c;
				if (c === "天") {
					this.sellDate.now = "今" + c;
					this.sellDate.previously = "昨" + c;
				} else {
					this.sellDate.now = "本" + c;
					this.sellDate.previously = "上" + c;
				}
			},
			handleCommandPurchase(c) {
				// eslint-disable-next-line no-empty
				this.salePurchaseT = "按" + c;
				if (c === "天") {
					this.sellPurchaseDate.now = "今" + c;
					this.sellPurchaseDate.previously = "昨" + c;
				} else {
					this.sellPurchaseDate.now = "本" + c;
					this.sellPurchaseDate.previously = "上" + c;
				}
			}
		},
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
		font-size: 14px;
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
