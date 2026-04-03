<script lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import NavBar from './components/NavBar.vue';
import Home from './components/Home.vue';
import Account from './components/Account.vue';
import Music from "@/components/Music.vue";
import MyMelodies from "@/components/MyMelodies.vue";
import Admin from "@/components/Admin.vue";
import {userInfoStore} from "@/stores/global-vars.ts";

const name = ref('Unknown')

const getName = async () => {
  const res = await fetch('/api/')
  const data = await res.json()
  name.value = data.name
}

export default {
  computed: {
    userInfoStore() {
      return userInfoStore
    }
  },

  components: {
    Admin,
    MyMelodies,
    Music,
    NavBar,
    Home,
    Account,
  },
  // Setup for reactive state handling
  setup() {
    const activeComponent = ref('Home');

    function handleNavigation(componentName) {
      activeComponent.value = componentName;
    }

    return { activeComponent, handleNavigation };
  }
};
</script>

<template>
  <NavBar @navigate="handleNavigation" />
  <!--  Components are rendered conditionally-->
  <!--  Clicking on a NavBar link decides which component is rendered-->
  <Home v-if="activeComponent === 'Home'" />
  <Account v-if="activeComponent === 'Account'" />
  <Music v-if="activeComponent === 'Music'" />
  <MyMelodies v-if="activeComponent === 'MyMelodies'" />
  <Admin v-if="activeComponent === 'Admin' && userInfoStore.isAdmin" />
</template>

<!--<template>-->
<!--  <header>-->
<!--    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />-->

<!--    <div class="wrapper">-->
<!--      <HelloWorld msg="You did it!" />-->
<!--      <button class="green" @click="getName" aria-label="get name">-->
<!--        Name from API is: {{ name }}-->
<!--      </button>-->
<!--      <p>Edit <code>server/index.ts</code> to change what the API gets</p>-->
<!--      <nav>-->
<!--        <RouterLink to="/">Home</RouterLink>-->
<!--        <RouterLink to="/about">About</RouterLink>-->
<!--      </nav>-->
<!--    </div>-->
<!--  </header>-->

<!--  <RouterView />-->
<!--</template>-->

<style scoped>

</style>
