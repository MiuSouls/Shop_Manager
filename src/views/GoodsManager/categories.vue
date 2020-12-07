<template>
  <div >
    <!-- //面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- //内容主体 -->
      <el-card>
        <el-button type="primary" @click="AddCategoriesDiaLog">添加分类</el-button>
        <!-- //添加DiaLog -->
        <el-dialog
          title="添加分类"
          :visible.sync="AddCategoriesDialogVisible"
          width="50%"
          @close="CloseCategoriesDialog"
          >
          <el-form :model="AddCategoriesFrom" :rules="rules" ref="categoriesForm">
            <el-form-item label="分类名称" label-width="80px" prop="cat_name">
              <el-input v-model="AddCategoriesFrom.cat_name"></el-input>
            </el-form-item>
             <el-form-item label="父级分类" label-width="80px">
              <!-- props指定级联选择器父子关系 -->
              <!-- v-model表示选择完之后将选择内容和这里的值双向绑定 -->
              <el-cascader
                v-model="CascaderValue"
                :options="CategoriesArray"
                :props="props"
                clearable
                ref="cascader"
                @change="HandleChange">
              </el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="AddCategoriesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddCategories">确 定</el-button>
          </span>
        </el-dialog>
        <!-- //表格 -->
        <tree-table 
        :data="goodsSort" 
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        :border="true"

        index-text="#"
        class="tree-table"
        >
          <!-- //是否有效 -->
          <template slot="IsOk" slot-scope="scope">
            <i class="el-icon-success iconTypeGreen" v-show="scope.row.cat_deleted"></i>
            <i class="el-icon-error iconTypeRed" v-show="!scope.row.cat_deleted"></i>
          </template>
          <!-- //排序 -->
          <template slot="Sort" slot-scope="scope">
            <el-tag v-show="scope.row.cat_level==0">一级</el-tag>
            <el-tag type="success" v-show="scope.row.cat_level==1">二级</el-tag>
            <el-tag type="danger" v-show="scope.row.cat_level==2">三级</el-tag>
          </template>
          <!-- //操作 -->
           <template slot="Operation" slot-scope="scope">
            <el-button  type="primary" size="mini" @click="EditCategories(scope.row)">
              <i class="el-icon-edit"></i>
              编辑</el-button>
            <!-- //编辑DiaLog -->
            <el-dialog
              title="编辑分类"
              :visible.sync="EditCategoriesDialogVisible"
              width="50%"
              :modal-append-to-body='false'
              @close="EditDiaLogCLose">
              <el-form :model="EditCategoriesFrom" :rules="rules" ref="EditForm">
                <el-form-item label="分类名称" label-width="85px" prop="cat_name">
                  <el-input v-model="EditCategoriesFrom.cat_name"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="EditCategoriesDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="CommitCategories()">确 定</el-button>
              </span>
            </el-dialog>
            <el-button  type="danger" size="mini" @click="DeleteCategories(scope.row.cat_id)">
              <i class="el-icon-delete"></i>
              删除</el-button>
           </template>
        </tree-table>
        <!-- //分页 -->
        <el-pagination
          @size-change="HandleSizeChange"
          @current-change="HandleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="GoodsSortTotal">
        </el-pagination>
      </el-card>
  </div>
</template>

