<template>
  <div class="block">
    <span id="ChartShowTimeSpan" class="demonstration">时间轴: {{ ChartShowTime }}</span>
    <el-slider id="timeSlider" v-model="timeStamp" :max="countriesName.length" :show-tooltip="false" min="0"
               step="1"></el-slider>
  </div>
  <div id="sortChart" style="width: 100%;height:800px;"></div>
  <div id="miniCHarts" style="width: 100%;height:800px;"></div>
</template>

<script>
import * as echarts from "echarts/core";
import 'element-plus/lib/theme-chalk/el-slider.css';
import {TitleComponent, GridComponent, LegendComponent} from 'echarts/components';
import {BarChart, LineChart} from 'echarts/charts';
import {CanvasRenderer, SVGRenderer} from 'echarts/renderers';

echarts.use(
    [TitleComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer, SVGRenderer]
);
const worldData = require("../static/resource/data.json");
const countriesName = Object.keys(worldData.countries);

let timeStamp = 0;
let dailyData = [];

function chartRun(chart, option) {
  for (let i = 0; i < countriesName.length; i++) {
    dailyData[i] = worldData.countries['' + countriesName[i] + ''].cases[timeStamp];
  }
  timeStamp = timeStamp < countriesName.length ? (timeStamp + 1) : countriesName.length;
  let chartShowTimeSpan = document.getElementById('ChartShowTimeSpan');
  let timeSlider = document.getElementById('timeSlider');
  // console.log(timeSlider.value);
  timeSlider.value = worldData.series[timeStamp];
  chartShowTimeSpan.value = '时间轴:' + worldData.series[timeStamp];
  chart.setOption(option);
}

export default {
  name: "Trend",
  data() {
    return {
      myChart: null,
      timeStamp,
      ChartShowTime: worldData.series[timeStamp],
      countriesName,
    }
  },
  mounted() {
    this.initCharts();
    this.initMiniCharts();
  },
  methods: {
    initCharts: function () {
      let chartDom = document.getElementById('sortChart', null, {renderer: 'svg'});
      this.myChart = echarts.init(chartDom, 'dark');
      let tempChart = this.myChart;

      let typeOfData = 'Cases';

      let chartOption = {
        title: {
          text: 'Global Covid-19 ' + typeOfData
        },
        xAxis: {
          max: 'dataMax',
        },
        yAxis: {
          type: 'category',
          data: countriesName,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 19, // only the largest 3 bars will be displayed
        },
        series: [{
          realtimeSort: true,
          name: '确诊数量',
          type: 'bar',
          data: dailyData,
          label: {
            show: true,
            position: 'right',
            valueAnimation: true
          }
        }],
        legend: {
          show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 3000,
        animationEasing: "linear",
        animationEasingUpdate: 'linear',
      };

      setTimeout(function () {
        chartRun(tempChart, chartOption);
      }, 0);

      setInterval(function () {
        chartRun(tempChart, chartOption);
      }, 3000);
    },

    initMiniCharts() {
      let chartDom = document.getElementById('miniCHarts');
      let miniCharts = echarts.init(chartDom, 'dark');

      let grids = [];
      let xAxes = [];
      let yAxes = [];
      let series = [];
      let titles = [];
      let count = 0;
      const N_POINT = countriesName.length;

      Object.keys(worldData.countries).forEach(function (country) {
        let data = country.cases.map(function (v, i) {return [i, v]});

      })
    },

    addTimeSlider() {
      let chartShowTimeSpan = document.getElementById('ChartShowTimeSpan');
      let timeSlider = document.getElementById('timeSlider');
      timeSlider.addEventListener("input", function (v) {
        timeStamp = v;
        timeSlider.value = worldData.series[timeStamp];
        chartShowTimeSpan.value = '时间轴:' + worldData.series[timeStamp];
      });
    },
  }
}
</script>

<style scoped>

</style>
