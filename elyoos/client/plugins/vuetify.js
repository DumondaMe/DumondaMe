import Vue from 'vue';
import {
    Vuetify,
    VApp,
    VBtn,
    VIcon,
    VMenu,
    VList,
    vDivider,
    VForm,
    VTextField
} from 'vuetify';

Vue.use(Vuetify, {
    theme: {
        primary: '#303F9F',
        accent: '#7986CB',
        secondary: '#D81B60',
        info: '#0D47A1',
        warning: '#ffb300',
        error: '#B71C1C',
        success: '#2E7D32'
    },
    components: {
        VApp,
        VBtn,
        VIcon,
        VMenu,
        VList,
        vDivider,
        VForm,
        VTextField
    }
});
