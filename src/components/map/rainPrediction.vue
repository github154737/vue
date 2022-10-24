<!-- 构建一个能够通过点击获取历史降雨、流量及预测的页面
1.以省或市为范围，加载对应的wms
2.点击以后获取降雨及流量数据（找开放接口）
3.数据绑定echart
4.新渲染的echart以pop的形式呈现 -->

<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="rainPredictMap"  style="height: 100vh;width:85.8vw;z-index: 1;" >
        <div v-show="echartShow" style="position: absolute;background-color:aliceblue;height: 75vh;
                                top:100px;width:60vw;z-index: 2;left:350px;opacity: 90%;">
          <el-button size="mini"  @click="closePop" style="z-index:4;position:absolute;right:105px;top:0px;">关闭图表</el-button>    
          <div id="echart"  style="position: relative;height: 70vh;
                                 top:0px;width:60vw;z-index: 3;left:0px;">
          </div>  
                                  
        </div>

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
    name: 'rainPrediction',
    data () {
        return {
        map: null,
        rainData:[],
        initYear:0,
        initMonth:0,
        initDay:0,
        station:0,
        echartShow:false,

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
            target: 'rainPredictMap',
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

        //绑定点击事件
        this.map.on("click", this.clickEchart);


        },

        loadEchart(){
            var chartDom = document.getElementById('echart');
            var myChart = this.$echarts.init(chartDom);
            var option;

            let base = +new Date(this.initYear, this.initMonth, this.initDay);//这里改为第一行
            let oneDay = 24 * 3600 * 1000;
            let data = [[base, 0]];//这里改为第一行
            for (let i = 1; i < this.rainData.length; i++) {
              let now = new Date((base += oneDay));
              data.push([+now, this.rainData[i]/10]);
            }
            console.log(data);
            
            option = {
              tooltip: {
                trigger: 'axis',
                position: function (pt) {
                  return [pt[0], '10%'];
                }
              },
              title: {
                left: 'center',
                text: '降雨数据(来源于站点'+this.station+")"
              },
              toolbox: {
                feature: {
                  dataZoom: {
                    yAxisIndex: 'none'
                  },
                  restore: {},
                  saveAsImage: {}
                }
              },
              xAxis: {
                name:"日期",
                type: 'time',
                boundaryGap: false
              },
              yAxis: {
                name: '降雨量(mm)',
                type: 'value',
                boundaryGap: [0, '100%']
              },
              dataZoom: [
                {
                  type: 'inside',
                  start: 0,
                  end: 20
                },
                {
                  start: 0,
                  end: 20
                }
              ],
              series: [
                {
                  name: 'RainFall',
                  type: 'line',
                  smooth: true,
                  symbol: 'none',
                  areaStyle: {},
                  data: data
                }
              ]
            };

            option && myChart.setOption(option);

        },

        //获取点击地方的降雨数据生成echart
        clickEchart(evt){
          var that = this;
          console.log(evt.coordinate);
          var lng = evt.coordinate[0];
          var lat = evt.coordinate[1];
          
          this.axios.get('/rainDataApi/'+lat+"/"+lng+"/"+ 1 +"/"+1)
          .then(function(res){
              console.log(res.data[0]);
              that.station=res.data[0][1];
              that.initYear=res.data[0][2];
              that.initMonth=res.data[0][3];
              that.initDay=res.data[0][4];
              that.echartShow=true;
              var rainFall = res.data.map(function(elt) { return elt[5]; });
              console.log(rainFall);
              that.rainData = rainFall;
              that.loadEchart();
          })

          
        },

        closePop(){
          this.echartShow=false;

        },




    },
    mounted () {
        this.createMap();

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
    
    