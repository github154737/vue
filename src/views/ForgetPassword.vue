<template>
<div id="forgetpwd">
        <div style="position:absolute;left:30%;height: 40px;">
              <el-radio v-model="radio" label="1">手机号</el-radio>
              <el-radio v-model="radio" label="2">邮箱</el-radio>                    
        </div><br><br>
        <div>
           <el-input placeholder="请输入手机号或邮箱" v-model="PhoneMail" clearable></el-input>
        </div><p></p>
        <div>
           <el-input placeholder="请输入验证码" v-model="Vcode" clearable></el-input>
        </div><p></p>
        <div>
            <el-input placeholder="请输入新密码" v-model="newpwd1" show-password id="newpwd1" clearable></el-input>
        </div><p></p>

        <div><el-input placeholder="请再次输入新密码" v-model="newpwd2" show-password id="newpwd2" clearable></el-input></div>
       
        <div><p></p><p></p><el-button type="primary" round style="position:absolute;left:34%;" @click="submit">提交</el-button></div>        
    </div>
</template>
       


<script>
  export default {
    name:'ForgetPassword',
    data() {
      return {
        PhoneMail:'',
        newpwd2:'',
        newpwd1: '',
        radio: '1',
        Vcode:''

      }
    },
    methods:{
      submit(){
       console.log("向后端传数据:"),
       console.log("账号为："+this.username+"\n旧密码："+this.oldpwd+"\n新密码："+this.newpwd1),
       this.axios.post('/ResetPasswordAPI', {username:this.username,oldpassword:this.oldpwd,newpassword:this.newpwd2}).then(res=>{console.log(res)})
      //  this.axios.post('/usersapi', {username : this.username,password:this.newpwd1}).then(res=>{console.log(res)})//test

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