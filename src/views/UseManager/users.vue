<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格区域 -->
    <el-card>
      <div class="user-top">
        <el-row :gutter="20">
          <el-col :span="10">
            <div>
              <el-input
                placeholder="请输入内容"
                v-model="input"
                class="input"
                clearable
                @clear="ClearInput"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="Search"
                ></el-button>
              </el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <el-button type="primary" @click="AddDialogVisible = true"
                >添加用户</el-button
              >
              <el-dialog
                title="添加用户"
                :visible.sync="AddDialogVisible"
                @closed="CloseAddUserDiaLog()"
              >
                <el-form
                  :model="AddUsersForm"
                  label-width="80px"
                  :rules="rules"
                  ref="userForm"
                >
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="AddUsersForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                    <el-input v-model="AddUsersForm.password"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="AddUsersForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="AddUsersForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer">
                  <el-button @click="AddDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="AddUsers">确 定</el-button>
                </div>
              </el-dialog>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="user-middle">
        <el-table :data="UserManagerData" border style="width: 100%">
          <el-table-column type="index" label="#" width="50"> </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="250"
          ></el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
            width="220"
          ></el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
            width="150"
          ></el-table-column>
          <el-table-column prop="mg_state" label="状态" width="90">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#268BD2"
                inactive-color="#DCDFE6"
                @change="StateChange(scope.row.id, scope.row.mg_state)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <!-- 编辑 -->
              <el-tooltip
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  size="mini"
                  @click="SelectUsers(scope.row.id)"
                >
                  <i class="el-icon-edit"></i>
                </el-button>
              </el-tooltip>

              <el-dialog
                title="修改用户"
                :visible.sync="EditDialogVisible"
                @closed="CloseEditUserDiaLog()"
              >
                <el-form
                  label-width="70px"
                  :model="EditUsersForm"
                  :rules="rules"
                  ref="editForm"
                >
                  <el-form-item label="姓名">
                    <el-input
                      v-model="EditUsersForm.username"
                      disabled
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="EditUsersForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="EditUsersForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer">
                  <el-button @click="EditDialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="EditUsers">确 定</el-button>
                </div>
              </el-dialog>

              <!-- 删除 -->
              <el-tooltip
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button type="danger" size="mini" @click="DeleteBoxOpen(scope.row.id)">
                  <i class="el-icon-delete"></i>
                </el-button>
              </el-tooltip>

              <!-- 设置 -->
              <el-tooltip
                effect="dark"
                content="设置"
                placement="top"
                :enterable="false"
              >
                <el-button type="warning" size="mini">
                  <i class="el-icon-setting"></i>
                </el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="HandleSizeChange"
          @current-change="HandleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="UserTotal"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import Axios from 'axios';
