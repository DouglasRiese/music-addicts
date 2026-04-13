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
    // url: 'http://localhost:3005', //TODO: remember to uncomment this when doing local testing of API!
    url: 'https://music-addicts-api.onrender.com',
})
