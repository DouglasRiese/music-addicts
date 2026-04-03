<script setup>
defineProps({
  embeddedURL: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="flex justify-center">
    <iframe
        width="560"
        height="315"
        :src="`https://www.youtube.com/embed/${embeddedURL}/autoplay=1`"
        title="Home Page Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
  </div>
</template>

<style scoped>

</style>