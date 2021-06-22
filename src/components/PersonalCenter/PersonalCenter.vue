<template>
   <div class="page-tag">
      <span style="float: left;font-size:34px">个人信息</span>
      <!-- 标签页 -->
    </div>
  <el-container class="UserInfo">
	   <el-dialog title="用户修改" v-model="dialogFormVisible" width="45%">
        <el-form :model="dialogForm" :rules="rules1" ref="change">
          <el-form-item label="用户名称：" prop="userName">
            <el-input v-model.trim="dialogForm.userName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="用户手机：" prop="userPhone">
            <el-input v-model.trim="dialogForm.userPhone" style="width: 250px" />
          </el-form-item>
	  <el-form-item label="用户密码：" prop="userPass">
            <el-input v-model.trim="dialogForm.userPass" style="width: 250px" show-password/>
          </el-form-item>
          <el-form-item label="用户性别：">
            <el-radio v-model="dialogForm.userSex" label="男">男</el-radio>
            <el-radio v-model="dialogForm.userSex" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :rows="3"
              placeholder="请填写用户备注"
              v-model.trim="dialogForm.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeok('change')">确 定</el-button>
         	 </span>
        	</template>
      		</el-dialog>
		     <el-row>
		  <span class="icon-edit">
		  <el-button type="primary" style="height:20px" icon="el-icon-edit" @click="getuser()">修改个人信息</el-button>
		  </span>
		  <el-link>
		  <el-avatar icon="el-icon-user-solid" :size="128" :src="form.userIcon"/>
		  </el-link>
			<span class="userinfo-x">
			  用户名:{{form.userName}}
			</span>
			<span  class="userinfo-x2">
			  用户密码:******
			</span>
			<span  class="userinfo-x3">
			 用户手机号:{{form.userPhone}}
			</span>
			<span  class="userinfo-x4">
			 用户性别:{{form.userSex}}
			</span>
			<span  class="userinfo-x5">
			  备注:{{form.remark}}
			</span>
	  </el-row>
  </el-container>
</template>

<script>
export default{
	data(){
		return{
		dialogFormVisible: false,
		form: {
		 delFlag: "",
		 foundTime: "",
		 founder: "",
		 updatedBy: "",
		 userIcon:"",
        	 userId: "",
        	 userName: "",
		 userPass:"",
         	 userPhone: "",
        	 userSex: "",
        	 userState: "",
        	 remark: "",
		 roles: [],
      		},
		dialogForm:{
		 userId: "",
        	 userName: "",
		 userPass:"",
         	 userPhone:"",
        	 userSex: "",
        	 remark: "",	
		},
		rules1: {
        	 userName: [
          	 {
			 required: true, message: "请输入用户名称", trigger: "blur" 
		 },
          	 {
           	 min: 2,
           	 max: 10,
            	 message: "长度在 2 到 10 个字符",
           	 trigger: "blur",
          	 },
        	 ],
        	 userPhone: [
          	 { 
			required: true, message: "请输入手机号", trigger: "blur"
		 },
          	 {
            	 pattern: /^1[34578]\d{9}$/, //正则校验不用字符串
           	 message: "请填写正确的手机号码",
            	 trigger: "blur",
          	 },
        	 ],
		 userPass: [
          	 { 
			required: true, message: "", trigger: "blur" 
		 },
          	 {
           	 min:6,
            	 message: "长度不能小于6个字符",
            	 trigger: "blur",
         	 },
        	 ],
      		},
		}
	},
	methods:{
		//打开dialog
		getuser(){
			this.dialogFormVisible=true;
			this.dialogForm.userId=this.form.userId;
			this.dialogForm.userName=this.form.userName;
			this.dialogForm.userPass=this.form.userPass;
			this.dialogForm.userPhone=this.form.userPhone;
			this.dialogForm.userSex=this.form.userSex;
			this.dialogForm.remark=this.form.remark;
		},
		//获取该用户信息
		finduser(){
			const state = JSON.parse(sessionStorage.getItem("state"));
        		var _this = this;
			var fd = {
			username : this.$store.state.userInfo.userName
			};
			console.log("------"+fd.username);
        		this.axios({
          		 url:"http://localhost:8088/frameproject/user/getUsermessage",
         		 method:"get",
			 params: fd,
          		 processData: false,
       			 headers:{
           		  JWTDemo:state.userInfo.token,
          		 }
         	}).then(function(response){
           		_this.form = response.data.data.user[0];
			_this.form.userIcon = "src/assets/img/"+response.data.data.user[0].userIcon;
            		console.log(response.data.data.user);
          	}).catch(function(error){
            		console.log(error)
         	});	

		},
		//修改用户信息
		updateuser(){

		}	
	},
	created(){
		this.finduser();
		this.getuser();
	},
	
}

</script>

<style>
.UserInfo {	
  width: 100%;
  height: 90%;
  margin: 0px auto;
  padding: 0px auto;
  background-color: rgb(195, 229, 236);
  font-size:24px;
}
.icon-edit{
	margin-top: 50px;
	margin-left: 120px;
}
.userinfo-x{
	margin-left: 40px;
	margin-top: 100px;
}
.userinfo-x2{
	margin-top: 160px;
	margin-left: -150px;
}
.userinfo-x3{
	margin-top: -270px;
	margin-left:305px;
}
.userinfo-x4{
	margin-top: -220px;
	margin-left:-280px;
}
.userinfo-x5{
	margin-top: -160px;
	margin-left:-124px;
}
.el-avatar{
	margin-top: 100px;
	margin-left:-135px;
}
.el-link{
	margin-top: -170px;
}
</style> 