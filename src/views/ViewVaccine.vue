<template>

  <div id="map"></div>
</template>

<script>
import ViewWorld from "components/ViewWorld";
import L from "leaflet";

export default {
  name: "ViewVaccine",
  components: {
    ViewWorld,
  },
  data() {
    return {
      map: null,
      globalVaccineLayer: null,
    }
  },
  mounted() {
    this.components.ViewWorld.methods.initBaseMap();
    this.components.ViewWorld.methods.addTopoJson();
    this.addVaccineLayer();
    this.addLayerControl();

  },
  methods: {

    addVaccineLayer() {
      const countryData = require("../static/resource/countries.json");
      const vaccineData = require("../static/resource/vaccine.json");
      this.globalVaccineLayer = L.layerGroup(vaccineData.map(_, i => {
          L.circle([countryData[i].countryInfo.lat, countryData[i].countryInfo.long],
              {radius: 3000 * Math.sqrt(Object.values(vaccineData[i].timeline)[0])}
          )}
      )).addTo(this.map);
    },

    addLayerControl() {
      this.overlays = {
        '全球矢量图': this.globalTopoLayer,
        '全球疫苗图': this.globalVaccineLayer,
      }
      L.control.layers(this.baseLayers, this.overlays).addTo(this.map)
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
