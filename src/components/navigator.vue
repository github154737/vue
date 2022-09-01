<template>
    <div>

         <el-container style="min-height:100%;" >

      <el-aside :width="sideWidth+'px'"  style="background-color: rgb(238, 241, 246);overflow-y: scroll" >
<!--    :collapse-transition="false" 关闭标签动画效果，解决导航栏收缩卡顿问题-->
        <el-menu :default-openeds="['1','2','3']"
            default-active="1-1"
            style="min-height:100%;"
            background-color="rgb(48,65,86)"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapsed"
            :collapse-transition="false">
<!--          添加目录头-->
          <div style="height:60px;line-height: 60px;text-align: center">
            <img src="../assets/logo.png" style="width:20px;position: relative; top:5px;margin-left: 5px">
            <b style="color:white" v-show="LogoTextShow">后台管理界面</b>
          </div>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-coin"></i>
              <span slot="title">数据展示区</span>
            </template>
              <el-menu-item index="1-1" @click="goUserManage">用户管理(完成)</el-menu-item>
              <el-menu-item index="1-2" @click="goUserData">用户数据(完成)</el-menu-item>
              <el-menu-item index="1-3" @click="goUserView">用户一览(构建中)</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-discover"></i>
              <span slot="title">地图展示区</span>
            </template>
              <el-menu-item index="2-1" @click="goIndexMap">基础地图(完成)</el-menu-item>
              <el-submenu index="2-2">
                <template slot="title">
                <i class="el-icon-position"></i>
                <span slot="title">功能展示区</span>
                </template>
                <el-menu-item index="2-2-1" @click="goGetWeather">获取天气</el-menu-item>
                <el-menu-item index="2-2-2">待定</el-menu-item>
                <el-menu-item index="2-2-3">待定</el-menu-item>
              </el-submenu>
              <el-menu-item index="2-3">地图3(构建中)</el-menu-item>
          </el-submenu>
          <el-submenu index="3" >
            <template slot="title">
              <i class="el-icon-s-unfold"></i>
              <span slot="title">Navigator Three</span>
            </template>
            <el-menu-item-group>
              <template slot="title">Group 1</template>
              <el-menu-item index="3-1">Option 1</el-menu-item>
              <el-menu-item index="3-2">Option 2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Group 2">
              <el-menu-item index="3-3">Option 3</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      </el-container>
    </div>
</template>


<script>
export default {
  name: 'navigator',

  data() {
    return {
      collapseBtnClass:'el-icon-s-fold',//折叠图标的类型根据点击事件 collapse发生改变
      isCollapsed:false, //false展开true折叠
      sideWidth:200,//侧导航栏宽度
      LogoTextShow:true,//文本是否显示
    }
  },

  methods:{//写一些界面常见方法，用于请求和传递数据
    collapse(){ //点击收缩按钮触发 菜单栏收缩
      this.isCollapsed=!this.isCollapsed;
      if(this.isCollapsed){
        this.sideWidth=64
        this.collapseBtnClass='el-icon-s-unfold'
        this.LogoTextShow=false
      }else{
        this.sideWidth=200
        this.collapseBtnClass='el-icon-s-fold'
        this.LogoTextShow=true

      }
    },
    goUserManage(){
        this.$router.push('/adminPanel')

    },
    goUserData(){
        this.$router.push('/userData')
    },
    goUserView(){
        this.$router.push('/userManagement')
    },
    goIndexMap(){
        this.$router.push('/IndexMap')
    },
    goGetWeather(){
      this.$router.push("/getWeather")
    }
  }

}
</script>