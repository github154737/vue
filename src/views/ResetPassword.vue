<template>
    <div id="resetpwd">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名/邮箱" prop="user">
            <el-input v-model="ruleForm.user" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="旧密码" prop="oldpwd">
            <el-input v-model.number="ruleForm.oldpwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="newpwd">
            <el-input type="password" v-model="ruleForm.newpwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="newpwd2">
            <el-input type="password" v-model="ruleForm.newpwd2" autocomplete="off"></el-input>
          </el-form-item>        
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">全部清空</el-button>
          </el-form-item>
        </el-form>
    </div>
</template>

<script>
  export default {
    name:'ResetPassword',
    
    methods: {
    //提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //在这里写判断旧密码是否正确的逻辑
            this.IsPwdTure(this.ruleForm.user,this.ruleForm.oldpwd,this.ruleForm.newpwd);
            // console.log("exist:"+exist)
            // if(exist>=1){
            //   alert('重置密码成功，请重新登陆');
            // }else{
            //   alert('旧密码错误，请检查后再试');
            //  return false;
            // }           
          } else {
            alert('重置密码失败，请检查后再试');
            return false;
          }
        });
      },
      //清空表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      //判断旧密码是否正确
      IsPwdTure(user,oldpwd,newpwd){        
        console.log("向后端传账号和旧密码:")
        console.log("账号为："+user+"\n旧密码："+oldpwd)
        this.axios.post('/ResetPasswordAPI', {UserName:user,OldPassword:oldpwd})
        .then(res=>{
          // console.log(res.data.count)
          var result=res.data.count 
          if(result>=1){
            //在这里写重新设置密码的逻辑
            this.axios.post('/ChangePasswordAPI', {UserName:user,NewPassword:newpwd})
            .then(res=>{
              console.log("update:"+res)            
          })  
              alert('重置密码成功，请重新登陆');
            }else{
              alert('旧密码错误，请检查后再试');
             return false;
            }    
          })    
      }
    },

  data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
          ruleForm: {
          user: '7',
          oldpwd:'7',
          newpwd: '7'
        },
        rules: {
          newpwd: [
            {required:true, trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
          newpwd2: [
            {required:true,validator: validatePass2, trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
            ],
          user:[
            {required:true, trigger: 'blur'}
          ],
          oldpwd:[
            {required:true, trigger: 'blur'}
          ]
        }
      };
    }
    
  }

  
</script>

<style>
#resetpwd{
    width:400px;
    height: 30px;
    position: absolute;
    top:30%;
    left:30%;
}
</style>