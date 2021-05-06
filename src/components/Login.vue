<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="./../assets/img/logo.png" alt="登陆头像" />
      </div>
      <!-- 登陆区域 -->
      <el-form
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-search"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登陆表单的数据对象
      loginForm: {
        username: "admin",
        password: "123456",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到 8 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 21,message: "长度在 3 到 21 个字符",trigger: "blur",},
        ]
      }
    };
  },
  methods:{
    restLoginForm(){
      this.$refs.loginFormRef.resetFields();
    },
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if(!valid) return;
        const { data:res } = await this.$http.post("login",this.loginForm);
        if(res.meta.status !==200)return this.$message.error(('登录失败'));
        this.$message.success('登陆成功');

        //1.将登陆成功之后的token，保存到客户端的sessionStorage中
        //  1.1 项目中出现了登陆之外的其他API接口，必须在登陆之后才能访问
        //  1.2 token 只应在当前网站打开期间生效，所以将token保存在sessionStorage中
        console.log(res);
        window.sessionStorage.setItem('token',res.data.token);
        // 2.通过编程导航跳转到后台主页,路由地址是 /home
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped >
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 580px;
  height: 460px;
  background-color: #fff;
  border-radius: 3px;
  display: flex;
  flex-flow: column;
  align-items: center;
}
.avatar_box {
  height: 180px;
  width: 180px;
  display: flex;
  margin-top: -100px;
  border: #fff 18px solid;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  background-color: #fff;
  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  display: flex;
  flex-flow: column;
  justify-content: center;
  width: 350px;
  height: 600px;
  box-sizing: border-box;
}
.btns {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>