<template>
   <div class="page-tag">
      <span style="float: left;margin-top:20px;margin-left:20px;font-size:34px">个人中心</span>
      <!-- 标签页 -->
    </div>
  <el-container class="UserInfo1">
	  <el-dialog title="上传头像" v-model="dialogIconVisible" width="35%">
			<el-upload action="" ref="upload" list-type="picture-card" :auto-upload="false" :on-change="handleUpload">
		<template #default>
			<i class="el-icon-plus"></i>
		</template>
		<template #file="{file}">
			<div>
				<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
				<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
						<i class="el-icon-zoom-in"></i>
					</span>
					<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
						<i class="el-icon-download"></i>
					</span>
					<span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
						<i class="el-icon-delete"></i>
					</span>
				</span>
			</div>
		</template>
	</el-upload>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogIconVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitUpload()">确 定</el-button>
         	 </span>
        	</template>
      		</el-dialog>
	<el-card class="box-card">
  <template #header>
    <div class="card-header">
      <span>个人信息</span>
    </div>
  </template>
  <div class="text_item">
	  <div class="text_i">
	   <el-avatar icon="el-icon-user-solid" :size="112" :src="form.userIcon" @click="dialogIconVisible=true"></el-avatar> 
	 </div>
	 <hr/> 
	 <div class="text_i">
	<i class="el-icon-user-solid">用户名</i>
	<span class="right">{{form.userName}}</span>
	 </div>
	 <br>
	  <hr/>
	<div class="text_i">
	<i class="el-icon-phone">手机号</i>
	<span class="right">{{form.userPhone}}</span>
	 </div>
	 <br>
	  <hr/>
	<div class="text_i">
	<i class="el-icon-s-custom">性别</i>
	<span class="right">{{form.userSex}}</span>
	 </div>
	 <br>
	  <hr/>
	<div class="text_i">
	<i class="el-icon-key">密码</i>
	<span class="right">******</span>
	 </div>
	  <br>
	  <hr/>
	<div class="text_i">
	<i class="el-icon-tickets">备注</i>
	<span class="right">{{form.remark}}</span>
	 </div>
  </div>
  
</el-card>
	  <el-card class="update-card">
  <template #header>
    <div class="card-header">
      <span v-show="iszz">基础资料</span>
       <span v-show="isyy">修改密码</span>
    </div>
  </template>
  <div class="text_form">
	<el-radio-group v-model="radio1">
      <el-radio-button label="基本信息" @click="openjb()"></el-radio-button>
      <el-radio-button label="修改密码" @click="openps()"></el-radio-button>
    </el-radio-group>   
    <hr/>
	<!-- //修改密码 -->
	<el-form :model="dialogForm" :rules="rules1" ref="change" v-show="isps">
          <el-form-item label="新密码：" prop="newuserPass">
            <el-input v-model.trim="dialogForm.newuserPass" style="width: 250px"  type="password"/>
          </el-form-item>
	  <el-form-item label="确认新密码：" prop="isuserPass">
            <el-input v-model.trim="dialogForm.isuserPass" style="width: 250px"  type="password"/>
          </el-form-item>
	 </el-form>
	 <!-- //修改基本信息 -->
	<el-form :model="dialogForm" :rules="rules1" ref="change" v-show="isjb">
          <el-form-item label="用户名称：" prop="userName">
            <el-input v-model.trim="dialogForm.userName" style="width: 250px" />
          </el-form-item>
          <el-form-item label="用户手机：" prop="userPhone">
            <el-input v-model.trim="dialogForm.userPhone" style="width: 250px" />
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
	<span class="dialog-footer">
            <el-button>取 消</el-button>
            <el-button type="primary" @click="changeok()">确 定</el-button>
            </span>
  </div>
</el-card>
  </el-container>
</template>

