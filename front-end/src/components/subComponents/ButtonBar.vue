<script setup>
import { ref } from 'vue'

const counter = ref(0)
const incrementCounter = () => counter.value++
</script>

<template>
  <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
    <slot :counter="incrementCounter"></slot>
  </div>
</template>

<style scoped>
</style>