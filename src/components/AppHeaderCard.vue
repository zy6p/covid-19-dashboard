<template>
  <el-alert
      :title="title"
      :type="type"
      :center="true"
      :closable="false">
  </el-alert>
</template>

<script>
import 'element-plus/lib/theme-chalk/el-alert.css';
export default {
  name: "AppHeaderCard" ,
  props: {
    title: String,
    type: String,
  },
}
</script>

<style scoped>

</style>
