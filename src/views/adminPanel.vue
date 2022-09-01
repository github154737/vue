<template>
  <div class="about" style="min-height:100%" >

    <el-container style="min-height:100%;" >

      <navigator      v-show=true></navigator>
      <userManagement v-show="$route.path=='/adminPanel' || $route.path=='/userManagement'"></userManagement>
      <userData       v-show="$route.path=='/userData'"></userData>
      <IndexMap       v-show="$route.path=='/IndexMap'"></IndexMap>
      <GetWeather     v-show="$route.path=='/GetWeather'"></GetWeather>


      

    </el-container>

  
  </div>
</template>
<script>
import navigator from '../components/navigator.vue';
import userManagement from '../components/userManagement.vue';
import userData from '../components/userData.vue'
import IndexMap from '../components/map/IndexMap.vue'
import GetWeather from "../components/map/GetWeather.vue"


export default {
  name: 'adminPanel',
  components:{ navigator, userManagement, userData, IndexMap, GetWeather },

}
</script>

