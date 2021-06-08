<template>
<div class="bg">
    <img src="../assets/img/404.png">
    <h2>抱歉，您访问的页面出错了</h2>
    <p>您可能输错了网址，或该网页已删除或不存在</p>
    <a @click="go()">返回登陆</a>
</div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods:{
        go(){
            this.$router.push('/Login')
        }
    }
}
</script>

<style>
.bg{
    padding-right: 15px;
    padding-left: 15px;
    margin-right: 30%;
    margin-left: 30%;
    padding-top: 150px;
}
</style>