import {
  GetUsers,
  PutUserState,
  GetSelectUsers,
  PostUsers,
  SetUsers,
  DeleteRoles,
} from "../../network/home";
export default {
  name: "users",
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      value: true,
      input: "",
      //当前页码
      pagenum: 1,
      //每页多少条
      pagesize: 5,
      //表格数据
      UserManagerData: [],
      // 列表总条数
      UserTotal: 0,
      uid: "",
      type: "",
      AddDialogVisible: false,
      AddUsersForm: {
        // username: "测试账号001",
        // password: "000001",
        // email: "001@163.com",
        // mobile: "13000000001"
        username: "",
        password: "",
        email: "001@163.com",
        mobile: "13000000001",
      },
      UserData:{},
      EditDialogVisible: false,
      EditUsersForm: {
        username: "",
        email: "",
        mobile: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 4,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            trigger: "blur",
            type: "email",
            message: "请输入正确的邮箱地址",
          },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          {
            validator: checkMobile,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //获取user表格数据的方法
    ReGetUsers() {
      GetUsers(this.input, this.pagenum, this.pagesize).then((res) => {
        // console.log(res.data);
        this.UserManagerData = res.data.data.users;
        this.UserTotal = res.data.data.total;
      });
    },
    //监听 pagesize 改变
    HandleSizeChange(newSize) {
      this.pagesize = newSize;
      console.log("newSize:" + newSize + "  this.pagesize:" + this.pagesize);
      this.ReGetUsers();
    },
    //监听 页码值 改变
    HandleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.ReGetUsers();
    },
    //设置状态
    StateChange(uid, type) {
      PutUserState(uid, type).then((res) => {
        // console.log(res)
        if (res.data.meta.status == 200) {
          this.loginSuccess("修改状态成功!");
        } else {
          type = !type;
          return this.loginErr("修改状态失败!");
        }
      });
    },
    //提示信息
    loginSuccess(Meg) {
      this.$message({
        message: Meg,
        type: "success",
      });
    },
    //搜索
    Search() {
      this.ReGetUsers();
    },
    //清空搜索
    ClearInput() {
      this.input = "";
      this.ReGetUsers();
    },
    //关闭添加对话框的时候调用
    CloseAddUserDiaLog() {
      this.$refs.userForm.resetFields();
      console.log("清理1!");
    },
    CloseEditUserDiaLog() {
      this.$refs.editForm.resetFields();
      console.log("清理2!");
    },
    //添加用户操作
    AddUsers() {
      console.log(this.$refs.userForm);
      //表单校验
      this.$refs.userForm.validate((valida, ob) => {
        if (valida) {
          console.log("通过校验!");
          console.log(this.AddUsersForm.username);
          PostUsers(
            this.AddUsersForm.username,
            this.AddUsersForm.password,
            this.AddUsersForm.email,
            this.AddUsersForm.mobile
          ).then((res) => {
            console.log(res);
            this.loginSuccess("用户添加成功!");
            this.ReGetUsers();
          });
          this.AddDialogVisible = false;
        } else {
          console.log("校验失败!");
          console.log(ob);
        }
      });
    },
    //获取用户信息
    SelectUsers(id) {
      this.EditDialogVisible = true;
      GetSelectUsers(id).then((res) => {
        this.UserData = res.data.data;
        console.log(this.UserData);
        if (res.data.meta.status != 200) {
          console.log("获取用户信息失败!");
        } else {
          console.log("获取用户信息成功!");
          this.EditUsersForm.username = this.UserData.username;
          this.EditUsersForm.email = this.UserData.email;
          this.EditUsersForm.mobile = this.UserData.mobile;
        }
      });
    },
    //编辑用户信息
    EditUsers() {
      this.$refs.editForm.validate((valida,ob)=>{
        if(valida){
          console.log("修改校验通过!")
          this.EditDialogVisible = false
          //提交修改
          SetUsers(this.UserData.id,this.EditUsersForm.email,this.EditUsersForm.mobile).then(
            res=>{
              console.log(res)
              this.ReGetUsers()
          })

          //直接访问 直接在请求头加token
          // let id=1152
          // Axios({
          //   url:`http://timemeetyou.com:8889/api/private/v1/users/${id}`,
          //   method:'put',
          //   data:{
          //     email:"666@163.com",
          //     mobile:"13000000001"
          //   },
          //   headers:{
          //     Authorization: `${sessionStorage.getItem("token")}`
          //   }
          // }).then(
          //   res=>{
          //     console.log(res)
          //   }
          // )


        }else{
          console.log(ob)
        }
      })
    },
    //删除对话框
    DeleteBoxOpen(id){
      const mesg=this.$confirm('是否永久删除当前用户?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
          //执行删除操作
          DeleteRoles(id).then(res=>{
            console.log(res)
            if(res.data.meta.status!=200){
              console.log("删除失败!");
            }else{
              this.ReGetUsers()
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          });   
          console.log("已取消删除!"+id);
        });
    }
  },
  created() {
    //获取user表格数据
    this.ReGetUsers();
  },
};
</script>

<style lang="less" scoped>
.users {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.el-pagination {
  margin-top: 15px;
}
.el-button--mini{
  margin-left: 10px;
}
</style>
