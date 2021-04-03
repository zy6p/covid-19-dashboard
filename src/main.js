import { createApp } from 'vue'
import App from './App.vue'
// import Home from "./views/Home";

import router from "./router";

const app = createApp(App);
app.use(router).mount('#app')
// createApp(App).mount('#app')
// createApp(Home).mount('#mainMap')
