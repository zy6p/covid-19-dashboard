<template>
  <div id="map" > </div>
</template>

<script>
import L from "leaflet"
import 'leaflet/dist/leaflet.css'

export default {
  name: "Home",
  data () {
    return {
      map: null
    }
  },
  mounted() {
    this.initBaseMap();
  },

  methods: {
    initBaseMap() {
      this.map = L.map('map').setView([51.505, -0.09], 5);

      L.tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }
      ).addTo(this.map)

    }

  }
}
</script>

<style scoped>
#map{
  margin: 0;
  width: 100%;
  height: 100%;
}

</style>
