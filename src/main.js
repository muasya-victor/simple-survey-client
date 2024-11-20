import { createApp } from 'vue'
import './style.css'
import "@/index.css"
import App from './App.vue'
import router from "./router/index.js";
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App);
app.use(router)
app.mount('#app')
