<template>
    <div style="width:800px;height:620px;">
         <div id='container' style="width:800px;height:620px;"></div>
        <div class='info'>操作说明：圆和矩形通过拖拽来绘制，其他覆盖物通过点击来绘制</div>
        <div class="input-card" style='width: 24rem;'>
            <div class="input-item" >
            <input type="radio" name='func' checked="" value='marker'><span class="input-text">画点</span>
            <input type="radio" name='func' value='polyline'><span class="input-text">画折线</span>
            <input type="radio" name='func' value='polygon'><span class="input-text" style='width:5rem;'>画多边形</span>
            </div>
            <div class="input-item">
            <input type="radio" name='func' value='rectangle'><span class="input-text">画矩形</span>
            <input type="radio" name='func' value='circle'><span class="input-text">画圆</span>
            </div>
            <div class="input-item" >
                <input id="clear" @click="clear"  type="button" class="btn" value="清除" />
                <input id="close" @click="close" type="button" class="btn" value="关闭绘图" />

            </div>
        </div>



    </div>
</template>


<script>
import AMapLoader from '@amap/amap-jsapi-loader'

export default ({
    name:'Draw',
    mounted() {
        this.initMap();
    },
    data() {
        return {
            map: null, //地图实例
        }
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
                "AMap.MouseTool",
                "AMap.Autocomplete",
                "AMap.CitySearch",
                "AMap.Geocoder",
                "AMap.DistrictSearch"
                ], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
                }).then((AMap) => {
                                   
                this.map = new AMap.Map("container", { //设置地图容器id
                
                    resizeEnable: true, //是否监控地图容器尺寸变化      
                    viewMode: "3D", //是否为3D地图模式
                    zoom: 8, //初始化地图级别
                    center: [116.397128, 39.916527], //初始化地图中心点位置
                    
                 });
                console.log("回调里的this.map："+this.map); 
                var mouseTool = new AMap.MouseTool(this.map); 
                //监听draw事件可获取画好的覆盖物
                var overlays = [];
                mouseTool.on('draw',function(e){
                    // console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
                    overlays.push(e.obj);
                }) 

                this.map.on('click', function(e) {
						console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
					});
                
                function draw(type){
                switch(type){
                    case 'marker':{
                        mouseTool.marker({
                        //同Marker的Option设置
                        });
                        break;
                       
                    }
                    case 'polyline':{
                        mouseTool.polyline({
                        strokeColor:'#80d8ff'
                        //同Polyline的Option设置
                        });
                     
                        break;
                    }
                    case 'polygon':{
                        mouseTool.polygon({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Polygon的Option设置
                        });
             
                        break;
                    }
                    case 'rectangle':{
                        mouseTool.rectangle({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Polygon的Option设置
                        });
                       
                        break;
                    }
                    case 'circle':{
                        mouseTool.circle({
                        fillColor:'#00b0ff',
                        strokeColor:'#80d8ff'
                        //同Circle的Option设置
                        });
                      
                        break;
                    }
                }

              
                }
                var radios = document.getElementsByName('func');
                for(var i=0;i<radios.length;i+=1){
                    radios[i].onchange = function(e){

                    draw(e.target.value)
                    }
                }
                draw('marker');
                var _that = this;

                // this.map.overlays=overlays;
                document.getElementById('clear').onclick = function(){
                    // console.log(this);
                    _that.map.remove(overlays)
                    overlays = [];
                }  
                document.getElementById('close').onclick = function(){
                    mouseTool.close(true)//关闭，并清除覆盖物
                    for(var i=0;i<radios.length;i+=1){
                        radios[i].checked = false;
                    }
                }

  
                
                }).catch(e => {
                    console.log(e);
                })
            },
            clear(){
                
                // this.map.remove(this.map.overlays)
                // this.map.overlays = [];
                // console.log(this.map.overlays);
            },
            close(){
                // this.mouseTool.close(true)//关闭，并清除覆盖物
                // for(var i=0;i<radios.length;i+=1){
                //     radios[i].checked = false;
                // }
            }

        
    },
    
    
})
</script>
