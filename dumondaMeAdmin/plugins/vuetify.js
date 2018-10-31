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
    theme: {
        primary: '#1E88E5',
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
