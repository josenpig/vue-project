<template>
	<div>
	    <el-radio-group>
			<router-link to=""><el-radio-button label="操作日志"></el-radio-button></router-link>  
			<router-link to=""><el-radio-button label="登录日志"></el-radio-button></router-link>
	    </el-radio-group>
	  </div>
	  <el-main>
	  	<router-view></router-view>
	  </el-main>
</template>

<script>
	  export default {
	    data () {
	      return {
	  
	      };
	    }
	  }
</script>

<style>
</style>
