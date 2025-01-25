<script>
import '@/assets/tailwind-styles.css';
import {userInfoStore} from "@/stores/global-vars.js";
import {defineComponent} from "vue";

export default defineComponent({
  computed: {
    userInfoStore() {
      return userInfoStore
    }
  }
})


</script>

<template>
  <div class="p-2 justify-center">
    <nav class="nav-bar cursor-pointer font-medium block text-center text-primary-contrast">
      <a class="p-1 m-0.5 shadow rounded-xl bg-[rgba(255,255,255,1.0)]" @click="$emit('navigate', 'Home')">Home</a>
      <a v-if="userInfoStore.isLoggedIn" class="p-1 m-0.5 shadow rounded-xl bg-[rgba(255,255,255,1.0)]" @click="$emit('navigate', 'Music')">Music</a>
      <a v-if="userInfoStore.isLoggedIn" class="p-1 m-0.5 shadow rounded-xl bg-[rgba(255,255,255,1.0)]" @click="$emit('navigate', 'MyMelodies')">My Melodies</a>
      <a class="p-1 m-0.5 shadow rounded-xl bg-[rgba(255,255,255,1.0)]" @click="$emit('navigate', 'Account')">Account</a>
      <a v-if="userInfoStore.isAdmin" class="p-1 m-0.5 shadow rounded-xl bg-[rgba(255,255,255,1.0)]" @click="$emit('navigate', 'Admin')">Admin</a>
      <Button/>
    </nav>
  </div>
</template>

<style scoped>
</style>