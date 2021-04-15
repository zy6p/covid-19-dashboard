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
  <div id="map"></div>
</template>

<script>
import AppHeaderCard from "@/components/AppHeaderCard";
// import axios from "axios";
import L from "leaflet";
import "@/m/fixleaflet";
import "leaflet.chinatmsproviders";

const chroma = require('chroma-js')
const color_scale = chroma.scale('Spectral');

const glanceData = require("../static/resource/all.json");
export default {
  name: "ViewWorld",
  data() {
    return {
      map: null,
      myStyle: null,
      glanceData,
      baseLayers: null,
      globalVaccineLayer: null,
      globalCovidLayer: null,
    };
  },
  components: {
    AppHeaderCard,
  },
  mounted() {
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
      this.vaccineData = (await this.axios.get("https://geo.hotdry.top:18100/covid-19-dashboard/data/vaccine.json")).data;
      this.vaccineCountryName = this.vaccineData.map((v) => v.country);
      this.globalVaccineLayer = new L.GeoJSON(this.worldBaseShp, {
        style: this.vaccineStyle,
        onEachFeature: this.onEachFeatureOfTopoLayer
      }).addTo(this.map);
      this.controlLayers.addOverlay(this.globalVaccineLayer, '全球疫苗图');
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
      let fColor = d > 0.30 ? color_scale(1)
          : d > 0.20 ? color_scale(0.8)
              : d > 0.12 ? color_scale(0.6)
                  : d > 0.08 ? color_scale(0.4)
                      : d > 0.05 ? color_scale(0.2)
                          : d > 0.01 ? color_scale(0.1)
                              : color_scale(0)
      // console.log(feature, id, index, this.vaccineData[index], this.vaccineData)
      return {
        fillColor: fColor.hex(),
        // fillColor: index < this.vaccineData.length ? Color(
        //     {
        //       r: 100,
        //       g:Object.values(this.vaccineData[index].timeline)
        //           / feature.properties.population,
        //       b: 100
        //     }).hex() : Color(0).hex(),
        // fillColor: this.getColor(feature.properties.COUNTRY),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },

    getColor(name) {
      let index = this.vaccineCountryName.findIndex(v => v === name);
      if (index < 0) {
        return "#FFF"
      }
      let d = Object.values(this.vaccineData[index].timeline) /
          this.covidData[index].population;

      return d > 0.30 ? "#800026"
          : d > 0.20 ? "#BD0026"
              : d > 0.12 ? "#E31A1C"
                  : d > 0.08 ? "#FC4E2A"
                      : d > 0.05 ? "#FD8D3C"
                          : d > 0.03 ? "#FEB24C"
                              : d > 0.01 ? "#FED976"
                                  : "#FFEDA0";
    },

    async addCovidLayer() {
      let that = this;
      this.covidData = ((await this.axios.get("https://geo.hotdry.top:18100/covid-19-dashboard/data/countries.json")).data);
      this.jhuCountryInfo = { id: this.covidData.map((v) => v.countryInfo.iso2),
        name: this.covidData.map((v) => v.country)};
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
        click: this.zoomToFeature,
      });
      let popupContent = `<strong>Country: </strong>${feature.properties.COUNTRY}`;
      layer.bindPopup(popupContent);
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