<script>
import {GetCategories,PostCategories,PutCategories,DeleteCategories} from '../../network/goods'
export default {
  name: "categories",
  data(){
    return{
      //分类的级别
      type:3,
      //商品分类列表
      goodsSort:[],
      // 当前页码
      pagenum:1,
      //每页多少条
      pagesize:5,
      //列表总数
      GoodsSortTotal:2,
      //表格行的属性配置
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:"template",
          template:"IsOk"
        },
        {
          label:'排序',
          type:"template",
          template:"Sort"
        },
        {
          label:'操作',
          type:"template",
          template:"Operation"
        },
      ],
      AddCategoriesDialogVisible:false,
      AddCategoriesFrom:{
        cat_pid:0,
        cat_name:'',
        cat_level:0
      },
      //商品所有列表信息
      CategoriesArray:[],
      CascaderValue:[],
      //级联选择器父子关系配置
      props:{
        value:"cat_id",
        label:'cat_name',
        children:'children',
        checkStrictly:'true'
      },
      rules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      //编辑DoaLog
      EditCategoriesDialogVisible:false,
      //分类名称
      EditCategoriesFrom:{
        CategoriesId:'',
        cat_name:''
      },
      
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
    //获取商品分类列表方法
    ReGetCategories(){
      GetCategories(this.type,this.pagenum,this.pagesize).then(res=>{
      // console.log(res);
      this.goodsSort=res.data.data.result
      // console.log(this.goodsSort);
      this.GoodsSortTotal=res.data.data.total
      })
    },
    //分页对应方法
    HandleSizeChange(value){
      // console.log("改变页码:"+value);
      this.pagesize=value
      this.ReGetCategories()
      
    },
    HandleCurrentChange(value){
      // console.log("当前页码:"+value);
      this.pagenum=value
      this.ReGetCategories()
    },
    //添加分类
    AddCategoriesDiaLog(){
      // console.log("AddCategories");
      //打开弹窗
      this.AddCategoriesDialogVisible=true
      //获取所有分类
      GetCategories(2).then(res=>{
        this.CategoriesArray=res.data.data
        // console.log(this.CategoriesArray);
      })
    },
    //选择完级联选择器内容之后触发事件
    HandleChange(){
      // console.log(this.CascaderValue);
      // 分类层级别
      this.AddCategoriesFrom.cat_level=this.CascaderValue.length
      //给分类父 ID赋值，直接取数组长度减1的那个
      this.AddCategoriesFrom.cat_pid=this.CascaderValue[this.CascaderValue.length-1]
    },
    //添加分类数据提交
    AddCategories(){
      // console.log("父类ID:"+this.AddCategoriesFrom.cat_pid);
      // console.log("分类名称:"+this.AddCategoriesFrom.cat_name);
      // console.log("分类层级别:"+this.AddCategoriesFrom.cat_level);
      const pid = this.AddCategoriesFrom.cat_pid
      const name = this.AddCategoriesFrom.cat_name
      const level = this.AddCategoriesFrom.cat_level
      //发起添加分类的网络请求
      PostCategories(pid,name,level).then(res=>{
        // console.log(res);
        if(res.data.meta.status!==201){
          this.loginSuccess("创建分类失败!")
        }else{
          this.loginSuccess("创建分类成功!")
          this.AddCategoriesDialogVisible=false
          this.ReGetCategories()
        }
      })
    },
    //关闭添加分类的DiaLog 清空表单数据，清空级联选择器内容 清空父类id和分层级别
    CloseCategoriesDialog(){
      this.$refs.categoriesForm.resetFields()
      this.CascaderValue=[]
      this.AddCategoriesFrom.cat_pid=0
      this.AddCategoriesFrom.cat_level=0
    },
    //编辑分类
    EditCategories(id){
      // console.log(id);
      this.EditCategoriesFrom.CategoriesId=id.cat_id
      this.EditCategoriesFrom.cat_name=id.cat_name
      this.EditCategoriesDialogVisible=true
    },
    //编辑校验确认
    CommitCategories(id){
      this.$refs.EditForm.validate((valid,obj)=>{
        if(valid){
          //发起网络请求
          PutCategories(this.EditCategoriesFrom.CategoriesId,this.EditCategoriesFrom.cat_name).then(res=>{
            if(res.data.meta.status!=200){
              console.log("重命名失败!");
            }else{
              this.ReGetCategories()
              this.EditCategoriesDialogVisible=false
            }
          })
        }else{
          console.log(obj);
        }
      })
    },
    //编辑DiaLog的关闭事件
    EditDiaLogCLose(){
      this.$refs.EditForm.resetFields()
    },
    //删除分类
    DeleteCategories(id){
       this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //发起网络请求
          DeleteCategories(id).then(res=>{
            // console.log(res);
            if(res.data.meta.status!=200){
              console.log("删除失败!");
            }else{
              this.ReGetCategories()
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
  },
  created(){
    //获取商品分类列表
    this.ReGetCategories()
    
  }
}
</script>

<style lang="less" scoped>
.tree-table,.el-pagination{
  margin-top: 15px;
}
.iconTypeGreen{
  color:green;
}
.iconTypeRed{
  color: red;
}
.el-cascader{
  width: 100%;
}
.el-button--mini{
  margin-left: 10px;
}
</style>
