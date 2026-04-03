<script setup>

</script>

<template>
  <div class="px-6 py-20 md:px-12 lg:px-20 bg-[linear-gradient(-225deg,var(--p-sky-500),var(--p-sky-700)_48%,var(--p-sky-800))] dark:bg-[linear-gradient(-225deg,var(--p-sky-400),var(--p-sky-600)_48%,var(--p-sky-800))]">
    <slot>
<!--      Code between the <Background> </Background> tags is inserted here-->
    </slot>
  </div>
</template>

<style scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>