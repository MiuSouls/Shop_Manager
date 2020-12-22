<template>
  <div >
    <!-- //面包屑 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item> 
      </el-breadcrumb>
    <!-- //主内容 -->
    <el-card>
      <!-- //搜索输入框 -->
      <el-input placeholder="请输入内容" v-model="Orderinput" class="input-with-select">
        <el-option label="餐厅名" value="1"></el-option>
        <el-option label="订单号" value="2"></el-option>
        <el-option label="用户电话" value="3"></el-option>
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- //表单内容 -->
      <el-table class="top-margin" border :data="OrderForm">
        <el-table-column label="#" type="index" width="40px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="300px"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" width="80px">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.pay_status==1" :disable-transitions="true">已付款</el-tag>
            <el-tag type="danger" v-show="scope.row.pay_status==0" :disable-transitions="true">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.update_time|dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
         <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="EditOrder(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
            <el-button type="success" size="mini" @click="SeeProgress">
              <i class="el-icon-location-outline"></i>
            </el-button>
         </template>
        </el-table-column>
      </el-table>
      <!-- //分页 -->
       <el-pagination
        @size-change="OrderHandleSizeChange"
        @current-change="OrderHandleCurrentChange"
        :current-page="InPrams.CurrentPage"
        :page-sizes="[1,3,5,10]"
        :page-size="InPrams.PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Total"
        class="top-margin">
      </el-pagination>
    </el-card>
    <!-- //修改地址的DiaLog -->
    <el-dialog
      title="修改地址" 
      :visible.sync="EditDialogVisible"
      width="50%"
      @close="CloseEditDiaLog">
      <el-form :model="EditAddressFrom" label-width="90px" ref="orderEditForm" :rules="rules">
          <el-form-item label="省市区/县" prop="MaxAddress">
              <el-cascader
                v-model="EditAddressFrom.MaxAddress"
                :options="cityData"
                @change="CascaderAddressHandleChange"
                :props="AddressProps">
              </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="MinAddress">
            <el-input v-model="EditAddressFrom.MinAddress"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="CommitOrder">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //物流进度的DiaLog -->
     <el-dialog
      title="物流进度"
      :visible.sync="SeeAddressDialogVisible"
      width="50%">
      <!-- //时间轴 -->
      <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(activity, index) in activitie"
        :key="index"
        :timestamp="activity.time">
        {{activity.context}}
      </el-timeline-item>
    </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import {GetOrders,PutOrders,GetKuaidi} from '../../network/order'
import cityData from './cityData'
export default {
  name: "orders",
  data(){
    return{
      //输入框内容
      Orderinput:'',
      //总共页码
      Total:10,
      //获取列表所需参数的表单
      InPrams:{
        //查询参数
        query:'',
        //当前页码
        CurrentPage:3,
        //每页显示
        PageSize:5,
        user_id:'',
        pay_status:'',
        is_send:'',
        order_fapiao_title:'',
        order_fapiao_company:'',
        order_fapiao_content:'',
        consignee_addr:''
      },
      //列表数据
      OrderForm:[],
      //控制修改地址DiaLog界面
      EditDialogVisible:false,
      //修改表单数据
      EditAddressFrom:{
        MaxAddress:[],
        MinAddress:''
      },
      //查看物流地址
      SeeAddressDialogVisible:false,
      //订单ID
      OrderId:'',
      //表单校验
      rules:{
        MaxAddress: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        MinAddress: [
        { required: true, message: '请输详细地址', trigger: 'blur' },
        { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
      },
      //地址级联选择器的数据
      cityData,
      //址级联选择器的配置
      AddressProps:{
        label:'label',
        value:'value'
      },
      //时间轴
      reverse: true,
      // 进度数据
      activitie:[]
      
    }
  },
  methods:{
    //获取订单数据
    ReGetOrders(){
      GetOrders(this.InPrams).then(res=>{
        this.OrderForm=res.data.data.goods
        this.Total=res.data.data.total
        // console.log(this.OrderForm);
      })
    },
    //更改每页显示总数
    OrderHandleSizeChange(value){
      this.InPrams.PageSize=value
      this.ReGetOrders()
    },
    //更改当前页码
    OrderHandleCurrentChange(value){
      this.InPrams.CurrentPage=value
      this.ReGetOrders()
    },
    //地址级联选择器事件
    CascaderAddressHandleChange(){
      console.log(this.EditAddressFrom.MaxAddress);
    },
    //修改地址DiaLog
    EditOrder(row){
      this.EditDialogVisible=true
    },
    //提交修改
    CommitOrder(){
      //发起网络亲求提交修改数据
      console.log(this.OrderId);
      PutOrders(this.OrderId).then(res=>{
        console.log(res);
      })
      this.EditDialogVisible=false
    },
    //关闭修改地址的DiaLog
    CloseEditDiaLog(){
      this.$refs.orderEditForm.resetFields()
    },
    //物流进度
    SeeProgress(){
      console.log("查看进度");
      //获取物流信息
      GetKuaidi().then(res=>{
        this.activitie=res.data.data
        console.log(this.activitie);
      })
      this.SeeAddressDialogVisible=true
    }

  },
  created(){
    //获取订单数据
    this.ReGetOrders()
  }
}
</script>

<style lang="less" scoped>
.input-with-select{
  width: 400px;
}
.top-margin{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;
}
</style>
