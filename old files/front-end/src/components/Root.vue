<script>
import { ref } from 'vue';
import NavBar from './NavBar.vue';
import Home from './Home.vue';
import Account from './Account.vue';
import Music from "@/components/Music.vue";
import MyMelodies from "@/components/MyMelodies.vue";
import Admin from "@/components/Admin.vue";
import {userInfoStore} from "@/stores/global-vars.js";

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

<style scoped>

</style>