<script>
// import Stomp from 'stompjs'
import { mapState } from "vuex";
import { initDynamicRoutes } from "../../router/index.js";
export default{
	data(){
		return{
		//client: Stomp.client("ws://localhost:15674/ws"),
		dialogImageUrl: '',
		radio1:'基本信息',
		files: [],
		isjb:false,
		isps:false,
		iszz:false,
		isyy:false,
		userIcon:'',
		//修改头像dialog
		dialogIconVisible: false,
		//个人信息
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
		//修改个人信息表单字段
		dialogForm:{
		 userId: "",
        	 userName: "",
		 newuserPass:"",
		 isuserPass:"",
		 userPass:"",
         	 userPhone:"",
        	 userSex: "",
        	 remark: "",
		 updatedBy: "",	
		},
		//限制
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
		 isuserPass: [
          	 { 
			required: true, message: "", trigger: "blur" 
		 },
          	 {
           	 min:6,
            	 message: "长度不能小于6个字符",
		 trigger: 'blur' ,
         	 },
        	 ],
		 newuserPass:[
			{
				required:true,message:"",trigger:"blur"
			},
			{
			min:6,
            	 	message: "长度不能小于6个字符",
			trigger:'blur',
			},
		 ],
      		},
		}
	},
	methods:{
		
		handleRemove(file) {
			console.log("删除")
			console.log(file);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleDownload(file) {
			console.log(file);
		},

		handleUpload(file) {
			console.log("文件名", file.name);
			this.userIcon = file.name;
			// 保存需要上传的文件
			//let keyID = Math.random().toString().substr(2);
			//file["keyID"] = keyID;
			this.files.push(file);
			return true;
		},handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.userIcon = file.name; 
			console.log(this.userIcon);
			},
		//上传头像
		submitUpload() {
			console.log(this.dialogImageUrl)	
			const state = JSON.parse(sessionStorage.getItem('state'));
			var fd = {
				userIcon:this.userIcon,
				userName:this.form.userName,
				updatedBy: this.form.userId, 
				userId: this.form.userId,	
				};
			var _this = this;
			this.axios({
				url: 'http://localhost:8088/frameproject/personal/upload',
				method: 'post',
				processData: false,
				data:{
					Icon:  JSON.stringify(fd),
				},
				headers: {
					JWTDemo:state.userInfo.token,
				}
			}).then(function(response) {
				_this.dialogIconVisible=false;
           		  	_this.changeok();
				console.log("上传成功")
				console.log(response)
			}).catch(function(err) {
				console.log("上传失败")
				console.log(err)
			})
		},
		//修改信息
		openjb(){
			this.iszz=true;
			this.isyy=false;
			this.isjb=true;
			this.isps=false;
		},
		openps(){
			this.isyy=true;
			this.isjb=false;
			this.isps=true;
			this.iszz=false;
			
		},
		//打开dialog
		getuser(){
			const state = JSON.parse(sessionStorage.getItem("state"));
			if(this.radio1=='基本信息'){
				this.isjb=true;
				this.iszz=true;
			};
			console.log(">>>>>>>>>>>>>")
			this.dialogForm.userId=this.form.userId;
			this.dialogForm.userName=this.form.userName;
			//this.dialogForm.userPass=this.form.userPass;
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
          		 url:"http://localhost:8088/frameproject/personal/getUsermessage",
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
			    _this.getuser();
          	}).catch(function(error){
            		console.log(error)
         	});	

		},
		//验证密码
		isPass(){
			const state = JSON.parse(sessionStorage.getItem("state"));
        		var _this = this;
			var fd={
			userPass : this.dialogForm.userPass,
			userName : this.dialogForm.userName,
			};
        		this.axios({
          		url:"http://localhost:8088/frameproject/personal/ispass",
         		method:"get",
          		processData: false,
			params : fd, 
          		headers:{
            		JWTDemo:state.userInfo.token,
          		}
          		}).then(function(response){
			_this.isPass=response.data.data
         		}).catch(function(error){
            		console.log(error)
         		});

		},
		//修改用户信息
		changeok(){
			const state = JSON.parse(sessionStorage.getItem("state"));
			this.dialogForm.updatedBy = state.userInfo.userName;
			var _this = this;
			if(this.isjb!=false){
			console.log("个人信息修改");
      			this.axios({
       			 url: "http://localhost:8088/frameproject/personal/changeuesr",
        		 method: "post",
        		 data: {
          			user: JSON.stringify(_this.dialogForm),
        		 },
        		 headers: {
          			JWTDemo: state.userInfo.token,
        		 },
      			})
        		.then(function (response) {
			_this.$store.commit("setmenulists", response.data.data.menus);
			console.log(">>>>>>"+ response.data.data);
            		_this.$store.commit("updateUserInfo", response.data.data);
            		//动态路由
            		initDynamicRoutes();
           		_this.finduser();
          		_this.$router.go(0);
       			})
        		.catch(function (error) {
          			console.log(error);
       			});
			}else{	
			if(this.dialogForm.newuserPass != this.dialogForm.isuserPass){
				this.$message({
					type: "error",
					message: "两次密码不一致,请重新输入！",
				});
				this.dialogForm.isuserPass = '';
				return false;
			}	
			console.log("密码修改")

			var fd={
			userName : this.dialogForm.userName,
			userPass : this.dialogForm.newuserPass,
			updatedBy: this.form.userId,
			};
			console.log("userName:"+fd.userName);
			console.log("userPass:"+this.dialogForm.newuserPass);
			console.log("updateBy:"+this.form.userId);
			this.axios({
       			 url: "http://localhost:8088/frameproject/personal/changeuesrPass",
        		 method: "get",
			 processData: false,
        		 params: fd,
        		 headers: {
          			JWTDemo: state.userInfo.token,
        		 },
      			})
        		.then(function (response) {
           		 _this.$router.push("/Login");
          		 sessionStorage.clear();
       			})
        		.catch(function (error) {
          			console.log(error);
       			});
			}
		},
	//             // 消息队列获取
        //     mqtthuoquMsg() {
        //         //初始化连接
        //         const headers = {
        //             login: "guest",
        //             passcode: "guest"
        //         };
        //         //进行连接
        //         this.client.connect(headers.login, headers.passcode, this.onConnected,  this.onFailed, "/");
        //     },
        //     onConnected: function () {
        //         //订阅频道
        //         const topic = "/exchange/mail.exchange/mail.routing.key";
	// 	console.log(topic+">>>>>>>>>>>>>>>>>>>>>");
        //         this.client.subscribe(topic, this.responseCallback, this.onFailed);
        //     },
        //     onFailed: function (frame) {
        //         console.log("MQ Failed: " + frame);
        //         this.$message.error('连接失败')
        //     },
        //     // 回传消息
        //     responseCallback: function (frame) {
        //          console.log("MQ msg=>" + frame.body);
        //         //接收消息处理
        //     },
        //     // 断开相应的连接
        //     close:function(){
        //           this.client.disconnect(function() {
        //                     console.log("已退出账号");
        //           })
        //     }
	},
	created(){
		this.finduser();
		//this.mqtthuoquMsg();
		//this.getuser();
	},
	
}

</script>

<style>
.UserInfo1 {	
  width: 100%;
  height: 90%;
  margin: 80px auto;
  padding: 100px auto;
  background-color: rgb(222, 231, 233);
  font-size:24px;
}

.UserInfo1 .box-card{
	margin-left: 50px;
	margin-top: 20px;
	width: 30%;
	height: 80%;
}
.update-card{
	margin-left: 20px;
	margin-top: 20px;
	width: 61%;
	height: 70%;
}
.text_item{
	text-align: center;
}
.text_i i{
	float: left;
}
.right{
	float: right;
}
</style> 