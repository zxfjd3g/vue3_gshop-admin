<template>
  <el-card class="middle-view">
    <template #header>
      <el-menu :default-active="state.activeIndex" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>

      <div class="right">
        <el-radio-group v-model="state.time" size="default">
          <el-radio-button label="今日"></el-radio-button>
          <el-radio-button label="本周"></el-radio-button>
          <el-radio-button label="本月"></el-radio-button>
          <el-radio-button label="今年"></el-radio-button>
        </el-radio-group>

        <el-date-picker
          v-model="state.time2"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="default"
          :shortcuts="shortcuts"
        />
      </div>
    </template>
    <div class="content">
      <v-chart :option="getOption()" autoresize></v-chart>

      <div class="rank-list">
        <div class="title">{{ state.activeIndex === '1' ? '门店销售额排名' : '门店访问量排名' }}</div>
        <div class="list">
          <div class="list-item" v-for="item in rankData" :key="item.no">
            <div class="no" :class="{ 'top-no': item.no <= 3 }">{{ item.no }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="count">{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'MiddleView',
}
</script>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useDataStore } from '@/stores/reportData';
import { computed } from '@vue/reactivity';

const dataStore = useDataStore()

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const state = reactive({
  activeIndex: '1',
  time: '本周',
  time2: '',
})

const orderFullYearAxis = computed(() => dataStore.reportData.orderFullYearAxis || [])
const orderFullYear = computed(() => dataStore.reportData.orderFullYear || [])
const userFullYearAxis = computed(() => dataStore.reportData.userFullYearAxis || [])
const userFullYear = computed(() => dataStore.reportData.userFullYear || [])
const orderRank = computed(() => dataStore.reportData.orderRank)
const userRank = computed(() => dataStore.reportData.userRank)
const rankData = computed(() => state.activeIndex === '1' ? orderRank.value : userRank.value)

/* 
选择菜单项
*/
const handleSelect = (value: string) => {
  state.activeIndex = value
}

const getOption = () => {
  const text = state.activeIndex === '1' ? '销售趋势' : '访问量趋势'
  return {
    title: {
      text,
      textStyle: {
        fontSize: 14,
        color: '#333'
      },
      left: 10,
    },
    xAxis: {
      type: 'category',
      data: state.activeIndex === '1' ? orderFullYearAxis.value : userFullYearAxis.value,
      axisTick: {
        alignWithLabel: true,
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: '#eee'
        }
      }
    },
    series: [{
      type: 'bar',
      barWidth: '35%',
      data: state.activeIndex === '1' ? orderFullYear.value : userFullYear.value
    }],
    color: '#3398DB',
    grid: {
      top: 50,
      left: 50,
      right: 50,
      bottom: 50
    },
    tooltip: {}
  }
}
</script>

<style lang="scss" scoped>
.middle-view {
  margin-top: 20px;

  :deep(.el-card__header) {
    // display: flex;
    position: relative;
    border-bottom: none;
    padding: 0 20px;

    .right {
      position: absolute;
      top: 0;
      right: 20px;
      height: 100%;
      display: flex;
      align-items: center;

      .el-date-editor {
        margin-left: 20px;
      }
    }
  }

  .content {
    display: flex;
    height: 270px;

    .echarts {
      flex: 5;
    }

    .rank-list {
      flex: 2;

      .title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-top: 20px;
      }

      .list {
        margin-top: 15px;

        .list-item {
          display: flex;
          align-items: center;
          height: 20px;
          font-size: 12px;
          margin: 6px 20px 6px 0;

          .no {
            width: 20px;
            height: 20px;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;

            &.top-no {
              border-radius: 50%;
              background-color: #000;
              color: #fff;
              font-weight: 300;
            }
          }

          .name {
            margin-left: 10px;
          }

          .count {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
