<!-- 



<template>
        <div style="margin: 0px;padding: 0px">
            <div id="panel"></div>
            <div
                    :id="mapId"
                    style="width:100%;height:80vh"
                    class="m-map"/>
            <a-button @click="buildMarker">添加标记</a-button>
            <a-button @click="buildTools">添加工具栏</a-button>
            <a-button @click="buildDriving">路线规划</a-button>
        </div>
</template>
 
<script>
    export default {
        name:'test',
        data () {
            return {
                mapId: 'mapId', // 地图id，多次调用该地图组件时，id必须动态生成
                map: null
            }
        },
        watch: {
            // 经纬度
            point: function (val) {
                this.map.setCenter(val)
                this.marker.setPosition(val)
            }
        },
        mounted () {
        },
        created () {
            console.log('create begin')
            this.createMap()
            console.log('create end')
        },
        methods: {
            createMap () {
                const _this = this
                this.mapId = `map${Math.random().toString().slice(4, 6)}`
                window.onMapLoad = function () {
                    console.log('window.AMap', window.AMap)
                    const map = new window.AMap.Map(_this.mapId, {
                        resizeEnable: true, // resizeEnable: true, //是否监控地图容器尺寸变化
                        zoom: 11, // zoom:11, //初始化地图层级
                        center: [ 116.397428, 39.90923 ]// center: [116.397428, 39.90923] //初始化地图中心点
                    })
                    _this.map = map
                }
                const url = 'https://webapi.amap.com/maps?v=1.4.15&key=e7a70459f8b1ecf94dc63aff142c24c0&callback=onMapLoad'
                const jsapi = document.createElement('script')
                jsapi.charset = 'utf-8'
                jsapi.src = url
                document.head.appendChild(jsapi)
            },
            createMapTools () {
                const self = this
                // 地图id，多次调用该地图组件时，id必须动态生成
                self.id = `map${Math.random().toString().slice(4, 6)}`
 
                // 封装回调函数，为了防止与其他地方定义的load冲突，最好重命名，如onmaploaded
                window.onmaploaded = () => {
                    // 地图基础控件添加，传递的第一个参数是DOM元素的id
                    const map = new window.AMap.Map(self.id, {
                        // resizeEnable: true, //是否监控地图容器尺寸变化
                        // zoom:11, //初始化地图层级
                        // center: [116.397428, 39.90923] //初始化地图中心点
                        resizeEnable: true,
                        zoom: 11,
                        center: self.point
                    })
                    // 地图图面
                    self.map = map
 
                    // 同时引入工具条插件
                    window.AMap.plugin(['AMap.ToolBar', 'AMap.Driving'], () => {
                        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                        const toolbar = new window.AMap.ToolBar()
                        map.addControl(toolbar)
 
                        // 创建地图点标记：
                        const marker = new window.AMap.Marker({
                            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                            position: self.point
                        })
                        self.marker = marker
                        // 将创建好的地图点标记控件 添加到地图map
                        marker.setMap(map)
                        console.log('----------------------')
                        // 构造路线导航类
                        var driving = new window.AMap.Driving({
                            map: map,
                            panel: 'panel'
                        })
                        // 根据起终点名称规划驾车导航路线
                        driving.search([
                            { keyword: '北京市地震局(公交站)', city: '北京' },
                            { keyword: '亦庄文化园(地铁站)', city: '北京' }
                        ], function (status, result) {
                            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                            if (status === 'complete') {
                                console.success('绘制驾车路线完成')
                            } else {
                                console.error('获取驾车数据失败：' + result)
                            }
                        })
                    })
                }
            },
            buildMarker () {
                var marker = new window.AMap.Marker({
                    position: new window.AMap.LngLat(116.39, 39.9),
                    title: '北京'
                })
                this.map.add(marker)
            },
            buildTools () {
                window.AMap.plugin(['AMap.ToolBar'], () => { // 同时引入工具条插件
                    // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
                    const toolbar = new window.AMap.ToolBar()
                    this.map.addControl(toolbar)
                })
            },
            buildDriving () {
                const _this = this
                window.AMap.plugin(['AMap.Driving'], () => {
                    var driving = new window.AMap.Driving({
                        map: _this.map,
                        panel: 'panel'
                    })
                    // 根据起终点名称规划驾车导航路线
                    driving.search([
                        { keyword: '北京市地震局(公交站)', city: '北京' },
                        { keyword: '亦庄文化园(地铁站)', city: '北京' }
                    ], function (status, result) {
                        // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                        if (status === 'complete') {
                            console.log('绘制驾车路线完成')
                        } else {
                            console.log('获取驾车数据失败：' + result)
                        }
                    })
                })
            }
        }
    }
</script>
 
<style>
 
</style> -->

















<template>
	<div class="content">
 
		<!-- 地图实例 -->
		<div class="Map">
			<IndexMap></IndexMap>
		</div>
	</div>
</template>
 
<script>
	import IndexMap from "../components/map/IndexMap.vue"
	export default {
		name: 'test',
		components: {
			IndexMap
		},
		data() {
			return {
 
			}
		},
		methods: {
 
		}
	}
</script>

