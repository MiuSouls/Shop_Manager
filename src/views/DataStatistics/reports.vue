<template>
  <div >
    <!-- //面包屑 -->
     <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //报表主体 -->
    <el-card>
      <!-- 2、为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width:900px; height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1、导入图表
import echarts from 'echarts'
import {GetReports} from '../../network/report'
export default {
  name: "reports",
  data(){
    return {
      //需要合并数据
      options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  methods:{

  },
  //页面渲染完毕
  mounted(){
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    
    GetReports().then(res=>{
      // 4、准备数据项
    const result=_.merge(res.data.data,this.options)
    // 5、展示数据
      myChart.setOption(result)
    })
  },

}


</script>

<style lang="less" scoped>

</style>
