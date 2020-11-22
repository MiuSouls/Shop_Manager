<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表 </el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsData" borderstyle="width: 100%" border>
        <el-table-column type="index"label="#"></el-table-column>
        <el-table-column prop="authName"label="权限名称"></el-table-column>
        <el-table-column prop="path"label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <!-- <el-tag type="success">标签{{level}}</el-tag> -->
          <template slot-scope="scope">
            <el-tag :type="tagLevel[scope.row.level]">{{levelNumber[scope.row.level]}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {GetRights} from '../../network/power'
export default {
  name: "rights",
  data(){
    return{
      rightsData:[],
      tagLevel:['','success','danger'],
      levelNumber:['一级权限','二级权限','三级权限']
    }
  },
  methods:{

  },
  created(){
    //获取权限列表
    GetRights("list").then(
      res=>{
        // console.log(res.data.data);
        this.rightsData=res.data.data
      }
    )
  }
};
</script>

<style lang="less" scoped>
</style>
