<script setup>
import InputText from 'primevue/inputtext';
import '@/assets/tailwind-styles.css';
import Background from "@/components/Background.vue";
import {userInfoStore} from "@/stores/global-vars.js";
import {dbInfoStore} from "@/stores/global-vars.js";
import {ref} from "vue";

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function login() {
  // Check if username and password fields have data
  if (!(username.value && password.value)) {
    errorMessage.value = "Username and password are required";
    return
  }

  // login request
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username.value, password: password.value })
  };
  const loginResponse = await (await fetch(`${dbInfoStore.url}/user/login`, requestOptions)).json()



  if (loginResponse.error) {
    console.log('status: ' + loginResponse.error.statusCode)
    console.log('message: ' + loginResponse.error.message)
    console.log('data: ' + loginResponse.error.data)
    errorMessage.value = loginResponse.error.message
  } else {
    // Save values to global variables
    userInfoStore.userUUID = loginResponse.data.userUUID
    userInfoStore.token = loginResponse.data.token
    userInfoStore.username = loginResponse.data.username
    userInfoStore.isLoggedIn = true
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`},
    };
    const res = await (await fetch(`${dbInfoStore.url}/user/isAdmin`, requestOptions)).json()
    userInfoStore.isAdmin = res.statusCode === 200
    // clear error
    errorMessage.value = null
  }

  // Clear password input
  password.value = ''

}

function logout() {
  console.log('logout requested for: ' + userInfoStore.username)
  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `${userInfoStore.token}` },
  };
  fetch(`${dbInfoStore.url}/user/logout`, requestOptions)
  userInfoStore.token = ''
  userInfoStore.username = ''
  userInfoStore.username = ''
  userInfoStore.isloggedIn = false
  userInfoStore.isAdmin = false
  window.location.reload()
}

async function register() {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username.value, password: password.value })
  };
  const loginResponse = await (await fetch(`${dbInfoStore.url}/user/create`, requestOptions)).json()
  if (loginResponse && loginResponse.statusCode === 201) {
    await login()
  } else {
    console.log(loginResponse)
    errorMessage.value = loginResponse.error.message
  }
}

</script>

<template>
  <Background>
    <div class="p-12 shadow text-center lg:w-[30rem] backdrop-blur-md rounded-xl bg-[rgba(255,255,255,0.1)]">
      <div class="text-4xl font-medium mb-12 text-primary-contrast">Welcome: {{userInfoStore.username}}</div>
      <InputText
          v-model="username"
          v-if="!userInfoStore.isLoggedIn"
          type="text"
          class="!appearance-none placeholder:!text-primary-contrast/40 !border-0 !p-4 !w-full !outline-0 !text-xl !block !mb-6 !bg-white/10 !text-primary-contrast/70 !rounded-full"
          placeholder="Username"/>
      <InputText
          v-model="password"
          v-on:keyup.enter="login"
          v-if="!userInfoStore.isLoggedIn"
          type="password"
          class="!appearance-none placeholder:!text-primary-contrast/40 !border-0 !p-4 !w-full !outline-0 !text-xl !mb-6 !bg-white/10 !text-primary-contrast/70 !rounded-full"
          placeholder="Password"/>
      <button
          @click="login"
          v-if="!userInfoStore.isLoggedIn"
          type="button"
          class="max-w-40 w-full rounded-full appearance-none border-0 p-4 outline-0 text-xl mb-6 font-medium bg-white/30 hover:bg-white/40 active:bg-white/20 text-primary-contrast/80 cursor-pointer transition-colors duration-150">
        Sign In
      </button>
      <button
          @click="logout"
          v-if="userInfoStore.isLoggedIn"
          type="button"
          class="max-w-40 w-full rounded-full appearance-none border-0 p-4 outline-0 text-xl mb-6 font-medium bg-white/30 hover:bg-white/40 active:bg-white/20 text-primary-contrast/80 cursor-pointer transition-colors duration-150">
        Log Out
      </button>
      <button
          @click="register"
          v-if="!userInfoStore.isLoggedIn"
          type="button"
          class="max-w-40 w-full rounded-full appearance-none border-0 p-4 outline-0 text-xl mb-6 font-medium bg-white/30 hover:bg-white/40 active:bg-white/20 text-primary-contrast/80 cursor-pointer transition-colors duration-150">
        Register
      </button>
      <p v-if="errorMessage" class="status-red">
        {{ errorMessage }}
      </p>

    </div>
  </Background>
</template>

<style scoped>
</style>