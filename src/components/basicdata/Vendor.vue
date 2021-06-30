<template>
	<!-- 主内容 -->
	<div class="vendor">
		<!-- 标题 -->
		<div class="page-tag">
			<span>供应商列表</span>
			<div class="shenpi">
				<!-- 新增供应商 -->
				<el-button v-has="{ action: 'vendor:add' }"  type="text" size="small " @click="dialogFormVisible = true" style="color: white;background-color: #459df5;width: 90px;">
					<i class="el-icon-plus"></i> 新增供应商
				</el-button>

				<el-dialog title="供应商信息" v-model="dialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item @change="pdCID" label="* 供应商编号 *" :label-width="formLabelWidth">
							<el-input v-model="form.vendorId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 供应商名称 *" :label-width="formLabelWidth">
							<el-input v-model="form.vendorName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="地址" :label-width="formLabelWidth">
							<el-input v-model="form.address" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="* 供应商类型 *" :label-width="formLabelWidth">
							<el-select v-model="form.vendorType" placeholder="请选择供应商类型 (必选)">
								<el-option label="批发" value="批发"></el-option>
								<el-option label="一级供供应商" value="一级供供应商"></el-option>
								<el-option label="二级供供应商" value="二级供供应商"></el-option>
								<el-option label="个体" value="个体"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth" >
							<el-select v-model="form.charge" filterable placeholder="请选择负责人 (必选)">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="form.contactName" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="form.contactAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="form.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="dialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="AddVendor">确 定</el-button>
						</span>
					</template>
				</el-dialog>
				
				<!--修改供应商-->
				<el-dialog title="修改供应商信息" v-model="updateDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="form">
						<el-form-item label="* 供应商编号 *" :label-width="formLabelWidth">
							<el-input @change="pdCID" :disabled="true" v-model="updateForm.vendorId" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="* 供应商名称 *" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateForm.vendorName" autocomplete="off" placeholder="(必填)" maxlength="20" show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.address" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="* 供应商类型 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.vendorType" placeholder="请选择供应商类型 (必选)">
								<el-option label="批发" value="批发"></el-option>
								<el-option label="一级供供应商" value="一级供供应商"></el-option>
								<el-option label="二级供供应商" value="二级供供应商"></el-option>
								<el-option label="个体" value="个体"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="* 负责人 *" :label-width="formLabelWidth">
							<el-select v-model="updateForm.charge" placeholder="请选择 (必选)" style="width:150px" @change="findpageByTypeOrCharge">
								<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
								</el-option>
							</el-select>
						</el-form-item>
						<hr />
						<el-form-item label="联系人姓名" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactName" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人地址" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactAddress" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="联系人电话" :label-width="formLabelWidth">
							<el-input v-model="updateForm.contactNumber" autocomplete="off"></el-input>
						</el-form-item>
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="updateDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updateVendor">确 定</el-button>
						</span>
					</template>
				</el-dialog>

			</div>
		</div>
		<!-- 表单头部 -->
		<div style="font-size: 15px;padding: 20px;">
			<div>
				<span style="font-size: 14.5px;">供应商类型：</span>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="全部">全部</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="批发">批发</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="一级供应商">一级供应商</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="二级供应商">二级供应商</el-radio>
				<el-radio @change="findpageByTypeOrCharge" v-model="selVendorType" label="个体">个体</el-radio>
			</div>
			<div>
				<p />
				<span style="font-size: 14.5px;">负责人：</span>
				<el-select filterable v-model="selcharge" placeholder="请选择" size="mini" style="width:150px" @change="findpageByTypeOrCharge">
					<el-option :label="selectAll" :value="selectAll"></el-option>
					<el-option v-for="item in charge" :label="item.chargeName" :value="item.chargeName">
					</el-option>
				</el-select>
			</div>
		</div>
		<!--批量删除-->
		<div style="float: left;padding-top: 15px;">
			<el-button v-has="{ action: 'vendor:delete' }" @click="batchDel" size="mini"><i class="el-icon-close"></i> 批量删除</el-button>
		</div>
		<!--搜索框-->
		<div class="page-search">
			<div style="float: left;margin: 5px 0px;">
				<el-select v-model="select" size="mini" style="width:110px">
					<el-option v-for="item in type" :key="item.label" :label="item.label" :value="item.label"></el-option>
				</el-select>
			</div>
			<div class="page-search-content">
				<el-input v-model="SearchContent" placeholder="请输入内容" size="small"></el-input>
			</div>
			<div style="float: left;">
				<el-button @click="findpageByidOrName" icon="el-icon-search" circle></el-button>
			</div>
		</div>
		<!-- 表体内容 -->
		<div class="vendor-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column fixed label="操作" width="100">
					<template #default="scope">
						<el-tooltip content="修改" placement="top">
						<el-button v-has="{ action: 'vendor:update' }" size="small" @click="openupdate(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
						</el-tooltip>
						
						<el-tooltip content="删除" placement="top">
						<el-button v-has="{ action: 'vendor:delete' }"  size="small" @click="del(scope.row.vendorId,scope.$index)" type="text" icon="el-icon-delete" circle></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column fixed label="管理产品" width="70">
					<template #default="scope">
						<el-tooltip content="该供应商下的产品" placement="top">
						<el-button v-has="{ action: 'vendor:update' }"  size="small" @click="findpageByidToPro(scope.row.vendorId,name)" type="text" icon="el-icon-s-goods" circle></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column fixed prop="vendorId" label="供应商编号" sortable width="120" />
				<el-table-column prop="vendorName" label="供应商名称" sortable width="120" />
				<el-table-column prop="vendorType" label="供应商类型" sortable width="120" />
				<el-table-column prop="accountsPayable" label="应付款金额()" sortable width="150" />
				<el-table-column prop="address" label="地址"  width="120" />
				<el-table-column prop="charge" label="负责人" sortable width="120" />
				<el-table-column prop="contactName" label="联系人姓名"  width="120" />
				<el-table-column prop="contactNumber" label="联系人电话"  width="120" />
				<el-table-column prop="contactAddress" label="联系人地址"  width="120" />
				<el-table-column prop="user" label="创建人" sortable width="120" />
				<el-table-column prop="creationTime" label="创建时间" sortable width="150" />
				<el-table-column prop="updateTime" label="更新时间" sortable width="150" />
				
			</el-table>
		</div>
		
		<!--供应商关联的产品-->
		<el-dialog title="供应商--产品管理" v-model="ProupdateDialogFormVisible">
			
			<!-- 新增供应商关联的产品 -->
			<el-button type="text" size="small " @click="openAddPV" style="color: white;background-color: #459df5;width: 90px;margin-top: 15px;">
				<i class="el-icon-plus"></i> 新增产品
			</el-button>
			
			<!--搜索框-->
			<div class="page-search">
				<div style="float: right;">
					<span style="float: left;margin: 10px 0px;size: 17px;">产品名称 :</span>
					<div class="page-search-content">
						<el-input v-model="pname" placeholder="请输入内容" size="small"></el-input>
					</div>
					<div style="float: left;">
						<el-button @click="this.findpageByidToPro(this.vid,pname)" icon="el-icon-search" circle></el-button>
					</div>
				</div>
			</div>
			
			<el-dialog title="新增供应商产品" v-model="addPVDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="addProductVendor">
						<el-form-item label="* 产品名称 *" :label-width="formLabelWidth" >
							<el-select @change="judgePro" v-model="addProductVendor.productId" filterable placeholder="请选择产品  (必选)">
								<el-option v-for="item in product" :label="item.productName" :value="item.productId" @click="sm(item)"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="标准采购单价" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="this.SMoney" autocomplete="off" style="width: 220px;"></el-input>
						</el-form-item>
						
						<el-form-item  label="调价比例(%)" :label-width="formLabelWidth" >
								<el-input-number v-model="this.addProductVendor.priceRatio" :precision="2" :step="1" :min="0" @change="this.addProductVendor.money=this.addProductVendor.priceRatio*this.SMoney/100"></el-input-number>
						</el-form-item >
						<el-form-item  label="采购价格" :label-width="formLabelWidth" >
								<el-input-number :precision="2" :step="1" :min="0" v-model="this.addProductVendor.money" @change="this.addProductVendor.priceRatio=this.addProductVendor.money/this.SMoney*100"></el-input-number> 
						</el-form-item >
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="addPVDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="AddPV">确 定</el-button>
						</span>
					</template>
			</el-dialog>
			
			<el-dialog title="修改供应商产品" v-model="updataPVDialogFormVisible">
					<hr style="margin-bottom: 20px;" />
					<el-form :model="updateProductVendor">
						<el-form-item label="* 产品名称 *" :label-width="formLabelWidth" >
							<el-input :disabled="true" v-model="updateProductVendor.productName" autocomplete="off" style="width: 220px;"></el-input>
						</el-form-item>
						<el-form-item label="标准采购单价" :label-width="formLabelWidth">
							<el-input :disabled="true" v-model="updateProductVendor.purchaseMoney" autocomplete="off" style="width: 220px;"></el-input>
						</el-form-item>
						
						<el-form-item  label="调价比例(%)" :label-width="formLabelWidth" >
							<el-input-number v-model="updateProductVendor.priceRatio" :precision="2" :step="1" :min="0" @change="this.updateProductVendor.money=this.updateProductVendor.priceRatio*this.updateProductVendor.purchaseMoney/100"></el-input-number>
						</el-form-item >
						<el-form-item  label="采购价格" :label-width="formLabelWidth" >
							<el-input-number v-model="updateProductVendor.money" :precision="2" :step="1" :min="0" @change="this.updateProductVendor.priceRatio=this.updateProductVendor.money/this.updateProductVendor.purchaseMoney*100"></el-input-number>
						</el-form-item >
					</el-form>
					<template #footer>
						<span class="dialog-footer">
							<el-button @click="updataPVDialogFormVisible = false">取 消</el-button>
							<el-button type="primary" @click="updatePV">确 定</el-button>
						</span>
					</template>
			</el-dialog>
			
			<div class="unit-mian">
				<el-table :data="VendorPro" @selection-change="handleSelectionChange" border
				 stripe>
					<el-table-column prop="date" label="操作" width="100">
						<template #default="scope">
							<el-tooltip content="修改" placement="top">
							<el-button size="small" @click="openUpdatePV(scope.row)" type="text" icon="el-icon-edit" circle></el-button>
							</el-tooltip>
							
							<el-tooltip content="删除" placement="top">
							<el-button size="small" @click="delPV(scope.row.vendorId,scope.row.productId)" type="text" icon="el-icon-delete" circle></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column prop="vendorName" label="供应商名称" sortable width="170" />
					<el-table-column prop="productId" label="产品编号" sortable width="152" />
					<el-table-column prop="productName" label="产品名称" sortable width="152" />
					<el-table-column prop="purchaseMoney" label="标准采购价格" sortable width="130" />
					<el-table-column prop="priceRatio" label="调价比例(%)" sortable width="130" />
					<el-table-column label="实际采购价格" sortable width="130">
						<template #default="scope">
							<span>{{(scope.row.purchaseMoney * scope.row.priceRatio / 100).toFixed(2)}}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="ProupdateDialogFormVisible = false">关闭</el-button>
				</span>
			</template>
		</el-dialog>
		
		<!-- 表尾分页显示 -->
		<div class="salelist-footer">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 50px"
			 @current-change="handleCurrentChange" v-model:currentPage="currentPage">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import {
		ElMessage
	} from 'element-plus'
	export default {
		name: "vendor",
		data() {
			return {
				formLabelWidth: '120px',
				//新增供应商信息弹框
				dialogFormVisible: false,
				//修改供应商信息弹框
				updateDialogFormVisible: false,
				//新增供应商表单
				form: {
					vendorId: '',//供应商编号
					vendorName: '',//供应商名称
					vendorType: '',//供应商类型:类型： 批发、一级供应商、二级供应商、个体
					address: '',//地址
					charge: '',//负责人
					contactName: '',//联系人姓名
					contactAddress: '',//联系人地址
					contactNumber: '',//联系人电话
					user: ''//创建人
				},
				//修改供应商表单
				updateForm: {
					vendorId: '',//供应商编号
					vendorName: '',//供应商名称
					vendorType: '',//供应商类型:类型： 批发、一级供应商、二级供应商、个体
					address: '',//地址
					charge: '',//负责人
					contactName: '',//联系人姓名
					contactAddress: '',//联系人地址
					contactNumber: '',//联系人电话
				},
				formLabelWidth: '120px',
				radio: '1',
				
				//选中搜索条件（默认仓库名称）
				select: '供应商名称',
				//搜索框中内容
				SearchContent: '',
				//搜索框条件
				type: [{
					label: '供应商名称'
				}, {
					label: '供应商编号',
				}],
				//选中客户类型
				selVendorType: '全部',

				//负责人
				charge: [],
				//选中负责人 （默认全部）
				selcharge: '全部',
				//全部负责人
				selectAll: '全部',

				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,
				
				
				//多选供应商
				selectCus: [],

				//供应商关联的产品信息信息弹框
				ProupdateDialogFormVisible: false,
				//供应商关联的产品信息
				VendorPro:[],

				//产品信息
				product:[],

				//供应商产品 
				vid:'',
				pname:'',//查询的产品名称
				productRepeat:true,//判断新增的产品是否也供应商已有的产品重复
				
				//新增供应商关联的产品信息信息弹框
				addPVDialogFormVisible: false,
				//新增供应商关联的产品信息
				addProductVendor:{
					vendorId:'',//供应商id
					productId:'',//产品id
					priceRatio:100,//调剂比例
					money:''//该产品在该供应商的采购价格
				},
				//选中产品标准采购单价
				SMoney:'',
				
				//修改供应商关联的产品信息信息弹框
				updataPVDialogFormVisible:false,
				//修改供应商关联的产品信息
				updateProductVendor:{
					vendorId:'',//供应商id
					productId:'',//产品id
					productName:'',//产品名称
					purchaseMoney:'',//产品价格
					priceRatio:'',//调剂比例
					money:''//该产品在该供应商的采购价格
				}
				
			}
		},
		methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//查询所有负责人
			findAllCharge() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseCharge/selectAll",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.charge = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//查询所有产品
			findAllPro() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.product = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//分页查询
			findpage() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor",
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
			//根据供应商类型或负责人查询
			findpageByTypeOrCharge() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					selcharge: this.selcharge,
					selVendorType: this.selVendorType,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/ByTypeOrCharge",
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
			//根据供应商编号或供应商名称查询
			findpageByidOrName() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					SearchContent: this.SearchContent,
					select: this.select,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/findAllVendor/ByIdOrName",
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
			//删除供应商
			del(id, index) {
				this.$confirm('此操作将永久该供应商, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var ids = new Array()
					ids.push(id)
					console.log("del:"+ids)
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/delVendor/batch",
							method: "delete",
							processData: false,
							data: ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
							if (response.data.data == null) {
								_this.$message({
									type: 'success',
									message: '删除成功'
								});
								_this.findpage()
							} else {
								ElMessage.warning({
									message: response.data.data,
									type: 'success'
								});
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//批量删除供应商
			batchDel() {
				this.$confirm('此操作将永久删除下列' + this.selectCus.length + ':个供应商, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var ids = new Array()
					this.selectCus.forEach(v => {
						ids.push(v.vendorId)
					})
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/delVendor/batch",
							method: "delete",
							processData: false,
							data: ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("批量删除是否成功：" + response.data.data);
							if (response.data.data == null) {
								_this.$message({
									type: 'success',
									message: '删除成功'
								});
								_this.findpage()
							} else {
								ElMessage.warning({
									message: response.data.data,
									type: 'success'
								});
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			//复选框
			handleSelectionChange(val) {
				this.selectCus = val
			},
			//判断供应商ID是否重复
			pdCID() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var id = {
					id: this.form.vendorId
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendor/judgeVendorId",
						method: "get",
						processData: false,
						params: id,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("id不重复是否通过:" + response.data.data)
						_this.judge = response.data.data
						if (response.data.data==false) {
							ElMessage.warning({
								message: '供应商ID重复',
								type: 'success'
							});
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//添加供应商
			AddVendor() {
				console.log(this.form)
				if (this.form.vendorId == '' ||
					this.form.vendorName == '' ||
					this.form.vendorType == '' ||
					this.form.charge == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.pdCID();
					
					setTimeout(() => {
						if (this.judge) {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.form.user = state.userInfo.userName;
					this.dialogFormVisible = false
					//添加供应商
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/addVendor",
							method: "post",
							processData: false,
							data: {
								vendor: JSON.stringify(_this.form)
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
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
						}
						}, 200)
				}
			},
			//打开修改框
			openupdate(val){
				this.updateDialogFormVisible= true;
				
				this.updateForm.vendorId= val.vendorId
				this.updateForm.vendorName= val.vendorName
				this.updateForm.vendorType= val.vendorType
				this.updateForm.address= val.address
				this.updateForm.charge= val.charge
				this.updateForm.contactName= val.contactName 
				this.updateForm.contactAddress= val.contactAddress
				this.updateForm.contactNumber= val.contactNumber
				
			},
			//修改供应商信息
			updateVendor(){
				console.log(this.updateForm)
				if (
					this.updateForm.vendorType == '' ||
					this.updateForm.charge == '' ) {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					//修改供应商
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendor/updateVendor",
							method: "post",
							processData: false,
							data: {
								vendor: JSON.stringify(_this.updateForm)
							},
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log(response.data.data)
							ElMessage.success({
								message: '修改成功',
								type: 'success'
							});
							_this.updateDialogFormVisible= false;
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
					}
			},
			
			//根据供应商编号查询供应商下的产品
			findpageByidToPro(vid,name) {
				this.vid=vid
				this.ProupdateDialogFormVisible =true
				console.log("vid:"+vid+", name:"+name)
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					vid: vid,
					pname: name
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseVendorProduct/findAllbaseVendorProduct/list",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.VendorPro = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			
			
			//打开添加供应商下产品
			openAddPV(){
				this.addPVDialogFormVisible=true
				this.addProductVendor.vendorId=this.vid
				console.log(this.addProductVendor)
			},
			
			//判断新增的产品是否与供应商已有的产品重复
			judgePro(){
				this.productRepeat=true
				this.VendorPro.forEach((item)=>{
					if(item.productId==this.addProductVendor.productId){
						this.productRepeat=false
						ElMessage.warning({
							message: '不能重复添加商品！',
							type: 'success'
						});
					}
				})
				console.log("是否与供应商已有的产品重复："+this.productRepeat)
			},
			
			//选中产品标准价
			sm(item){
				this.SMoney=item.purchaseMoney
				this.addProductVendor.money=this.addProductVendor.priceRatio*this.SMoney/100
			},
			
			//添加供应商下产品
			AddPV(){
				console.log(this.addProductVendor)
				if (this.addProductVendor.vendorId == '' ||
					this.addProductVendor.productId == '' ||
					this.addProductVendor.priceRatio == '' ||
					this.addProductVendor.money == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.judgePro();
					
					setTimeout(() => {
						if (this.productRepeat==true) {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendorProduct/addBaseVendorProduct",
							method: "post",
							processData: false,
							data: {
								BaseVendorProduct: JSON.stringify(_this.addProductVendor)
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
							_this.addPVDialogFormVisible=false
							_this.productRepeat=true
							_this.addProductVendor={
							vendorId:'',//供应商id
							productId:'',//产品id
							priceRatio:100,//调剂比例
							money:''//该产品在该供应商的采购价格
							}
							_this.findpageByidToPro(_this.vid,null)
						})
						.catch(function(error) {
							console.log(error);
						});
						}
						}, 200)
				}
			},
			
			//打开修改供应商下产品
			openUpdatePV(data){
				this.updataPVDialogFormVisible=true
				this.updateProductVendor.vendorId = data.vendorId
				this.updateProductVendor.productId = data.productId
				this.updateProductVendor.productName = data.productName
				this.updateProductVendor.purchaseMoney = data.purchaseMoney
				this.updateProductVendor.priceRatio = data.priceRatio
				this.updateProductVendor.money = data.purchaseMoney * data.priceRatio/100
				console.log(this.updateProductVendor)
			},
			
			//修改供应商信息
			updatePV(){
				console.log(this.updateProductVendor)
				if (
					this.updateProductVendor.priceRatio == '' ||
					this.updateProductVendor.money == '' ) {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					var updateProductVendor2={
						vendorId: this.updateProductVendor.vendorId,//供应商id
						productId: this.updateProductVendor.productId,//产品id
						priceRatio: this.updateProductVendor.priceRatio,//调价比例
					}
					this.dialogFormVisible = false
					//修改供应商
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendorProduct/updateVendorProduct",
							method: "post",
							processData: false,
							data: {
								ProductVendor: JSON.stringify(updateProductVendor2)
							},
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log(response.data.data)
							if(response.data.data!=null){
								ElMessage.success({
									message: '修改成功',
									type: 'success'
								});
								_this.updataPVDialogFormVisible= false;
							}else{
								ElMessage.warning({
									message: '修改失败，此供应商下的该产品存在未结案的采购单 无法修改！',
									type: 'success'
								});
							}
							_this.findpageByidToPro(_this.vid,null)
						})
						.catch(function(error) {
							console.log(error);
						});
					}
			},
			
			//删除供应商下产品
			delPV(vid, pid) {
				console.log(vid+",,,"+pid)
				this.$confirm('此操作将永久该产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var ids={
								vid: vid,
								pid: pid
					}
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseVendorProduct/delVendorProduct",
							method: "get",
							processData: false,
							params:ids,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
							if (response.data.data==true) {
								_this.$message({
									type: 'success',
									message: '删除成功'
								});
								_this.findpageByidToPro(_this.vid,null)
							} else {
								ElMessage.warning({
									message:'该供应商下产品id为： '+pid+' 的产品存在未结案的采购单, 无法删除！',
									type: 'success'
								});
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}
		},
		computed: {},
		created() {
			this.findpage()
			this.findAllCharge()
			this.findAllPro()
		}
	};
</script>

<style lang="scss">
	.vendor {
		width: 100%;
		background-color: white;
	}

	.vendor .r-float {
		float: right;
	}

	/* 顶部 */
	.vendor .page-tag {
		height: 40px;
		padding: 0 10px;
		color: #323232;
		font-size: 18px;
		line-height: 40px;
		background-color: #e9eef3;
	}

	.vendor .shenpi {
		float: right;
		line-height: 20px;
	}

	.vendor .page-search {
		float: right;
		padding: 13px;
	}

	.vendor .page-search-content {
		margin: 4px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.vendor-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.vendor .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.vendor .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.vendor-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.vendor th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.vendor th>.cell {
		color: white !important;
	}

	.vendor-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.vendor .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.vendor-main .el-input__inner {
		border: 0;
	}

	.vendor th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.vendor .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.vendor-footer {
		padding: 20px 15px;
		background-color: white;
	}
</style>
