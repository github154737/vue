<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="map" v-popover:popover style="height: 100vh;width:85.8vw;z-index: 1;" >
                <el-popover
                    id="pop"
                    ref="popover"
                    placement="right-start"
                    title="属性"
                    width="250"
                    trigger="click"
                    v-model="visible"
                    >
                    <span>
                        名字：{{popName}}  <p></p>     
                        面积：{{popArea}} 平方千米 <p></p>
                        周长：{{popPerimeter}} 千米
                    </span>
                    <el-button slot="reference" type="goon" size="mini" style="display:none"></el-button>                                     
                </el-popover>
			</div>
			</el-main>
		</el-container>
	</div>
</template>


<script>

import {Map, View, Feature} from 'ol'
import { defaults, FullScreen, MousePosition, ScaleLine, ZoomSlider } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
import {Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
import {GeoJSON, WFS} from 'ol/format';
import TileWMS from 'ol/source/TileWMS'
import {Style, Fill as StyleFill, Stroke as StyleStroke, Circle as StyleCircle, Text as StyleText } from 'ol/style'
import { Circle as GeomCircle, Point as GeomPoint, LineString as GeomLineString, Polygon as GeomPolygon } from 'ol/geom'

export default {
    name: 'click4property',
    data () {
        return {
        map: null,
        clickTimes:0,//控制消除图层
        visible:false,//控制pop是否显示
        popName:'',
        popArea:0,
        popPerimeter:0
        }
    },
    methods: {
        createMap () {
        let _this = this

        //高德地图底图
        var gaodeMapLayer = new TileLayer({
            title: "高德地图",
            source: new XYZ({
                //style=6是卫星图 ,style=7为矢量路网，style=8为影像路网
                //scl设置标注还是底图，scl=1代表注记，scl=2代表底图（矢量或者影像）
                url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=0&style=7&x={x}&y={y}&z={z}',
                wrapX: false
            })
        });

        //新建Map实例
        this.map = new Map({
            target: 'map',
            layers:[gaodeMapLayer],
            view: new View({
            center: [104.10075122802735, 30.682664909344276],
            projection: 'EPSG:4326',
            zoom: 4,
            maxZoom: 20,
            minZoom:4
            }),
            controls:defaults({
                // 移除归属控件
                attribution:false,
                // 移除缩放控件
                zoom:false,
                // 移除旋转控件
                rotate:false
            }).extend([                     
                new FullScreen(),// 添加全屏控件                
                new MousePosition({// 添加坐标拾取控件                
                    coordinateFormat:createStringXY(6),  // 设置数据格式              
                    projection:'EPSG:4326'// 设置空间参考系统为'EPSG:4326'
                }),                
                new ScaleLine(),// 添加比例尺控件                
                new ZoomSlider(),// 滑块缩放控件                
                // new ZoomToExtent({// 缩放至特定位置控件
                //     extent:[                    
                //         12667718, 2562800,// 位置矩形的左下角坐标                    
                //         12718359, 2597725// 位置矩形的右上角坐标
                //     ]
                // })
            ])
        })

        this.map.on("click", this.mapClick);

        },

        loadWMS(){
            var that = this;
            // 实例化WMS图层对象（ol.layer.Tile，ol.source.TileWMS）
            this.wmsLayer = new TileLayer({
            source: new TileWMS({
                //WMS服务地址
                url: 'http://localhost:8081/geoserver/cite/wms',
                //图层等参数
                params: { 'LAYERS': 'cite:province_p'},
                //服务类型
                serverType: 'geoserver'
            })
        });
        
            //添加WMS地图图层
            // this.map.addLayer(this.wmsLayer);

            //创建一个查询条件
            const featureRequest = new WFS().writeGetFeature({
            srsName: "EPSG:3857", //这里的EPSG不要改为4326，可能无法显示
            featureNS: "http://www.opengeospatial.net/cite", //这里是工作空间中的命名空间url
            featurePrefix: "cite",  
            featureTypes: ["cite:province_p"], //你要查询的图层
            outputFormat: "application/json", //数据返回格式
            // filter: equalToFilter("name", '安徽省') //查询的属性与查询的值
            });

            //实例化一个矢量图层Vector作为绘制层
            var source = that.source = new VectorSource({
            //是否在地图水平坐标轴上重复
            wrapX: false
            });

            var vector = new VectorLayer({
                source: source
            });

            //将绘制层添加到地图容器中
            this.map.addLayer(vector);
            vector.setVisible(false)
            //发送请求，使用fetch和axios都可以
            fetch("http://localhost:8081/geoserver/wms",{
                method:'post',
                body:new XMLSerializer().serializeToString(featureRequest)
            }).then(function(res) {  
                return res.json();
            }).then(json => {                    
                var geoJson = new GeoJSON();
                const features = geoJson.readFeatures(json);
                source.addFeatures(features);
                this.map.getView().fit(source.getExtent()); //查询出数据以后跳转到目标位置
            });

        },

        mapClick(evt) {

            var that = this;
            
            var viewResolution = this.map.getView().getResolution();//获取分辨率
            var url = this.wmsLayer
            .getSource()
            .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:3857", {
            INFO_FORMAT: "application/json"
            });
                
            // 使用getFeatureInfoUrl获取点击层的要素
            fetch(url, {
                method: "GET"
            }).then(function(response) {
                return response.json();                          
            }).then(json => {
                if(json.numberReturned==0){
                    that.$message({message:"暂无此地区信息",type:"info"})
                    this.visible=false;
                }

                if (json.numberReturned) { 
                    this.clickTimes++;   
                    
                // 创建一个多变形
                var Polygon1 = new Feature({     
                        geometry: new GeomPolygon([json.features[0].geometry.coordinates[0][0]])                   
                    });
            
                    //设置样式信息
                    Polygon1.setStyle(new Style({
                        //填充色
                        fill: new StyleFill({
                            color: 'rgba(255,204, 51, 0.5)'
                        }),
                        //边线颜色
                        stroke: new StyleStroke({
                            color: 'rgba(255,204, 51, 1)',
                            width: 1
                        }),
                        //形状
                        image: new StyleCircle({
                            radius: 2,
                            fill: new StyleFill({
                                color: 'rgba(255,204, 51, 1)'
                            })
                        })
                    }));

                    //一次只能选中一个
                    if(this.clickTimes>1){
                        this.source1.clear();
                    }

                    // 创建矢量数据源
                    var source1 = this.source1 = new VectorSource({
                        features: [Polygon1]
                    });  

                    // 创建矢量图层             
                    var vector1= new VectorLayer({
                        source: source1
                    });
                    this.map.addLayer(vector1)
                        
                    this.popName=json.features[0].properties.name
                    this.popArea=(json.features[0].properties.area * 10000).toFixed(2)
                    this.popPerimeter=(json.features[0].properties.perimeter * 100).toFixed(2)                 
                    this.visible=true;
                }

            });
            }



    },
    mounted () {
        this.createMap()
        this.loadWMS()
    }
    
    }
