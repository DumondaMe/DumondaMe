import Vue from 'vue';
import Vuetify, {
    VApp,
    VBtn,
    VBadge,
    VIcon,
    VMenu,
    VList,
    VDivider,
    VForm,
    VDialog,
    VCard,
    VTextarea,
    VTextField,
    VTooltip,
    VTabs,
    VTimeline,
    VCheckbox,
    VSelect,
    VSnackbar,
    VChip,
    VRadioGroup,
    VNavigationDrawer,
    VProgressCircular,
    VProgressLinear,
    VDatePicker
} from 'vuetify/lib';

import {Ripple, ClickOutside, Touch} from 'vuetify/lib/directives'

Vue.use(Vuetify, {
    iconfont: 'mdi',
    theme: {
        primary: '#009e97',
        accent: '#D81B60',
        secondary: '#D81B60',
        info: '#0D47A1',
        warning: '#ffb300',
        error: '#ff5252',
        success: '#2E7D32'
    },
    components: {
        VApp,
        VBtn,
        VBadge,
        VIcon,
        VMenu,
        VList,
        VDivider,
        VForm,
        VDialog,
        VCard,
        VTextarea,
        VTextField,
        VTooltip,
        VTabs,
        VTimeline,
        VCheckbox,
        VSelect,
        VSnackbar,
        VChip,
        VRadioGroup,
        VNavigationDrawer,
        VProgressCircular,
        VProgressLinear,
        VDatePicker
    },
    directives: {
        Ripple,
        ClickOutside,
        Touch
    }
});
