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
          <div class="ss">
            <!-- 操作员 -->
            <br /><br />
            <span>操作员:</span>
            <el-select v-model="value1"  filterable>
              <el-option>
              </el-option>
            </el-select>
            <!-- 登陆时间 -->
            <div class="block">
            <span class="demonstration">登陆时间:</span>
            <el-date-picker
             v-model="value2"
             align="right"
             type="date"
             placeholder="选择日期"
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
          prop="logintime"
          label="登陆时间"
          sortable
          width="435"
        />
        <el-table-column prop="operator"   label="操作员" width="255" />
        <el-table-column prop="typeofoperator"   label="操作员类别" width="255" />
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
        //选择日期
        value2: '',
        //表单数据
        tableData:[],
        //分页
		pagesize: 5,
		max: 0,
		currentPage: 1,
      };
    },
    methods: {
			//改变页码数
			handleCurrentChange(val) {
				this.findpage(val, this.pagesize);
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
						url: "http://localhost:8088/frameproject/operationlog/findAll",
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
			this.findpage()
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
.ss{
	margin-top:0px;
	
}

.block{
	float: left;
}

</style>