</script>
 
 
<style>
    :root,
    :host {
      --ol-background-color: white;
      --ol-accent-background-color: #F5F5F5;
      --ol-subtle-background-color: rgba(128, 128, 128, 0.25);
      --ol-partial-background-color: rgba(255, 255, 255, 0.75);
      --ol-foreground-color: #333333;
      --ol-subtle-foreground-color: #666666;
      --ol-brand-color: #00AAFF;
    }
    
    .ol-box {
      box-sizing: border-box;
      border-radius: 2px;
      border: 1.5px solid var(--ol-background-color);
      background-color: var(--ol-partial-background-color);
    }
    
    .ol-mouse-position {
      bottom: 8px;
      right: 8px;
      position: absolute;
    }
    
    .ol-scale-line {
      background: var(--ol-partial-background-color);
      border-radius: 4px;
      bottom: 8px;
      left: 8px;
      padding: 2px;
      position: absolute;
    }
    
    .ol-scale-line-inner {
      border: 1px solid var(--ol-subtle-foreground-color);
      border-top: none;
      color: var(--ol-foreground-color);
      font-size: 10px;
      text-align: center;
      margin: 1px;
      will-change: contents, width;
      transition: all 0.25s;
    }
    
    .ol-scale-bar {
      position: absolute;
      bottom: 8px;
      left: 8px;
    }
    
    .ol-scale-bar-inner {
      display: flex;
    }
    
    .ol-scale-step-marker {
      width: 1px;
      height: 15px;
      background-color: var(--ol-foreground-color);
      float: right;
      z-index: 10;
    }
    
    .ol-scale-step-text {
      position: absolute;
      bottom: -5px;
      font-size: 10px;
      z-index: 11;
      color: var(--ol-foreground-color);
      text-shadow: -1.5px 0 var(--ol-partial-background-color), 0 1.5px var(--ol-partial-background-color), 1.5px 0 var(--ol-partial-background-color), 0 -1.5px var(--ol-partial-background-color);
    }
    
    .ol-scale-text {
      position: absolute;
      font-size: 12px;
      text-align: center;
      bottom: 25px;
      color: var(--ol-foreground-color);
      text-shadow: -1.5px 0 var(--ol-partial-background-color), 0 1.5px var(--ol-partial-background-color), 1.5px 0 var(--ol-partial-background-color), 0 -1.5px var(--ol-partial-background-color);
    }
    
    .ol-scale-singlebar {
      position: relative;
      height: 10px;
      z-index: 9;
      box-sizing: border-box;
      border: 1px solid var(--ol-foreground-color);
    }
    
    .ol-scale-singlebar-even {
      background-color: var(--ol-subtle-foreground-color);
    }
    
    .ol-scale-singlebar-odd {
      background-color: var(--ol-background-color);
    }
    
    .ol-unsupported {
      display: none;
    }
    
    .ol-viewport,
    .ol-unselectable {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    .ol-viewport canvas {
      all: unset;
    }
    
    .ol-selectable {
      -webkit-touch-callout: default;
      -webkit-user-select: text;
      -moz-user-select: text;
      user-select: text;
    }
    
    .ol-grabbing {
      cursor: -webkit-grabbing;
      cursor: -moz-grabbing;
      cursor: grabbing;
    }
    
    .ol-grab {
      cursor: move;
      cursor: -webkit-grab;
      cursor: -moz-grab;
      cursor: grab;
    }
    
    .ol-control {
      position: absolute;
      background-color: var(--ol-subtle-background-color);
      border-radius: 4px;
    }
    
    .ol-zoom {
      top: .5em;
      left: .5em;
    }
    
    .ol-rotate {
      top: .5em;
      right: .5em;
      transition: opacity .25s linear, visibility 0s linear;
    }
    
    .ol-rotate.ol-hidden {
      opacity: 0;
      visibility: hidden;
      transition: opacity .25s linear, visibility 0s linear .25s;
    }
    
    .ol-zoom-extent {
      top: 4.643em;
      left: .5em;
    }
    
    .ol-full-screen {
      left: .5em;
      top: .5em;
    }
    
    .ol-control button {
      display: block;
      margin: 1px;
      padding: 0;
      color: var(--ol-subtle-foreground-color);
      font-weight: bold;
      text-decoration: none;
      font-size: inherit;
      text-align: center;
      height: 1.375em;
      width: 1.375em;
      line-height: .4em;
      background-color: var(--ol-background-color);
      border: none;
      border-radius: 2px;
    }
    
    .ol-control button::-moz-focus-inner {
      border: none;
      padding: 0;
    }
    
    .ol-zoom-extent button {
      line-height: 1.4em;
    }
    
    .ol-compass {
      display: block;
      font-weight: normal;
      will-change: transform;
    }
    
    .ol-touch .ol-control button {
      font-size: 1.5em;
    }
    
    .ol-touch .ol-zoom-extent {
      top: 5.5em;
    }
    
    .ol-control button:hover,
    .ol-control button:focus {
      text-decoration: none;
      outline: 1px solid var(--ol-subtle-foreground-color);
      color: var(--ol-foreground-color);
    }
    
    .ol-zoom .ol-zoom-in {
      border-radius: 2px 2px 0 0;
    }
    
    .ol-zoom .ol-zoom-out {
      border-radius: 0 0 2px 2px;
    }
    
    .ol-attribution {
      text-align: right;
      bottom: .5em;
      right: .5em;
      max-width: calc(100% - 1.3em);
      display: flex;
      flex-flow: row-reverse;
      align-items: center;
    }
    
    .ol-attribution a {
      color: var(--ol-subtle-foreground-color);
      text-decoration: none;
    }
    
    .ol-attribution ul {
      margin: 0;
      padding: 1px .5em;
      color: var(--ol-foreground-color);
      text-shadow: 0 0 2px var(--ol-background-color);
      font-size: 12px;
    }
    
    .ol-attribution li {
      display: inline;
      list-style: none;
    }
    
    .ol-attribution li:not(:last-child):after {
      content: " ";
    }
    
    .ol-attribution img {
      max-height: 2em;
      max-width: inherit;
      vertical-align: middle;
    }
    
    .ol-attribution button {
      flex-shrink: 0;
    }
    
    .ol-attribution.ol-collapsed ul {
      display: none;
    }
    
    .ol-attribution:not(.ol-collapsed) {
      background: var(--ol-partial-background-color);
    }
    
    .ol-attribution.ol-uncollapsible {
      bottom: 0;
      right: 0;
      border-radius: 4px 0 0;
    }
    
    .ol-attribution.ol-uncollapsible img {
      margin-top: -.2em;
      max-height: 1.6em;
    }
    
    .ol-attribution.ol-uncollapsible button {
      display: none;
    }
    
    .ol-zoomslider {
      top: 4.5em;
      left: .5em;
      height: 200px;
    }
    
    .ol-zoomslider button {
      position: relative;
      height: 10px;
    }
    
    .ol-touch .ol-zoomslider {
      top: 5.5em;
    }
    
    .ol-overviewmap {
      left: 0.5em;
      bottom: 0.5em;
    }
    
    .ol-overviewmap.ol-uncollapsible {
      bottom: 0;
      left: 0;
      border-radius: 0 4px 0 0;
    }
    
    .ol-overviewmap .ol-overviewmap-map,
    .ol-overviewmap button {
      display: block;
    }
    
    .ol-overviewmap .ol-overviewmap-map {
      border: 1px solid var(--ol-subtle-foreground-color);
      height: 150px;
      width: 150px;
    }
    
    .ol-overviewmap:not(.ol-collapsed) button {
      bottom: 0;
      left: 0;
      position: absolute;
    }
    
    .ol-overviewmap.ol-collapsed .ol-overviewmap-map,
    .ol-overviewmap.ol-uncollapsible button {
      display: none;
    }
    
    .ol-overviewmap:not(.ol-collapsed) {
      background: var(--ol-subtle-background-color);
    }
    
    .ol-overviewmap-box {
      border: 1.5px dotted var(--ol-subtle-foreground-color);
    }
    
    .ol-overviewmap .ol-overviewmap-box:hover {
      cursor: move;
    }
    
    
    </style>
    
    