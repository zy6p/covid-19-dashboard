<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b">
    <el-menu-item index="/home" route="true">
      <el-image src="https://static.hotdry.top/logo3.png" >hotdry</el-image>
    </el-menu-item>
    <el-menu-item index="/" route="true">全球疫情</el-menu-item>
    <el-menu-item index="/vaccine" route="true">疫苗接种</el-menu-item>
    <el-menu-item index="/usa" route="true">美国疫情</el-menu-item>
  </el-menu>
</template>

<script>
import 'element-plus/lib/theme-chalk/el-image.css';
import 'element-plus/lib/theme-chalk/el-menu.css';
export default {
  name: "AppHeader",
  data() {
    return {
      activeIndex: '/',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  },
}
</script>

<style scoped>
.el-menu-demo {
  height: 5%;
}

</style>
