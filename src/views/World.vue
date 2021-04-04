<template>
  <AppHeaderCard :title="'确诊： ' + worldTotalData.totals.cases.slice(-1)" type="warning"></AppHeaderCard>
  <AppHeaderCard :title="'康复： ' + worldTotalData.totals.recovered.slice(-1)" type="success"></AppHeaderCard>
  <AppHeaderCard :title="'死亡： ' + worldTotalData.totals.deaths.slice(-1)" type="info"></AppHeaderCard>
  <div id="map"></div>
</template>

<script>
import AppHeaderCard from "../components/AppHeaderCard";
import L from "leaflet";
import * as topojson from "topojson-client";
const worldData = require("../static/resource/data.json");
import 'leaflet.chinatmsproviders'

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

export default {
  name: "World",
  data() {
    return {
      map: null,
      worldTotalData: worldData,
      myStyle: null,
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
        center: [40, 0],
        zoom: 2,
        layers: [OpenStreetMap],
      })
      // L.control.scale({ maxWidth: 200, metric: true, imperial: false }).addTo(this.map)
    },

    addTopoJson() {
      const topo = require("../static/resource/topo.json");
      this.globalTopoLayer = new L.TopoJSON(null, {style: this.myStyle, onEachFeature: this.onEachFeatureOfTopoLayer});
      this.globalTopoLayer.addData(topo);
      this.globalTopoLayer.addTo(this.map);
    },

    addCovidLayer() {
      const country = require("../static/resource/countries.json");
      // console.log(country)
      this.globalCovidLayer = new L.GeoJSON(country, {
        style: () => ({color: '#99FF85', weight: 0.25})
      }).bindPopup(function (layer) {
        return layer.feature.properties.COUNTRY;
      }).addTo(this.map);
    },

    addLayerControl() {
      this.overlays = {
        '全球矢量图': this.globalTopoLayer,
        '全球疫情图': this.globalCovidLayer,
      }
      L.control.layers(this.baseLayers, this.overlays).addTo(this.map)
    },

    onEachFeatureOfTopoLayer(feature, layer) {
      var popupContent = `<strong>Município: </strong>${feature.properties.nome}`;
      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
      }
      layer.bindPopup(popupContent);
    },


  }
}
</script>

<style scoped>
#map {
  margin: 0;
  width: 100%;
  height: 700px;
}

</style>
