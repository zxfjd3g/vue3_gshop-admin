import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import SidebarItem from './layout/components/Sidebar/SidebarItem.vue'

const app = createApp(App)

app.component(SidebarItem.name, SidebarItem)
ElSvg(app)

app.use(pinia).use(router).use(ElementPlus).mount('#app')
