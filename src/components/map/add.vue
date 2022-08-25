<template>
    <div style="width:800px;height:700px;">
        <div id="container"></div>
<div class="input-card" style="width:24rem;">
    <h4>添加、删除覆盖物</h4>
    <div class="input-item">
      <label>Marker：</label>
      <button class="btn" id="add-marker" @click="addmarker" style="margin-right:1rem;">添加Marker</button>
      <button class="btn" id="remove-marker" @click="removemarker">删除Marker</button>
    </div>
    <div class="input-item">
      <label>Circle：</label>
      <button class="btn" id="add-circle" @click="addcircle" style="margin-right:1rem;">添加Circle</button>
      <button class="btn" id="remove-circle" @click="removecircle">删除Circle</button>
    </div>
  </div>
    </div>
</template>



<script>
    //引入高德地图
	import AMapLoader from '@amap/amap-jsapi-loader'
	export default {
		name: 'add',
		data() {
			return {
                map: null, //地图实例
			}
		},
		mounted() {
			this.initMap()
		},
		methods: {
			initMap() {
				AMapLoader.load({
					key: "e7a70459f8b1ecf94dc63aff142c24c0",
					version: "1.4.0", 
					resizeEnable: true,
					plugins: [
						"AMap.ToolBar", //工具条
						"AMap.Scale", // 比例尺
						"AMap.Geolocation", //定位
                        "Amap.MouseTool",
                        "Amap.Autocomplete"
					], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
				}).then((AMap) => {
                    
					this.map = new AMap.Map("container", { //设置地图容器id                  
						viewMode: "3D", //是否为3D地图模式
						zoom: 8, //初始化地图级别
						center: [116.397128, 39.916527], //初始化地图中心点位置
					});
                    var marker = new AMap.Marker({
                        icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: [116.405467, 39.907761]
                    });
                    this.marker = marker;
                    // 构造矢量圆形
                    var circle = new AMap.Circle({
                        center: new AMap.LngLat("103.603322", "30.520255"), // 圆心位置
                        radius: 1000,  //半径
                        strokeColor: "#F33",  //线颜色
                        strokeOpacity: 1,  //线透明度
                        strokeWeight: 3,  //线粗细度
                        fillColor: "#ee2200",  //填充颜色
                        fillOpacity: 0.35 //填充透明度
                    });
                    this.circle = circle;

                    // 折线的节点坐标数组，每个元素为 AMap.LngLat 对象
                    var path = [
                        new AMap.LngLat(117.368904,39.913423),
                        new AMap.LngLat(102.382122,39.901176),
                        new AMap.LngLat(110.387271,39.912501),
                        new AMap.LngLat(90.398258,39.904600)
                    ];
                    this.path = path;
                    // 创建折线实例
                    var polyline = new AMap.Polyline({
                        path: path,  
                        borderWeight: 2, // 线条宽度，默认为 1
                        strokeColor: 'red', // 线条颜色
                        lineJoin: 'round' // 折线拐点连接处样式
                    });

                    // 将折线添加至地图实例
                    this.map.add(polyline);
                    
				}).catch(e => {
					// console.log(e);
				})
			},
            addmarker(){
                this.map.add(this.marker);
                this.map.setFitView();
            },
            removemarker(){
                this.map.remove(this.marker);
                this.map.setFitView();
            },
            addcircle(){
                this.map.add(this.circle);
                this.map.setFitView();
            },
            removecircle(){
                this.map.remove(this.circle);
                this.map.setFitView();
            }



		}
	}
</script>

  <style>
        html,
        body,
        #container {
          width: 100%;
          height: 100%;
        }
        
        label {
            width: 55px;
            height: 26px;
            line-height: 26px;
            margin-bottom: 0;
        }
        button.btn {
            width: 80px;
        }
    </style>