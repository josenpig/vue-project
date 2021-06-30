<template>
	<h3>新增产品</h3>
	<div class="button">
		<el-button size="small" @click="ToPro" class="button-no" type="primary">取消</el-button>
		<el-button size="small" @click="AddPro" class="button-ok" type="primary">保存</el-button>
	</div>
	<el-tabs type="border-card">
		<el-tab-pane label="产品管理">
			
			<el-form :model="proForm">
				<el-form-item label="* 产品编号  " :label-width="formLabelWidth">
					<el-input @change="pdID" v-model="proForm.productId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品名称 " :label-width="formLabelWidth">
					<el-input v-model="proForm.productName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="* 产品成分 " :label-width="formLabelWidth">
					<el-input v-model="proForm.ingredient" autocomplete="off" placeholder="(必填)"></el-input>
				</el-form-item>
				<el-form-item label="* 产品规格 " :label-width="formLabelWidth">
					<el-input v-model="proForm.productSpec" autocomplete="off" placeholder="(必填)"></el-input>
				</el-form-item>
				<el-form-item label=" 克重 &nbsp;&nbsp;&nbsp;" :label-width="formLabelWidth">
					<el-input v-model="proForm.gramHeavy" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="* 产品单位 " :label-width="formLabelWidth">
					<el-select v-model="proForm.unitId" filterable placeholder="请选择产品单位  (必选)">
						<el-option v-for="item in unit" :label="item.unitName" :value="item.unitId"></el-option>
					</el-select>
					
					<!-- 新增单位 -->
					<el-button type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;margin-left: 20px;">
						<i class="el-icon-plus"></i> 新增单位
					</el-button>
					
					<el-dialog title="新增单位" v-model="dialogFormVisible">
						<hr style="margin-bottom: 20px;" />
						<el-form :model="form">
							<el-form-item label="单位名称" :label-width="formLabelWidth">
								<el-input @change="pdName(form.unitName)" v-model="form.unitName" placeholder="单位名称不能重复 (必填)" autocomplete="off"></el-input>
							</el-form-item>
						</el-form>
						<template #footer>
							<span class="dialog-footer">
								<el-button @click="dialogFormVisible = false">取 消</el-button>
								<el-button type="primary" @click="Add">确 定</el-button>
							</span>
						</template>
					</el-dialog>
					
				</el-form-item>
				<el-form-item label="* 产品分类 "  :label-width="formLabelWidth">
					<el-select v-model="proForm.productTypeId" filterable placeholder="请选择产品分类  (必选)">
						<el-option v-for="item in proType" :label="item.label" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="* 销售单价 " :label-width="formLabelWidth">
					<el-input-number v-model="proForm.purchaseUnitPrice" :precision="2" :step="1" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="* 采购单价 " :label-width="formLabelWidth">
					<el-input-number @change="changeMoney" v-model="proForm.purchaseMoney" :precision="2" :step="1" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="产品描述" :label-width="formLabelWidth">
					<el-input v-model="proForm.productDescribe" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="  备注 &nbsp;&nbsp; " :label-width="formLabelWidth">
					<el-input v-model="proForm.remarks" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			
		</el-tab-pane>

		<!--////////初期库存////////////-->
		<el-tab-pane label="初期库存">
			<!-- 表体内容 -->
			<div>
				<el-table :data=" stockForm" style="width: 100%" @selection-change="handleSelectionChange" border stripe>
					<el-table-column prop="depotName" label="仓库" :show-overflow-tooltip="true" sortable width="406">
						<template #default="scope">
							<el-select v-model="stockForm[scope.$index].depotName" filterable style="width:230px">
								<el-option v-for="item in depot" :key="item.depotName" :label="item.depotName" :value="item.depotName">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="openingNumber" label="初期库存"  sortable width="300">
						<template #default="scope">
							<el-input-number v-model=" stockForm[scope.$index].openingNumber" :precision="0" :step="1" :min="0"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="100" fixed>
						<template #default="scope">
							<el-tooltip content="新增" placement="top">
								<el-button size="mini" icon="el-icon-plus" @click="addrow()" type="primary" circle />
							</el-tooltip>
							<el-tooltip content="删除" placement="top">
								<el-button size="mini" icon="el-icon-delete" @click="delrow(scope.$index,  stockForm)" type="primary" circle />
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</el-tab-pane>
		
		<!--////////产品供应////////////-->
		<el-tab-pane label="采购价格">
			<!-- 表体内容 -->
			<div>
				<div style="margin: 10px 10px 10px 0px;">
					<span style="font-size: 15px;;">产品标准采购价格：</span>
					<el-input-number  @change="changeMoney" v-model="proForm.purchaseMoney" :precision="2" :step="1" :min="0"></el-input-number>
				</div>
				<el-table :data="supplyForm" style="width: 100%" @selection-change="handleSelectionChange" border stripe>
					<el-table-column label="操作" width="100" fixed>
						<template #default="scope">
							<el-tooltip content="新增" placement="top">
								<el-button size="mini" icon="el-icon-plus" @click="addrow2()" type="primary" circle />
							</el-tooltip>
							<el-tooltip content="删除" placement="top">
								<el-button size="mini" icon="el-icon-delete" @click="delrow2(scope.$index,  supplyForm)" type="primary" circle />
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="vendor_name" label="供应商名称" :show-overflow-tooltip="true" sortable width="300">
						<template #default="scope">
							<el-select v-model=" supplyForm[scope.$index].vendor_id" filterable style="width:230px">
								<el-option v-for="item in vendor" :key="item.vendorName" :label="item.vendorName" :value="item.vendorId">
								</el-option>
							</el-select>
						</template>
					</el-table-column>
					<el-table-column prop="price_ratio" label="调价比例(%)" sortable width="300">
						<template #default="scope">
							<el-input-number v-model=" supplyForm[scope.$index].price_ratio" :precision="2" :step="1" :min="0" @change="supplyForm[scope.$index].money=supplyForm[scope.$index].price_ratio*this.proForm.purchaseMoney/100"></el-input-number>
						</template>
					</el-table-column>
					<el-table-column label="采购价格" sortable width="287">
						<template #default="scope">
							<el-input-number :precision="2" :step="1" :min="0" v-model="supplyForm[scope.$index].money" @change="supplyForm[scope.$index].price_ratio=supplyForm[scope.$index].money/this.proForm.purchaseMoney*100"></el-input-number>
						</template>
					</el-table-column>
					
				</el-table>
			</div>
		</el-tab-pane>
		
	</el-tabs>
