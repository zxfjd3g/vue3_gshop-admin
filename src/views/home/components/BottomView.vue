<template>
  <div class="bottom-view">
    <el-card shadow="hover" class="view">
      <template #header>
        <div>关键词搜索</div>
      </template>

      <div class="search-view">
        <div class="chart-wrap">
          <div class="chart">
            <div class="title">搜索用户数</div>
            <div class="count">{{ numberFormat(lineChartData.totalUser) }}</div>
            <v-chart :option="getLineOption('userList', '搜索用户数')" autoresize></v-chart>
          </div>
          <div class="chart">
            <div class="title">搜索量</div>
            <div class="count">{{ numberFormat(lineChartData.totalCount) }}</div>
            <v-chart :option="getLineOption('countList', '搜索量')" autoresize></v-chart>
          </div>
        </div>
        <div class="search-table">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="rankNo" label="排名">
            </el-table-column>
            <el-table-column prop="word" label="关键字">
            </el-table-column>
            <el-table-column prop="count" label="搜索数量">
            </el-table-column>
            <el-table-column prop="user" label="搜索用户数">
            </el-table-column>
            <el-table-column prop="range" label="搜索占比">
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="tableTotalData.length" v-model:current-page="currentPage"
            :page-size="pageSize">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <el-card shadow="hover" class="view">
      <template #header>
        <div>分类销售排行</div>
        <el-radio-group v-model="radioSelect" size="small">
          <el-radio-button label="品类"></el-radio-button>
          <el-radio-button label="商品"></el-radio-button>
        </el-radio-group>
      </template>

      <div class="search-view">
        <v-chart :option="getPieOption()" autoresize />
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BottomView',
}
</script>

<script lang="ts" setup>
import useFormat from '@/hooks/useFormat';
import { useDataStore } from '@/stores/reportData';
import { computed, ref } from 'vue';

const { numberFormat } = useFormat()
const radioSelect = ref('品类')
const currentPage = ref(1)
const pageSize = ref(5)
const dataStore = useDataStore()
const searchWord = computed(() => dataStore.reportData.searchWord)
const saleRank = computed(() => dataStore.reportData.saleRank)

const tableTotalData = computed(() => {
  if (!searchWord.value) return []
  return searchWord.value.map((item, index) => ({
    ...item,
    rankNo: index + 1,
    range: (item.user / item.count * 100).toFixed(2) + '%',
  }))
})

const tableData = computed(() => {
  return tableTotalData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const lineChartData = computed(() => {
  const data = {
    wordList: [] as string[],
    userList: [] as number[],
    countList: [] as number[],
    totalUser: 0,
    totalCount: 0
  }
  if (tableTotalData.value && tableTotalData.value.length > 0) {
    tableTotalData.value.forEach(item => {
      data.wordList.push(item.word)
      data.userList.push(item.user)
      data.countList.push(item.count)
      data.totalUser += item.user
      data.totalCount += item.count
    })
  }

  return data
})

const pieChartData = computed(() => {
  const data = {
    categoryList: [] as any[],
    cTotal: 0,
    goodsList: [] as any[],
    gTotal: 0
  }

  if (saleRank.value) {
    const { category: { axisX, data1 }, goods: { axisX: axisX2, data1: data2 } } = saleRank.value
    const total = data1.reduce((pre, item) => pre + item, 0)
    data.cTotal = total

    axisX.forEach((item, index) => {
      const percent = (data1[index] / total * 100).toFixed(2) + '%'
      data.categoryList.push({
        name: item + '|' + percent,
        value: data1[index],
        percent,
        labelName: item
      })
    })

    const total2 = data2.reduce((pre, item) => pre + item, 0)
    data.gTotal = total2
    axisX2.forEach((item, index) => {
      const percent = (data2[index] / total2 * 100).toFixed(2) + '%'
      data.goodsList.push({
        name: item + '|' + percent,
        value: data2[index],
        percent,
        labelName: item
      })
    })
  }

  return data
})

const getLineOption = (listName: 'userList' | 'countList', name: string) => {
  return {
    xAxis: {
      boundaryGap: false,
      data: lineChartData.value.wordList
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name, // 名称
        type: 'line',
        // 列表数据
        data: lineChartData.value[listName],
        // 线条光滑
        smooth: true,
        // 区域的样式
        areaStyle: {
          color: '#C7E7FF'
        },
        // 点项的样式
        itemStyle: {
          opacity: 0
        },
        // 线的样式
        lineStyle: {
          color: '#5FBBFF'
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
      trigger: 'axis'
    }
  }
}

const getPieOption = () => {
  const { categoryList, goodsList, cTotal, gTotal } = pieChartData.value

  const list = radioSelect.value === '品类' ? categoryList : goodsList
  const total = radioSelect.value === '品类' ? cTotal : gTotal

  return {
    // 标题
    title: [
      {
        text: `${radioSelect.value}分布`,
        textStyle: {
          fontSize: 14,
          color: '#666'
        },
        left: 20,
        top: 20
      },

      {
        text: '累计订单量',
        subtext: total,
        textStyle: {
          fontSize: 14,
          color: '#999'
        },
        subtextStyle: {
          fontSize: 28,
          color: '#333'
        },
        left: '34.5%',
        top: '42.5%',
        textAlign: 'center'
      }
    ],
    // tooltip: {
    //   trigger: 'item',
    // },
    legend: {
      orient: "vertical",
      left: '70%',
      top: 'middle',
      textStyle: {
        color: '#8c8c8c'
      }
    },
    series: [
      {
        name: `${radioSelect.value}分布`,
        // 列表数据
        data: list,

        type: 'pie',
        // 中心点坐标
        center: ['35%', '50%'],
        // 圆环的半径
        radius: ['35%', '50%'],
        // 不用防止标签文本与图重叠(圆环图)
        avoidLabelOverlap: false,
        // 间隔区域样式
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        // 图表项的标题
        label: {
          // 在环的外侧
          position: 'outside',
          // 指定特定标题
          formatter: function (params: any) {
            return params.data.labelName
          }
        },
        // 标签的视觉引导线
        labelLine: {
          length: 7,
          length2: 5,
        },
      }
    ],
    // 提示
    tooltip: {
      // 整个图表项触发
      trigger: 'item',
      // 提示内容及样式
      formatter: (params: any) => {
        /* 
        data: 当前项数据
        marker: 内置提供的圆点标签
        */
        // console.log(params)
        return `${radioSelect.value}分布<br>
                  ${params.marker + params.data.labelName}<br>
                  ${params.marker}数量: ${params.data.value}<br>
                  ${params.marker}占比: ${params.data.percent}
                `
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-view {
  display: flex;
  margin-top: 20px;

  .view {
    flex: 1;

    &:first-child {
      margin-right: 10px;
    }

    &:last-child {
      margin-left: 10px;
    }

    :deep(.el-card__header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }

    .search-view {
      height: 450px;
      display: flex;
      flex-direction: column;

      .chart-wrap {
        display: flex;

        .chart {
          flex: 1;

          &:first-child {
            margin-right: 5px;
          }

          &:last-child {
            margin-left: 5px;
          }

          .title {
            font-size: 14px;
            color: #999;
          }

          .count {
            font-size: 22px;
            color: #333;
            font-weight: 500;
            letter-spacing: 2px;
          }

          .echarts {
            height: 50px;
          }
        }
      }

      .search-table {
        flex: 1;
        margin-top: 20px;

        .el-pagination {
          text-align: right;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
