<template>
  <div id="mapCon"
       style="height: 600px; width: 800px">
  </div>
</template>
 
<script>
  import View from 'ol/View'
  import Map from 'ol/Map'
  import TileLayer from 'ol/layer/Tile'
  import OSM from 'ol/source/OSM'
  import {defaults, FullScreen, ScaleLine, ZoomSlider, MousePosition} from 'ol/control'
  // 导入ol的CSS样式
  import 'ol/ol.css'

  export default {
    name: 'mymap',
    components: {},
    props: {},
    mounted() {
      // 在mounted中写函数
      new Map({
        // 地图将通过'map-root'的ref属性进行绑定
        // 这里想用id属性也可以
        target: mapCon,
        layers: [
          new TileLayer({
            source: new OSM()

          }),
        ],
        view: new View({
          center: [116.394926, 39.9125],
          projection: "EPSG:3857",
          zoom: 1,
          maxZoom: 20,
          constrainResolution: true  //确保OSM tile缩放到正确的级别
        }),
        // 注意地图控件的写法
        controls: defaults().extend([
          new FullScreen(),
          new ZoomSlider(),
          new ScaleLine(),
          new MousePosition()
        ])
      })
    },
  }
</script>

