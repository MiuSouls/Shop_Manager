<template>
  <div >
    <p>主页</p>
    <el-button @click="ExitBtn">退出登录</el-button>
  </div>
</template>

<script>
export default {
  name: "Home",
  methods:{
    ExitBtn(){
        sessionStorage.setItem("token","")
        this.$router.push("/Login")
    }
  }
}
</script>

<style lang="less" scoped>

</style>
