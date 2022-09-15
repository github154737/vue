<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="weather" style="height: 100vh;width:85.8vw"></div>
			<div class="info">
			<h4>预报天气</h4><hr>
			<p id='forecast'></p>
			</div>
			</el-main>
		</el-container>
	</div>
</template>

<!-- <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" /> -->

<script>
    //引入高德地图
	import AMapLoader from '@amap/amap-jsapi-loader'
	export default {
		name: 'GetWeather',
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
						"AMap.Scale", // 比例尺
						"AMap.Geolocation", //定位
						"AMap.Weather",	
						"AMap.Geocoder",				
					], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
				}).then((AMap) => {
					var  that = this;
					this.map = new AMap.Map("weather", { //设置地图容器id
						viewMode: "3D", //是否为3D地图模式
						zoom: 10, //初始化地图级别
						center: [116.397128, 39.916527], //初始化地图中心点位置
					});
					var weather = new AMap.Weather();
				
					var geocoder = new AMap.Geocoder({
						city: "010", //城市设为北京，默认：“全国”
						radius: 1000 //范围，默认：500
					});					

					// 明天改改样式，框太大了，然后看看怎么改同时出现多个点的问题

					that.map.on('click',function(e){		
						var lnglat = e.lnglat.lng + ',' + e.lnglat.lat
						// console.log(lnglat);
						
						geocoder.getAddress(lnglat, function(status, result) {
							if (status === 'complete') {
								//获得逆地理编码结果
								var address = result.regeocode.formattedAddress;
								// console.log(address);

								//在这里从逆地理编码中获得所在区
								//注意这里的key要用web服务的key，web端的key没有这个服务
								var url = 'https://restapi.amap.com/v3/geocode/geo?address='+
								address+
								'&output=JOSON&key=86d4d7bc1e061618f27e08655ce1b84c'
								that.axios.get(url)
								.then(function(res){
								var district = res.data.geocodes[0].district;
								
								//查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
								weather.getLive(district, function(err, data) {
									if (!err) {
										var str = [];
										str.push('<h4 >实时天气' + '</h4><hr>');
										str.push('<p>城市/区：' + data.city + '</p>');
										str.push('<p>天气：' + data.weather + '</p>');
										str.push('<p>温度：' + data.temperature + '℃</p>');
										str.push('<p>风向：' + data.windDirection + '</p>');
										str.push('<p>风力：' + data.windPower + ' 级</p>');
										str.push('<p>空气湿度：' + data.humidity + '</p>');
										str.push('<p>发布时间：' + data.reportTime );	
										var position = that.map.getCenter();
										position.lat = e.lnglat.lat;
										position.lng = e.lnglat.lng;
										position.Q = e.lnglat.lat;
										position.R = e.lnglat.lng;															
										var marker = new AMap.Marker({map: that.map, position: position});										
										var infoWin = new AMap.InfoWindow({
											content: '<div class="info" style="position:inherit;margin-bottom:0;">'+str.join('')+'</div><div class="sharp"></div>',
											isCustom:true,
											offset: new AMap.Pixel(0, -30)
										});
										infoWin.open(that.map, marker.getPosition());
										marker.on('mouseover', function() {
											infoWin.open(that.map, marker.getPosition());
										});
									}else{
										that.$message({message:"暂无该地区天气数据",type:"info"})
									}
								});
									//未来4天天气预报
									weather.getForecast('朝阳区', function(err, data) {
										if (err) {return;}
										var str = [];
										for (var i = 0,dayWeather; i < data.forecasts.length; i++) {
											dayWeather = data.forecasts[i];
											str.push(dayWeather.date+' <span class="weather">'+dayWeather.dayWeather+'</span> '+ dayWeather.nightTemp + '~' + dayWeather.dayTemp + '℃');
										}
										document.getElementById('forecast').innerHTML = str.join('<br>');
									});

								})
							}else{
								that.$message({message:"暂无该地区天气数据",type:"info"})
							}
						});

					})

				})


			}
		}
	}
</script>


<style type="text/css">
	html,body{
		height:100%;
	}
	.weather{
		width:5rem;
		display:inline-block;
		padding-left:0.5rem;
	}
	.info {
		padding: .5rem .75rem;
		margin-bottom: .5rem;
		border-radius: .25rem;
		position: fixed;
		top: .5rem;
		background-color: white;
		width: auto;
		min-width: 18rem;
		border-width: 0;
		right: .5rem;
		box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
	}
	.info hr {
		margin-right: 0;
		margin-left: 0;
		border-top-color: grey;
	}
</style>



