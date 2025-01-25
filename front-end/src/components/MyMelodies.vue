<script setup>

import EmbeddedVideo from "@/components/subComponents/EmbeddedVideo.vue";
import Background from "@/components/Background.vue";
import ButtonItem from "@/components/subComponents/ButtonItem.vue";
import ButtonBar from "@/components/subComponents/ButtonBar.vue";
import MyHeading from "@/components/subComponents/MyHeading.vue";
import MyBorder from "@/components/subComponents/MyBorder.vue";
import ThumbnailVideo from "@/components/subComponents/ThumbnailVideo.vue";
import Checkbox from "primevue/checkbox";
import {ref} from "vue";
import {dbInfoStore, userInfoStore} from "@/stores/global-vars.js";

const myMelodies = ref([])
const checkedPieces = ref([])
const index = ref(0)

async function getMelodies() {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`}
  };

  //This fetch returns all the user melodies a user has stored
  const ref = await (await fetch(`${dbInfoStore.url}/user-melody/${userInfoStore.userUUID}`, requestOptions)).json()
  if (!ref.error)
  {
    myMelodies.value = ref.data
  }
  console.log(myMelodies.value)
  for (let x in myMelodies.value)
  {
    console.log(x)
  }
}
getMelodies()

async function removeFromPlaylist() {
  const requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`}
  };

  // const ref = await (await fetch(`${dbInfoStore.url}/user-melody/${userInfoStore.userUUID}/${myMelodies.value[0].userMelodyUUID}`, requestOptions)).json()

  // Loop through checkedPieces and send DELETE requests
  for (const userMelodyUUID of checkedPieces.value) {
    console.log(userMelodyUUID)
    try {
      await fetch(`${dbInfoStore.url}/user-melody/${userInfoStore.userUUID}/${userMelodyUUID}`, requestOptions);
    }
    catch (error) {
      console.error(`Failed to delete piece with UUID ${userMelodyUUID}`, error);
    }
  }

  //reload the thumbnails after pressing remove button
  myMelodies.value = []
  checkedPieces.value = []
  index.value = 0
  await getMelodies()
}
</script>

<template>
  <Background>
    <div>
      <MyHeading>My Melodies</MyHeading>
      <MyBorder class="m-2.5">
        <ButtonBar class="block m-2.5" v-slot="{ counter }">
          <ButtonItem :counter="counter()" group-name="">In Progress</ButtonItem>
          <ButtonItem :counter="counter()" group-name="">For Later</ButtonItem>
          <ButtonItem :counter="counter()" group-name="">Completed</ButtonItem>
        </ButtonBar>
        <div class="flex items-center gap-2 p-1" v-for="melody in myMelodies" :key="melody.pieceUUID" v-if="myMelodies.length !== 0">
          <Checkbox v-model="checkedPieces" :inputId="`${melody.pieceUUID}`" name="thumbnail" :value="`${melody.userMelodyUUID}`" />
          <MyBorder class="p-1">
            <label :for="`${melody.pieceUUID}`"> <ThumbnailVideo :embeddedURL="`${melody.url.split(/(\?v=)/g)[2]}`"></ThumbnailVideo> </label>
            <p>{{melody.name}}</p>
            <p>{{melody.lengthInSeconds}}</p>
          </MyBorder>
        </div>
        <button class="block p-1 m-2.5 text-1 font-bold bg-white/30 hover:bg-white/40" @click="removeFromPlaylist">
          Remove From PlayList
        </button>
      </MyBorder>
    </div>
    <div>
      <div>
        <MyHeading>Selected Piece</MyHeading>
      </div>
      <div v-if="myMelodies.length !== 0">
        <EmbeddedVideo :embeddedURL="`${myMelodies[0].url.split(/(\?v=)/g)[2]}`"/>
      </div>
    </div>
  </Background>
</template>

<style scoped>

</style>