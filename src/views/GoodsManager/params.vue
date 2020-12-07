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
                <template slot-scope="scope">
                  <el-tag v-for="(tData,i) of scope.row.attr_vals" closable @close="CloseTag(i,scope.row)">{{tData}}</el-tag>
                    <!-- //动态添加tag -->
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="#" width="70px" type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="EditParams(scope.row)">
                    <i class="el-icon-edit"></i>
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" @click="DeleteParams(scope.row)">
                    <i class="el-icon-delete"></i>
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
             <!-- //添加参数按钮 -->
             <el-button size="mini" type="primary" class="addParams" :disabled="!IsButton" @click="AddDiaLog('静态属性')">添加属性</el-button>
             <el-table border :data="OnlyArray">
              <el-table-column type="expand">
                 <template slot-scope="scope">
                  <el-tag v-for="(tData,i) of scope.row.attr_vals" closable @close="CloseTag(i,scope.row)">{{tData}}</el-tag>
                  <!-- //动态添加tag -->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column label="#" width="70px" type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                 <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="EditParams(scope.row)">
                    <i class="el-icon-edit"></i>
                    编辑
                  </el-button>
                  <el-button type="danger" size="mini" @click="DeleteParams(scope.row)">
                    <i class="el-icon-delete"></i>
                    删除
                  </el-button>
                </template>
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
          <el-form-item :label="DiaLogName" prop="params" label-width="100px">
            <el-input v-model="ParamsFrom.params"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="CommitParams">确 定</el-button>
        </span>
      </el-dialog>
      <!-- //编辑DiaLog -->
      <el-dialog
        :title="'编辑'+DiaLogName"
        :visible.sync="EditParamsdialogVisible"
        width="50%"
        @close="CloseEditDiaLog">
        <el-form :model="EditParamsForm" :rules="rules" ref="editparamsFrom">
          <el-form-item :label="DiaLogName" prop="attr_name" label-width="100px">
            <el-input v-model="EditParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="EditParamsdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="CommitEditParams">确 定</el-button>
        </span>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import {GetCategories} from '../../network/goods'
import {GetCategoriesAttributes,PostCategoriesAttributes,PutCategories,DeleteCategories} from '../../network/params'
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
      DiaLogName:'动态参数',
      //表单内容
      ParamsFrom:{
        params:''
      },
      //表单验证
      rules:{
         params: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
          attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
          ],
      },
      //分类ID
      endID:'',
      EditParamsdialogVisible:false,
      EditParamsForm:{
        id:'',
        attrId:'',
        attr_name:'',
        attr_sel:''
      },
      inputVisible:false,
      inputValue:'',
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
    //获取动态或者静态表单数据
    ReGetCategoriesAttributes(endID,sel){
      GetCategoriesAttributes(endID,sel).then(res=>{
        
        //循环得到表格每列的参数详情
        // console.log(res.data.data);
        res.data.data.forEach((value)=>{
          //添加2个参数，这样每个组件就可以单独拥有自己的2个参数
          value.inputVisible=false
          value.inputValue=""
          if(value.attr_vals==''){
            value.attr_vals=[]
          }
          else{
            //把获取的数据修改格式然后在赋值，得到的数据就是想要的格式
            value.attr_vals=value.attr_vals.split(' ')
          }
        })
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
        this.OnlyArray=[]
        this.ManyArray=[]
      }
     
    },
    // tabs选择之后出发事件
    TabsHandleClick(tab){
      // 更改弹窗标题名字
      this.DiaLogName=tab.label
      this.ReactiveName=tab.name
    },
    //添加按钮
    AddDiaLog(){
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
              console.log("提交失败!");
            }
          })
        }else{
          console.log(obj);
        }
      })
    },
    //编辑参数
    EditParams(row){
      console.log(row);
      this.EditParamsForm.id=row.attr_id
      this.EditParamsForm.attrId=this.endID
      this.EditParamsForm.attr_name=row.attr_name
      this.EditParamsForm.attr_sel=row.attr_sel
      this.EditParamsdialogVisible=true

    },
    //提交编辑参数
    CommitEditParams(){
      this.$refs.editparamsFrom.validate((valid,obj)=>{
        if(valid){
          console.log("成功!");
          //发送网络请求
          // console.log( this.EditParamsForm.id);
          // console.log( this.EditParamsForm.attrId);
          // console.log( this.EditParamsForm.attr_name);
          // console.log( this.EditParamsForm.attr_sel);

          const id=this.EditParamsForm.id
          const attrId=this.EditParamsForm.attrId
          const attr_name=this.EditParamsForm.attr_name
          const attr_sel=this.EditParamsForm.attr_sel

          PutCategories(id,attrId,attr_name,attr_sel).then(res=>{
            if(res.data.meta.status==200){
              this.ReGetCategoriesAttributes(attrId,attr_sel)
              this.EditParamsdialogVisible=false
              console.log(res);
            }else{
              console.log("失败!");
            }
          })
          
        }else{
          console.log(obj);
        }
      })
    },
    //退出编辑DiaLog事件
    CloseEditDiaLog(){
      this.$refs.editparamsFrom.resetFields()
    },
    //删除参数
    DeleteParams(row){
      console.log(row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除参数的网络请求
          DeleteCategories(row.cat_id,row.attr_id).then(res=>{
            console.log(res);
            if(res.data.meta.status==200){
              this.ReGetCategoriesAttributes(row.cat_id,row.attr_sel)
            }else{
              console.log("删除失败!");
            }
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //保存参数
    SaveCategories(row,vals){
      return PutCategories(row.cat_id,row.attr_id,row.attr_name,row.attr_sel,vals)
    },
    //关闭Tag触发事件
    CloseTag(i,row){
      row.attr_vals.splice(i,1)
      const vals=row.attr_vals.join(" ")
      this.SaveCategories(row,vals).then(res=>{
        if(res.data.meta.status!=200){
            this.loginSuccess("添加失败!")
            console.log(res);
          }else{
            this.loginSuccess("添加成功!")
          }
      })
    },
     // 点击按钮显示文本输入
    showInput(row){
      row.inputVisible=true
      // console.log(row);
      // 寄货文本框之后自动获得焦点
      // $nextTick 方法的作用:就是当页面上的元素被重新渲染之后，才会回调这个函数中的代码
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //文本框失去焦点或者按下Enter都触发事件
    handleInputConfirm(row) {
      if(row.inputValue.trim().length==0){
        row.inputValue=''
        row.inputVisible=false
        return
      }else{
        //有用数据处理
        row.attr_vals.push(row.inputValue.trim())
        // 发起网络请求添加参数详情
        const vals=row.attr_vals.join(" ")
        this.SaveCategories(row,vals).then(res=>{
          if(res.data.meta.status!=200){
            this.loginSuccess("添加失败!")
            console.log(res);
          }else{
            this.loginSuccess("添加成功!")
          }
        })
        //清空文本框数据
        row.inputValue=''
        row.inputVisible=false
      }
    },
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
  // width: 100%;
  // color: #E6A23C;
  margin-right: 20px;
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
.input-new-tag{
  width: 12%;
}
</style>
