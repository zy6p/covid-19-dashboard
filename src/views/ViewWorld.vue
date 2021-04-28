<template>
  <AppHeaderCard
      :title="'确诊： ' + glanceData.cases"
      type="warning"
  ></AppHeaderCard>
  <AppHeaderCard
      :title="'康复： ' + glanceData.recovered"
      type="success"
  ></AppHeaderCard>
  <AppHeaderCard
      :title="'死亡： ' + glanceData.deaths"
      type="info"
  ></AppHeaderCard>
    <span >疫苗接种率色阶： </span>
    <el-radio-group v-model="colorMap" @change="changeColorMap">
      <el-radio style="width: 100px" v-for="(c, i) in theColorMap"
                :label="i" :key="i" >
        <AppColorGrad :color-map="c"></AppColorGrad>
      </el-radio>
    </el-radio-group>
  <div id="map"></div>
</template>

<script>
import AppHeaderCard from "@/components/AppHeaderCard";
import AppColorGrad from "@/components/AppColorGrad";
import 'element-plus/lib/theme-chalk/el-radio.css';
import 'element-plus/lib/theme-chalk/el-radio-group.css';
import L from "leaflet";
import "@/m/fixleaflet";
import "leaflet.chinatmsproviders";

const chroma = require('chroma-js');
const theColorMap = [
  'Spectral',
  ['yellow', '008ae5'],
  ['yellow', 'red', 'black'],
  ['yellow', 'navy'],
  'YlGn',
  'RdYlBu'
];
const ratio2ColorMap = [
  [0.00, 0.00],
  [0.01, 0.10],
  [0.03, 0.20],
  [0.05, 0.30],
  [0.08, 0.40],
  [0.12, 0.50],
  [0.18, 0.60],
  [0.25, 0.70],
  [0.50, 0.80],
  [0.70, 0.90],
  [0.80, 1.00],
];

