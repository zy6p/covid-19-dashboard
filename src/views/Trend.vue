<template>
  <div class="block">
    <span id="ChartShowTimeSpan" class="demonstration">时间轴: {{ ChartShowTime }}</span>
    <el-slider id="timeSlider" v-model="timeStamp" :max="countriesName.length" :show-tooltip="false" min="0"
                                                                                                     step="1"></el-slider>
  </div>
  <div id="sortChart" style="width: 100%;height:800px;"></div>
  <div id="miniCHarts" style="width: 100%;height:400%;"></div>
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

      let grid_templete = {
        show: true,
        borderWidth: 0,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowBlur: 2
      };
      let xAxes_templete = function(count) {return {
        type: 'value',
        show: false,
        min: 0,
        max: 1,
        gridIndex: count
      }};
      let yAxes_templete = function (name, count){
        return {
          type: 'value',
          show: false,
          min: 0,
          max: worldData.countries[name].cases.slice(-1)[0],
          gridIndex: count
        }};
      let showItem = ['cases', 'deaths', 'recovered'];
      let series_templete = function (name, item, data, count) {
        return {
          name: name + ' ' + showItem[item],
          type: 'line',
          xAxisIndex: count,
          yAxisIndex: count,
          data: data[item],
          showSymbol: false,
          animationEasing: name + ' ' + showItem[item],
          animationDuration: 1000
        }};
      let titles_templete = function (name, item) {
        return {
          textAlign: 'center',
          text: name + ' ' + showItem[item],
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal'
          }
        }};
      const N_POINT = worldData.series.length;

      Object.keys(worldData.countries).forEach(function (country) {
        let c_data = [];
        c_data.push(worldData.countries[country].cases.map(function (v, i) {return [i / N_POINT, v]}));
        c_data.push(worldData.countries[country].deaths.map(function (v, i) {return [i / N_POINT, v]}));
        c_data.push(worldData.countries[country].recovered.map(function (v, i) {return [i / N_POINT, v]}));

        for (let i = 0; i < 3; i ++) {
          //console.log(grid_templete);
          //console.log(xAxes_templete(count));
          //console.log(yAxes_templete(country, count));
          //console.log(series_templete(country, i, c_data, count));
          //console.log(titles_templete(country, i));
          grids.push(grid_templete);
          xAxes.push(xAxes_templete(count));
          yAxes.push(yAxes_templete(country, count));
          series.push(series_templete(country, i, c_data, count));
          titles.push(titles_templete(country, i));
          count++;
        }

      });
      const colNumber = 3;
      const rowNumber = 214;
      grids.forEach(function (grid, idx) {
        grid.left = ((idx % colNumber) / colNumber * 100 + 0.5) + '%';
        grid.top = (Math.floor(idx / colNumber) / rowNumber * 400 + 0.5) + '%';
        grid.width = (1 / colNumber * 100 - 1) + '%';
        grid.height = (1 / rowNumber * 400 - 1) + '%';

        titles[idx].left = parseFloat(grid.left) + parseFloat(grid.width) / 2 + '%';
        titles[idx].top = parseFloat(grid.top) + '%';
      });

      let option = {
        title: titles.concat([{
          text: 'Global Cases MiniCharts',
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
