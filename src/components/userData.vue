<template>
  <div >
    <el-container>
        <el-main>
            <div id="bar" style="width: 600px;height: 400px;"></div>
            <div id="myChart"  :style="linestyle"></div>
            
        </el-main>

    </el-container>
  </div>
</template>
 
<script>
import 'echarts-gl';




export default {
  name: 'userData',
data() {
    return {
        earth:null,
        myChart: null,
        timeData:[],
        countData:[],
        option: {
            title: {
                text: '七日用户数量变化曲线',
            },
            tooltip: {
                trigger: 'axis',

            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                show: false,
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ['line', 'bar']
                    },
                    restore: {},
                    saveAsImage: {}
                }
            },
            color: ["red", "#CD3333"],
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: [],
                axisLabel:{
                  // interval:0,
                  textStyle:{
                    fontSize:12
                  }
                }
            },
            yAxis: {
                type: 'value',
                name: '单位（人）',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [{
                    name: '用户人数',
                    type: 'line',
                    data:[210, 136, 120, 120, 118, 219, 195, 176, 156, 329, 356, 346, 406.54, 256, 156]

                },
            ]
        },
        baseTexture:null,
        heightTexture:null,
        environment:null,
        texture:null,

    }
		},


mounted(){  

    this.lodaData();
    this.barEcharts();
    this.drawBar();

    
},


  computed:{
    linestyle(){
      return {width:document.documentElement.clientWidth-400+'px',
              height:"300px"}
    }
},
  methods: {
    barEcharts () {
      var myChart = this.$echarts.init(document.getElementById('bar'))
      // 配置图表
		  var option = {
			title: {
			  text: 'echrt demo'
			},
			//提示框
			tooltip: {},
			legend: {
			  data: ['']
			},
			//x轴显示种类
			xAxis: {
			  data: ['种类一', '种类二', '种类三', '种类四', '种类五', '种类六']
			},
			//y轴可填数值等
			yAxis: {
			},
			series: [{
			  name: '销量',
			  type: 'bar',
			  //y轴数值
			  data: [5,
				{
				  value: 20,
				  itemStyle: {
					color: '#FFB5C5'
				  }
				}, 36, 10, 10, 20]
				}]
		  }
		  myChart.setOption(option)
   	},
    drawBar() {
				this.myChart = this.$echarts.init(document.getElementById('myChart'))
				// 绘制图表
				this.myChart.setOption(this.option);
 
				// 设置该 chart 的 resize 方法
				window.addEventListener("resize", this.myChart.resize)
 
			},



    lodaData(){
      var _that = this;
      this.axios.get('/usersapi/'+'test')
      .then(function(res){
        var countdata = [];
        for(var i=0;i<7;i++){
          _that.timeData[i] = res.data[6-i].day;
          countdata[i] = res.data[6-i].count;
        }
        _that.option.xAxis.data = _that.timeData
        _that.option.series[0].data = countdata
        // console.log(_that.option.series[0].data)
        


        // // 当浏览器窗口大小发生改变的时候修改图标的大小
        // window.resize(function(){
        //   _that.$refs.myChart.resize();
        // });

      })
    }

  },
  watch: {
			option: {
				// 更新处理，也可以 handler(newVal，oldVal)
				handler(newVal) {
					if (newVal) {
						this.myChart.setOption(newVal)
					}
				},
				//关键,对象内部属性的监听(内部有数据更新，也进行对应的watch触发)
				deep: true
			},
  }

}
</script>
 
