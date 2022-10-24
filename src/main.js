// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import './plugins/axios'
import App from './App'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import * as echarts from 'echarts'

// import ECharts from 'vue-echarts'
// Vue.component('VueEcharts', ECharts)




Vue.config.productionTip = false
Vue.use(ElementUI)

window._AMapSecurityConfig = {
	securityJsCode: 'beb09120f541131b5fb8e8ce5ba2ecb6' //*  安全密钥
}


 
Vue.prototype.$publicURL = './';
Vue.prototype.$echarts = echarts;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  beforeCreate(){
    Vue.prototype.$bus=this;//安装全局事件总线
  }
})
