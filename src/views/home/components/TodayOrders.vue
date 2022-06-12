<template>
  <common-card title="今日订单" :value="numberFormat(orderToday)">
    <div ref="chartRef" style="width:100%;height:100%"></div>
    <template v-slot:bottom>
      <span>昨日订单量</span>
      <span class="emphasis">{{moneyFormat(orderLastDay)}}</span>
    </template>
  </common-card>
</template>

<script lang="ts">
export default {
  name: 'TodayOrders',
}
</script>

<script lang="ts" setup>
import useFormat from '@/hooks/useFormat';
import { $echarts } from '@/plugins/chart';
import { useDataStore } from '@/stores/reportData';
import type { EChartsType } from 'echarts';
import { computed, onMounted, ref, watch } from 'vue';

const {numberFormat, moneyFormat} = useFormat()
const dataStore = useDataStore()


const orderToday = computed(() => dataStore.reportData.orderToday as number)
const orderLastDay = computed(() => dataStore.reportData.orderLastDay as number)
const orderTrend = computed(() => dataStore.reportData.orderTrend || [])
const orderTrendAxis = computed(() => dataStore.reportData.orderToday||[])
const chartRef = ref()
let chart: EChartsType

const getOption = () => {
  return {
    xAxis: {
      boundaryGap: false, // 两侧不留空白
      data: orderTrendAxis.value // x轴数据列表
    },
    yAxis: {
      show: false // 不显示y轴及标线
    },
    series: [
      {
        name: '实时订单数',
        type: 'line',
        // 列表数据
        data: orderTrend.value,
        // 线条光滑
        smooth: true,
        // 区域的样式
        areaStyle: {
          color: 'purple'
        },
        // 折线点的样式
        itemStyle: {
          opacity: 0
        },
        // 线的样式
        lineStyle: {
          opacity: 0
        }
      }
    ],
    // 图表在坐标中显示的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    // 显示提示
    tooltip: {
      trigger: 'axis',
      confine: true,
    }
  }
}

onMounted(() => {
  chart = $echarts.init(chartRef.value)
  chart.setOption(getOption())

  window.addEventListener('resize', () => {
    chart && chart.resize()
  })
}) 

watch(orderToday, () => {
  chart.setOption(getOption())
})

</script>

<style lang="scss" scoped>

</style>
