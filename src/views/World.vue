<template>
  <AppHeaderCard :title="'确诊： ' + glanceData.cases" type="warning"></AppHeaderCard>
  <AppHeaderCard :title="'康复： ' + glanceData.recovered" type="success"></AppHeaderCard>
  <AppHeaderCard :title="'死亡： ' + glanceData.deaths" type="info"></AppHeaderCard>
  <div id="map"></div>
</template>

<script>
import AppHeaderCard from "@/components/AppHeaderCard";
// import axios from "axios";
import L from "leaflet";
import * as topojson from "topojson-client";
import 'leaflet.chinatmsproviders'

// Leaflet bugs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

L.TopoJSON = L.GeoJSON.extend({
  addData: function (jsonData) {
    if (jsonData.type === "Topology") {
      for (let key in jsonData.objects) {
        let geojson = topojson.feature(jsonData,
            jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    } else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  }
});

const glanceData = require("../static/resource/all.json");
export default {
  name: "World",
  data() {
    return {
      map: null,
      myStyle: null,
      glanceData,
      baseLayers: null,
      globalTopoLayer: null,
      globalCovidLayer: null,
    }
  },
  components: {
    AppHeaderCard,
  },
  mounted() {
    this.initBaseMap();
    this.addTopoJson();
    this.addCovidLayer();
    this.addLayerControl();
  },

  methods: {
    initBaseMap() {
      let Gaode = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        attribution: '© 高德地图',
      });
      let Gaodimgem = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
        attribution: '© 高德地图'
      });
      let Gaodimga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
        attribution: '© 高德地图'
      });
      let Gaodimage = L.layerGroup([Gaodimgem, Gaodimga]);
      // 图层
      let OpenStreetMap = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }
      );
      let MapBoxStreet = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
      });
      this.baseLayers = {
        'OpenStreetMap': OpenStreetMap,
        '高德地图': Gaode,
        '高德影像': Gaodimage,
        'Mapbox': MapBoxStreet,
      }
      this.map = L.map('map', {
        center: [0, 0],
        zoom: 2,
        layers: [OpenStreetMap],
      })
      L.control.scale({ maxWidth: 200, metric: true, imperial: false }).addTo(this.map)
    },

    addTopoJson() {
      const topo = require("../static/resource/topo.json");
      this.globalTopoLayer = new L.TopoJSON(null, {style: this.myStyle, onEachFeature: this.onEachFeatureOfTopoLayer});
      this.globalTopoLayer.addData(topo);
      // this.globalTopoLayer.addTo(this.map);
    },

    addCovidLayer: function () {
      //country cycle
      const countryData = require("../static/resource/countries.json");
      // // let countryData = {};
      // axios.get("https://geo.hotdry.top:18100/covid-19/data/countries.json").then(response => {
        // countryData = response.data
      this.globalCovidLayer = L.layerGroup(countryData.map(c =>
          L.circle([c.countryInfo.lat, c.countryInfo.long],
              {radius: Math.sqrt(c.cases) * 300}
          ).bindPopup(
              '<img style="height: 50px;" src=' + c.countryInfo.flag + ' alt=' + c.countryInfo.iso2 + '><div><strong>' + c.country +
              '</strong></div><li>累计确诊: ' + c.cases + '</li><li>今日确诊: ' + c.todayCases + '</li><li>累计死亡: ' + c.deaths +
              '</li><li>今日死亡: ' + c.todayDeaths + '</li><li>累计康复: ' + c.recovered + '</li> <li>今日康复: ' +
              c.todayRecovered + '</li><li>现存患者: ' + c.active + '</li>'
          )
      )).addTo(this.map);
    },

    addLayerControl() {
      this.overlays = {
        '全球矢量图': this.globalTopoLayer,
        '全球疫情图': this.globalCovidLayer,
      }
      L.control.layers(this.baseLayers, this.overlays).addTo(this.map)
    },

    onEachFeatureOfTopoLayer(feature, layer) {
      let popupContent = `<strong>Country: </strong>${feature.properties.NAME}`;
      layer.bindPopup(popupContent);
    },



  }
}
</script>

<style scoped>
#map {
  margin: 0;
  width: 100%;
  height: 80%;
}

</style>
