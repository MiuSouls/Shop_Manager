<template>
  <div >
     <!-- //面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="'/goods'">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item >添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- //内容 -->
      <el-card>
        <el-alert
          title="添加商品信息"
          type="info"
          show-icon
          :closable="false"
          center>
        </el-alert>
        <!-- //步骤条 -->
        <el-steps :active="StepsActive" finish-status="success" class="maginTop" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- //导航菜单栏 -->
        <el-form  :model="StepsForm" :rules="rules" ref="stepsForm" label-position="top">
          <el-tabs :tab-position="TabPosition" class="maginTop" v-model="TabsActiveName" @tab-click="ChangeTab" :before-leave="BeforeLeave">
            <el-tab-pane label="基本信息">
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="StepsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input v-model="StepsForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input v-model="StepsForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                  <el-input v-model="StepsForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                  <el-cascader
                  v-model="StepsForm.goods_cat"
                  :options="CategoriesData"
                  @change="AddCascaderHandleChange"
                  :props="props"
                  clearable
                  ref="cascader">
                  </el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" @open="NextForm">
              <!-- 循环商品的参数 -->
              <el-form-item v-for="i of ParamsDataMay" :label="i.attr_name">
                <el-checkbox-group v-model="i.attr_vals">
                  <el-checkbox :label="re" v-for="re of i.attr_vals" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性">
              <el-form-item v-for="re of ParamsDataOnly" :label="re.attr_name">
                <el-input v-model="re.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片">
              <el-upload
                class="upload-demo"
                :action="UploadURL"
                :headers="UploadHeaders"
                :on-preview="UploadHandlePreview"
                :on-remove="UploadHandleRemove"
                :on-success="UploadHandleSuccess"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <!-- //展示图片的DiaLog窗口 -->
              <el-dialog title="图片预览" width="60%" :visible.sync="PreviewDialogTableVisible" @close="PreviewDiaLogClose">
               <img :src="PreviewURL" class="PreviewImg">
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="商品内容">
              
              <quill-editor
                ref="myQuillEditor"
                v-model="StepsForm.goods_introduce"/>

              <el-button type="primary" @click="AddGoods" class="maginTop">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>

      </el-card>
  </div>
</template>

