<template>
  <div class="block">
    <span id="ChartShowTimeSpan" class="demonstration">时间轴: {{ ChartShowTime }}</span>
    <el-slider id="timeSlider" v-model="timeStamp" :max="countriesName.length" :show-tooltip="false" min="0"
               step="1"></el-slider>
  </div>
  <div id="sortChart" style="width: 100%;height:800px;"></div>
  <div id="miniCHarts" style="width: 100%;height:13000px;"></div>
</template>

<script>
import * as echarts from "echarts/core";
import 'element-plus/lib/theme-chalk/el-slider.css';
import {GridComponent, ToolboxComponent, TooltipComponent, LegendComponent, TitleComponent} from 'echarts/components';
import {BarChart, LineChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
    [TitleComponent, ToolboxComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]
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
      let chartDom = document.getElementById('sortChart');
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

      function grid_templete(count, item) {
        return {
          show: true,
          borderWidth: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 2,
          left: (33.3 * item + 3.7) + '%',
          top: (Math.floor(count / 3) * 60 + 5) + 'px',
          width: '26%',
          height: '60px'
        }}

      function xAxes_templete(count) {
        return {
          type: 'value',
          show: false,
          min: 0,
          max: 1,
          gridIndex: count
        }
      }

      function yAxes_templete(name, count) {
        return {
          type: 'value',
          show: false,
          min: 0,
          // max: 0.001 * worldData.countries[name].population,
          max: 1,
          gridIndex: count
        }
      }

      let showItem = ['cases', 'deaths', 'recovered'];

      function series_templete(name, item, data, count) {
        return {
          name: name + ' ' + showItem[item],
          type: 'line',
          xAxisIndex: count,
          yAxisIndex: count,
          data: data[item],
          showSymbol: false,
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          animationEasing: name + ' ' + showItem[item],
          animationDuration: 1000
        }
      }

      function titles_templete(name, item) {
        return {
          textAlign: 'center',
          text: name + ' ' + showItem[item],
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal'
          },
          top: (Math.floor(count / 3) * 60 + 30) + 'px',
          left: ((33 * item) + 16.5) + '%'
        }
      }

      const N_POINT = worldData.series.length;

      // const allCountriesName = Object.keys(worldData.countries).sort();
      Object.keys(worldData.countries).sort().forEach(function (country) {
        let c_data = [];
        c_data.push(worldData.countries[country].cases.map(function (v, i) {
          return [i / N_POINT, v / worldData.countries[country].population * 10]
        }));
        c_data.push(worldData.countries[country].deaths.map(function (v, i) {
          return [i / N_POINT, v/ worldData.countries[country].population * 250]
        }));
        c_data.push(worldData.countries[country].recovered.map(function (v, i) {
          return [i / N_POINT, v/ worldData.countries[country].population * 10]
        }));

        for (let i = 0; i < 3; i++) {
          grids.push(grid_templete(count, i));
          xAxes.push(xAxes_templete(count));
          yAxes.push(yAxes_templete(country, count));
          series.push(series_templete(country, i, c_data, count));
          titles.push(titles_templete(country, i));
          count++;
        }
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
        series: series,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      };

      console.log(option)
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
