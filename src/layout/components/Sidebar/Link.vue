<template>
  <a v-if="isExternal" :href="to" target="_blank"></a>
  <router-link v-else :to="to">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
  export default {
    name: 'SidebarLink'
  }
</script>

<script lang="ts" setup>
import {computed} from 'vue'
import { isExternalFn } from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const isExternal = computed(() => {
  return isExternalFn(props.to)
})

const type = () => {
  if (isExternal) {
    return 'a'
  }
  return 'router-link'
}

const linkProps = (to: string) =>{
  console.log(to)
  if (isExternal) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: to
  }
}
</script>
