<template>
  <!-- <div class="home"> -->
    <el-container class="container">
      <!-- //top -->
      <el-header>
        <div class="Logo">
          <span>管理系统</span>
        </div>
        <a class="exit" href="" @click="ExitBtn">退出登录</a>
      </el-header>
      <!-- //left -->
      <el-container class="middle">
        <el-aside :width="Iscollapse ? '64px':'200px'">
          <div @click="ToggleCollapse">|||</div>
          <!-- Menu -->
          <el-menu
          ref="elmenu"
            background-color="#283339"
            text-color="#fff"
            active-text-color="#19b294"
            :unique-opened="true"
            :collapse="Iscollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="defaultactive"
            >
            <el-submenu :index="keym+''" v-for="(m,keym) of MenuName">
              <template slot="title">
                <i :class="IconArray[keym]"></i>
                <span>{{m.authName}}</span>
              </template>
              <el-menu-item :index="'/'+i.path" v-for="(i,keyi) of m.children" @click="SessionPath(i.path)">{{i.authName}}</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- //中间 -->
        <el-main>
          
          <router-view/>

        </el-main>
      </el-container>
    </el-container>
  <!-- </div> -->
</template>

<script>
import { GetMenus } from "../network/home";
export default {
  name: "Home",
  data() {
    return {
      MenuName: [],
      IconArray:[
        "el-icon-user-solid",
        "el-icon-unlock",
        "el-icon-goods",
        "el-icon-shopping-cart-full",
        "el-icon-s-data"
      ],
      Iscollapse:false,
      defaultactive:"",

    };
  },
  methods: {
    // 退出登录
    ExitBtn() {
      sessionStorage.setItem("token", "");
      this.$router.push("/Login");
    },
    // 菜单缩小
    ToggleCollapse(){
      this.Iscollapse=!this.Iscollapse
      console.log(this.Iscollapse)
    },
    //获取存储的路径，使其高亮
    SessionPath(path){
      sessionStorage.setItem('path','/'+path)
    },
    GetMenus(){
      // 获取左侧菜单数据的方法
      GetMenus().then((res) => {
        // console.log(res)
        this.MenuName=res.data.data
        // console.log(this.MenuName);
        this.defaultactive=sessionStorage.getItem("path")
      })
    },
    

  },
  created() {
    //获取左侧菜单数据
    this.GetMenus()

  },
};
</script>

<style lang="less" scoped>
.container{
  height: 100%;
}
.el-header {
  background-color: #19b294;
  display: flex;
  width: 100%;
  // justify-content: space-between;
  .Logo {
    flex: 17;
    font-size: 35px;
  }
  .exit {
    transform: translate(0, 30%);
    flex: 1;
  }
}

.el-aside {
  background-color: #283339;
  div{
    text-align: center;
    color: #ffffff;
  }
}
.middle {
  height: 100%;
}
.el-menu{
  border-right: none;
  
}
</style>