</template>

<script>
	import {
		ElMessage
	} from 'element-plus'
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
					purchaseUnitPrice:'' , //销售单价
					purchaseMoney:'' , //采购单价
					remarks: '', //备注
					productDescribe: '', //产品描述
					pictureId: 1, //图片id： 连接图片表
				},

				//产品库存
				 stockForm: [{
					depotName: '', //仓库名称
					openingNumber: 0 ,//期初数量 默认：0
				}],
				
				//产品供应
				 supplyForm: [{
					vendor_id: '', //供应商id
					vendor_name: '', //供应商名称
					price_ratio: 100 ,//调价比例 默认：100
					money:'' //采购单价 
				}],

				//单位数据
				unit:[],
				//新增单位信息弹框
				dialogFormVisible: false,
				//修改产品信息弹框
				updateDialogFormVisible: false,
				//新增单位表单
				form: {
					unitName: '' //单位名称
				},

				//产品分类数据
				proType: [],
				//仓库数据
				depot: [],
				//供应商数据
				vendor: [],

				//判断
				judge: '',

				formLabelWidth: '120px'
			}
		},
		methods: {
			//返回
			ToPro() {
				this.$router.push("/Product")
			},
			
			//新增一行  产品库存
			addrow() {
				this. stockForm.push({
					depotName: '', //仓库名称
					openingNumber: 0 //期初数量
				});
			},
			//移除一行  产品库存
			delrow(index, rows) {
				console.log(this. stockForm)
				if (this. stockForm.length > 1) {
					rows.splice(index, 1); //删掉该行
				}
			},
			
			//新增一行  --产品供应
			addrow2() {
				this.supplyForm.push({
					vendor_id: '', //供应商id
					vendor_name: '', //供应商名称
					price_ratio: 100 ,//调剂比例 默认：100
					money:this.proForm.purchaseMoney //采购单价 
				});
			},
			//移除一行  --产品供应
			delrow2(index, rows) {
				console.log(this.supplyForm)
				if (this.supplyForm.length > 1) {
					rows.splice(index, 1); //删掉该行
				}
			},
			
			//查询所有单位
			findAllUnit() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseUnit/findAllUnit/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.unit = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//查询所有产品分类
			findAllProType() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/findProType/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.proType = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//查询所有仓库
			findAllDepot() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseDepot/findAllDepot/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.depot = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//查询所有供应商
			findAllVendor() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.vendor = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//判断产品ID是否重复
			pdID() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var id = {
					id: this.proForm.productId
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/judgeProductId",
						method: "get",
						processData: false,
						params: id,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("pid不重复是否通过:" + response.data.data)
						_this.judge = response.data.data
						if (response.data.data==false) {
							ElMessage.warning({
								message: '产品ID重复',
								type: 'success'
							});
						}else{
							console.log(response.data)
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//添加产品-提交表单
			AddPro() {
				console.log(this.proForm)
				console.log(this.stockForm)
				console.log(this.supplyForm)
				
				if (this.proForm.productId == '' ||
					this.proForm.productName == '' ||
					this.proForm.ingredient == '' ||
					this.proForm.unitId == '' ||
					this.proForm.productTypeId == '' ||
					this.proForm.purchaseUnitPrice == '' ||
					this.proForm.purchaseMoney == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					var dfn=true
					var vfn=true
					if(this.stockForm.size!=0){
						this.stockForm.forEach((item)=>{
								if(item.depotName==''){
									dfn=false
								}
						})
					}
					if(this.supplyForm.size!=0){
						this.supplyForm.forEach((item)=>{
								if(item.vendor_id==''){
									vfn=false
								}
						})
					}
					if(dfn==false){
						ElMessage.warning({
							message: '仓库名称不能为空！',
							type: 'success'
						});
					}
					if(vfn==false){
						ElMessage.warning({
							message: '供应商名称不能为空！',
							type: 'success'
						});
					}
					if(dfn==true && vfn==true){
							var df=true;
							var vf=true;
							if(this.stockForm.size!=0){
								this.stockForm.forEach((item)=>{
									var dname=item.depotName
									this.stockForm.forEach((item2)=>{
										if(item!=item2){
										if(item2.depotName==dname){
											df=false
										}}
									})
								})
							}
							if(this.supplyForm.size!=0){
								this.supplyForm.forEach((item)=>{
									var vid=item.vendor_id
									this.supplyForm.forEach((item2)=>{
										if(item!=item2){
										if(item2.vendor_id==vid){
											vf=false
										}}
									})
								})
							}
							if(df==false){
								ElMessage.warning({
									message: '不能选中重复的仓库！',
									type: 'success'
								});
							}
							if(vf==false){
								ElMessage.warning({
									message: '不能选中重复的供应商！',
									type: 'success'
								});
							}
							
							if(vf==true && df==true){
							this.pdID()
							setTimeout(() => {
								if (this.judge) {
									const state = JSON.parse(sessionStorage.getItem("state"));
									var _this = this;
									var user = state.userInfo.userName;
									this.dialogFormVisible = false
									
									this.axios({
											url: "http://localhost:8088/frameproject/baseProduct/addProduct",
											method: "post",
											processData: false,
											data: {
												User: JSON.stringify(user),
												Product: JSON.stringify(_this.proForm),
												Stock: JSON.stringify(_this.stockForm),
												Supply: JSON.stringify(_this.supplyForm)
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
											_this.judge = {}
											_this.$router.push("/Product")
										})
										.catch(function(error) {
											console.log(error);
										});
								} else {
									ElMessage.warning({
										message: '产品ID重复！',
										type: 'success'
									});
								}
							}, 200);
							}
						}
						
					}
			},
			
			//查询单位列表
			findAllUnit() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseUnit/findAllUnit/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.unit = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//判断单位名称是否重复
			pdName(val) {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var UnitName = {
					UnitName: val
				}
				this.axios({
						url: "http://localhost:8088/frameproject/baseUnit/judgeUnitName",
						method: "get",
						processData: false,
						params: UnitName,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("单位名称不重复是否通过:" + response.data)
						_this.judge = response.data
						if(!response.data){
							ElMessage.warning({
								message: '单位名称重复！',
								type: 'success'
							});
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			//添加单位
			Add() {
				console.log(this.form)
				if (this.form.unitName == null || this.form.unitName == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.pdName(this.form.unitName)
					setTimeout(() => {
						if (this.judge) {
							const state = JSON.parse(sessionStorage.getItem("state"));
							var _this = this;
							this.dialogFormVisible = false
							//添加单位
							this.axios({
									url: "http://localhost:8088/frameproject/baseUnit/addUnit",
									method: "post",
									processData: false,
									data: {
										Unit: JSON.stringify(_this.form)
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
									_this.judge = {}
									_this.findAllUnit()
								})
								.catch(function(error) {
									console.log(error);
								});
						}
					}, 200)
				}
			},
			
			//改变采购价格
			changeMoney() {
				this.supplyForm.forEach((item)=>{
					item.money=this.proForm.purchaseMoney*item.price_ratio/100
				})
			}
		},
		computed: {
		},
			created() {
				this.findAllUnit()
				this.findAllProType()
				this.findAllDepot()
				this.findAllVendor()
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
