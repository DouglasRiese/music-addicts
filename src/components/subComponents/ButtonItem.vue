

<script setup>
defineProps({
  counter: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  groupName: {
    type: String,
    required: true
  }
})
</script>

<template>
<!-- @click=$emit('click' is required or click events will not be registered -->
  <input type="radio" :checked="isSelected" class="btn-check" :name="groupName" :id="`${groupName}-${counter}`" autocomplete="off" @click="$emit('click')">
  <label class="btn btn-danger" :class="isSelected ? 'btn-primary' : 'btn-danger'"  :for="`${groupName}-${counter}`">
    <slot></slot>
  </label>
</template>

<style scoped>

</style>