<template>
  <el-menu
      :default-active="activeIndex"
      active-text-color="#ffd04b"
      background-color="#545c64"
      class="el-menu-demo"
      mode="horizontal"
      router="true"
      text-color="#fff"
      @select="handleSelect">
    <el-menu-item >
      <el-image alt="hotdry"
                src="https://static.hotdry.top/logo3.png"></el-image>
    </el-menu-item>
    <el-menu-item index="/">今日疫情</el-menu-item>
    <el-menu-item index="/trend">疫情走势</el-menu-item>
    <el-menu-item index="/about">关于本站</el-menu-item>
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
      this.activeIndex = keyPath;
    }
  },
}
</script>

<style scoped>
.el-menu-demo {
  height: 5%;
}

</style>
