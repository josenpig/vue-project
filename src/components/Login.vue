<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 账户登录表单区-->
      <el-tabs v-model="activeName" :stretch="true">
        <el-tab-pane label="账号登录" name="first">
          <div style="float: left; margin-top: 250px">
            <el-form
              ref="loginForm"
              :rules="loginFormRules"
              :model="loginForm"
              label-width="0px"
              class="login_form"
            >
              <!-- 用户名-->
              <el-form-item prop="userName">
                <el-input
                  prefix-icon="el-icon-user"
                  placeholder="请输入用户名"
                  maxlength="15"
                  v-model="loginForm.userName"
                  clearable
                ></el-input>
              </el-form-item>
              <!-- 密码-->
              <el-form-item prop="userPass">
                <el-input
                  prefix-icon="el-icon-lock"
                  placeholder="请输入密码"
                  v-model="loginForm.userPass"
                  maxlength="15"
                  show-password
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item class="btus">
                <!-- 确认登录-->
                <el-button type="primary" @click="login()" style="width: 415px"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 快捷登录 -->
        <el-tab-pane label="快捷登录" name="second">
          <div style="float: left; margin-top: 250px">
            <el-form
              ref="loginFormgo"
              :rules="loginFormRulesgo"
              :model="loginFormgo"
              label-width="0px"
              class="login_form"
            >
              <!-- 手机号-->
              <el-form-item prop="userPhone">
                <el-input
                  prefix-icon="el-icon-phone"
                  placeholder="请输入手机号"
                  maxlength="11"
                  v-model="loginFormgo.userPhone"
                  clearable
                ></el-input>
              </el-form-item>
              <!-- 验证码-->
              <el-form-item prop="userMessage">
                <el-input
                  prefix-icon="el-icon-s-comment"
                  placeholder="请输入验证码"
                  v-model="loginFormgo.userMessage"
                  maxlength="6"
                  style="width: 65%"
                  clearable
                ></el-input>
                <el-button class="gain" :disabled="reset" @click="getcode(0)">
                  {{ reset ? `${djs}秒后再次获取` : "获取验证码" }}</el-button
                >
              </el-form-item>
              <el-form-item class="btus">
                <!-- 确认登录-->
                <el-button
                  type="primary"
                  @click="gologin()"
                  style="width: 415px"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { initDynamicRoutes } from "../router/index.js";
import { ElMessage } from "element-plus";
export default {
  name: "Login",
  data() {
    return {
      activeName: "first",
      // 账户登录信息
      loginForm: {
        userName: "admin",
        userPass: "a123456",
      },
      //表单验证规则对象
      loginFormRules: {
        //验证用户名是否合法
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        //验证密码是否合法
        userPass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      // 快捷登录信息
      loginFormgo: {
        userPhone: "",
        userMessage: "",
      },
      //表单验证规则对象
      loginFormRulesgo: {
        //验证用户名是否合法
        userPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        //验证密码是否合法
        userMessage: [
          { required: true, message: "请输入验证码", trigger: "blur" },
        ],
      },
      djs: 60,
      reset: false,
    };
  },
  methods: {
    //获取验证码
    getcode(i) {
      const _this = this;
      if (i == 0) {
        if (!/^1[34578]\d{9}$/.test(this.loginFormgo.userPhone)) {
          ElMessage.error("请填写正确的手机号");
        } else {
          this.axios
            .post(
              "http://localhost:8088/frameproject/login/getcode/" +
                _this.loginFormgo.userPhone
            )
            .then(function (response) {
              ElMessage.success("验证码已发送,请注意查收");
            })
            .catch(function (error) {
              console.log(error);
            });
          this.reset = true;
          let timer = setInterval(() => {
            this.djs--;
            this.$store.commit("updatetime", {
              thisdjs: this.djs,
            }); //存入本地
            if (this.djs <= 0) {
              this.reset = false;
              this.djs = 60;
              clearInterval(timer);
            }
          }, 1000);
        }
      } else {
        this.reset = true;
        let timer = setInterval(() => {
          this.djs--;
          this.$store.commit("updatetime", {
            thisdjs: this.djs,
          }); //存入本地
          if (this.djs <= 0) {
            this.reset = false;
            this.djs = 60;
            clearInterval(timer);
          }
        }, 1000);
      }
    },
    //账户登录校验
    login() {
      const _this = this;
      this.axios
        .post("http://localhost:8088/frameproject/login", _this.loginForm)
        .then(function (response) {
          if (typeof response.data.data == "string") {
            ElMessage.error(response.data.data);
          } else {
            _this.$store.commit("setmenulists", response.data.data.menus);
            _this.$store.commit("updateUserInfo", response.data.data);
            _this.$router.push("/Workbench");
            //动态路由
            initDynamicRoutes();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    gologin() {
      const _this = this;
      var fd={
        phone:_this.loginFormgo.userPhone,
        code: _this.loginFormgo.userMessage
      }
      this.axios({
        url: "http://localhost:8088/frameproject/login/fast",
        method: "post",
        params: fd,
      })
        .then(function (response) {
          if (typeof response.data.data == "string") {
            ElMessage.error(response.data.data);
          } else {
            _this.$store.commit("setmenulists", response.data.data.menus);
            _this.$store.commit("updateUserInfo", response.data.data);
            _this.$router.push("/Workbench");
            //动态路由
            initDynamicRoutes();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
  //
  created() {
    //先清空
    window.sessionStorage.removeItem("menulists");
    window.sessionStorage.removeItem("state");
    //获取之前获取验证码的倒计时
    if (
      window.sessionStorage.getItem("djs") != null ||
      window.sessionStorage.getItem("djs") > 0
    ) {
      this.djs = this.$store.state.thisdjs;
      this.getcode(1);
    }
  },
};
</script>

<style>
.el-tabs__nav-scroll {
  margin-left: 0px !important;
}
.login_container {
  height: 100%;
  width: 100%;
  background: url("../assets/img/bgimg.jpg");
  background-size: 100%
}
.gain {
  position: absolute;
  left: 65%;
  top: 0%;
  width: 35%;
  background: rgba(230, 230, 230, 0.5);
  min-height: 41px !important;
}
.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(230, 230, 230, 0.5);
  border-radius: 15px;
}
.btus {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 415px;
  padding: 20px 18px;
}
</style>