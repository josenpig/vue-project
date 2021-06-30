<template>
  <!-- 主内容 -->
  <div class="returnlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left;font-size:28px">登录日志</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="returnlist-header">
       <el-collapse accordion>
         <br/>
         <br/>
         
      <el-form>
        
            <!-- 登陆时间 -->
            <p class="block block1">
             <span class="demonstration">登陆日期:</span>
             <el-date-picker
               v-model="value2"
               @change="findlogbyOperator()"
               align="right"
              
               type="date"
               placeholder="选择日期"
               :disabled-date="disabledDate"
               :shortcuts="shortcuts"
    >
              </el-date-picker>
            </p>
            <br/>
            <!--操作员--->
            <p class="block">
    <el-form-item>
      <el-from-label>操作员：    </el-from-label>
          <el-select v-model="operator"  placeholder="请选择操作员"  @change="findlogbyOperator()">
            <el-option
                    v-for="item in operators"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
            </p>
            <p class="block">
    <el-form-item>
      <el-from-label>操作员类别：    </el-from-label>
          <el-select v-model="operatorType"  placeholder="请选择操作员类别"  @change="findlogbyOperator()">
            <el-option
                    v-for="item in operatorTypes"
                    :key="item.roleName"
                    :label="item.roleName"
                    :value="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
            </p>         
      </el-form>
       </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="returnlist-mian">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          prop="logintime"
          label="登陆时间"
          sortable
          width="435"
        />
        <el-table-column prop="operator"   label="操作员" width="255" />
        <el-table-column prop="typeofoperator"   label="操作员类别" width="255" />
        <el-table-column prop="logintype"   label="登录方式" width="255" />
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="returnlist-footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="max"
        :page-size="pagesize"
        style="margin-top: 50px"
        @current-change="handleCurrentChange"
        v-model:currentPage="currentPage"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
		ElMessage
	} from 'element-plus';
import store from "../../store";
 export default {
     data() {
      return {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: 'Today',
          value: new Date(),
        }, {
          text: 'Yesterday',
          value: (() => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          })(),
        }, {
          text: 'A week ago',
          value: (() => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          })(),
        }],
        //选择日期
        value2: '',
        //表单数据
        tableData:[],
        //分页
		    pagesize: 5,
		    max: 0,
		    currentPage: 1,
        
        //表头单据信息
        operator:"",//操作员
        operators:[],
        operatorType:"",//操作员类别
        operatorTypes:[],
        //ex表格数据
        excelData:[],
      
      };
    },
    methods: {

    
			//改变页码数
			handleCurrentChange(val) {
				this.findlogbyOperator(this.operator,val, this.pagesize,this.value2,this.operatorType);
			},
      //获取操作员
     findusername(){
				const state = JSON.parse(sessionStorage.getItem("state"));
        var _this = this;
        this.axios({
          url:"http://localhost:8088/frameproject/personnel/ofpeople",
          method:"get",
          processData: false,
          headers:{
            JWTDemo:state.userInfo.token,
          }
          }).then(function(response){
            _this.operators=response.data.data.notifiers;
            console.log(response.data.data.notifiers)
          }).catch(function(error){
             console.log(error)
          });

      },
      //获取操作员类别
     finduserrole(){
				const state = JSON.parse(sessionStorage.getItem("state"));
        var _this = this;
        this.axios({
          url:"http://localhost:8088/frameproject/personnel/ofpeople",
          method:"get",
          processData: false,
          headers:{
            JWTDemo:state.userInfo.token,
          }
          }).then(function(response){
            _this.operatorTypes=response.data.data.sysRoles;
            console.log(response.data.data.sysRoles)
          }).catch(function(error){
             console.log(error)
          });

      },
      //通过操作员查询登录记录||查询所有||通过日期查询
      findlogbyOperator(){
        const state = JSON.parse(sessionStorage.getItem("state"));
        var _this = this;
        var params = {
         logintime : this.value2,
         operator : this.operator,
         currentPage: this.currentPage,
         pagesize: this.pagesize,
         operatorType:this.operatorType,
        };
        this.axios({
          url : "http://localhost:8088/frameproject/operationlog/findloginlogbycondition",
          methods : "get",
          processData : false,
          params : params,
          headers:{
            JWTDemo:state.userInfo.token,
          }
        }).then(function(response){
          _this.tableData = response.data.data.rows;
					_this.max = response.data.data.total;
                        console.log(response.data.data.rows);
                        console.log(response.data.data.total);
        }).catch(function(error){
          console.log(error)
        })
      },
     
    },
    computed: {}
		,created() {
      this.handleCurrentChange(); 
      this.finduserrole();
      this.findusername();
      this.findlogbyOperator();
     
   },
 }
</script>

<style>
.returnlist {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.returnlist .page-tag {
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  line-height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.returnlist-header {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlist .el-radio-group {
  margin: 10px 0px;
}
.returnlist-header span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.returnlist .el-tag {
  color: #409eff !important;
}
.returnlist .el-collapse,
.returnlist .el-collapse-item__wrap,
.returnlist .el-collapse-item__header,
.returnlist .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.returnlist .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.returnlist-main {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlist th {
  color: white !important;
  background-color: #459df5 !important;
}
.returnlist .cell {
  text-align: center;
}
/* 内容表尾 */
.returnlist-footer {
  padding: 25px 15px;
  background-color: white;
  text-align: center;
}
.block{
  float: left;
  margin-left: 10px;
}
.block1{
 margin-top: 37px;
}
.returnlist-header .el-collapse{
  height: 120px;
}
</style>