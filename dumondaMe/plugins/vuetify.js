import Vue from 'vue';
import {
    Vuetify,
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
    VCheckbox,
    VGrid,
    VSelect,
    VSnackbar,
    VChip,
    VRadioGroup,
    VProgressCircular,
    VProgressLinear,
    VDatePicker
} from 'vuetify';

Vue.use(Vuetify, {
    iconfont: 'mdi',
    theme: {
        primary: '#009e97',
        accent: '#7986CB',
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
        VCheckbox,
        VGrid,
        VSelect,
        VSnackbar,
        VChip,
        VRadioGroup,
        VProgressCircular,
        VProgressLinear,
        VDatePicker
    }
});
