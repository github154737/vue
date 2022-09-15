<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="navigation" style="height: 100vh;width:85.8vw;z-index: 1;" >
				<div id="test">
					<Bus id="unBus" @click="ifbus = !ifbus;ifcar=false;ifriding=false;" v-if="ifbus ==false" style="position:relative;left:22%;top:8px;" 
					theme="multi-color" size="24" :fill="['#FFFFFF' ,'#2F88FF' ,'#FFF' ,'#b8e986']" :strokeWidth="3"/>

					<Bus id="doBus" @click="ifbus = !ifbus;ifcar=false;ifriding=false;" v-if="ifbus ==true" style="position:relative;left:22%;top:8px;" 
					theme="multi-color" size="24" :fill="['#FFFFFF' ,'#7ed321' ,'#FFF' ,'#b8e986']" :strokeWidth="3"/>

					<Car id="unCar" @click="ifcar = !ifcar;ifbus=false;ifriding=false;"  v-if="ifcar ==false" style="position:relative;left:37%;top:8px;" 
					theme="multi-color" size="24" :fill="['#ffffff' ,'#3D93FD' ,'#4a90e2' ,'#ffffff']" :strokeWidth="3"/>

					<Car id="doCar" @click="ifcar = !ifcar;ifbus=false;ifriding=false;" v-if="ifcar == true" style="position:relative;left:37%;top:8px;" 
					theme="multi-color" size="24" :fill="['#ffffff' ,'#7ed321' ,'#4a90e2' ,'#ffffff']" :strokeWidth="3"/>

					<Riding id="unRiding" @click="ifriding = !ifriding;ifcar=false;ifbus=false;" v-if="ifriding ==false" style="position:relative;left:52%;top:8px;" 
					theme="multi-color" size="24" :fill="['#ffffff' ,'#3D93FD' ,'#4a90e2' ,'#b8e986']" :strokeWidth="3"/>

					<Riding id="doRiding" @click="ifriding = !ifriding;ifcar=false;ifbus=false;" v-if="ifriding ==true" style="position:relative;left:52%;top:8px;" 
					theme="multi-color" size="24" :fill="['#ffffff' ,'#b8e986' ,'#4a90e2' ,'#b8e986']" :strokeWidth="3"/>

					<br><br>	
					<el-input
						id="start"
						placeholder="请输入起点"
						v-model="start"
						prefix-icon="el-icon-search"
						clearable>
					</el-input>
					<p></p>
					<el-input
						id="ending"
						placeholder="请输入终点"
						v-model="ending"
						prefix-icon="el-icon-search"
						clearable>
					</el-input><p></p>
					<el-button v-if="ifriding==true" class="btn" type="primary" round @click="startRiding">走路去</el-button>
					<el-button v-if="ifcar==true" class="btn" type="primary" round @click="startCar">开车去</el-button>
					<el-button v-if="ifbus==true" class="btn" type="primary" round @click="startBus">坐公交</el-button>
				</div>	

				<!-- panel是导航的pop框 -->
				<div id="panel" style="display: none;"></div>

				<div id="checkBox" style="position:absolute;top:15px;right:30px;z-index:2;">
					<el-checkbox-group v-model="checkboxGroup"  @change="changeLayer" >
					<el-checkbox-button v-for="option in options" :label="option" :key="option" >{{option}}</el-checkbox-button>
					</el-checkbox-group>
				</div>

			</div>
			

			</el-main>
		</el-container>
	</div>
</template>