<script>
import {GetCategories} from '../../../network/categories'
import {GetCategoriesAttributes} from '../../../network/params'
import {PostGoods} from '../../../network/goods'
import _ from 'lodash'
export default {
  name: "addSteps",
  data(){
    return{
      // 步骤条位置
      StepsActive:0,
      //导航栏方向
      TabPosition: 'left',
      //级联选择器数据
      CategoriesData:[],
      //选择导航栏的序列号
      TabsActiveName:0,
      //表单数据
      StepsForm:{
        goods_name:'',
        goods_price:1,
        goods_weight:1,
        goods_number:1,
        // 商品分类列表 (级联选择器值)
        goods_cat:'',
        // 介绍
        goods_introduce:'',
        // 上传的图片临时路径（对象）多个图片
        pics:[],
        // 商品的参数（数组）
        attrs:[],
      },
      //校验规则
      rules:{
        goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ]
      },
      //级联选择器的参数
      props:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      //分类ID
      EndID:'',
      //商品参数/动态参数
      ParamsDataMay:[],
      //商品属性/静态属性
      ParamsDataOnly:[],
      //上传图片地址
      // UploadURL:"http://timemeetyou.com:8889/api/private/v1/upload",
      UploadURL:"https://www.liulongbin.top:8888/api/private/v1/",
      //上传图片时所需要的请求头，这里是token
      UploadHeaders:{Authorization:sessionStorage.getItem("token")},
      //展示图片所需要的url路径
      PreviewURL:'',
      //判断是否展示图片的DiaLog窗口
      PreviewDialogTableVisible:false,
    }
  },
  methods:{
    //基本信息->商品分类的级联选择器
    AddCascaderHandleChange(value){
      //处理只能选择三级菜单，其他都回清楚选择内容
      if(value.length!==3){
        this.StepsForm.goods_cat=[]
      }else{
        // console.log(value);
        this.EndId=value[2]
        
      }
    },
    //选择导航栏触发事件
    ChangeTab(value){
      // console.log(value);
      //设置步骤条
      this.StepsActive=parseInt(this.TabsActiveName)
    },
    //从"基本信息"进入下一步的校验
    NextForm(){
      console.log("验证");
    },
    //标签页跳转触发钩子函数
    BeforeLeave(ActiveName,oldActiveName){
      if(oldActiveName==0){
        var IsOn=true
        if(this.StepsForm.goods_cat==""){
          IsOn=false
          this.$message.error("商品分类不能为空!")
        }else{
          this.ReGetCategoriesAttributes('many')
          IsOn=true
        }
        //进入2/商品属性
        if(ActiveName==2){
          //获取商品静态属性
          this.ReGetCategoriesAttributes('only')
        }
        return IsOn //正式
      }
      if(ActiveName==2){
          //获取商品静态属性
          this.ReGetCategoriesAttributes('only')
      }
      
    },
    //获取参数
    ReGetCategoriesAttributes(sel){
      GetCategoriesAttributes(this.EndId,sel).then(
        res=>{
          if(sel=='many'){
             // 修改参数样式
            for(var arr of res.data.data){
              if(arr.attr_vals.length!==0){
                arr.attr_vals=arr.attr_vals.split(' ')
              }
            }
            //多选按钮状态的值
            this.ParamsDataMay=res.data.data
            // console.log(this.ParamsDataMay);
          }else{
            // console.log(res);
            this.ParamsDataOnly=res.data.data
          }
        }
      )
    },
    //点击文件列表中已上传的文件时的钩子/处理图片的预览
    UploadHandlePreview(file){
      console.log("点击已上传文件");
      //展示图片所需要的url
      this.PreviewURL=file.response.data.url
      this.PreviewDialogTableVisible=true
    },
    //文件列表移除文件时的钩子/处理图片的移除 :TODO
    UploadHandleRemove(file){
      //移除操作
        console.log(this.StepsForm.pics);
        console.log(file.response.data.tmp_path);
        const num=this.StepsForm.pics.findIndex((index)=>{
          return index.pic===file.response.data.tmp_path
        })
        this.StepsForm.pics.splice(num,1)
        console.log(this.StepsForm);
    },
    //上传图片成功触发事件
    UploadHandleSuccess(response,file,fileList){
      // console.log(response.data.url);
      console.log("上传成功");
      //拼接图片对象
      const picInfo={pic:response.data.tmp_path}
      //添加到数组里
      this.StepsForm.pics.push(picInfo)
      
    },
    //关闭展示图片DiaLog清理展示路径变量的内容
    PreviewDiaLogClose(){
      this.PreviewURL=""
    },
    //添加商品
    AddGoods(){
      //表单预校验
      this.$refs.stepsForm.validate((valid)=>{
        if(!valid){
          this.$message.error("表单数据不能为空！")
        }else{
          //TODO
          //改造一下goods_cat的数据格式，接口需要','分隔
          //深拷贝出来的表单
          var formData=_.clone(this.StepsForm)
          formData.goods_cat=formData.goods_cat.join(',')
          
          //遍历动态添加attrs
          this.ParamsDataMay.forEach((value)=>{
            if(!value.attr_vals==""){
              formData.attrs.push({
              attr_id:value.attr_id,
              attr_value:value.attr_vals})
            }
            
          })
          //遍历静态添加attrs
          this.ParamsDataOnly.forEach((value)=>{
            if(!value.attr_vals==""){
              formData.attrs.push({
              attr_id:value.attr_id,
              attr_value:value.attr_vals})
            }
          })
          // console.log(formData);
          //发送网络请求添加商品
          PostGoods(formData).then(res=>{
            if(res.data.meta.status==201){
              this.$router.push("/goods")
            }else{
              this.$message.error("商品添加失败!")
            }
          })

        }
      })
    },
  },
  created(){
    GetCategories().then(res=>{
      this.CategoriesData=res.data.data
      // console.log(this.CategoriesData);
    })
  }
}

</script>

<style lang="less" scoped>
  .el-steps{
    width: 98%;
    position:relative;
    left: 50%;
    transform: translate(-50%);
  }
  .maginTop{
    margin-top: 20px;
  }
  .el-checkbox{
    margin: 2px 10px 0 0 !important;
  }
  .PreviewImg{
    width: 100%;
    height: 100%;
  }
</style>
