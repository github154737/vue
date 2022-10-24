<!-- 做一个可以画图形(完成)、
    删除图形(完成)、
    新建、修改属性(完成)、     
    缓冲区分析、
    拓扑分析、
    裁剪图形、
    点击保存自动入库的底图(完成) -->
<template>
	<div>		
		<el-container>
			<el-main style="padding: 0;">
			<!-- 用来显示地图 -->
			<!-- 可以不写宽度，但一定要有高度 -->
			<div id="editMap" class="editMap" style="height: 100vh;width:85.8vw;z-index: 1;" >

        <!-- <el-button @click="test"></el-button> -->
      
                <!-- 信息form -->
                <div style="z-index:2;position:absolute;height:300px;width:500px;top:0px;right:0px;
                      background-color: white;opacity:0.97;overflow: auto;">
                    <el-form :model="dynamicValidateForm"  ref="ruleForm" label-width="auto" size="small">


                    <el-table
                    :data="dynamicValidateForm"
                    border
                    style="width: 100%"
                    class="add_table"
                    highlight-current-row
                    >

                    <!-- 序号 -->
                    <el-table-column label="序号" width="40" align="center" property="id">
                        <template slot-scope="scope">
                            
                                <span class="table-inner" >{{ dynamicValidateForm[scope.$index].id  }}</span>
                           
                        </template>
                    </el-table-column>

                    <!-- 类型 -->
                    <el-table-column
                        property="type"
                        label="几何图形类型"
                        align="center"
                        width="150px"
                    >
                        <template slot-scope="scope">

                        <el-select v-model="dynamicValidateForm[scope.$index].type" 
                        placeholder="几何图形类型" 
                        style="left:0px;"
                        :disabled="dynamicValidateForm[scope.$index].disableInput">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                       
                        </template>
                    </el-table-column>

                    <!-- 属性 -->
                    <el-table-column property="geoProperty" label="属性" align="center" width="auto" >
                      <template slot-scope="scope">
                        <!-- v-model="geoProperty"下面空位置 -->
                            <el-input
                            v-model.lazy.trim="dynamicValidateForm[scope.$index].geoProperty"
                            placeholder="属性(名称)"
                            :disabled="dynamicValidateForm[scope.$index].disableInput"
                            ></el-input>
                      </template>
                    </el-table-column>

                    <!-- 编辑/删除 -->
                    <el-table-column
                        prop="action"
                        label="操作"
                        align="center"
                        width="140px"
                    >
                    <template slot-scope="scope">
                    <!-- 保存的时候表单检验 -->
                        <el-button-group>
                          <el-button type="primary" size="mini"  @click="editFeature(scope.$index)">编辑</el-button>
                          <el-button type="danger" @click="deleteFeature(scope.$index)" size="mini">删除</el-button>
                        </el-button-group>
                    </template>
                    </el-table-column>

                    </el-table>
                   
                </el-form>



                </div>

                <!-- 装新增、上传按钮的div -->
                <div style="position:absolute;right:0px;top: 300px;width:500px;height:30px;z-index: 2;opacity: 0.97;background-color: white;">

                  <!-- 新增按钮 -->
                  <el-button
                  size="small"
                  type="primary"
                  @click="addFormItem"
                  style="margin-bottom:10px"
                  >
                  新增
                  </el-button>

                  <!-- 保存按钮 -->
                  <el-button type="success" size="small" @click="postData2DB">上传至数据库</el-button>
                </div>

            </div>
            </el-main>
        </el-container>
	</div>
</template>


<script>
import {Map, View, Feature} from 'ol'
import { defaults, FullScreen, MousePosition, OverviewMap, ScaleLine, ZoomSlider, ZoomToExtent } from 'ol/control';
import { createStringXY } from 'ol/coordinate';
import { getArea ,getLength } from "ol/sphere";
import XYZ from 'ol/source/XYZ'
import VectorSource from 'ol/source/Vector'
// import Cluster from 'ol/source/Cluster'
import {Vector as VectorLayer, Tile as TileLayer } from 'ol/layer'
import {GeoJSON, WFS} from 'ol/format';
// import TileWMS from 'ol/source/TileWMS'
// import {Style, Fill as StyleFill, Stroke as StyleStroke, Circle as StyleCircle, Text as StyleText } from 'ol/style'
import { Circle, Point, LineString , Polygon } from 'ol/geom'
import { Draw , Select , Modify} from 'ol/interaction'
import { createRegularPolygon } from 'ol/interaction/Draw';//不知道为什么要这样引入才行

// import {
//   and as andFilter,
//   equalTo as equalToFilter,
//   like as likeFilter,
// } from 'ol/format/filter';