<script>
    //引入高德地图
	import AMapLoader from '@amap/amap-jsapi-loader'
	//引入图标库
	import {Bus,Car,Riding} from '@icon-park/vue'
	


	export default {
		name: 'navigation',
		components: {
			Bus,//图标库的bus图标
			Car,
			Riding		
		},
		data() {
			return {
                map: null, //地图实例
				start:'',
				ending:'',
				ifriding : true,
				ifbus : false,
				ifcar : false,
				checkboxGroup: [''],
				options : ['卫星','路网','路况','空气'],//checkBox选项
				ifShowPanel:false,
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
						"AMap.Geocoder",//地理编码	
						"AMap.ControlBar",
						"AMap.ContextMenu",	//提供图面添加右键菜单的方式
						"AMap.InfoWindow",	//信息窗体	
						"AMap.Autocomplete"//输入提示
					], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
				}).then((AMap) => {
						var  that = this;						
						this.map = new AMap.Map("navigation", { //设置地图容器id
							viewMode: "3D", //是否为3D地图模式
							zoom: 10, //初始化地图级别
							center: [116.397128, 39.916527], //初始化地图中心点位置
						});	


						//实时路况图层
						var trafficLayer = new AMap.TileLayer.Traffic({
							zIndex: 3,
							zooms: [2, 22],
							opacity:1
						});
						this.map.trafficLayer=trafficLayer;
						trafficLayer.setMap(this.map);
						trafficLayer.hide();

						// 卫星图层
						var satellite = new AMap.TileLayer.Satellite({
							map: this.map,
							zIndex: 2,
							opacity: 1
						});
						this.map.satellite=satellite;
						satellite.hide();

						//输入提示,两个input框都需要绑定
						var auto1 = new AMap.Autocomplete({
							input: "start"
						});
						var auto2 = new AMap.Autocomplete({
							input: "ending"
						});

						//地图控件
						var scale = new AMap.Scale(),
						controlBar = new AMap.ControlBar({
							position: {
								bottom: '-180px',
								right: '0px',
							},
							showZoomNum: true //显示zoom值
						})
						this.map.addControl(scale);
						this.map.addControl(controlBar);

						var geocoder = new AMap.Geocoder({
							city: "010", //城市设为北京，默认：“全国”
							radius: 1000 //范围，默认：500
						});						
					
						this.map.on('rightclick', function(e) {		
							var lnglat = e.lnglat.lng + ',' + e.lnglat.lat
							// console.log(lnglat);						
							geocoder.getAddress(lnglat, function(status, result) {
								if (status === 'complete') {
									//获得逆地理编码结果
									var address = result.regeocode.formattedAddress;
									//注意这里的key要用web服务的key，web端的key没有这个服务
									var url = 'https://restapi.amap.com/v3/geocode/geo?address='+
									address+
									'&output=JOSON&key=86d4d7bc1e061618f27e08655ce1b84c'
									that.axios.get(url)
									.then(function(res){
									var district = res.data.geocodes[0].formatted_address;
									// console.log(that.start);

									//信息窗体
									var content = [
										"<div style=\'z-index:3\'>",
										"<div id=\'infowindow\' style=\'z-index:3\'>"+district+"</div>",	
										"<button class=\'btn\' onclick="+
										"document.getElementById(\"start\").value=document.getElementById(\"infowindow\").innerText"+
										">设为起点</button>",
										"<button class=\'btn\' onclick="+
										"document.getElementById(\"ending\").value=document.getElementById(\"infowindow\").innerText"+
										">设为终点</button>",
									];

									// 创建 infoWindow 实例	
									that.map.infoWindow = new AMap.InfoWindow({
										// anchor: 'buttom-left',
										offset: new AMap.Pixel(0, -20),//偏移
										content: content.join("<br>")
									});
									that.map.infoWindow.open(that.map,e.lnglat);


									})
								}							
							})																					
						});


				})


			},

			//步行导航方法
			startRiding(){
				var that=this;
				this.start=document.getElementById("start").value
				this.ending=document.getElementById("ending").value
				AMapLoader.load({
						key: "e7a70459f8b1ecf94dc63aff142c24c0",
						version: "1.4.0",
						resizeEnable: true,
						plugins: [	
							"AMap.Walking",//步行导航
						], 
					}).then((AMap) => {
						// 步行导航
						var walking = new AMap.Walking({
							map: that.map,
							panel: "panel"
						}); 
						walking.search([
							{keyword: that.start,city:'北京'},
							{keyword: that.ending,city:'北京'}
						], function(status, result) {
							if (status === 'complete') {
								document.getElementById('panel').style.display="block";	
								that.$message({message:"步行导航完成",type:"success"})
							} else {
								that.$message({message:"步行路程过长，建议选择公交或驾车出行！",type:"info"})
							}
							that.map.infoWindow.close();
						});						

					})
			
			},

			//驾车导航方法
			startCar(){
				var that=this;
				this.start=document.getElementById("start").value
				this.ending=document.getElementById("ending").value
				AMapLoader.load({
						key: "e7a70459f8b1ecf94dc63aff142c24c0",
						version: "1.4.0",
						resizeEnable: true,
						plugins: [	
							"AMap.Driving",//驾车导航
						], 
					}).then((AMap) => {
						//构造路线导航类
						var driving = new AMap.Driving({
								map: that.map,
								panel: "panel"
							}); 

						// 根据起终点名称规划驾车导航路线
						driving.search([
							{keyword: that.start,city:'北京'},
							{keyword: that.ending,city:'北京'}
						], function(status, result) {
							if (status === 'complete') {
								document.getElementById('panel').style.display="block";	
								that.$message({message:"驾车导航完成",type:"success"})
							} else {
								that.$message({message:"驾车导航失败！请检查地点是否正确",type:"info"})
							}
							that.map.infoWindow.close();
						});				
					})


			},

			//公交出行方法
			startBus(){
			var that=this;
				this.start=document.getElementById("start").value
				this.ending=document.getElementById("ending").value
				AMapLoader.load({
						key: "e7a70459f8b1ecf94dc63aff142c24c0",
						version: "1.4.0",
						resizeEnable: true,
						plugins: [	
							"AMap.Transfer",//公交导航
						], 
					}).then((AMap) => {
						// that.ifShowPanel=true;
						var transOptions = {
							map: that.map,
							city: '北京市',
							panel: 'panel',                           
							policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
						};

						//构造公交换乘类
						var transfer = new AMap.Transfer(transOptions);

						//根据起、终点名称查询公交换乘路线
						transfer.search([
							{keyword: that.start,city:'北京'},
							{keyword: that.ending,city:'北京'}
						], function(status, result) {							
							if (status === 'complete') {
								document.getElementById('panel').style.display="block";																							
								that.$message({message:"公交导航完成",type:"success"})								
							} else {
								that.$message({message:"公交导航失败！请检查地点是否正确",type:"info"})
							}
							that.map.infoWindow.close();
						});					
					})
			},

			//切换图层方法
			changeLayer(val){
				function isInArray(arr,value){
					for(var i = 0; i < arr.length; i++){
						if(value === arr[i]){
							return true;
						}
					}
					return false;
				}
				if(isInArray(val,'卫星')){
					this.map.satellite.show();					
				}else{
					this.map.satellite.hide();	
				}

				if(isInArray(val,'路况')){
					this.map.trafficLayer.show();					
				}else{
					this.map.trafficLayer.hide();	
				}

				if(isInArray(val,'路网')){					
					this.map.satellite.setOpacity(0.7);
				}else{
					this.map.satellite.setOpacity(1);
				}
				
				
			},

			
			
		}//method
	}
