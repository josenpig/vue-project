<template>

	<!-- 类别列表 -->
	<div class="typelabel">
		<h4 class="title">产品分类</h4>
		<div>
			<div>
				<el-button @click="findpage" type="primary" class="allType">
					<i class="el-icon-caret-bottom" style="padding:10px 0px 0px 5px;"></i>全部
					<el-button type="text" @click="openAdd(AllId)" style="float: right;color: white;" class="el-icon-circle-plus-outline" v-has="{ action: 'sort:add' }">
						<span style="font-size: 10px;">新增子分类</span>
					</el-button>
				</el-button>
			</div>
			<el-tree :data="ProType" node-key="1000" @node-click="findByType" style="font-size: 15px;padding: 5px 15px;">
				<template #default="{ node, data }">
					<span class="custom-tree-node">
						<span>{{ node.label }}</span>
						<span style="padding: 10px;">
							<el-button type="text" @click="openAdd(data)" class="el-icon-circle-plus-outline" v-has="{ action: 'sort:add' }"></el-button>

							<el-button type="text" @click="remove(data)" class="el-icon-delete" v-has="{ action: 'sort:delete' }"></el-button>

							<el-button type="text" @click="openupdateProType(data)" v-has="{ action: 'sort:update' }" class="el-icon-edit"></el-button>

						</span>
					</span>
				</template>
			</el-tree>
		</div>
	</div>

	<!--新增子分类-->
	<div>
		<el-dialog title="新增子分类" v-model="PTdialogFormVisible">
			<hr style="margin-bottom: 20px;" />
			<el-form :model="ProTypeForm">
				<el-form-item label="分类名称" :label-width="formLabelWidth">
					<el-input @change="pdProductTypeName(ProTypeForm.label)" v-model="ProTypeForm.label" placeholder="单位名称不能重复 (必填)"
					 autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="PTdialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="append">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>

	<!--修改分类名称-->
	<div>
		<el-dialog title="修改子分类" v-model="PTupdateDialogFormVisible">
			<hr style="margin-bottom: 20px;" />
			<el-form :model="updateProTypeForm">
				<el-form-item label="分类名称" :label-width="formLabelWidth">
					<el-input @change="pdProductTypeName(updateProTypeForm.label)" v-model="updateProTypeForm.label" placeholder="单位名称不能重复 (必填)"
					 autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="PTupdateDialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="updateProType">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>

	<!-- 主内容 -->
	<div class="product">
		<!-- 标题 -->
		<div class="page-tag">
			<span>产品列表</span>
			<div class="shenpi">
				<!-- 新增产品 -->
				<el-button type="text" v-has="{ action: 'product:add' }" size="small " @click="ToAdd" style="color: white;background-color: #459df5;width: 90px;margin: 3px;">
					<i class="el-icon-plus"></i> 新增产品
				</el-button>
			</div>
		</div>
		<!-- 表单头部 -->

		<div>
			<!-- 修改产品 -->
			<el-dialog title="修改产品" v-model="updateDialogFormVisible">
				<hr style="margin-bottom: 20px;" />
				<el-form :model="form">
					<el-form-item label="产品编号" :label-width="formLabelWidth">
						<el-input :disabled="true" v-model="updateForm.productId" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="产品名称" :label-width="formLabelWidth">
						<el-input v-model="updateForm.productName" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="成分" :label-width="formLabelWidth">
						<el-input v-model="updateForm.ingredient" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="规格" :label-width="formLabelWidth">
						<el-input v-model="updateForm.productSpec" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="克重" :label-width="formLabelWidth">
						<el-input v-model="updateForm.gramHeavy" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="单位" :label-width="formLabelWidth">
						<el-select v-model="updateForm.unitId" filterable placeholder="请选择单位 (必选)" @change="this.updateForm.settlementTypeId = this.settlementTypeName">
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
					<el-form-item label="产品分类" :label-width="formLabelWidth">
						<el-select v-model="updateForm.productTypeId" filterable placeholder="请选择结算类型 (必选)" @change="this.updateForm.settlementTypeId = this.settlementTypeName">
							<el-option v-for="item in ProTypeList" :label="item.label" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="销售单价" :label-width="formLabelWidth">
						<el-input-number v-model="updateForm.purchaseUnitPrice" :precision="2" :step="1" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="采购单价" :label-width="formLabelWidth">
						<el-input-number v-model="updateForm.purchaseMoney" :precision="2" :step="1" :min="0"></el-input-number>
					</el-form-item>
					<el-form-item label="产品描述" :label-width="formLabelWidth">
						<el-input v-model="updateForm.productDescribe" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="备注" :label-width="formLabelWidth">
						<el-input v-model="updateForm.remarks" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item label="产品状态" :label-width="formLabelWidth">
						<span style="color: #ff4949;padding: 15px;">下架</span>
						<el-switch @change="disableOrEnable(updateForm)" v-model="updateForm.SWstate" active-color="#13ce66"
						 inactive-color="#ff4949">
						</el-switch>
						<span style="color: #13ce66;padding: 15px;">上架</span>
					</el-form-item>
				</el-form>
				<template #footer>
					<span class="dialog-footer">
						<el-button @click="updateDialogFormVisible = false">取 消</el-button>
						<el-button type="primary" @click="update">确 定</el-button>
					</span>
				</template>
			</el-dialog>
		</div>

		<!--批量删除-->
		<div style="float: left;padding-top: 15px;">
			<el-button size="mini" @click="batchDel"><i class="el-icon-close"></i> 批量删除</el-button>
		</div>
		<!--搜索框-->
		<div class="page-search">
			<div style="float: left;margin: 5px 0px;">
				<el-select v-model="select" size="mini" style="width:110px">
					<el-option v-for="item in SearchType" :label="item.label" :value="item.label"></el-option>
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
		<div class="product-mian">
			<el-table :data="tableData" style="width: 100%" max-height="400" @selection-change="handleSelectionChange" border
			 stripe>
				<el-table-column type="selection" width="55" />
				<el-table-column fixed label="操作" width="100">
					<template #default="scope">
						<el-tooltip content="修改" placement="top">
							<el-button  v-has="{ action: 'sort:update' }" type="text" size="small" @click="openupdate(scope.row)" icon="el-icon-edit" circle></el-button>
						</el-tooltip>
						<el-tooltip content="删除" placement="top">
							<el-button  v-has="{ action: 'sort:delete' }" size="small" @click="del(scope.row.productId)" type="text" icon="el-icon-delete" circle></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
				<el-table-column fixed label="状态" width="80">
					<template #default="scope">
						<el-button v-if="scope.row.state==1" @click="disableOrEnable(scope.row)" round style="background-color: rgba(255,127,80,0.7);color: white;padding: 7px;" v-has="{ action: 'sort:update' }">下架</el-button>
						<el-button v-if="scope.row.state==0" @click="disableOrEnable(scope.row)" round style="background-color: rgba(144,238,144,0.6);color: white;padding: 7px;" v-has="{ action: 'sort:update' }">上架</el-button>
					</template>
				</el-table-column>
				<el-table-column fixed prop="productId" label="产品编号" sortable width="120" />
				<el-table-column :show-overflow-tooltip="true" prop="productName" label="产品名称" sortable width="150" />
				<el-table-column :show-overflow-tooltip="true" prop="productSpec" label="规格" width="140" />
				<el-table-column :show-overflow-tooltip="true" prop="ingredient" label="成分" width="140" />
				<el-table-column prop="gramHeavy" label="克重" width="120" />
				<el-table-column prop="productTypeName" label="分类" sortable width="120" />
				<el-table-column prop="unitName" label="单位" sortable width="120" />
				<el-table-column prop="opingNumber" label="初期总数量" sortable width="120" />
				<el-table-column prop="state" label="状态" sortable width="120">
					<template #default="scope">
						<span v-if="scope.row.state==0" style="color: orangered;">下架</span>
						<span v-if="scope.row.state==1" style="color: seagreen;">上架</span>
					</template>
				</el-table-column>
				<el-table-column :show-overflow-tooltip="true" prop="productDescribe" label="产品描述" width="200" />
				<el-table-column :show-overflow-tooltip="true" prop="remarks" label="备注" width="150" />
				<el-table-column prop="purchaseMoney" label="采购单价(元)" sortable width="120" />
				<el-table-column prop="purchaseUnitPrice" label="销售单价(元)" sortable width="120" />
				<el-table-column prop="userName" label="创建人" sortable width="120" />
				<el-table-column prop="creationTime" label="创建时间" sortable width="150" />
				<el-table-column prop="updateTime" label="更新时间" sortable width="150" />
			</el-table>
		</div>
		<!-- 表尾分页显示 -->
		<div class="salelist-footer">
			<el-pagination background layout="prev, pager, next" :total="max" :page-size="pagesize" style="margin-top: 10px"
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
		name: "product",
		data() {
			return {
				formLabelWidth: '120px',
				// 分类数据
				ProType: [],
				//不封装 分类数据
				ProTypeList: [],
				//表单数据
				tableData: [],
				//分页
				pagesize: 5,
				max: 0,
				currentPage: 1,

				//搜索条件
				SearchType: [{
					label: "产品名称"
				}, {
					label: "产品编号"
				}],
				SearchContent: '',

				//选中数据
				select: "产品名称",

				//多选产品
				selectPro: [],

				//单位数据
				unit: [],
				//新增单位信息弹框
				dialogFormVisible: false,
				//修改产品信息弹框
				updateDialogFormVisible: false,
				//新增单位表单
				form: {
					unitName: '' //单位名称
				},

				//新增产品分类弹框
				PTdialogFormVisible: false,
				//修改产品分类弹框
				PTupdateDialogFormVisible: false,
				//新增产品分类
				ProTypeForm: {
					productTypeParentId: '', //父级分类id
					label: '' //分类名称
				},
				//修改产品分类
				updateProTypeForm: {
					id: '', //分类id
					label: '', //分类名称
				},

				//修改产品表单
				updateForm: {
					productId: '', //产品编号
					productName: '', //产品名称
					ingredient: '', //成份
					productSpec: '', //规格
					gramHeavy: '', //克重
					unitId: '', //单位id： 连接单位表
					productTypeId: '', //产品分类id： 连接分类表
					purchaseUnitPrice: '', //销售单价
					purchaseMoney: '', //采购单价
					remarks: '', //备注
					productDescribe: '', //产品描述
					state: '', //产品状态
					SWstate: '', //switch产品状态
				},
				//全部分类
				AllId: {
					id: 0
				},
				judge: '',
				judge2: ''
			}
		},

		methods: {
			//添加产品
			ToAdd() {
				this.$router.push("/AddProduct")
			},
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
			},
			//查询所有产品分类
			findAllProType() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/findProType",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.ProType = response.data.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			//查询所有产品分类返回不封装list
			findAllProTypeToList() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/findProType/list",
						method: "get",
						processData: false,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log(response.data.data)
						_this.ProTypeList = response.data.data;
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
					pageSize: this.pagesize
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct",
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
			//根据id或name查询
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
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/ByIdOrName",
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
			//删除产品
			del(id) {
				this.$confirm('此操作将永久删除该产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var ids = new Array()
					ids.push(id)
					console.log(ids)
					var _this = this
					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/delProduct/batch",
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
			//批量删除产品
			batchDel() {
				this.$confirm('此操作将永久删除下列 ' + this.selectPro.length + ' 条产品, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var ids = new Array()
					this.selectPro.forEach(v => {
						ids.push(v.productId)
					})
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/delProduct/batch",
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
				this.selectPro = val
			},
			//下架或上架
			disableOrEnable(val) {
				var _this = this;
				var able;
				if (val.state == 1) {
					able = '下架'
				};
				if (val.state == 0) {
					able = '上架'
				};
				this.$confirm('是否 "' + able + '" 该产品！', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					const state = JSON.parse(sessionStorage.getItem("state"));
					console.log(val)
					var Dstate = {
						Did: val.productId,
						Dstate: val.state
					};
					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/disableOrEnable",
							method: "get",
							processData: false,
							params: Dstate,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("状态修改是否成功：" + response.data.data);
							if (response.data.data == null) {
								_this.$message({
									type: 'success',
									message: able + '成功'
								});
								_this.findpage()
							} else {
								ElMessage.warning({
									message: response.data.data,
									type: 'success'
								});
								_this.updateForm.SWstate = val.state == 0 ? false : true
							}
						})
						.catch(function(error) {
							console.log(error);
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消' + able
					});
					_this.updateForm.SWstate = val.state == 0 ? false : true
				});
			},
			//根据分类查询商品
			findByType(data) {
				console.log(data)

				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pageSize: this.pagesize,
					id: data.id,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/baseProduct/findAllProduct/ByTpye",
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
						console.log("单位名称不重复是否通过:" + response.data.data)
						_this.judge = response.data.data
						if (response.data.data == false) {
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
							//添加仓库
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

			//打开分类新增
			openAdd(data) {
				this.PTdialogFormVisible = true
				this.ProTypeForm.productTypeParentId = data.id
				console.log("add:")
				console.log(data)
			},

			//判断分类名称是否重复
			pdProductTypeName(val) {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var ProductTypeName = {
					ProductTypeName: val
				}
				this.axios({
						url: "http://localhost:8088/frameproject/baseProductType/judgeProductTypeName",
						method: "get",
						processData: false,
						params: ProductTypeName,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						console.log("产品名称不重复是否通过:" + response.data.data)
						_this.judge2 = response.data.data
						if (response.data.data == false) {
							ElMessage.warning({
								message: '产品名称重复！',
								type: 'success'
							});
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			},

			//新增产品子分类
			append() {
				console.log("append:")
				console.log(this.ProTypeForm)
				if (this.ProTypeForm.label == null || this.ProTypeForm.label == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					this.pdProductTypeName(this.ProTypeForm.label)
					setTimeout(() => {
						if (this.judge2) {
							const state = JSON.parse(sessionStorage.getItem("state"));
							var _this = this;
							this.dialogFormVisible = false
							//添加仓库
							this.axios({
									url: "http://localhost:8088/frameproject/baseProductType/addProductType",
									method: "post",
									processData: false,
									data: {
										ProductType: JSON.stringify(_this.ProTypeForm)
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
									_this.ProTypeForm = {}
									_this.judge2 = {}
									_this.findAllProType()
									_this.PTdialogFormVisible = false
								})
								.catch(function(error) {
									console.log(error);
								});
						}
					}, 200)
				}
			},
			//打开产品分类修改
			openupdateProType(data) {
				this.PTupdateDialogFormVisible = true
				this.updateProTypeForm.id = data.id
				this.updateProTypeForm.productTypeParentId = data.productTypeParentId
				console.log("update:")
				console.log(data)
			},
			//修改产品分类信息
			updateProType() {
				console.log(this.updateProTypeForm)
				if (this.updateProTypeForm.label == '' || this.updateProTypeForm.label == null) {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false
					this.pdName(this.updateProTypeForm.label)
					setTimeout(() => {
						if (this.judge2) {
							this.$confirm('修改后使用过该分类的相关产品都会更新显示。确定修改？', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {

								this.axios({
										url: "http://localhost:8088/frameproject/baseProductType/updateProductType",
										method: "post",
										processData: false,
										data: {
											ProductType: JSON.stringify(_this.updateProTypeForm)
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
										_this.PTupdateDialogFormVisible = false;
										_this.judge2 = {}
										_this.findAllProType()
									})
									.catch(function(error) {
										console.log(error);
									});

							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消修改'
								});
							});
						} else {
							ElMessage.warning({
								message: '单位名称重复！',
								type: 'success'
							});
						}
					}, 500)
				}
			},

			//删除分类--
			remove(data) {
				console.log("remove:")
				console.log(data)
				var _this = this;
				this.$confirm('此操作将永久删除该分类及其下级子分类, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					const state = JSON.parse(sessionStorage.getItem("state"));
					var id = {
						id: data.id
					}
					console.log(id)
					this.axios({
							url: "http://localhost:8088/frameproject/baseProductType/delProductType",
							method: "get",
							processData: false,
							params: id,
							headers: {
								JWTDemo: state.userInfo.token,
							},
						})
						.then(function(response) {
							console.log("删除是否成功：" + response.data.data);
							if (response.data.data) {
								_this.$message({
									type: 'success',
									message: '删除成功'
								});
								_this.findAllProType()
							} else {
								ElMessage.warning({
									message: '该分类下有产品数据，无法删除！',
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

			//打开产品修改框
			openupdate(val) {
				this.updateDialogFormVisible = true;

				this.updateForm.productId = val.productId
				this.updateForm.productName = val.productName
				this.updateForm.ingredient = val.ingredient
				this.updateForm.productSpec = val.productSpec
				this.updateForm.gramHeavy = val.gramHeavy
				this.updateForm.productSpec = val.productSpec
				this.updateForm.unitId = val.unitId
				this.updateForm.productTypeId = val.productTypeId
				this.updateForm.purchaseUnitPrice = val.purchaseUnitPrice
				this.updateForm.purchaseMoney = val.purchaseMoney
				this.updateForm.remarks = val.remarks
				this.updateForm.productDescribe = val.productDescribe
				this.updateForm.pictureId = val.pictureId
				this.updateForm.state = val.state
				this.updateForm.SWstate = val.state == 0 ? false : true
			},
			//修改产品信息---
			update() {
				console.log(this.updateForm)
				if (
					this.updateForm.productName == '' ||
					this.updateForm.ingredient == '' ||
					this.updateForm.unitId == '' ||
					this.updateForm.productTypeId == '' ||
					this.updateForm.purchaseUnitPrice == '' ||
					this.updateForm.purchaseMoney == '') {
					ElMessage.error('必填或必须选不能为空！！！');
				} else {
					const state = JSON.parse(sessionStorage.getItem("state"));
					var _this = this;
					this.dialogFormVisible = false

					this.axios({
							url: "http://localhost:8088/frameproject/baseProduct/updateProduct",
							method: "post",
							processData: false,
							data: {
								Product: JSON.stringify(_this.updateForm)
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
							_this.updateDialogFormVisible = false;
							_this.findpage()
						})
						.catch(function(error) {
							console.log(error);
						});
				}
			}

		},
		components: {},
		created() {
			this.findpage()
			this.findAllProType()
			this.findAllUnit()
			this.findAllProTypeToList()
		}
	};
</script>

<style lang="scss">
	.product {
		width: 75%;
		float: right
	}

	.title {
		color: #459df5;
		background-color: #f9f9f9;
		height: 30px;
		padding: 15px;
		margin-top: 0px;
	}

	.allType {
		padding: 4px;
		width: 100%;
		text-align: left;
		font-size: 17px;
	}

	.typelabel {
		width: 22%;
		height: 100%;
		float: left;
		background-color: white;
		margin: -17px;
		border-right: 2px solid gainsboro;
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
		margin: 2px;
		float: left;
		padding: 0px 10px 10px;
	}

	/* 内容表头 */
	.product-header {
		padding: 25px 15px;
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.product .el-form--inline .el-form-item {
		margin-right: 20px !important;
	}

	.product .el-tag {
		color: #409eff !important;
	}


	/* 内容表体 */
	.product-mian {
		background-color: #e9eef3;
		;
		padding-top: 10px;
	}

	.product th>.cell {
		color: white;
		background-color: #459df5 !important;
	}

	.product th>.cell {
		color: white !important;
	}

	.product-main {
		border-bottom: #e9eef3 5px solid;
		background-color: white;
	}

	.product .cell {
		text-align: center;
		color: black !important;
		font-size: 8px !important;
	}

	.product-main .el-input__inner {
		border: 0;
	}

	.product th {
		color: black !important;
		background-color: #459df5 !important;
	}

	.remarks {
		margin-top: 15px;
		height: 100%;
		width: 100%;
	}

	.product .el-textarea .el-textarea__inner {
		resize: none;
		border: 0;
	}

	/* 内容表尾 */
	.product-footer {
		padding: 20px 15px;
		background-color: white;
	}


	/**/
	html,
	body,
	#app,
	.el-container {
		padding: 0px;
		margin: 0px;
		height: 100%;
	}
</style>
