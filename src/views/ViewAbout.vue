<template>
  <h1>hotdry covid-19 dashboard</h1>
  <p>GIS设计与实践大作业 - 疫情地图，作者：王知远</p>
  <h2>技术栈</h2>
  <p>项目为前后端分离设计，前端负责可视化疫情，后端负责爬取数据。</p>
  <p>前端使用 Vue3 框架，搭配 Leaflet 地图可视化，加上 ECharts 数据可视化。</p>
  <p>后端使用 GeoServer 作为地图发布平台，python 爬虫爬取疫情数据。</p>
  <h2>开放数据</h2>
  <p>全球国家境界可以使用<a href="https://geo.hotdry.top:18100/geoserver/covid-19/wms">WMS
    服务</a>，或者使用直接下载 <a
      href="https://geo.hotdry.top:18105/geoserver/covid-19/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=covid-19%3AWorld_Countries__Generalized_&maxFeatures=50&outputFormat=application%2Fjson">geojson
    文件</a>。</p>
  <p>各国疫情时序数据，包括各国疫情数据（确诊、死亡、康复人数），国家信息（人口，ISO码，国名），链接 <a
      href="https://geo.hotdry.top:18100/covid-19-dashboard/data/data.json">data.json</a>。
  </p>
  <p>各国每日疫情数据，包括各国当日疫情（确诊、死亡、康复、现存、新增人数），国家信息（人口，ISO码，国名，经纬度，国旗），数据链接 <a
      href="https://geo.hotdry.top:18100/covid-19-dashboard/data/countries.json">countries.json</a>。
  </p>
  <p>全球每日疫情概览，包括当日总疫情（确诊、死亡、康复、现存、新增人数），数据链接 <a
      href="https://geo.hotdry.top:18100/covid-19-dashboard/data/all.json">all.json</a>。
  </p>
  <p>各国每日疫苗数据，包括当日接种疫苗累计人数，国名，数据链接 <a
      href="https://geo.hotdry.top:18100/covid-19-dashboard/data/vaccive.json">vaccive.json</a>。
  </p>
  <video src="fdsa65gr89.mkv" width="800" height="450" controls>
    <source src="fdsa65gr89.mkv" type="video/mkv">
  </video>
</template>

<script>
export default {
  name: "about"
}
</script>

<style scoped>

</style>
