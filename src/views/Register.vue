<template>
<div id="forgetpwd">
        <h1 style="text-align:center">注册账号</h1>
        <!-- <div style="position:absolute;left:30%;height: 40px;">

              <el-radio v-model="radio" label="1">手机号</el-radio>
              <el-radio v-model="radio" label="2">邮箱</el-radio>                    
        </div><br><br> -->
        <div>
           <el-input placeholder="请输入账号" v-model="UserName" clearable></el-input>
        </div><p></p>
        <div>
            <el-input placeholder="请输入密码" v-model="Password" show-password id="Password" clearable></el-input>
        </div><p></p>

        <div><el-input placeholder="请再次输入密码" v-model="PasswordComfirm" show-password id="PasswordComfirm" clearable></el-input></div>
       
        <div><p></p><p></p><el-button type="primary" round style="position:absolute;left:34%;" @click="submit">提交</el-button></div>        
    </div>
</template>
       


<script>
  export default {
    name:'Register',
    data() {
      return {
        UserName:'',
        PasswordComfirm:'',
        Password: ''
        // radio: '1'

      }
    },
    methods:{
      submit(){
        if(this.UserName==''){
          this.$message({message:"账号不能为空",type:"info"});
          return false;
        }
        else if(this.Password!=this.PasswordComfirm){
          this.$message({message:"密码不一致",type:"info"});
          return false;
        }
       console.log("向后端传数据:"),
       console.log("账号为："+this.UserName+"\n密码："+this.Password),
       this.axios.post('/usersapi', {UserName:this.UserName,Password:this.PasswordComfirm,Type:"common"})
       .then(res=>{
        console.log(res);
        if(res.status==200){this.$message({message:"注册成功",type:"success"});this.$router.push('/')}
        })
      //  this.axios.post('/usersapi', {UserName : this.UserName,password:this.Password}).then(res=>{console.log(res)})//test

    },
    ForgetPassword(){
      this.$router.push('/ForgetPassword')
    }
  }
    
  }

</script>



<style>
  .el-row {
    margin-bottom: 20px;
    /* &:last-child {
      margin-bottom: 0;
    } */
  }
  .el-col {
    border-radius: 4px;
  }
  /* .bg-purple-dark {
    background: #99a9bf;
  } */
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  #forgetpwd{
    width:400px;
    height: 400px;
    position: absolute;
    top:30%;
    left:30%;
}
</style>