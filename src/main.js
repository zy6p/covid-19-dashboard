import {createApp} from 'vue'
// import { ElMenu, ElImage } from 'element-plus';
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
// import 'element-plus/lib/theme-chalk/el-image.css';
// import 'element-plus/lib/theme-chalk/el-menu.css';
import App from './App.vue'
import Axios from 'axios'
import VueAxios from 'vue-axios'

import 'leaflet/dist/leaflet.css'
import '@/assets/main.css'
import '@/m/matomo'

import router from "./router";

Axios.defaults.baseURL = '/covid-19/data'
Axios.defaults.headers.get['Content-Type'] = 'application/json'

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.use(VueAxios, Axios);
app.mount('#app')
