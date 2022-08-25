<template>
  <div class="myapp">
  
  <el-row class="tac">
  <el-col :span="10">

    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>点数据</span>
        </template>
        <el-menu-item-group>
          
          <el-menu-item index="1-1">{{coordinate.latitude}}</el-menu-item>
          <el-menu-item index="1-2">{{coordinate.lontitude}}</el-menu-item>
        </el-menu-item-group>
        
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      
    </el-menu>
  </el-col>
</el-row>

  </div>
</template>

<script>
import Login from './login.vue'
  export default {
    data() {
        return {
            coordinate: {
                latitude: "45",
                lontitude: "56"
            }
        };
    },
    methods: {
        handleOpen(key, keyPath) {
            // console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            // console.log(key, keyPath);
        }
    },
    components: { Login }
}
</script>


