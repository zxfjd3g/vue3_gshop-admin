<template>
  <div class="home">
    <top-view />
    <middle-view />
    <bottom-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import TopView from './components/TopView.vue'
import MiddleView from './components/MiddleView.vue'
import BottomView from './components/BottomView.vue'
import { useDataStore } from '@/stores/reportData';
import { onMounted } from 'vue';

const dataStore = useDataStore()

onMounted(() => dataStore.getData())
</script>

<style scoped>
  .home {
    width: 100%;
    padding: 20px;
    background: #eee;
  }
</style>
