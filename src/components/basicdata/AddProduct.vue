<template>
	<h3>新增产品</h3>
	<div class="button">
		<el-button size="small" @click="ToPro" class="button-no" type="primary">取消</el-button>
		<el-button size="small" @click="ToPro" class="button-ok" type="primary">保存</el-button>
	</div>
	<el-tabs type="border-card">
		<el-tab-pane label="用户管理">
			
			<el-form :model="proForm">
				<el-form-item label="* 产品编号  " :label-width="formLabelWidth">
					<el-input v-model="proForm.productId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品名称 " :label-width="formLabelWidth">
					<el-input v-model="proForm.productName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品成分 " :label-width="formLabelWidth">
					<el-input v-model="proForm.ingredient" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品规格 " :label-width="formLabelWidth">
					<el-input v-model="proForm.productSpec" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label=" 克重 &nbsp;&nbsp;&nbsp;" :label-width="formLabelWidth">
					<el-input v-model="proForm.gramHeavy" autocomplete="off" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品单位 " :label-width="formLabelWidth">
					<el-select v-model="proForm.unitId" placeholder="请选择产品单位  (必选)">
						<el-option v-for="item in unit" :label="item.unitName" :value="item.unitId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="* 产品分类 " :label-width="formLabelWidth">
					<el-select v-model="proForm.productTypeId" placeholder="请选择产品单位  (必选)">
						<el-option v-for="item in proType" :label="item.label" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="* 销售单价 " :label-width="formLabelWidth">
					<el-input-number v-model="proForm.purchaseUnitPrice" :precision="0" :step="1" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="* 采购单价 " :label-width="formLabelWidth">
					<el-input-number v-model="proForm.purchaseMoney" :precision="0" :step="1" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="产品描述" :label-width="formLabelWidth">
					<el-input v-model="proForm.productDescribe" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="  备注 &nbsp;&nbsp; " :label-width="formLabelWidth">
					<el-input v-model="proForm.remarks" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="  图片 &nbsp;&nbsp;" :label-width="formLabelWidth">
					<el-button size="small" type="primary">点击上传</el-button>
				</el-form-item>
			</el-form>
			
		</el-tab-pane>

		<!--////////初期库存////////////-->
		<el-tab-pane label="初期库存">
			<!-- 表体内容 -->
			<div>
				<el-table :data="stockData" style="width: 100%" @selection-change="handleSelectionChange" border stripe>
					<el-table-column prop="depotName" label="仓库" sortable width="406">
						<template #default="scope">
							<el-select v-model="stockData[scope.$index].depotName" style="width:150px">
								<el-option v-for="item in depot" :key="item.depotName" :label="item.depotName" :value="item.depotName">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="openingNumber" label="初期库存" sortable width="300">
						<template #default="scope">
							<el-input-number v-model="stockData[scope.$index].openingNumber" :precision="0" :step="1" :min="0"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" fixed>
						<template #default="scope">
							<el-tooltip content="新增" placement="top">
								<el-button size="mini" icon="el-icon-plus" @click="addrow()" type="primary" circle />
							</el-tooltip>
							<el-tooltip content="删除" placement="top">
								<el-button size="mini" icon="el-icon-delete" @click="delrow(scope.$index, stockData)" type="primary" circle />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>
	export default {
		data() {
			return {
				//新增产品单
				proForm: {
					productId: '', //产品编号
					productName: '', //产品名称
					ingredient: '', //成份
					productSpec: '', //规格
					gramHeavy: '', //克重
					unitId: '', //单位id： 连接单位表
					productTypeId: '', //产品分类id： 连接分类表
					purchaseUnitPrice: 0, //销售单价
					purchaseMoney: 0, //采购单价
					remarks: '', //备注
					productDescribe: '', //产品描述
					pictureId: 1, //图片id： 连接图片表
					state: 1, //状态:（已启用：1)
					userId: '', //创建人id: 连接用户表
				},

				//库存数据
				stockData: [{
					depotName: '', //仓库名称
					openingNumber: 0 //期初数量
				}],

				//单位数据
				unit: [{
					unitId: 1,
					unitName: '单位1'
				}],

				//产品分类数据
				proType: [{
					id: 1,
					label: '分类1'
				}],

				//仓库数据
				depot: [{
					depotName: '仓库1'
				}],

				formLabelWidth: '120px',
			}
		},
		computed: {},
		methods: {
			//返回
			ToPro() {
				this.$router.push("/Product")
			},
			handleAddDetails() {
				if (this.cusDate == undefined) {
					this.cusDate = new Array();
				}
				let obj = {};
				obj.customer = " ";
				obj.number = " ";

				this.cusDate.push(obj);
			},
			handleDeleteDetails(index, row) {
				this.cusDate.splice(index, 1);
			},
			//新增一行
			addrow() {
				this.stockData.push({
					depotName: '', //仓库名称
					openingNumber: 0 //期初数量
				});
			},
			//移除一行
			delrow(index, rows) {
				console.log(this.stockData)
				if (this.stockData.length > 1) {
					rows.splice(index, 1); //删掉该行
				}
			},
		}
	}
</script>

<style>
	.must {
		color: red;
	}

	.font {
		font-size: 14px;
	}

	.bz {
		width: 600px;
		padding-left: 65px;
	}

	.inpStyle {
		padding-left: 30px;
		width: 400px;
	}

	.tab {
		padding: 20px;
	}

	.tab>div {
		padding: 10px;
	}

	.button {
		float: right;
		margin-top: -40px;
	}

	.button-no {
		background-color: white;
		color: #1B273A;
		border-color: whitesmoke;
		margin-right: 15px;
	}

	.button-ok {
		background-color: seagreen;
		border-color: whitesmoke;
	}
</style>
