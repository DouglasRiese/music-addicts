<script setup>

import MyHeading from "@/components/subComponents/MyHeading.vue";
import ButtonItem from "@/components/subComponents/ButtonItem.vue";
import ButtonBar from "@/components/subComponents/ButtonBar.vue";
import Checkbox from 'primevue/checkbox';
import MyButton from "@/components/subComponents/MyButton.vue";
import InputText from 'primevue/inputtext';
import Slider from 'primevue/slider';
import { ref } from 'vue'
import MyBorder from "@/components/subComponents/MyBorder.vue";

// Value must be an array when defining a range
const value = ref([0,100])
</script>

<template>
  <MyBorder class="p-1">
    <MyHeading>Sort By:</MyHeading>
    <MyHeading class="text-lg">Length Range:</MyHeading>
    <div id="rangeSelector">
      <InputText class="w-16" v-model.number="value[0]" placeholder="0" />
      <Slider class="w-full" v-model="value" range />
      <InputText class="w-16" v-model.number="value[1]" placeholder="100"/>
    </div>
    <MyHeading class="text-lg">Genre:</MyHeading>

    <div class="flex items-center gap-2">
      <Checkbox inputId="genre1" name="genre" value="Jazz" />
      <label for="genre1"> Jazz </label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox inputId="genre2" name="genre" value="Classical" />
      <label for="genre2"> Classical </label>
    </div>
    <div class="flex items-center gap-2">
      <Checkbox inputId="genre3" name="genre" value="Pop" />
      <label for="genre3"> Pop </label>
    </div>

    <MyHeading>Add to My Melodies:</MyHeading>
    <MyHeading class="text-lg">With Status...</MyHeading>
    <ButtonBar class="item5" v-slot="{ counter }">
      <ButtonItem :counter="counter()">In Progress</ButtonItem>
      <ButtonItem :counter="counter()">For Later</ButtonItem>
      <ButtonItem :counter="counter()">Completed</ButtonItem>
    </ButtonBar>
    <div class="m-1 text-center">
      <MyButton>Add to My Melodies</MyButton>
    </div>
  </MyBorder>
</template>

<style scoped>
#rangeSelector {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
}
</style>