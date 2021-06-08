<template>
	<h3>新增产品</h3>
	<div class="button">
		<el-button size="small" @click="ToPro" class="button-no" type="primary">取消</el-button>
		<el-button size="small" class="button-ok" type="primary">保存</el-button>
	</div>
	<el-tabs type="border-card">
		<el-tab-pane label="用户管理">
			<div class="tab">
				<div>
					<span class="must">*</span>
					<span class="font">产品名称</span>
					<el-input v-model="input" class="inpStyle"></el-input>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">产品编号</span>
					<el-input v-model="input" class="inpStyle"></el-input>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">规格</span>
					<el-input v-model="input" class="inpStyle" style="padding-left: 58px;"></el-input>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">销售价格</span>
					<el-input v-model="input" class="inpStyle"></el-input>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">采购价格</span>
					<el-input v-model="input" class="inpStyle"></el-input>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">单位</span>
					<el-select v-model="form.unit" placeholder="请选择" style="padding-left: 58px;">
						<el-option v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div>
					<span class="must">*</span>
					<span class="font">分类</span>
					<el-select v-model="form.type" placeholder="请选择" style="padding-left: 58px;">
						<el-option v-for="item in proType" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div>
					<span class="font">&nbsp;&nbsp;备注</span>
					<p></p>
					<el-input class="bz" style="margin-top: -35px;padding-left: 92px;" type="textarea" :rows="5" v-model="textarea">
					</el-input>
				</div>
				<div>
					<span class="font">&nbsp;&nbsp;图片</span>
					<div style="margin: -25px 90px">
						<el-button size="small" type="primary">点击上传</el-button>
					</div>
				</div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="初期库存">
			<el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px;" @click="handleAddDetails">添加</el-button>
			<!-- 表体内容 -->
			<div>
				<el-table :data="cusDate" style="width: 100%" @selection-change="handleSelectionChange" border stripe>
					<el-table-column prop="customer" label="仓库" sortable width="406">
						<template #default="scope">
							<el-select v-model="scope.row.customer" style="width:150px">
								<el-option v-for="item in charge" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="number" label="初期库存" sortable width="300">
						<template #default="scope">
							<el-input v-model="scope.row.number"></el-input>
						</template>
					</el-table-column>
					<el-table-column prop="date" label="操作" width="280">
						<template #default="scope">
							<el-button type="danger" size="small " icon="el-icon-delete" @click="handleDeleteDetails(scope.$index, scope.row)" circle></el-button>
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
				unitList: [{
					value: '选项1',
					label: '单位1'
				}, {
					value: '选项2',
					label: '单位2'
				}, {
					value: '选项3',
					label: '单位3'
				}],
				proType: [{
					value: '选项1',
					label: '分类1'
				}, {
					value: '选项2',
					label: '分类2'
				}, {
					value: '选项3',
					label: '分类3'
				}],
				charge: [{
					value: '选项1',
					label: '仓库1'
				}, {
					value: '选项2',
					label: '仓库2'
				}],
				selcharge: '',
				cusDate: [{
					customer: '',
					number: ''
				}],
				form: {
					type: '',
					unit: ''
				},

			}
		},
		computed: {},
		methods: {
			//取消添加
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
				this.cusDate.splice(index,1);
			}
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
