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
        let data = worldData.countries[country].cases.map(function (v, i) {return [i / N_POINT, v]});
        grids.push({
          show: true,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 2
        });
        xAxes.push({
          type: 'value',
          show: false,
          min: 0,
          max: 1,
          gridIndex: count
        });
        yAxes.push({
          type: 'value',
          show: false,
          min: -0.4,
          max: 1.4,
          gridIndex: count
        });
        series.push({
          name: country,
          type: 'line',
          xAxisIndex: count,
          yAxisIndex: count,
          data: data,
          showSymbol: false,
          animationEasing: country,
          animationDuration: 1000
        });
        titles.push({
          textAlign: 'center',
          text: country,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal'
          }
        });
        count++;
      });
      let rowNumber = Math.ceil(Math.sqrt(count));
      grids.forEach(function (grid, idx) {
        grid.left = ((idx % rowNumber) / rowNumber * 100 + 0.5) + '%';
        grid.top = (Math.floor(idx / rowNumber) / rowNumber * 100 + 0.5) + '%';
        grid.width = (1 / rowNumber * 100 - 1) + '%';
        grid.height = (1 / rowNumber * 100 - 1) + '%';

        titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
        titles[idx].top = parseFloat(grid.top) + '%';
      });

      let option = {
        title: titles.concat([{
          text: 'Different Easing Functions',
          top: 'bottom',
          left: 'center'
        }]),
        grid: grids,
        xAxis: xAxes,
        yAxis: yAxes,
        series: series
      };

      option && miniCharts.setOption(option);
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
