<template>
  <router-view></router-view>
</template>

<script>
import { initDynamicRoutes } from './router/index.js'
import HomePageView from './components/HomePage.vue'
export default {
  name: 'App',
  components: {
    HomePageView,
  },
  created: function () {
    //全局监听，页面刷新的时候将store里state的值存到sessionStorage中，
    //然后从sessionStorage中获取，再赋值给store。然后再把session里面
    //存的删除即可，相当于中间件的作用。在页面加载时读取sessionStorage
    //里的状态信息
    console.group('in main.js created............................begin')
    // console.log(sessionStorage.getItem("state"));
    if (sessionStorage.getItem('state')) {
      //替换 store 的根状态，状态合并
      //Object.assign方法用于对象的合并，将源对象（source）的所有可枚举属性
      //，复制到目标对象（target）。Object.assign(target, source1, source2);
      this.$store.replaceState(
        Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem('state'))
        )
      )
    }
    if (sessionStorage.getItem('djs') <= 0) {
      //等于0时清空
      sessionStorage.removeItem('djs')
    }
    console.log('in main.js created............................end')
    console.groupEnd()
  },
  mounted: function () {
    window.addEventListener('beforeunload', () => {
      //刷新前将目前登录的用户保存到sessionStorage中
      sessionStorage.setItem('state', JSON.stringify(this.$store.state))
      sessionStorage.setItem(
        'menulists',
        JSON.stringify(this.$store.state.menulists)
      )
    })
  },
}
</script>
<style>
/* 滚动条 */
::-webkit-scrollbar {
  width: 0;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #f6f6f6;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 30px;
}
::-webkit-scrollbar-thumb:hover {
  background: #747474;
}
::-webkit-scrollbar-corner {
  background: #f6f6f6;
}
.el-table th.gutter {
  display: table-cell !important;
}
/* 清除input属性 */
.el-input__suffix,
.el-input__suffix-inner {
  margin-right: unset !important;
}
/* 提示框样式 */
.el-carousel__arrow--right,
.el-notification.right {
  top: 110px !important;
  background-color: #f2dede;
  border-color: #ebccd1;
}
</style>