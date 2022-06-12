import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import {installVueEcharts} from './plugins/chart'
import './mockServer'
import CommonCard from './views/home/components/CommonCard.vue'

const app = createApp(App)

app.component(CommonCard.name, CommonCard)

installVueEcharts(app)

ElSvg(app)

app.use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
