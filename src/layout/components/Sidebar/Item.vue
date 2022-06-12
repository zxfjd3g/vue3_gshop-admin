<template #title>
  <span>
    <svg-icon v-if="props.icon" :name="props.icon" />
    <span v-if="props.title && appStore.sidebar.opened">{{props.title}}</span>
  </span>
</template>

<script lang="ts">
  export default {
    name: 'MenuItem'
  }
</script>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app';

const appStore = useAppStore()
const props = defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
