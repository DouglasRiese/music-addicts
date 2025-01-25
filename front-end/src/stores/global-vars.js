import {reactive} from "vue";

// (global variables!)
export let userInfoStore = reactive({
    userUUID: '',
    token: '',
    username: '',
    isAdmin: false,
    isLoggedIn: false,
})

export const dbInfoStore = reactive({
    url: 'http://localhost:3005',
})


