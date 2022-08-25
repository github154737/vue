<template>
    <div style="height:600px;width:600px;">
        <div id="container" class="map">
			<div class="input-card">
				<h4>左击获取经纬度：</h4>
				<div class="input-item">
				<input type="text" readonly="true" id="lnglat">
				<button id="change" @click="change"></button>
				<router-link to="/static/GetCity.html">zou</router-link>
				</div>
			</div>
		</div>
<router-view></router-view>
    </div>
</template>
<link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />


<script>
    //引入高德地图
	import AMapLoader from '@amap/amap-jsapi-loader'

	export default {
		name: 'GetCoordinate',
		data() {
            
			return {
        map: null, //地图实例
			}
		},
		mounted() {		
      this.initMap();

      
		},
    created(){
                
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
						"AMap.mouseTool",
						"AMap.Autocomplete",
						"AMap.CitySearch",
						"AMap.Geocoder",
						"AMap.DistrictSearch"
								], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
							}).then((AMap) => {
								// console.log(AMap);                    
								this.map = new AMap.Map("container", { //设置地图容器id
								
						resizeEnable: true, //是否监控地图容器尺寸变化      
									viewMode: "3D", //是否为3D地图模式
									zoom: 8, //初始化地图级别
									center: [116.397128, 39.916527], //初始化地图中心点位置
								});
					this.map.on('click', function(e) {
						document.getElementById("lnglat").value = e.lnglat.getLng() + ',' + e.lnglat.getLat()
					});
          



                   
				}).catch(e => {
					console.log(e);
				})
			},
			change(){

			}
      
		}
	}
</script>

<style type="text/css">
    html,body{
        width: 100%;
        height: 100%;
        margin: 0px;
    }
    .map{
        height: 100%;
        width: 100%;
        float: left;
		z-index: 1;
    }
	.input-card {
		display: flex;
		flex-direction: column;
		min-width: 0;
		word-wrap: break-word;
		background-color: #fff;
		background-clip: border-box;
		border-radius: .12rem;
		width: 11rem;
		border-width: 0;
		border-radius: 0.4rem;
		box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		-ms-flex: 1 1 auto;
		flex: 1 1 auto;
		padding: 0.75rem 1.25rem;
		z-index: 2;
		height: 6rem;
	}
	.input-item {
		position: relative;
		display: -ms-flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		-ms-flex-align: center;
		align-items: center;
		width: 100%;
		height: 3rem;
		z-index: 2;
	}
</style>