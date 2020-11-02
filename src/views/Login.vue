<template>
  <div class="Login">
    <div class="login_box">
      <!-- 头像 -->
      <div class="login_avatar">
        <img src="../assets/imge/logo.png" />
      </div>
      <!-- 表单 -->
      <div>
        <el-form class="login_form" :model="loginform" :rules="rules" ref="login">
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user-solid"
              v-model="loginform.username"
              placeholder="用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-key"
              v-model="loginform.password"
              show-password
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <div class="button">
            <el-button type="primary" @click="commitForm">提交</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from '../network/request.js'
import {loginAxios} from '../network/login.js'
import axios from 'axios'
export default {
  name: "Login",
  data() {
    return {
      loginform: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          { min: 5, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  methods:{
    resetForm(){
      this.$refs.login.resetFields()
    },
    commitForm(){
      this.$refs.login.validate(result=>{   //表单验证，返回一个函数
        if(result){  //表单验证通过时
         loginAxios(this.loginform.username,this.loginform.password).then(res=>{
           console.log(res.data)
            const status =res.data.meta.status
            const token =res.data.data.token
            if(status==200){
              this.loginSuccess("登录成功!")
              sessionStorage.setItem("token",token)
              this.$router.push("/Home")
            }else{
              this.loginErr("帐号/密码错误")
            }
          })
        }else{ //表单验证不通过
          console.log("信息不全！")
          this.loginErr("信息不完整，请填写完信息在进行提交！")
        }
        })
    },
    loginSuccess(Meg) {
        this.$message({
          message: Meg,
          type: 'success'
        });
    },
    loginErr(Meg) {
        this.$message.error(Meg);
    },
  }
};
</script>

<style lang="less"  scoped>
.Login {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.login_avatar {
  background-color: rgb(255, 255, 255);
  border-radius: 50%;
  width: 130px;
  height: 130px;
  border: solid 1.5px rgb(226, 228, 230);
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: rgb(221, 219, 217);
  }
}
.login_form {
  position: absolute;
  left: 30px;
  right: 30px;
  bottom: 10px;
  text-align: right;
}
</style>
