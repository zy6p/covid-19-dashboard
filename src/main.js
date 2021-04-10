import {createApp} from 'vue'
// import { ElMenu, ElImage } from 'element-plus';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
// import 'element-plus/lib/theme-chalk/el-image.css';
// import 'element-plus/lib/theme-chalk/el-menu.css';
import App from './App.vue'

import 'leaflet/dist/leaflet.css'

import Axios from 'axios'
import router from "./router";

Axios.defaults.baseURL = '/covid-19/data'
Axios.defaults.headers.get['Content-Type'] = 'application/json'

const app = createApp(App);
app.use(router).use(ElementPlus).mount('#app')
