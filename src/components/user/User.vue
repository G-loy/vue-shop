<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图管理区域 -->
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="修改"
              placement="top"
              :enterable="false"
            >
              <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!--添加用户的对话框  -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close = "addDialogClosed"
    >
    <!-- 底部区域 -->
    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"  label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close = "addDialogClosed"
    >
    <!-- 底部区域 -->
    <el-form :model="editForm" :rules="addFormRules" ref="addFormRef"  label-width="70px">
      <el-form-item label="用户名" prop="username" >
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setDialogClosed"
    >
      <div>
        <p> 当前的用户:{{userInfo.username}}</p>
        <p> 当前的角色:{{userInfo.role_name}}</p>
        <p>请选择新角色
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
        </p>
      </div>
    <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    var checkEmail=(rule,value,callback) =>{
        const regEmail =  /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
        if(regEmail.test(value)){
          return callback()
        }
        callback(new Error('请输入合法的邮箱'));
    }
    var checkMobile = (rule,value,callback) =>{
      const regMobile =  /^1[3456789]{1}\d{9}$/
      if(regMobile.test(value)){
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }



    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: "",
        //当前的页数
        pagenum: 1,
        //当前每页显示多少条
        pagesize: 2,
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''

      },
      editForm:{

      },
      //修改用户
      editDialogVisible:false,
      // 分配角色
      setRoleDialogVisible:false,
      //添加表单的验证对象
      addFormRules:{
         username:[
           { required : true, message:'请输入用户名', trigger:'blur'},
           { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: 'blur'}
         ],
         password:[
           { required: true, message: "请输入密码", trigger: "blur" },
           { min: 3, max: 21,message: "长度在 3 到 21 个字符",trigger: "blur",},
         ],
         email:[
           { required: true, message: "请输入邮箱", trigger: "blur" },
           { validator:checkEmail, trigger:"blur"}
         ],
         mobile:[
           { required: true, message: "请输入电话", trigger: "blur" },
           {validator:checkMobile,trigger:"blur"}
         ]
      },
      //需要被分配角色的用户信息
      userInfo:{},
      //所有角色的列表
      rolesList:[],
      //已选中角色ID
      selectedRoleId:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userlist = res.data.users;
      this.total = res.data.total;
      console.log(res);
      console.log(this.userlist);
      console.log(this.total);
    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
      console.log(newSize);
    },
    //监听页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听 switch 开关状态
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    addDialogClosed(){
      this.$refs.addFormRef.resetFields();
    },
    addUser(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        const{data:res} = await this.$http.post('users/',this.addForm)
        if(res.meta.status !=201){
          return this.$message.error("添加用户失败")
        }
        this.$message.success("添加用户成功")
        this.getUserList()
      } )
      
      this.addDialogVisible = false
    },
    async showEditDialog(id){
        this.editDialogVisible = true;
        const{data:res} = await this.$http.get('users/'+id)
        if(res.meta.status !=200){
          return this.$message.error('获取用户信息失败')
        }
        this.editForm = res.data
    },
    editUserInfo(){
      this.$refs.addFormRef.validate(async valid =>{
        if(!valid) return
        const{data:res} = await this.$http.put('users/'+this.editForm.id,{email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status != 200){
          return this.$message.error('修改用户信息失败')
        }
        this.$message.success('修改用户信息成功')
        this.editDialogVisible=false;
        this.getUserList();
      })
    },
    deleteUser(id){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then( async () => {
            const {data:res} = await this.$http.delete('users/'+id)
            if(res.meta.status!==200){
              return this.$message.error("删除用户信息失败")
            }
            this.getUserList()
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
    //给用户分配角色
    async setRole(userInfo){
      this.userInfo = userInfo
      //在展示对话框前获取所有角色列表
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status !==200){
        return this.$message.error("获取角色列表失败")
      }
      this.rolesList = res.data
      console.log(this.rolesList)

      this.setRoleDialogVisible=true
      // console.log(this.userInfo)
    },
    async saveRoleInfo(){
      if(!this.selectedRoleId){
        this.$message.error("请选择要分配的角色")
      }
      const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
      if(res.meta.status !=200){
        return this.$message.error("修改用户角色失败")
      }
      this.$message.success("设置角色成功")
      this.getUserList()
      this.setRoleDialogVisible=false
    },
    // 处理对话框关闭事件
    setDialogClosed(){
      this.selectedRoleId = ''
      this.userInfo =''
    }
    
    
  },
};
</script>
    
<style>
</style>