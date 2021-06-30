<template>
  <!-- 主内容 -->
  <div class="returnlist">
    <!-- 标题 -->
    <div class="page-tag">
      <span style="float: left;font-size:28px">操作日志</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="returnlist-header1">
      <el-collapse accordion>
          <div class="ss">
            <!-- 操作员 -->
            <br /><br />
            <span>操作员:</span>
            <el-select v-model="operator"  filterable @change="findpage()">
              <el-option 
                   v-for="item in operators"
                    :key="item.userName"
                    :label="item.userName"
                    :value="item.userName">
              </el-option>
            </el-select>
			<!--操作内容 -->
			<span>操作内容:</span>
		   <el-input v-model="input" placeholder="请输入内容" ></el-input>
       <el-button type="primary" icon="el-icon-search" @click="findpage()">搜索</el-button>
            <!-- 操作时间 -->
            <div class="block">
            <span class="demonstration">操作时间:</span>
            <el-date-picker
             v-model="value2"
             align="right"
             type="date"
             placeholder="选择日期"
             @change="findpage()"
            :disabled-date="disabledDate"
            :shortcuts="shortcuts"
          >
        </el-date-picker>
  </div>
          </div>
        
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
          prop="createtime"
          label="操作时间"
          sortable
          width="340"
        />
        <el-table-column prop="operator" label="操作员" width="230" />
        <el-table-column prop="operation" label="操作内容" width="185" />
		<el-table-column prop="method" label="操作的方法" width="460" />
		<!-- <el-table-column prop="params" label="参数" width="230" /> -->
		<el-table-column prop="ipaddress" label="ip地址" width="230" />

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
import { defineComponent, ref } from 'vue'
import {
		ElMessage
	} from 'element-plus'
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
        value2:'',
        //表单数据
        tableData:[],
        //分页
		    pagesize: 5,
	    	max: 0,
	    	currentPage: 1,
        operator:"",//操作员
        operators:[],
        input: ref(''),
        };
    },
    methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize,this.value2,this.operator,this.input);
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
			//分页查询
			findpage() {
				const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          createtime:this.value2,
          input: this.input,
          operator:this.operator,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/operationlog/findoperationlogbycondition",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
						_this.tableData = response.data.data.rows;
						_this.max = response.data.data.total;
                        console.log(response.data.data.rows);
                        console.log(response.data.data.total)
					})
					.catch(function(error) {
						console.log(error);
					});
			},
    },
    computed: {},
		created() {
			this.findpage();
      this.findusername();
		}
  };
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
.returnlist-header1 {
  padding: 15px 15px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlist .el-radio-group {
  margin: 10px 0px;
}
.returnlist-header1 span {
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
.ss{
	margin-top:0px;
	
}
.returnlist-header1 .el-input{
  width: 210px;
}
.block{
	float: left;
}
.el-button{
  margin-left: 10px;
}

</style>