<template>
  <el-alert
      :center="true"
      :closable="false"
      :title="title"
      :type="type">
  </el-alert>
</template>

<script>
import 'element-plus/lib/theme-chalk/el-alert.css';

export default {
  name: "AppHeaderCard",
  props: {
    title: String,
    type: String,
  },
}
</script>

<style scoped>

</style>
