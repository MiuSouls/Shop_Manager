<template>
  <div >
    <!-- //面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //内容 -->
    <el-card>
      <!-- //提示 -->
       <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false">
      </el-alert>
      <!-- //选择框 -->
      <el-row class="Cascader">
        <span>选择商品分类:</span>
        <el-cascader
          v-model="CascaderValue"
          :options="CategoriesArray"
          :props="props"
          @change="CascaderHandleChange">
        </el-cascader>
      </el-row>
      <!-- //Tabs和表单内容 -->
      <el-row class="Tabs">
        <el-tabs v-model="activeName"  @tab-click="TabsHandleClick">
          <el-tab-pane label="动态参数" name="many">
            <!-- //添加参数按钮 -->
            <el-button size="mini"type="primary" class="addParams" :disabled="!IsButton" @click="AddDiaLog('动态参数')">添加参数</el-button>
            <el-table border :data="ManyArray" >
              <el-table-column type="expand">
                <!-- TODO:参数详情 -->
              </el-table-column>
              <el-table-column label="#" width="70px" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <el-button type="primary" size="mini">
                  <i class="el-icon-edit"></i>
                  编辑
                </el-button>
                <el-button type="danger" size="mini">
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
             <!-- //添加参数按钮 -->
             <el-button size="mini" type="primary" class="addParams" :disabled="!IsButton" @click="AddDiaLog('静态属性')">添加属性</el-button>
             <el-table border :data="OnlyArray">
              <el-table-column type="expand"></el-table-column>
              <el-table-column label="#" width="70px" type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                <el-button type="primary" size="mini">
                  <i class="el-icon-edit"></i>
                  编辑
                </el-button>
                <el-button type="danger" size="mini">
                  <i class="el-icon-delete"></i>
                  删除
                </el-button>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-row>
      <!-- //添加的DiaLog -->
      <el-dialog
        :title="'添加'+DiaLogName"
        :visible.sync="AddDialogVisible"
        width="50%"
        @close="CloseDiaLog">
        <el-form :model="ParamsFrom" :rules="rules" ref="paramsFrom">
          <el-form-item :label="DiaLogName" prop="params">
            <el-input v-model="ParamsFrom.params"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="CommitParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {GetCategories} from '../../network/goods'
import {GetCategoriesAttributes,PostCategoriesAttributes} from '../../network/params'
export default {
  name: "params",
  data(){
    return{
      //商品分类
      CategoriesArray:[],
      //级联选择器最终选择的内容
      CascaderValue:'',
      props:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      //默认选择项名字
      activeName: 'many',
      //记录Tabs选择的内容Re
      ReactiveName:'many',
      //动态参数存放数组
      ManyArray:[],
      //静态参数存放数组
      OnlyArray:[],
      IsButton:false,
      AddDialogVisible:false,
      // 标题名字
      DiaLogName:'',
      //表单内容
      ParamsFrom:{
        params:''
      },
      //表单验证
      rules:{
         params: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
      //分类ID
      endID:''
    }
  },
  methods:{
     //提示信息
     loginSuccess(Meg) {
      this.$message({
        message: Meg,
        type: "success",
      });
    },
    //获取静态属性表单数据
    ReGetCategoriesAttributes(endID,sel){
      GetCategoriesAttributes(endID,sel).then(res=>{
        if(sel=="many"){
          this.ManyArray=res.data.data
        }else if(sel=="only"){
          this.OnlyArray=res.data.data
        }
      })
    },
    //级联选择器选择完触发事件
    CascaderHandleChange(value){
      if(value.length==3){
         //三级菜单的id
        this.endID=value[value.length-1]
        //获取动态参数表单数据
        this.ReGetCategoriesAttributes(this.endID,"many")
        //获取静态属性表单数据
        this.ReGetCategoriesAttributes(this.endID,"only")
        this.IsButton=true
      }else{
        this.loginSuccess("选择的不是三级分类")
        this.IsButton=false
      }
     
    },
    // tabs选择之后出发事件
    TabsHandleClick(tab){
      console.log(tab.name);
      this.ReactiveName=tab.name
    },
    //添加按钮
    AddDiaLog(name){
      // 标题名字
      this.DiaLogName=name
      this.AddDialogVisible=true
    },
    //关闭DiaLog
    CloseDiaLog(){
      this.$refs.paramsFrom.resetFields()
    },
    //提交添加的参数
    CommitParams(){
      this.$refs.paramsFrom.validate((valid,obj)=>{
        if(valid){
          PostCategoriesAttributes(this.endID,this.ParamsFrom.params,this.ReactiveName).then(res=>{
            if(res.data.meta!=201){
              this.AddDialogVisible=false
              this.ReGetCategoriesAttributes(this.endID,this.ReactiveName)
            }else{
              
            }
            
          })
        }else{
          console.log(obj);
        }
      })
    }
  },
  created(){
    //获取商品分类
    GetCategories().then(res=>{
      this.CategoriesArray=res.data.data
      // console.log(this.CategoriesArray);
    })
  }
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 10px;
}
.el-card{
  margin-top: 20px;
}
.el-tag{
  width: 100%;
  color: #E6A23C;
}
.Cascader{
  margin-top: 20px;
}
.el-cascader{
  margin-left: 10px;
  width: 260px;
}
.Tabs{
  margin-top: 10px;
}
</style>
