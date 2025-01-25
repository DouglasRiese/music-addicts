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
        width="224"
        height="126"
        :src="`https://www.youtube.com/embed/${embeddedURL}?autohide=1&controls=0&showinfo=0`"
        title="Thumbnail Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
    </iframe>
  </div>
</template>

<style scoped>

</style>