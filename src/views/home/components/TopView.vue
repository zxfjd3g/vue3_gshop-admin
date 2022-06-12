<template>
  <el-row :gutter="10" class="top-view">
    <el-col :span="6">
      <today-sales />
    </el-col>
    <el-col :span="6">
      <today-orders />
    </el-col>
    <el-col :span="6">
      <today-users />
    </el-col>
    <el-col :span="6">
      <total-users />
    </el-col>
  </el-row>
</template>
<script lang="ts">
export default {
  name: 'TopView',
}
</script>

<script lang="ts" setup>
import TodaySales from './TodaySales.vue'
import TodayOrders from './TodayOrders.vue'
import TodayUsers from './TodayUsers.vue'
import TotalUsers from './TotalUsers.vue'
</script>

<style lang="scss">
  .top-view {
    .emphasis {
      margin: 0 5px;
      font-size: 12px;
      font-weight: 700;
    }
    .increment {
      width: 0;
      height: 0;
      border-width: 4px;
      border-color: transparent transparent green transparent;
      border-style: solid;
    }
    .decrement {
      width: 0;
      height: 0;
      border-width: 4px;
      border-color: red transparent transparent transparent;
      border-style: solid;
    }
  }
</style>