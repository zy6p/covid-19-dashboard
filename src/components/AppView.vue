<template>
  <div class="main">
    <Header></Header>
  </div>
  <router-view></router-view>
</template>

<script>
import Header from "./AppHeader";

export default {
  name: "AppView",
  components: {
    Header,
  }
}
</script>

<style scoped>

</style>
