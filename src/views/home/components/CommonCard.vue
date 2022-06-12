<template>
  <el-card class="common-card">
    <div class="title">{{title}}</div>
    <div class="value">{{value}}</div>
    <div class="chart">
      <slot></slot> <!-- 默认插槽 -->
    </div>
    <div class="line"></div>
    <div class="bottom">
      <slot name="bottom"></slot> <!-- 具名插槽 -->
    </div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'CommonCard',
  props: ['title', 'value'],
}
</script>

<style lang="scss" scoped>
  .common-card {
    .title {
      font-size: 12px;
      color: #999;
    }
    .value {
      font-size: 25px;
      margin: 5px 0;
      letter-spacing: 1px;
    }
    .chart {
      height: 50px;
    }
    .line {
      border: 1px #eee solid;
      margin: 10px 0;
    }
    .bottom {
      font-size: 12px;
      color: #666;
    }
  }
</style>
