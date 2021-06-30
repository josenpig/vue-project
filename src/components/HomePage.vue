<template>
  <el-container class="homepage">
    <!-- 头部信息 -->
    <el-header style="height: 50px">
      <div class="el-header-div1">
        <!-- <img
          height="25"
          style="vertical-align: middle; vertical-align: -5px"
          src="../assets/img/mv.jpg"
        /> -->
        <span>星际进销存</span>
      </div>
      <!-- 用户信息 -->
      <el-row style="float: right" :gutter="40">
        <el-col :span="6" style="line-height: 48px">
          <!-- <el-popover
    placement="bottom"
    title="最新消息通知"
    :width="400"
    trigger="click"
  
  > -->
            
            
    <!-- <template #reference> -->
          <el-button type="text" icon="el-icon-bell" style="color: white;margin-top:-10px" @click="gotoset1()"
            > 提醒
            <!-- <el-badge v-model="msg.isHidden" :max="msg.mrow" :value="msg.nrow" class="item"> -->
              <!-- </el-badge> -->
          </el-button>
    <!-- </template> -->
    <!-- <el-table
        :data="message"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column
          width="400"
        >
        {{message.sender}}向{{message.recver}}发起了一个{{message.ordertype}}的审批请求,订单编号为{{message.orderid}}
        </el-table-column>
      </el-table>
      <el-button style="width:400px" @click="gotoset1()">查看所有通知</el-button> -->
  <!-- </el-popover> -->
        </el-col>
        <el-col :span="6" style="line-height: 48px">
          <el-button type="text" icon="el-icon-setting" style="color: white" @click="gotoset()"
            >设置</el-button
          ></el-col
        >
        <el-col :span="12">
          <el-dropdown @command="handleCommand">
            <label>
              <el-avatar icon="el-icon-user-solid" :size="36" :src="circleUrl" style="margin-top: 7px" />
              <span
                style="
                  height: 100%;
                  color: white;
                  position: relative;
                  top: -12px;
                  left: 10px;
                "
              >
                {{ $store.state.userInfo.userName }}
              </span>
            </label>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="mydata">我的资料</el-dropdown-item>
                <el-dropdown-item command="signout">安全退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>

    <el-container style="overflow: auto">
      <!-- 侧边栏导航菜单 -->
      <el-aside width="220px" class="aside">
        <el-menu
          :uniqueOpened="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#26344b"
          text-color="#fff"
          active-text-color="#ffd04b"
          style="text-align: left"
          router
        >
          <!-- 控制台 -->
          <el-menu-item :index="menulist[0].path" :key="menulist[0].menuId">
            <template #title>
              <i :class="menulist[0].icon"></i>{{ menulist[0].menuName }}
            </template>
          </el-menu-item>
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.menuId"
            v-for="item in menulist.slice(1)"
            :key="item.menuId"
          >
            <template #title>
              <i :class="item.icon"></i>{{ item.menuName }}
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="subItem.path"
              v-for="subItem in item.childMenu"
              :key="subItem.menuId"
            >
              {{ subItem.menuName }}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 内容  -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      circleUrl:"src/assets/img/"+this.$store.state.userInfo.userIcon,
      menulist: [],
      msg:{
        isHidden:false,
        mrow:1,
        vrow:10,
      },
      message:[],
    };
  },
  created() {
    this.menulist = this.menulists;
  },
  methods: {
    //获取未读消息通知，
    findmessage(){
      const state = JSON.parse(sessionStorage.getItem("state"));
       var fd={
          userid:this.$store.state.userInfo.userName,
        };
        var _this = this;
       
        this.axios({
          url:"http://localhost:8088/frameproject/msg/get",
          method:"get",
          params: fd,
          processData: false,
          headers:{
            JWTDemo:state.userInfo.token,
          }
          }).then(function(response){
            _this.message=response.data.data.msg;
            console.log(response.data.data.msg)
          }).catch(function(error){
             console.log(error)
          });
    },
    handleCommand(command) {
      //退出
      if (command == "signout") {
          this.$router.push("/Login");
          sessionStorage.clear();
          console.log(command);
      } else if(command == "mydata"){
          this.$router.push('/PersonalCenter') ;
     
      }
    },
    gotoset(){
      this.$router.push('/Menulist')
    },
   gotoset1(){
      this.$router.push('/messageNotification')
    },
             // 消息队列获取
            mqtthuoquMsg() {
                //初始化连接
                const headers = {
                    login: "guest",
                    passcode: "guest"
                };
                //进行连接
                this.client.connect(headers.login, headers.passcode, this.onConnected,  this.onFailed, "/");
            },
            onConnected: function () {
                //订阅频道
                const topic = "/exchange/mail.exchange/mail.routing.key";
		console.log(topic+">>>>>>>>>>>>>>>>>>>>>");
                this.client.subscribe(topic, this.responseCallback, this.onFailed);
            },
            onFailed: function (frame) {
                console.log("MQ Failed: " + frame);
                this.$message.error('连接失败')
            },
            // 回传消息
            responseCallback: function (frame) {
                 console.log("MQ msg=>" + frame.body);
                //接收消息处理
            },
            // 断开相应的连接
            close:function(){
                  this.client.disconnect(function() {
                            console.log("已退出账号");
                  })
            }
  },
 
  computed: { 
    ...mapState(["menulists"]),
   
  },
};
</script>

<style>
.homepage {
  width: 100%;
  height: 100%;
  margin: 0px auto;
}
.el-header,
.el-footer {
  background-color: #444a63;
  color: #333;
  text-align: left;
  line-height: 40px;
}
.homepage .item {
  margin-top: 10px;
  margin-right: 40px;
}
.homepage .el-.el-row {
  margin-top: 7px !important;
}
.el-menu-item.is-active {
  color: white;
}
.el-aside {
  background-color: #1b273a;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.el-header > .el-header-div1 {
  padding-top: 4px;
  padding-left: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}
.el-header > .el-header-div1 > span {
  margin-left: 5px;
  margin-top: -5px;
}
.el-header > img {
  margin-right: 5px;
  vertical-align: -8px;
}
.el-header-div1 {
  float: left;
}
.ul-s{
  list-style-type:none;
}
</style>