export default {
  name: "ViewWorld",
  data() {
    return {
      map: null,
      myStyle: null,
      glanceData: {cases: 0, recovered: 0, deaths: 0},
      theColorMap,
      baseLayers: null,
      globalVaccineLayer: null,
      globalCovidLayer: null,
      colorMap: 1,
    };
  },
  components: {
    AppColorGrad,
    AppHeaderCard,
  },
  mounted() {
    this.axios.get("data/all.json").then(r => this.glanceData = r.data );
    this.chooseColorMap();
    this.initBaseMap();
    this.addLayerControl();
    this.addCovidLayer();
    this.addVaccineLayer();
  },

  methods: {
    initBaseMap() {
      let Gaode = L.tileLayer.chinaProvider("GaoDe.Normal.Map", {
        attribution: "© 高德地图",
      });
      let Gaodimgem = L.tileLayer.chinaProvider("GaoDe.Satellite.Map", {
        attribution: "© 高德地图",
      });
      let Gaodimga = L.tileLayer.chinaProvider("GaoDe.Satellite.Annotion", {
        attribution: "© 高德地图",
      });
      let Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);
      // 图层
      let OpenStreetMap = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: "© OpenStreetMap",
          }
      );
      let MapBoxStreet = L.tileLayer(
          "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",
          {
            maxZoom: 18,
            id: "mapbox/streets-v11",
            attribution: "© MapBox",
            tileSize: 512,
            zoomOffset: -1,
          }
      );
      this.baseLayers = {
        OpenStreetMap: OpenStreetMap,
        "高德地图": Gaode,
        "高德影像": Gaodimage,
        Mapbox: MapBoxStreet,
      };
      this.map = L.map("map", {
        center: [40, 0],
        zoom: 2,
        layers: [OpenStreetMap],
      });
      L.control
          .scale({
            maxWidth: 200,
            metric: true,
            imperial: false,
          })
          .addTo(this.map);
    },

    async addVaccineLayer() {
      this.worldBaseShp = (await this.axios.get("https://geo.hotdry.top:18105/geoserver/covid-19/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=covid-19%3AWorld_Countries__Generalized_&outputFormat=application%2Fjson")).data;
      this.vaccineData = (await this.axios.get("data/vaccine.json")).data;
      this.vaccineCountryName = this.vaccineData.map((v) => v.country);
      this.globalVaccineLayer = new L.GeoJSON(this.worldBaseShp, {
        style: this.vaccineStyle,
        onEachFeature: this.onEachFeatureOfTopoLayer
      }).addTo(this.map);
      this.controlLayers.addOverlay(this.globalVaccineLayer, '全球疫苗图');
    },

    chooseColorMap() {
      this.color_scale = chroma.scale(theColorMap[this.colorMap]);
    },

    changeColorMap(event) {
      this.colorMap = event;
      this.chooseColorMap();
      this.globalVaccineLayer.setStyle(this.vaccineStyle);
    },

    vaccineStyle(feature) {
      let id = feature.properties.id;
      let d = 0;
      let index = this.vaccineCountryName.findIndex(
          (c) => c ===
              this.jhuCountryInfo.name[
                  this.jhuCountryInfo.id.findIndex((e) => e === id)
                  ]);
      if (index >= 0) {
        d = Object.values(this.vaccineData[index].timeline)
            / feature.properties.population;
      }
      let fColor = d <= ratio2ColorMap[0][0] ? this.color_scale(ratio2ColorMap[0][1])
          : d <= ratio2ColorMap[1][0] ? this.color_scale(ratio2ColorMap[1][1])
          : d <= ratio2ColorMap[2][0] ? this.color_scale(ratio2ColorMap[2][1])
          : d <= ratio2ColorMap[3][0] ? this.color_scale(ratio2ColorMap[3][1])
          : d <= ratio2ColorMap[4][0] ? this.color_scale(ratio2ColorMap[4][1])
          : d <= ratio2ColorMap[5][0] ? this.color_scale(ratio2ColorMap[5][1])
          : d <= ratio2ColorMap[6][0] ? this.color_scale(ratio2ColorMap[6][1])
          : d <= ratio2ColorMap[7][0] ? this.color_scale(ratio2ColorMap[7][1])
          : d <= ratio2ColorMap[8][0] ? this.color_scale(ratio2ColorMap[8][1])
          : d <= ratio2ColorMap[9][0] ? this.color_scale(ratio2ColorMap[9][1])
          : d <= ratio2ColorMap[10][0] ? this.color_scale(ratio2ColorMap[10][1])
          : this.color_scale(1);
      return {
        fillColor: fColor.hex(),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },

    async addCovidLayer() {
      let that = this;
      this.covidData = ((await this.axios.get("data/countries.json")).data);
      this.jhuCountryInfo = {
        id: this.covidData.map((v) => v.countryInfo.iso2),
        name: this.covidData.map((v) => v.country)
      };
      this.globalCovidLayer = L.layerGroup(
          that.covidData.map((c) =>
              L.circle([c.countryInfo.lat, c.countryInfo.long], {
                radius: Math.sqrt(c.cases) * 300,
              }).bindPopup(
                  '<img style="height: 50px;" src=' +
                  c.countryInfo.flag +
                  " alt=" +
                  c.countryInfo.iso2 +
                  "><div><strong>" +
                  c.country +
                  "</strong></div><li>累计确诊: " +
                  c.cases +
                  "</li><li>今日确诊: " +
                  c.todayCases +
                  "</li><li>累计死亡: " +
                  c.deaths +
                  "</li><li>今日死亡: " +
                  c.todayDeaths +
                  "</li><li>累计康复: " +
                  c.recovered +
                  "</li> <li>今日康复: " +
                  c.todayRecovered +
                  "</li><li>现存患者: " +
                  c.active +
                  "</li>"
              )
          )
      ).addTo(this.map);
      this.controlLayers.addOverlay(this.globalCovidLayer, '全球疫情图');
    },

    addLayerControl() {
      this.overlays = {
        // 全球疫苗图: this.globalVaccineLayer,
        // 全球疫情图: this.globalCovidLayer,
      };
      this.controlLayers = L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
    },

    onEachFeatureOfTopoLayer(feature, layer) {
      layer.on({
        mouseover: this.highlightFeature,
        mouseout: this.resetHighlight,
        // click: this.zoomToFeature,
      });
      let id = feature.properties.id;
      let d = 0;
      let index = this.vaccineCountryName.findIndex(
          (c) => c ===
              this.jhuCountryInfo.name[
                  this.jhuCountryInfo.id.findIndex((e) => e === id)
                  ]);
      if (index >= 0) {
        d = Object.values(this.vaccineData[index].timeline)
            / feature.properties.population;
      }
      layer.bindPopup(
          '<img style="height: 50px;" src=https://disease.sh/assets/img/flags/' +
          feature.properties.id.toLowerCase() +
          ".png alt=" +
          feature.properties.id +
          "><div><strong>" +
          feature.properties.COUNTRY +
          "</strong></div><li>疫苗接种率: " +
          Math.round(d * 1000) / 10 +
          "%</li><li>接种人数: " +
          d * feature.properties.population +
          "</li><li>国家人口: " +
          feature.properties.population +
          "</li>"
      );
    },
    highlightFeature(e) {
      let layer = e.target;
      layer.setStyle({
        weight: 5,
        color: "#666",
        dashArray: "",
        fillOpacity: 0.7,
      });
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    },

    resetHighlight(e) {
      this.globalVaccineLayer.resetStyle(e.target);
    },

    zoomToFeature(e) {
      this.map.fitBounds(e.target.getBounds());
    },
  },
}
</script>

<style scoped>
#map {
  margin: 0;
  width: 100%;
  height: 80%;
}
</style>
