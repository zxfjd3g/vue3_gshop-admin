import * as $echarts from 'echarts'
import type { App } from 'vue'
import VueEcharts from 'vue-echarts'

const installVueEcharts = (app: App) => {
  app.component('v-chart', VueEcharts)
}

export {
  $echarts,
  installVueEcharts
}