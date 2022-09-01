import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import app from '@/components/app.vue'
import adminPanel from '@/views/adminPanel.vue'
import ResetPassword from '@/views/ResetPassword.vue'
import ForgetPassword from '@/views/ForgetPassword.vue'
import mymap from '@/views/mymap.vue'
import MapPage from '@/views/MapPage.vue'
import IndexMap from '@/components/map/IndexMap.vue'
import GetCoordinate from '@/components/map/GetCoordinate.vue'
import add from '@/components/map/add'
import Draw from '@/components/map/Draw'
import Register from "@/views/Register"
import userManagement from "@/components/userManagement"



Vue.use(Router)

export default new Router({
  // mode:"history",
  routes: [
    
    {
      path: '/app',
      name: 'app',
      component: app
    },
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path:'/adminPanel',
      name:'adminPanel',
      component: adminPanel,
      // redirect:"navigator",
      children:[
        {
          path:'/userData',
          component: () => import('@/components/userData'),
          name:'userData'
        },
        {
          path:'/IndexMap',
          component: () => import('@/components/map/IndexMap'),
          name:'IndexMap'
        },
        {
          path:'/GetWeather',
          component: () => import('@/components/map/GetWeather'),
          name:'GetWeather'
        },

      ]
    },
    {
      path:'/userManagement',
      name:'userManagement',
      component:userManagement
    },
    {
      path:'/ResetPassword',
      name:'ResetPassword',
      component:ResetPassword
    },
    {
      path:'/ForgetPassword',
      name:'ForgetPassword',
      component:ForgetPassword
    },
    {
      path:'/mymap',
      name:'mymap',
      component:mymap
    },
    {
      path:'/MapPage',
      name:'MapPage',
      component:MapPage
    },
    {
      path:'/GetCoordinate',
      name:'GetCoordinate',
      component:GetCoordinate
    },
    {
      path:'/IndexMap',
      name:'IndexMap',
      component:IndexMap
    },
    {
      path:'/add',
      name:'add',
      component:add
    },
    {
      path:'/Draw',
      name:'Draw',
      component:Draw
    },
    {
      path:'/Register',
      name:'Register',
      component:Register
    }

  ]
})
