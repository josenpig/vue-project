<template>
   <div class="page-tag">
      <span style="float: left;font-size:34px">个人信息</span>
      <!-- 标签页 -->
    </div>
  <el-container class="UserInfo1">
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
            <el-button type="primary" @click="changeok()">确 定</el-button>
         	 </span>
        	</template>
      		</el-dialog>  
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
		     <el-row>
			   
		  <div class="icon1">
		
		  	<el-avatar  @click="dialogIconVisible = true" icon="el-icon-user-solid" :size="128" :src="form.userIcon"/>
		  	
		  </div>
			<div class="userinfo-x1">
			  用户名:{{form.userName}}
			</div>
			<div  class="userinfo-x1">
			  用户密码:******
			</div>
			<div  class="userinfo-x1 userinfo-y">
			 用户手机号:{{form.userPhone}}
			</div>
			<div  class="userinfo-x1 userinfo-y">
			 用户性别:{{form.userSex}}
			</div>
			<div  class="userinfo-x1 userinfo-y1">
			  备注:{{form.remark}}
			</div>
			<div class="icon-edit1">
		  	<el-button type="primary" style="height:20px" icon="el-icon-edit" @click="getuser()">修改个人信息</el-button>
		  	</div>

			
	  </el-row>
  </el-container>
</template>

<script>
export default{
	data(){
		return{
		dialogImageUrl: '',
		disabled: false,
		files: [],
		userIcon:'',
		//修改用户信息表单dialog
		dialogFormVisible: false,
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
           		  	_this.finduser();
				console.log("上传成功")
				console.log(response)
			}).catch(function(err) {
				console.log("上传失败")
				console.log(err)
			})
		},
		//打开dialog
		getuser(){
			this.dialogFormVisible=true;
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
          	}).catch(function(error){
            		console.log(error)
         	});	

		},
		//修改用户信息
		changeok(){
			const state = JSON.parse(sessionStorage.getItem("state"));
			this.dialogForm.updatedBy = state.userInfo.userName;
      			var _this = this;
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
			  _this.dialogFormVisible=false;
           		  _this.finduser();
          		
       			})
        		.catch(function (error) {
          			console.log(error);
       			});
		}	
	},
	created(){
		this.finduser();
		//this.getuser();
	},
	
}

</script>

<style>
.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 178px;
		height: 178px;
		line-height: 178px;
		text-align: center;
	}

.avatar {
		width: 178px;
		height: 178px;
		display: block;
	}
.UserInfo1 {	
  width: 100%;
  height: 90%;
  margin: 0px auto;
  padding: 0px auto;
  background-color: rgb(195, 229, 236);
  font-size:24px;
}

.icon-edit1{
}
.userinfo-x1{	
	height: 100px;
	width: 30%;
	line-height:100px;
	float: left;
}
.el-row1{
	width: 70%;
	padding: 30px 30px 30px 30px;
}
.icon1{
	width: 300px;
	height: 300px;
}
.icon1 .el-avatar{
	margin-top: 50px;
	margin-left: 50px;
}
.userinfo-y{
	margin-top: -300px;
	margin-left: 301px;
}
.userinfo-y1{
	margin-top: -445.5px;

}
</style> 