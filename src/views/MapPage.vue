<template>
<div id="whole">
    <div id="NavMenu" >       
        <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1" class="el-menu-item">处理中心</el-menu-item>
            <el-submenu index="2" class="el-menu-item">
            <template slot="title" >我的工作台</template>
                <el-menu-item index="2-1" class="el-menu-item-inside">选项1</el-menu-item>
                <el-menu-item index="2-2" class="el-menu-item-inside">选项2</el-menu-item>
                <el-menu-item index="2-3" class="el-menu-item-inside">选项3</el-menu-item>
            </el-submenu>
        <el-menu-item index="3"  class="el-menu-item">消息中心</el-menu-item>
        <el-menu-item index="4" class="el-menu-item"><a href="######" target="_blank">订单管理</a></el-menu-item>
        </el-menu>
    </div>
    
<!-- 加入indexmap实例 -->
    <div id="mapCon"><IndexMap></IndexMap></div>
    
</div>
</template>

<script>
//  import View from 'ol/View'
//   import Map from 'ol/Map'
//   import TileLayer from 'ol/layer/Tile'
//   import OSM from 'ol/source/OSM'
//   import {defaults, FullScreen, ScaleLine, ZoomSlider, MousePosition} from 'ol/control'
  // 导入ol的CSS样式
  import 'ol/ol.css'
  import IndexMap from "../components/map/IndexMap.vue"


  export default {
    name:'MapPage',
    components: {
			IndexMap
		},
    props: {},
    // mounted() {
    //   // 在mounted中写函数
    //   new Map({
    //     // 地图将通过'map-root'的ref属性进行绑定
    //     // 这里想用id属性也可以
    //     target: mapCon,
    //     layers: [
    //       new TileLayer({
    //         source: new OSM()

    //       }),
    //     ],
    //     view: new View({
    //       center: [116.394926, 39.9125],
    //       projection: "EPSG:3857",
    //       zoom: 1,
    //       maxZoom: 20,
    //       constrainResolution: true  //确保OSM tile缩放到正确的级别
    //     }),
    //     // 注意地图控件的写法
    //     controls: defaults().extend([
    //       new FullScreen(),
    //       new ZoomSlider(),
    //       new ScaleLine(),
    //       new MousePosition()
    //     ])
    //   })
    // },
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      }
    }
  }
</script>





<style>
*{
    margin:0px;
    padding: 0px;
}

.el-menu-item{
    width: 15%;
}

.el-menu-item-inside{
    width: 200px;
    margin: 0px;
    border: 0ch;
    padding: 0%;
}

#whole{
    position:absolute;
    width: 100%;
    height: 100%;
    left:0px;
    top:0px;
}

#NavMenu{
    position: absolute;
    top:0px;
    left:0px;
    width:100%;
    height: 250px;
    z-index: 5;
}

#mapCon{
    width: 100%;
    height: 100%;
    z-index: 1;
}

</style>