export default {
    name: 'edit',
    data () {
        return {
        map: null,
        options: [{
          value: 'None',
          label: '无'
        }, {
          value: 'Point',
          label: '点'
        },{
          value: 'StraightLine',
          label: '直线(点击)'
        },{
          value: 'LineString',
          label: '曲线(拖动)'
        }, {
          value: 'Polygon',
          label: '多边形'
        }, {
          value: 'Square',
          label: '正方形'
        },{
          value: 'Circle',
          label: '圆(维护中)'
        },{
          value: 'Area',
          label: '区(自动闭合)'
        }],
        I:0,//全局I，用于控制绑定事件时候的i
        source:null,
        vector:null,
        feature:null,//最近一次画的图形
        draw:null,
        select:null,//交互控件
        modify:null,//修改控件
        coordinate:[],//图形坐标
        // geoProperty:[],
        ruleForm: {
        geoProperty: '',
        },
        dynamicValidateForm:
            [{
                id:0,
                type:'None',
                geoProperty:'',
                disableInput:true,
                geoData:[],
        }],
        activeItem:0,//当前正在被编辑的item
        drawObjectList:[],//draw对象列表
        sourceObjectList:[],//source对象列表
        layerObjectList:[], //vector对象列表 
        

        }
    },
    methods: {
        createMap () {
            var that=this;
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
            target: 'editMap',
            layers:[gaodeMapLayer],
            zIndex:2,
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
            ])
        })

        this.source = new VectorSource({
            wrapX: false 
        });
        this.source.sourceId = 0;
        // this.sourceObjectList.push(this.source);//加入列表

        this.vector= new VectorLayer({
            source: this.source,
            zIndex:3,
        });
        this.map.addLayer(this.vector)
        // console.log(this.vector);
        
        this.draw = new Draw();
        this.draw.drawId = 0;
        // this.drawObjectList.push(this.draw);//加入列表

        this.select = new Select();//添加交互控件
        this.map.addInteraction(this.select);

        this.map.addInteraction(this.draw);


        },

        //新增表单行
        addFormItem(){
          var that = this;
          async function t1(){
            that.dynamicValidateForm.push({
                id: that.dynamicValidateForm[that.dynamicValidateForm.length -1].id+1,
                type:'None',
                geoProperty:'',
                disableInput:true,
                geoData:[],
            });

          } 
          //然后把除了activeItem所有全部禁用
          async function t2(){
            that.dynamicValidateForm.forEach(item => {
                  item.disableInput=true;                  
              });
          }
          async function t3(){
            that.dynamicValidateForm[that.activeItem].disableInput=false;               
          }
          
          t1();
          t2();
          t3();
        },


        //把数据传入数据库
        postData2DB(){
          var _that = this;
          this.axios({
            method:"post",
            url:"geoDataApi",
            data:{
              dataList:this.dynamicValidateForm
            },
          })
          .then(function (response) {
              console.log(response.status);
              if(response.status ==200){
                _that.$message({message:"入库成功",type:"success"});
              }
              else{
                _that.$message({message:"入库失败，请检查后再试",type:"error"});
              }
          })
          .catch(function (error) {
              console.log(error);
              _that.$message({message:"入库失败，请检查后再试",type:"error"});
          });

        },


        test(){
            // console.log(this.dynamicValidateForm); 
            // console.log(this.sourceObjectList); 
            // console.log(this.layerObjectList);
            // console.log(this.dynamicValidateForm);
            console.log(this.dynamicValidateForm);              
        },

        //编辑按钮
        editFeature(index){
          var that=this;
          this.activeItem=index;  

          this.map.removeInteraction(this.draw);
          async function t1(){//全部disable
            that.dynamicValidateForm.forEach(item => {
                  item.disableInput=true;                  
              });
          } 

          async function t2(indata){
            that.dynamicValidateForm[indata].disableInput=false;
          }

          async function t3(){            
            that.source = that.sourceObjectList[index];
            that.draw = that.drawObjectList[index];
            // that.vector.setSource(that.source);
            // that.map.addInteraction(that.draw);
            that.vector = that.layerObjectList[index];
            // that.map.addLayer(that.layerObjectList[index]);
          }
          
          //如果还没有type，正要去选的话
          if(this.dynamicValidateForm[index].type == "None"){
            // console.log('没有值，正要去选');
            t1();
            t2(index);
          }
          //已经有值，现在点击是为了去编辑那一个图层
          else{
            t1();
            t2(index);
            t3();
            this.map.addInteraction(this.draw);
          }


        },

        //删除按钮
        deleteFeature(index){
            var that = this;
            //删除最近一次画的图形
            this.vector.getSource().removeFeature(this.feature);
            this.feature = null;
            //删除表单item
            this.dynamicValidateForm.splice(index,1);

            //然后把对应的object列表里面的也删除
            this.drawObjectList.splice(index,1);
            this.sourceObjectList.splice(index,1);
            this.layerObjectList.splice(index,1);

            //把列表后面的id全部改变
            this.dynamicValidateForm.forEach(data => {
              if(data.id>index){
                data.id = data.id - 1;
              }
            });
            this.drawObjectList.forEach(draw => {
              if(draw.drawId>index){
                draw.drawId = draw.drawId - 1;
              }
            });
            this.sourceObjectList.forEach(source => {
              if(source.sourceId>index){
                source.sourceId = source.sourceId - 1;
              }
            });
            this.layerObjectList.forEach(layer => {
              if(layer.vectorId>index){
                layer.vectorId = layer.vectorId - 1;
                layer.zIndex = layer.zIndex -1;
              }
            });
            
        },

    },


    watch:{
        //监听画哪种图形 监听的是计算属性的值      
        newDynamicValidateForm : {
          handler : function (newVal, oldVal) {
            // console.log(this.drawObjectList)
            var that = this;

            //比对哪个type变了
            for(var i=0;i<oldVal.length;i++){                         
              //如果之前是None，也就是新建的,那就新建draw和source
              if(oldVal[i].type !== newVal[i].type && oldVal[i].type == 'None'){
                this.I = i;
                //先创建一个source并加入到list
                var source = new VectorSource({
                    wrapX: false 
                });
                source.sourceId = i;
                this.sourceObjectList.push(source);//加入列表
                this.source = source;

                //创建layer
                var vector= new VectorLayer({
                    source: source,
                    zIndex:i+4,
                });
                vector.vectorId = i;
                this.layerObjectList.push(vector);
                this.vector = vector;
                this.map.addLayer(vector)

                //然后根据类型创建draw                
                //实例化交互绘制类对象并添加到地图容器中
                var draw ;
                if (newVal[i].type !== "StraightLine" && (newVal[i].type !== 'None' 
                && newVal[i].type!=='') &&newVal[i].type !== "Square"
                && newVal[i].type !== "Area" &&newVal[i].type !== "Polygon") {
                    draw = new Draw({
                        source: source,
                        type: newVal[i].type,
                        //按住键盘的Shift键来触发手绘
                        freehand: true, // true: 拖拽画图; false:点击画图                        
                    });                    
                
                }
                //点击画直线
                if (newVal[i].type == "StraightLine") {
                    draw = new Draw({
                        source: source,
                        type: "LineString",
                        freehand:false ,
                        
                    });
                                                      
                }
                //点击画多边形
                if (newVal[i].type == "Polygon") {
                    draw = new Draw({
                        source: source,
                        type: "Polygon",
                        freehand:false ,
                        
                    });
                                                    
                }
                //点击画区
                if (newVal[i].type == "Area") {
                    draw = new Draw({
                        source:source,
                        type: "Polygon",
                        freehand: true,
                        
                    });
                                                     
                }
                //正方形
                if (newVal[i].type == "Square") {
                    var geometryFunction = new createRegularPolygon(4);
                    draw = new Draw({
                        source: source,
                        type: 'Circle',
                        geometryFunction: geometryFunction,
                        
                    });
                    
                }
                //draw创建完以后
                if(newVal[i].type !== "None" && newVal[i].type !== ''){
                    this.map.addInteraction(draw); 
                    draw.drawId = newVal[i].id;
                    this.draw = draw;
                    this.drawObjectList.push(draw);
                    // this.draw = draw;
                }
                
                // 绘制结束时触发的事件
                //注意这里只是绑定事件，里面的变量和上下文不一样，比如i
                this.draw.on('drawend', function(e) {
                    that.feature = e.feature;
                    const geometry = e.feature.getGeometry();

                    //转换为geojson,添加到对应数组中
                    let featureGeoJson = JSON.parse(new GeoJSON().writeFeature(e.feature));
                    that.dynamicValidateForm[that.I].geoData.push(featureGeoJson);                  
                    // console.log(featureGeoJson);

                    //计算面积和长度
                    var area = getArea(geometry);
                    var geoLength = getLength(geometry);

                    if (geoLength > 100) {
                      geoLength = Math.round((geoLength / 1000) * 100) / 100 + ' ' + 'km'
                    } else {
                      geoLength = Math.round(geoLength * 100) + ' ' + 'km'
                    }  
                    
                    var output;
                    if (area > 10000) {
                        output = (Math.round(area / 1000000 * 100) / 100) + ' ' + '万平方千米';
                    } else {
                        output = (Math.round(area * 100) / 100) + ' ' + '万平方千米';
                    }
                    // console.log("area="+output)
                   
                    // let pointArr = geometry.getCoordinates()
                    // that.coordinate.push(pointArr)
                    // console.log("coordinate="+that.coordinate);
                    // that.map.removeInteraction(that.draw)
                })

              }
              //选完以后又改变类型且不是None的
              else if(oldVal[i].type !== newVal[i].type && oldVal[i].type !== "None" && newVal[i].type !== "None"){
                this.drawObjectList[i].type = newVal[i].type
                //这里还要改
              }
              //变成None
              else if(oldVal[i].type !=="None" && newVal[i].type == "None"){
                this.map.removeInteraction(this.draw);
              }


            }

          },
          immediate : true //初始化页面后立即监听
        } , 


    },

    computed:{
      //因为监听对象变化新旧值是一样的，就用计算属性过渡
      newDynamicValidateForm : function () {
        return JSON.parse(JSON.stringify(this.dynamicValidateForm))
      } , 
    },

    mounted () {
        this.createMap()
    }
    
    }
</script>
 
<style scoped>
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
.editMap >>> .el-input__inner{
	color:#040000;
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

