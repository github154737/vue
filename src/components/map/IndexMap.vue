<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="Map" style="height: 100vh;width:85.8vw"></div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
    //引入高德地图
	import AMapLoader from '@amap/amap-jsapi-loader'
	export default {
		name: 'IndexMap',
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
					key: "e7a70459f8b1ecf94dc63aff142c24c0", // 申请好的Web端开发者Key，首次调用 load 时必填
					//2.0版本太卡了 ，所以使用的1.4.0版本  其插件也有不同  如：ToolBar
					version: "1.4.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
					resizeEnable: true,
					plugins: [
						"AMap.ToolBar", //工具条
						"AMap.Scale", // 比例尺
						"AMap.Geolocation", //定位
						"AMap.TileLayer.WMS",
					], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
				}).then((AMap) => {
					// console.log(AMap);
					this.map = new AMap.Map("Map", { //设置地图容器id
                  
						viewMode: "3D", //是否为3D地图模式
						zoom: 4, //初始化地图级别
						center: [116.397128, 39.916527], //初始化地图中心点位置
					});
				}).then(map => {
							var country_bound  = new AMap.TileLayer.WMS({
							url: 'http://localhost:8081/geoserver/cite/wms', // wms服务的url地址
							blend: false, // 地图级别切换时，不同级别的图片是否进行混合
							tileSize: 512, // 加载WMS图层服务时，图片的分片大小
							params: {
								'LAYERS': 'cite:river',//在图层预览里面的名称
								VERSION:'1.1.1'
							} // OGC标准的WMS地图服务的GetMap接口的参数
						});
						var province_bound  = new AMap.TileLayer.WMS({
							url: 'http://localhost:8081/geoserver/cite/wms', // wms服务的url地址
							blend: false, // 地图级别切换时，不同级别的图片是否进行混合
							tileSize: 512, // 加载WMS图层服务时，图片的分片大小
							params: {
								'LAYERS': 'cite:province_line',//在图层预览里面的名称
								VERSION:'1.1.1'
							} // OGC标准的WMS地图服务的GetMap接口的参数
						});
						// var province_area  = new AMap.TileLayer.WMS({
						// 	url: 'http://localhost:8081/geoserver/cite/wms', // wms服务的url地址
						// 	blend: false, // 地图级别切换时，不同级别的图片是否进行混合
						// 	tileSize: 512, // 加载WMS图层服务时，图片的分片大小
						// 	params: {
						// 		'LAYERS': 'cite:province_p',//在图层预览里面的名称
						// 		VERSION:'1.1.1'
						// 	} // OGC标准的WMS地图服务的GetMap接口的参数
						// });

						this.map.add(country_bound);
						this.map.add(province_bound);
						// this.map.add(province_area);
					
				})


			}
		}
	}
</script>