<template>
  <div >
    <el-container>
        <el-main>
            <div id="bar" style="width: 600px;height: 400px;"></div>
            <div id="myChart" :style="{width: '50%', height: '300px'}"></div>
        </el-main>

    </el-container>


    

  </div>
</template>
 
<script>
export default {
  name: 'userData',
data() {
    return {
        myChart: null,
        option: {
            title: {
                text: '用户数量变化曲线',
            },
            tooltip: {
                trigger: 'axis',

            },
            legend: {
                data: ['昨日(11月8日)', '今日(11月9日)']
            },
            grid: {
                left: '20%',
                right: '1%',
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
                data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
                    '18', '19', '20', '21', '22', '23', '24'
                ]
            },
            yAxis: {
                type: 'value',
                name: '单位（人）',
                axisLabel: {
                    formatter: '{value}'
                }
            },
            series: [{
                    name: '昨日(11月8日)',
                    type: 'line',
                    data: [110, 106, 110, 110, 318, 119, 205, 256, 156, 309, 256, 306, 206, 356, 456, 486,
                        565.45, 234, 156, 206, 126, 256, 150, 276
                    ],

                },
                {
                    type: 'line',
                    name: '今日(11月9日)',
                    data: [210, 136, 120, 120, 118, 219, 195, 176, 156, 329, 356, 346, 406.54, 256, 156],
                }
            ]
        }
    }
		},
mounted(){
    this.$bus.$on("sendPopulation",data=>{
      console.log("this is data:"+data)
    })
    this.barEcharts();
    this.drawBar();
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
 
			}

  },
  watch: {
			// 监听 option 更新
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
 
