<script setup>
import EmbeddedVideo from "@/components/subComponents/EmbeddedVideo.vue";
import Background from "@/components/Background.vue";
import ButtonBar from "@/components/subComponents/ButtonBar.vue";
import ButtonItem from "@/components/subComponents/ButtonItem.vue";
import MyHeading from "@/components/subComponents/MyHeading.vue";
import {dbInfoStore, userInfoStore} from "@/stores/global-vars.js";
import {ref} from "vue";


const randomURL = ref('rBrd_3VMC3c')
const selectedStatus = ref('in-progress')

async function nextPiece() {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  };
  let response = await (await fetch(`${dbInfoStore.url}/piece/random`, requestOptions)).json()
  // Keep making request until I get a different url
  while (randomURL.value === response.data.url.split(/(\?v=)/g)[2]) {
    response = await (await fetch(`${dbInfoStore.url}/piece/random`, requestOptions)).json()
  }
  randomURL.value = response.data.url.split(/(\?v=)/g)[2]
}


async function addToMyMelodies() {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `${userInfoStore.token}` },
    body: JSON.stringify({})
  };
  await fetch(`${dbInfoStore.url}/user/logout`, requestOptions)

}

</script>

<template>
  <Background>
    <div class="wrapper">
      <MyHeading class="item1">Random Piece</MyHeading>
      <button @click="nextPiece" class="item2 p-2 text-xl mb-6 font-bold bg-white/30 hover:bg-white/40">Next</button>
      <div v-if="userInfoStore.isLoggedIn">
        <MyHeading class="item3">Add to My Melodies</MyHeading>
        <h2 class="item4">With Status...</h2>
        <ButtonBar class="item5" v-slot="{ counter }">
          <ButtonItem :group-name="'r1'" :counter="counter()" @click="selectedStatus='in-progress'">In Progress</ButtonItem>
          <ButtonItem :group-name="'r1'" :counter="counter()" @click="selectedStatus='for-later'">For Later</ButtonItem>
          <ButtonItem :group-name="'r1'" :counter="counter()" @click="selectedStatus='completed'">Completed</ButtonItem>
        </ButtonBar>
        <br>
        <button @click="addToMyMelodies"  class="item6 p-1 mt-3 text-l mb-3 font-bold bg-white/30 hover:bg-white/40">Add to My Melodies</button>
      </div>
      <EmbeddedVideo class="item7" :embeddedURL="`${randomURL}`"/>
    </div>
  </Background>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 10% 30% 10% 10% 20% 10%;
  grid-template-areas:
    "a g"
    "b g"
    "c g"
    "d g"
    "e g"
    "f g"
}

.item1 {
  grid-area: a;
  align-self: center;
  justify-self: center;
}

.item2 {
  grid-area: b;
  align-self: center;
  justify-self: center;
}

.item3 {
  grid-area: c;
  align-self: center;
  justify-self: center;
}

.item4 {
  grid-area: d;
  align-self: center;
  justify-self: center;
}

.item5 {
  grid-area: e;
  align-self: center;
  justify-self: center;
}

.item6 {
  grid-area: f;
  align-self: center;
  justify-self: center;
}

.item7 {
  grid-area: g;
}
</style>