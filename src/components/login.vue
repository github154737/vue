<template>
  <div id="login">
    <el-form>
          <br><br><br><br><br><br><br><br><br>
          <h1 id="title">管理员登陆系统</h1>
          <br>
      <el-row :gutter="35">
        <el-col class="col-label" :offset="7" :span="4">
          <span class="label">账号：</span>
        </el-col>
        <el-col :span="4">
          <el-input type="text" placeholder="请输入账号" v-model="account.username"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="35">
        <el-col class="col-label" :offset="7" :span="4">
          <span class="label">密码：</span>
        </el-col>
        <el-col :span="4">
          <el-input type="password" placeholder="请输入密码" v-model="account.password"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="8" :span="8">
          <span>
            <a href="#" rel="external nofollow"    @click="register" >注册账号</a>
            /
            <a href="#" rel="external nofollow"    @click="forgetPwd" >忘记密码</a>
          </span>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :offset="10" :span="4">
          <el-button type="primary" round @click="onSubmit">登录</el-button>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>
 
<script>
export default {
  name: 'login',
  data() {
    return {
      account: {
        username: 'sa',
        password: 'root'
      }
    }
  },
mounted(){
},
  methods: {
    register() {
      this.$router.push('/Register')    
    },

    forgetPwd() {
      this.$router.push('/ForgetPassword')
    },

    //点击登陆按钮事件
    onSubmit() {
      // console.log("向后端传数据:"),
      // console.log("账号："+this.account.username+"\n密码："+this.account.password),
      this.axios.get('/usersapi', {params:{UserName : this.account.username,Password:this.account.password,Type:"admin"}})
      .then(res=>{
        if(res.data==this.account.password){
          this.$message({message:"登陆成功",type:"success"});
          this.$router.push('/adminPanel');
        }else {console.log("密码错误");
        this.$message({message:"密码错误",type:"error"})}
        })
    }
 
  }
}
</script>
 
<style scoped>

  html,body{
    margin: 0;           
    padding: 0;
    width: 100%;
    height: 100%;
  }  

  #login {
    position: absolute;
    top:0px;
    height: 100%;
    width: 100%;
    text-align: center;
    margin: 0;
    padding: 0;
    background:url("../assets/sicau.jpg") ;
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  #title{
    margin: 0;
    padding: 0;
  }
  .label {
    height: 40px;
    line-height: 40px;
  }
  .col-label {
    text-align: right;
  }
  .el-row {
    margin-top: 15px;
  }
  .el-button {
    width: 120px;
  }
  .title {
    margin-top: 10%;
  }
</style>