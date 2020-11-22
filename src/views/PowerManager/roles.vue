<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="AddRoledialogVisible=true">添加角色</el-button>
      <!-- //添加角色表单 -->
      <el-dialog
        title="添加角色"
        :visible.sync="AddRoledialogVisible"
        width="50%">
        <el-form label-width="80px" :model="addRolesForm" :rules="rules" ref="addRoles">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddRoledialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddRoles">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="roleData" border borderstyle="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row v-for="(oneRight,Oindex) in scope.row.children" :key="oneRight.id" :class="['bdbottom','venter',Oindex===0?'bdtop':'']">
              <el-col :span="5">
                <el-tag closable @close="DeleteTag(scope.row,oneRight.id)">{{oneRight.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级权限位置 -->
              <el-col :span="19">
                <el-row v-for="(towRight,Tindex) in oneRight.children" :class="['venter',Tindex>0?'bdtop':'']">
                  <el-col :span="6">
                    <el-tag closable type="success" @close="DeleteTag(scope.row,towRight.id)">{{towRight.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                      <el-tag closable type="warning"  v-for="threeRight in towRight.children" @close="DeleteTag(scope.row,threeRight.id)">{{threeRight.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            

          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" ></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column prop="" label="操作" width="300">
          <template slot-scope="scope">
            <!-- //编辑 -->
            <el-button type="primary" size="mini" @click="SelectRoles(scope.row.id)">
              <i class="el-icon-edit"></i>
              编辑
            </el-button>
            <!-- //编辑角色信息表单 -->
            <el-dialog
              title="修改角色"
              :visible.sync="EditRoledialogVisible"
              width="50%">
              <el-form label-width="80px" :model="editRolesForm" :rules="rules" ref="editRoles">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述">
                  <el-input v-model="editRolesForm.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="EditRoledialogVisible= false">取 消</el-button>
                <el-button type="primary" @click="EditRoles(scope.row.id)">确 定</el-button>
              </span>
            </el-dialog>

            <!-- //删除 -->
            <el-button type="danger" size="mini" @click="DeleteRole(scope.row.id)">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
            <!-- //分配权限 -->
            <el-button type="warning" size="mini" @click="SetRightsList(scope.row)">
              分配权限
              <i class="el-icon-setting"></i>
            </el-button>
            <!-- //分配权限DiaLog -->
            <el-dialog
              title="分配权限"
              :visible.sync="SetRightsdialogVisible"
              width="50%"
              @close="CloseRightsDialog">
              <el-tree :data="rightsList" :props="RightsProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKey" ref="treeRef"></el-tree>
              <span slot="footer" class="dialog-footer">
                <el-button @click="SetRightsdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="SetRights()">确 定</el-button>
              </span>
            </el-dialog>

          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import {GetRolesLsit, PostRoles,GetRoles,PutRoles,DeleteRoles,DeleteRolesRights,GetRightsList,PostRolesRights} from '../../network/roles'
export default {
  name: "roles",
  data(){
    return{
      roleData:[],
      //添加角色参数
      addRolesForm:{
        roleName:'',
        roleDesc:''
      },
      editRolesForm:{
        roleName:'',
        roleDesc:''
      },
      AddRoledialogVisible:false,
      EditRoledialogVisible:false,
      SetRightsdialogVisible:false,
      rules: {
        roleName:[{ required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }]
      },
      rightsList:[],
      RightsProps:{
        children: 'children',
        label: 'authName'
      },
      //默认选中节点Id值数组
      defKey:[],
      RoleId:''
    }
  },
  methods:{
    //获取角色列表方法
    ReGetRoles(){
      GetRolesLsit().then(res=>{
        // console.log(res.data)
        this.roleData=res.data.data
      })
    },
    //增加角色
    AddRoles(){
      console.log("添加Roles");
      //表单校验
      this.$refs.addRoles.validate((valid,msg)=>{
        if(valid){
          //通过验证,网络请求
          PostRoles(this.addRolesForm.roleName,this.addRolesForm.roleDesc).then(res=>{
          console.log(res);
          this.AddRoledialogVisible=false
          this.ReGetRoles()
        })
        }else{
          console.log(msg);
        }
      })
    },
    //选择编辑角色
    SelectRoles(id){
      this.EditRoledialogVisible=true
      //获取角色信息
      GetRoles(id).then(res=>{
        let Rdata=res.data.data
        this.editRolesForm.roleName=Rdata.roleName
        this.editRolesForm.roleDesc=Rdata.roleDesc
      })
      
    },
    //编辑角色信息
    EditRoles(id){
      // console.log(id)
      //表单验证
      this.$refs.editRoles.validate((valid,msg)=>{
        if(valid){
          //通过验证,网络请求
          PutRoles(id,this.editRolesForm.roleName,this.editRolesForm.roleDesc).then(
            res=>{
              console.log(res)
              this.EditRoledialogVisible=false
              this.ReGetRoles()
            }
          )
        }else{
          console.log(msg);
        }
      })
    },
    //删除角色
    DeleteRole(id) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除操作
          DeleteRoles(id).then(res=>{
            this.ReGetRoles()
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
    //移除权限tag,弹窗提示
     DeleteTag(role,rightId) {
        this.$confirm('是否移除改权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log("角色ID:"+role.id+"  权限ID:"+rightId);
          // console.log(role);
          //TODO 发起删除业务
          DeleteRolesRights(role.id,rightId).then(res=>{
            role.children=res.data.data
          })
          this.$message({
            type: 'success',
            message: '移除成功!'
          });
        }).catch(() => {
          // console.log("角色ID:"+role.id+"  权限ID:"+rightId);
          // console.log(role);
          this.$message({
            type: 'info',
            message: '已取消移除'
          });          
        });
    },
    //分配权限
    SetRightsList(row){
      this.SetRightsdialogVisible=true
      this.RoleId=row.id
      GetRightsList("tree").then(res=>{
        //获取所有权限的列表
        this.rightsList=res.data.data

        //获取所拥有的权限id 三级权限id列表获取
        for(let one of row.children){
          for(let tow of one.children){
            for(let three of tow.children){
              this.defKey.push(three.id)
            }
          }
        }
      })
    },
    //关闭权限DiaLog
    CloseRightsDialog(){
      this.defKey=[]
    },
    //分配权限
    SetRights(){
      this.SetRightsdialogVisible=false
      let rArr=[]
      //全选
      rArr.push(...this.$refs.treeRef.getCheckedKeys())
      //半选
      rArr.push(...this.$refs.treeRef.getHalfCheckedKeys())
      //设置逗号分隔的格式
      const RerArr=rArr.join(',')
      console.log(this.RoleId);
      PostRolesRights(this.RoleId,RerArr).then(
        res=>{
          console.log(res);
          this.ReGetRoles()
        }
      )
    }
    
  },
  created(){
    //获取角色列表
    this.ReGetRoles()
  }
};
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.el-button--mini{
  margin-left: 10px;
}
.el-tag{
  margin: 7px;
  
}
.bdtop{
  border-top: solid 1px #eee;
}
.bdbottom{
  border-bottom: solid 1px #eee;
}
.venter{
  display: flex;
  align-items: center;
}
</style>
