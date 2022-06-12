<template>
  <common-card title="累计用户数" :value="numberFormat(usersTotal)">
    <v-chart :option="getOption()" autoresize />
    <template v-slot:bottom>
      <div class="total-users-bottom">
        <div>日同比</div>
        <div class="emphasis">{{ userGrowthLastDay }}%</div>
        <div class="increment"></div>
        <div class="right">月同比</div>
        <div class="emphasis">{{ userGrowthLastMonth }}%</div>
        <div class="decrement"></div>
      </div>
    </template>
  </common-card>
</template>

<script lang="ts">
export default {
  name: 'TotalUsers',
}
</script>

<script lang="ts" setup>
import useFormat from '@/hooks/useFormat';
import { useDataStore } from '@/stores/reportData';
import { computed } from '@vue/reactivity';

const dataStore = useDataStore()
const { numberFormat } = useFormat()

const usersTotal = computed(() => dataStore.reportData.usersTotal)
const usersLastMonth = computed(() => dataStore.reportData.usersLastMonth)
const userGrowthLastDay = computed(() => dataStore.reportData.userGrowthLastDay)
const userGrowthLastMonth = computed(() => dataStore.reportData.userGrowthLastMonth)

const getOption = () => {
  return {
    xAxis: {
      // 去掉两边留白
      boundaryGap: false,
      // 不显示
      show: false,

      min: 0, // x轴最小值
      max: usersTotal.value // x轴最大值
    },
    yAxis: {
      type: 'category', // y轴为类目轴 => 水平柱状图
      show: false // 不显示y轴
    },
    series: {
      name: '用户增长量',
      type: 'bar',
      data: [(usersTotal.value as number) - (usersLastMonth.value as number)],
      // 柱条的宽度
      barWidth: 10,

      // 展示背景
      showBackground: true,
      // 背景样式
      backgroundStyle: {
        // 背景色
        color: '#eee'
      },

      // 柱条样式
      itemStyle: {
        color: 'yellowgreen'
      },

      // 柱条显示的内容
      label: {
        show: true, // 显示
        formatter: '|', // 显示的具体内容
        position: 'right', // 内容的位置
        color: 'yellowgreen' // 颜色
      }
    },
    grid: {
      left: 0,
      top: 0,
      bottom: 0,
      right: 0
    },
    // 显示提示
    tooltip: {
      // formatter (params) {
      //   // console.log(params)
      //   const {seriesName, marker, value} = params
      //   return `${seriesName}<br>${marker}${value}`
      // },
      trigger: 'axis',
    }
  }
}
</script>

<style lang="scss" scoped>
.total-users-bottom {
  display: flex;
  align-items: center;

  .right {
    margin-left: 10px;
  }
}
</style>
