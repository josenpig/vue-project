import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import api from '../src/axios/axios.js'
import permission from '../src/untis/permission.js'

import * as echarts from 'echarts'

axios.defaults.withCredentials = true;

createApp(App).use(ElementPlus, { locale }).use(router).use(store).use(permission).use(echarts)
    .use(VueAxios, axios).use(ElementPlus).mount('#app')
