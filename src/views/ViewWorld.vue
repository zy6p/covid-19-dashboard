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
import * as topojson from "topojson-client";
import "leaflet.chinatmsproviders";

const countryData = require("../static/resource/countries.json");
// Leaflet bugs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

L.TopoJSON = L.GeoJSON.extend({
  addData: function (jsonData) {
    if (jsonData.type === "Topology") {
      for (let key in jsonData.objects) {
        let geojson = topojson.feature(jsonData, jsonData.objects[key]);
        L.GeoJSON.prototype.addData.call(this, geojson);
      }
    } else {
      L.GeoJSON.prototype.addData.call(this, jsonData);
    }
  },
});

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
    this.addVaccineLayer();
    this.addCovidLayer();
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
          tileSize: 512,
          zoomOffset: -1,
        }
      );
      this.baseLayers = {
        OpenStreetMap: OpenStreetMap,
        高德地图: Gaode,
        高德影像: Gaodimage,
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
      const worldBaseShp = (await this.axios.get("https://geo.hotdry.top:18105/geoserver/covid-19/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=covid-19%3AWorld_Countries__Generalized_&maxFeatures=50&outputFormat=application%2Fjson")).data;
      console.log(worldBaseShp);
      this.vaccineData = (await this.axios.get("https://geo.hotdry.top:18100/covid-19-dashboard/data/vaccine.json")).data;
      this.countryName = this.vaccineData.map((v) => v.country);
      console.log(this.countryName)
      this.globalVaccineLayer = new L.GeoJSON(worldBaseShp, {
        style: this.vaccineStyle,
        onEachFeature: this.onEachFeatureOfTopoLayer
      }).addTo(this.map);
      // this.globalVaccineLayer = new L.TopoJSON(null, {
      //   style: this.vaccineStyle,
      //   onEachFeature: this.onEachFeatureOfTopoLayer,
      // });
      // this.globalVaccineLayer.addData(topo);
      // this.globalVaccineLayer.addTo(this.map);
      this.addLayerControl();
    },

    vaccineStyle(feature) {
      return {
        fillColor: this.getColor(feature.properties.COUNTRY),
        weight: 2,
        opacity: 1,
        color: "white",
        dashArray: "3",
        fillOpacity: 0.7,
      };
    },

    getColor(name) {
      let index = this.countryName.findIndex(v => v === name);
      if (index < 0) {return "#FFF"}
      let d = Object.values(this.vaccineData[index].timeline) /
          countryData[index].population;
      // if (Object.prototype.hasOwnProperty.call(name, "NAME")) {
      //   //let d = this.vaccineData[this.countryName.findIndex(element => element === name)].timeline["4/10/21"];
      //   let dd = this.countryName.findIndex(
      //     (element) => element === name["NAME"]
      //   );
      //   if (dd > -1) {
      //     let d =
      //       Object.values(this.vaccineData[dd].timeline) /
      //       countryData[dd].population;

      return d > 0.30 ? "#800026"
          : d > 0.20 ? "#BD0026"
              : d > 0.12 ? "#E31A1C"
                  : d > 0.08 ? "#FC4E2A"
                      : d > 0.05 ? "#FD8D3C"
                          : d > 0.03 ? "#FEB24C"
                              : d > 0.01 ? "#FED976"
                                  : "#FFEDA0";
    },

    addCovidLayer() {
      //country cycle
      // // let countryData = {};
      // axios.get("https://geo.hotdry.top:18100/covid-19/data/countries.json").then(response => {
      // countryData = response.data
      this.globalCovidLayer = L.layerGroup(
        countryData.map((c) =>
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
    },

    addLayerControl() {
      this.overlays = {
        全球疫苗图: this.globalVaccineLayer,
        全球疫情图: this.globalCovidLayer,
      };
      L.control.layers(this.baseLayers, this.overlays).addTo(this.map);
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
};
</script>

<style scoped>
#map {
margin: 0;
width: 100%;
height: 80%;
}
</style>
