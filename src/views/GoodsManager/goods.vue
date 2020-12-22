<template>
  <div >
      <!-- //面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- //显示商品列表页 -->
      <el-card>
       <el-input placeholder="请输入内容" v-model="inputData">
          <el-button slot="append" icon="el-icon-search" @click="ReSerch"></el-button>
        </el-input>
        <el-button type="primary" class="addBtn" @click="AddGoods">添加商品</el-button>
        <!-- 表格 -->
        <el-table border class="maginTop" :data="goodsArr">
          <el-table-column label="#" width="35px" type="index"></el-table-column>
          <el-table-column label="商品名称" width="450px" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格(元)" prop="goods_price"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
          <el-table-column label="创建时间" width="170px">
            <template slot-scope="scope">
                {{scope.row.upd_time|dataFormat}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="EditGoods">
              <i class="el-icon-edit"></i>
              </el-button>
              <el-button type="danger" size="mini" @click="DeleteGoods(scope.row)">
                <i class="el-icon-delete"></i>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- //分类 -->
        <el-pagination
          @size-change="AddGoodsHandleSizeChange"
          @current-change="AddGoodsHandleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[1,2,5,10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="addTotal"
          class="maginTop">
        </el-pagination>
      </el-card>
  </div>
</template>

<script>
import router from 'vue-router'
import {GetGoods,DeleteGoods} from '../../network/goods'
export default {
  name: "goods",
  data(){
    return{
      //添加商品面包屑显示
      IsBreadcrumb:false,
      //输入栏
      inputData:'',
      // 当前页码
      pagenum:1,
      //列表总数
      addTotal:0,
      //每页多少条
      pagesize:5,
      //商品列表数据
      goodsArr:[],
      
    }
  },
  methods:{
    //获取商品列表
    ReGetoods(){
      GetGoods(this.inputData,this.pagenum,this.pagesize).then(res=>{
        this.goodsArr=res.data.data.goods
        this.addTotal=res.data.data.total
        this.pagenum=parseInt(res.data.data.pagenum)
        // console.log(res);
        // console.log(this.goodsArr);
      })
    },
    //搜索
    ReSerch(){
      this.ReGetoods()
    },
    AddGoodsHandleSizeChange(value){
      this.pagesize=value
      console.log(this.pagesize);
      this.ReGetoods()
    },
    AddGoodsHandleCurrentChange(value){
      this.pagenum=value
      this.ReGetoods()
    },
    //添加商品
    AddGoods(){
      this.$router.push("/addSteps")
    },
    //删除商品
    DeleteGoods(row){
      console.log(row);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //网络请求删除商品
        DeleteGoods(row.goods_id).then(res=>{
          if(res.data.meta.status!=200){
            console.log("失败");
          }else{
            this.ReGetoods()
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
    //编辑商品
    EditGoods(){
      console.log("编辑商品!");
    }

  },
  created(){
    //加载商品列表数据
    this.ReGetoods()
  },
}
</script>

<style lang="less" scoped>
  .el-input{
    width: 30%;
  }
  .addBtn{
    margin-left: 20px;
  }
  .maginTop{
    margin-top: 20px;
  }
</style>
