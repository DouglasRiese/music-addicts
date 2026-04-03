import './assets/tailwind-styles.css';

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

import Root from "@/components/Root.vue"

createApp(Root).use(PrimeVue, {
    theme: {
        preset: Aura
    }
})
    .mount('#root');

