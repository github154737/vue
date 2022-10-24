<template>
  <div class="about" style="min-height:100%" >

    <el-container style="min-height:100%;" >

      <navigator      v-show=true></navigator>
      <userManagement v-show="$route.path=='/adminPanel' || $route.path=='/userManagement'"></userManagement>
      <userData       v-if="$route.path=='/userData'"></userData>
      <IndexMap       v-show="$route.path=='/IndexMap'"></IndexMap>
      <GetWeather     v-show="$route.path=='/GetWeather'"></GetWeather>
      <Navigation     v-show="$route.path=='/navigation'"></Navigation>
      <click4property v-if="$route.path=='/click4property'"></click4property>
      <edit           v-if="$route.path=='/edit'" ></edit>
      <rainPrediction v-if="$route.path=='/rainPrediction'"></rainPrediction>

    </el-container>

  
  </div>
</template>
<script>
import navigator from '../components/navigator.vue';
import userManagement from '../components/userManagement.vue';
import userData from '../components/userData.vue'
import IndexMap from '../components/map/IndexMap.vue'
import GetWeather from "../components/map/GetWeather.vue"
import Navigation from '../components/map/navigation.vue'
import click4property from '../components/map/click4property.vue'
import edit from '../components/map/edit.vue'
import rainPrediction from '../components/map/rainPrediction.vue'


export default {
  name: 'adminPanel',
  components:{ navigator, userManagement, userData, IndexMap, GetWeather, Navigation ,click4property,edit,rainPrediction},

}
</script>

