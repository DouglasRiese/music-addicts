<script setup>
import Background from "@/components/Background.vue";
import MyHeading from "@/components/subComponents/MyHeading.vue";
import MyBorder from "@/components/subComponents/MyBorder.vue";
import ThumbnailVideo from "@/components/subComponents/ThumbnailVideo.vue";
import {dbInfoStore, userInfoStore} from "@/stores/global-vars.js";
import {ref} from "vue";
import ButtonBar from "@/components/subComponents/ButtonBar.vue";
import Slider from "primevue/slider";
import ButtonItem from "@/components/subComponents/ButtonItem.vue";
import MyButton from "@/components/subComponents/MyButton.vue";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
// Value must be an array when defining a range
const range = ref([0, 100])
const availableGenres = ref(['Jazz', 'Classical'])
const selectedGenres = ref(['jazz', 'classical'])

const allMelodies = ref([])
const filteredMelodies = ref([])

async function getAllMelodies() {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`},
  };
  let response = await (await fetch(`${dbInfoStore.url}/melody`, requestOptions)).json()
  if (!response.error) {
    allMelodies.value = response.data
    console.log('all melodies list')
    console.log(allMelodies.value)
  }
}


function filterMelodies() {
  // Empty old list
  filteredMelodies.value = []
  for (let i = 0; i < allMelodies.value.length; i++) {
    const melody = allMelodies.value[i]
    const length = (melody.endTimeMS - melody.startTimeMS) / 1000;

    const isInLengthRange = length > range.value[0] && length < range.value[1];
    const isInGenre = selectedGenres.value.includes(melody.genre.toLowerCase());
    console.log(`for melody ${melody.genre} is ${isInGenre}`)

    if (isInGenre && isInLengthRange) {
      filteredMelodies.value.push(melody);
    }
    console.log('filtering')
    console.log(filteredMelodies.value)

  }
}

getAllMelodies()
filterMelodies()
</script>

<template>
  <Background>
    <MyBorder class="p-3">
      <MyHeading>Sort By:</MyHeading>
      <MyHeading class="text-lg">Length Range: (seconds)</MyHeading>
      <p>Note: melody length is different than piece length</p>
      <div id="rangeSelector" class="w-full">
        <InputText class="w-16" v-model.number="range[0]" placeholder="0" />
        <Slider class="w-full" v-model="range" range />
        <InputText class="w-16" v-model.number="range[1]" placeholder="100"/>
      </div>
      <MyHeading class="text-lg">Genre:</MyHeading>

      <div v-for="genre in availableGenres" :key="genre" class="flex items-center gap-2">
        <Checkbox
            v-model="selectedGenres"
            :inputId="genre.toLowerCase()"
            name="genre"
            :value="genre.toLowerCase()"
        />
        <label :for="genre.toLowerCase()">{{ genre }}</label>
      </div>
      <MyButton @click="filterMelodies">Filter</MyButton>

<!--      <MyHeading>Add to My Melodies:</MyHeading>
      <MyHeading class="text-lg">With Status...</MyHeading>
      <ButtonBar class="item5" v-slot="{ counter }">
        <ButtonItem :counter="counter()">In Progress</ButtonItem>
        <ButtonItem :counter="counter()">For Later</ButtonItem>
        <ButtonItem :counter="counter()">Completed</ButtonItem>
      </ButtonBar>
      <div class="m-1 text-center">
        <MyButton>Add to My Melodies</MyButton>
      </div>-->

    </MyBorder>
    <MyBorder>
      <MyHeading>Find New Melodies</MyHeading>
      <p>Click 'filter' to load melodies</p>
      <MyBorder v-for="melody in filteredMelodies" :key="melody.melodyUUID">
        <ThumbnailVideo :embeddedURL="`${melody.url.split(/(\?v=)/g)[2]}`"></ThumbnailVideo>
      </MyBorder>
    </MyBorder>
  </Background>
</template>

<style scoped>
#rangeSelector {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  align-items: center;
  width: 100%;
}
</style>