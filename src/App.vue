<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
html, body {
  height: 100%;
  /*overflow-x: hidden;*/
  /*overflow-y: scroll;*/
}

#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.router-view {
  width: 100%;
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
}
</style>
