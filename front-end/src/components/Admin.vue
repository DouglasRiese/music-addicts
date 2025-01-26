<script setup>

import Background from "@/components/Background.vue";
import MyBorder from "@/components/subComponents/MyBorder.vue";
import MyHeading from "@/components/subComponents/MyHeading.vue";
import ButtonBar from "@/components/subComponents/ButtonBar.vue";
import ButtonItem from "@/components/subComponents/ButtonItem.vue";
import MyButton from "@/components/subComponents/MyButton.vue";
import {dbInfoStore, userInfoStore} from "@/stores/global-vars.js";
import {ref} from "vue";

// on load request list of all users from db
const users = ref()
const userToUpdate = ref()
const counter = ref(1)
async function getUsers() {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`},
  };
  const res = await (await fetch(`${dbInfoStore.url}/user/all`, requestOptions)).json()

  users.value = res.data
}

async function updateAccessLevel(userUUID, newLevel) {
  console.log(`updating ${userUUID} to ${newLevel}`)

  let wantsToLowerOwnPermission
  // check if updating onw access level
  if (userUUID === userInfoStore.userUUID) {
    wantsToLowerOwnPermission = confirm('Are you sure you want to lower your permissions?')
  }


  const selectedUser = users.value.find(u => u.userUUID === userUUID)
  if (selectedUser) {
    selectedUser.accessLevel = newLevel
  }

  const requestOptions = {
    method: 'PUT',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`},
    body: JSON.stringify({userUUID: userUUID, accessLevel: newLevel})

  };

  if (userUUID === userInfoStore.userUUID && wantsToLowerOwnPermission) {
    const res = await (await fetch(`${dbInfoStore.url}/user/${userUUID}/access`, requestOptions)).json()
    // TODO kick out of page

    // select back admin


  }
  else if (userUUID === userInfoStore.userUUID && !wantsToLowerOwnPermission) {
    // do nothing
  }
  else {
    const res = await (await fetch(`${dbInfoStore.url}/user/${userUUID}/access`, requestOptions)).json()
  }




}

async function deleteUser(user) {
  const requestOptions = {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json', Authorization: `${userInfoStore.token}`},
  };
  const res = await (await fetch(`${dbInfoStore.url}/user/${user.userUUID}`, requestOptions)).json()
  if (!res.error) {
    const userIndex = users.value.indexOf(user)
    users.value.splice(userIndex, 1)
  }

}

getUsers()

</script>

<template>
  <Background>
    <MyBorder>
      <MyHeading>All Users</MyHeading>
      <MyBorder v-for="user in users" :key="user.userUUID">
        {{ user.username }}
        <ButtonBar>
          <ButtonItem :group-name=user.userUUID :counter="1" :is-selected="user.accessLevel ==='read'" @click="updateAccessLevel(user.userUUID,'read')">Read</ButtonItem>
          <ButtonItem :group-name=user.userUUID :counter="2" :is-selected="user.accessLevel ==='write'" @click="updateAccessLevel(user.userUUID,'write')">Write</ButtonItem>
          <ButtonItem :group-name=user.userUUID :counter="3" :is-selected="user.accessLevel ==='admin'" @click="updateAccessLevel(user.userUUID,'admin')">Admin</ButtonItem>
          <!--Button from tailwind documentation-->
          <button @click="deleteUser(user)" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>


        </ButtonBar>
      </MyBorder>
    </MyBorder>
  </Background>
</template>

<style scoped>
#pageNavigator {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
}
</style>