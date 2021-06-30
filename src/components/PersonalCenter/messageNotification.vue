<template>
  <!-- 主内容 -->
  <div class="returnlistme">
    <!-- 标题 -->
    <div class="page-tagme">
      <span style="float: left;font-size:28px">订单审批通知</span>
      <!-- 标签页 -->
    </div>
    <!-- 表单头部 筛选 -->
    <div class="returnlist-header1me">
      <el-collapse accordion>
        <br>
       <el-button-group>
  <el-button type="primary" icon="el-icon-search" @click="qureynotread()">未读</el-button>
  <el-button type="primary" icon="el-icon-search" @click="qureyisread()">已读</el-button>
  <el-button type="primary" icon="el-icon-search" @click="qureyAll()">全部</el-button>
      </el-button-group>
       <el-button class="yd" type="primary" icon="el-icon-view" @click="isreadAll()">全部已读</el-button>
      </el-collapse>
    </div>
    <!-- 表体内容 -->
    <div class="returnlist-mianme">
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
       <el-table-column prop="sendtime" label="发送时间" width="200" />
        <el-table-column prop="recver" label="接收人" width="200" />
        <el-table-column prop="status" label="已读状态" width="200"/>
		<el-table-column prop="sender" label="发送人" width="200" />
		<el-table-column prop="orderid" label="订单号" width="400" />
    <el-table-column label="操作" width="200" fixed>
						<template #default="scope">
							<el-tooltip content="查看" placement="top">
								<el-button size="mini" icon="el-icon-search" @click="queryrow(scope.row)" type="primary" circle />
							</el-tooltip>
              	<el-tooltip content="标记为未读" placement="top">
								<el-button size="mini" icon="el-icon-bell" @click="notreadrow(scope.row)" type="primary" circle />
							</el-tooltip>
							<el-tooltip content="标记为已读" placement="top">
								<el-button size="mini" icon="el-icon-message-solid" @click="isreadrow(scope.row)" type="primary" circle />
							</el-tooltip>
						</template>
					</el-table-column>
      </el-table>
    </div>
    <!-- 表尾分页显示 -->
    <div class="returnlist-footerme">
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
        value2:'',
        //表单数据
        tableData:[],
        //分页
		    pagesize: 5,
	    	max: 0,
	    	currentPage: 1,
        //
        };
    },
    methods: {
      //查看订单
      queryrow(val){
        sessionStorage.setItem('orderid',val.orderid);
        this.$router.push('/Sale')
      },
      //标记已读
      isreadrow(val){
        const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
          orderid : val.orderid,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/message/isread",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
				    _this.findpage();
					})
					.catch(function(error) {
						console.log(error);
					});
      },
       //标记已读所有
      isreadAll(){
        const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/message/isreadAll",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
				    _this.findpage();
					})
					.catch(function(error) {
						console.log(error);
					});
      },
      //标记未读
      notreadrow(val){
          const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
          orderid : val.orderid,
				};
				this.axios({
						url: "http://localhost:8088/frameproject/message/notread",
						method: "get",
						processData: false,
						params: fd,
						headers: {
							JWTDemo: state.userInfo.token,
						},
					})
					.then(function(response) {
				    _this.findpage();
					})
					.catch(function(error) {
						console.log(error);
					});
      },
      //查看已读
      qureyisread(){
        const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
				};

				this.axios({
						url: "http://localhost:8088/frameproject/message/qureyisread",
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
                        console.log(response.data.data.total);
					})
					.catch(function(error) {
						console.log(error);
					});
      },
      //查看未读
      qureynotread(){
           const state = JSON.parse(sessionStorage.getItem("state"));
				var _this = this;
				var fd = {
					currentPage: this.currentPage,
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
				};

				this.axios({
						url: "http://localhost:8088/frameproject/message/qureynotread",
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
                        console.log(response.data.data.total);
					})
					.catch(function(error) {
						console.log(error);
					});
      },
      //查看所有
      qureyAll(){
        this.findpage();
      },
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
					pagesize: this.pagesize,
          userName : this.$store.state.userInfo.userName,
          orderid : this.orderid,
				};

				this.axios({
						url: "http://localhost:8088/frameproject/message/allm",
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
                        console.log(response.data.data.total);
					})
					.catch(function(error) {
						console.log(error);
					});
			},
    },
    computed: {},
		created() {
			this.findpage();
      this.handleCurrentChange();
		}
  };
</script>

<style>
.returnlistme {
  width: 100%;
  background-color: #e9eef3 !important ;
}
/* 顶部 */
.returnlistme .page-tagme {
  padding: 0 10px;
  color: #323232;
  font-size: 18px;
  height: 40px;
  background-color: #e9eef3;
}
/* 内容表头 筛选框 */
.returnlist-header1me {
  padding: 15px 15px;
  height: 80px;
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlistme .el-radio-group {
  margin: 10px 0px;
}
.returnlist-header1me span {
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
}
.returnlistme .el-tag {
  color: #409eff !important;
}
.returnlistme .el-collapse,
.returnlistme .el-collapse-item__wrap,
.returnlistme .el-collapse-item__header,
.returnlistme .el-radio-button__inner {
  border: none !important;
  border-radius: 0px !important;
}
.returnlistme .el-select--small {
  line-height: 32px;
  margin-right: 20px;
}
/* 表体内容 */
.returnlist-mainme {
  border-bottom: #e9eef3 5px solid;
  background-color: white;
}
.returnlistme th {
  color: white !important;
  background-color: #459df5 !important;
}
.returnlistme .cell {
  text-align: center;
}
/* 内容表尾 */
.returnlist-footerme {
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

.yd{
  float: right;
}
</style>