</script>


<style type="text/css">
	html,body{
		height:100%;
	}
	#test {
		position: relative;
		top:15px;
		left:15px;
		height:30vh;
		width:21vw;
		background-color: #3D93FD;
		z-index: 2;
	}
	#start {
		position: relative;
		left:50px;
		height:5vh;
		width:16vw;
		background-color: #3587EB;
	}
	#ending {
		position: relative;
		left:50px;
		height:5vh;
		width:16vw;
		background-color: #3587EB;
	}
	#panel {		
		position: relative;
		background-color: white;
		overflow: auto;
		height: 65vh;
		top: 15px;
		left: 15px;
		width: 21vw;
		z-index: 3;
	}
	#panel .amap-call {
		background-color: #009cf9;
		border-top-left-radius: 4px;
		   border-top-right-radius: 4px;
	}
	#panel .amap-lib-walking {
		border-bottom-left-radius: 4px;
		   border-bottom-right-radius: 4px;
		overflow: hidden;
	}
	/* input内部字体样式 */
	.el-input__inner{
	color:#ffffff;
	}
	.el-input__prefix el-icon-search{
		position: relative;
		left:0px;
	}

	.btn {
		position: relative;
		display:block;
		margin:0 auto;
		/* display: inline-block; */
		font-weight: 400;
		text-align: center;
		white-space: nowrap;
		vertical-align: middle;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		border: 1px solid transparent;
		transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
		background-color: transparent;
		background-image: none;
		color: #fff;
		border-color: #559FFB;
		background-color: #579ff8;
		padding: .25rem .25rem;
		line-height: 1.5;
		border-radius: 1rem;
		-webkit-appearance: button;
		cursor:pointer;
	}

	.btn:hover {
		color: #fff;
		background-color: #65c2fd;
		border-color: #65c2fd
	}

	.btn:hover {
		text-decoration: none
	}
	.btn:focus {
		outline: 0;
		box-shadow: none;
	}

</style>


