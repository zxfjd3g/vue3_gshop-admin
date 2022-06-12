<template>
  <common-card title="今日销售额" :value="numberFormat(salesToday)">
    <div class="compare-wrap">
      <div class="compare">
        <div>日同比</div>
        <div class="emphasis">{{salesGrowthLastDay}}%</div>
        <div :class="(salesGrowthLastDay as number)>0 ? 'increment' : 'decrement'"></div>
      </div>
      <div class="compare">
        <div>日同比</div>
        <div class="emphasis">{{salesGrowthLastMonth}}%</div>
        <div :class="(salesGrowthLastMonth as number)>0 ? 'increment' : 'decrement'"></div>
      </div>
    </div>
    <template #bottom>
      <span>昨日销售额</span>
      <span class="emphasis">{{moneyFormat(salesLastDay)}}</span>
    </template>
  </common-card>
</template>

<script lang="ts">
export default {
  name: 'TodaySales'
}
</script>

<script lang="ts" setup>
import useFormat from '@/hooks/useFormat'
import { useDataStore } from '@/stores/reportData';
import { computed } from '@vue/reactivity';

const {numberFormat, moneyFormat} = useFormat()
const dataStore = useDataStore()

const salesToday = computed(() => dataStore.reportData.salesToday)
const salesGrowthLastDay = computed(() => dataStore.reportData.salesGrowthLastDay)
const salesGrowthLastMonth = computed(() => dataStore.reportData.salesGrowthLastMonth)
const salesLastDay = computed(() => dataStore.reportData.salesLastDay)

</script>

<style lang="scss" scoped>
  .compare-wrap {
      height: 100%;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      font-weight: 600;
      color: #666;
      .compare {
        flex: 1;
        display: flex;
        align-items: center;
      }
    }
</style>
