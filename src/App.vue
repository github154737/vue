<template>
  <div id="app">
      <!-- <router-link to="/app">
        点击此处访问点
      </router-link> -->
      <!-- <button @click="jump">点击跳转</button> -->
      <router-view></router-view>
      
    </div>
</template>

<script>


export default {
  name: 'APP',
  methods:{
  },
  components: {
    app
  }
}
</script>

<style>
body {
    margin: 0;
    padding: 0;
  }
</style>
