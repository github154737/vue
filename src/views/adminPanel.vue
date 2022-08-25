<template>
  <div class="about" style="min-height:100%" >

    <el-container style="min-height:100%;" >

      <navigator></navigator>
      <userManagement v-show="$route.path=='/adminPanel' || $route.path=='/userManagement'"></userManagement>
      <userData       v-show="$route.path=='/userData'"></userData>
      <!-- <button @click="show"></button> -->

      

    </el-container>

  
  </div>
</template>
<script>
import navigator from '../components/navigator.vue';
import userManagement from '../components/userManagement.vue';
import userData from '../components/userData.vue'
export default {
  name: 'adminPanel',
  components:{navigator,userManagement,userData},
  methods:{
    show(){
      console.log(this.$route.path)
    }
  }

}
</script>

