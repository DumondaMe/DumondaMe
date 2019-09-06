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

Vue.use(Vuetify);

export default ctx => {
    const vuetify = new Vuetify({
        iconfont: 'mdi',
        theme: {
            themes: {
                light: {
                    primary: '#009e97',
                    accent: '#D81B60',
                    secondary: '#D81B60',
                    info: '#0D47A1',
                    warning: '#ffb300',
                    error: '#ff5252',
                    success: '#2E7D32'
                }
            }
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
        }
    });

    ctx.app.vuetify = vuetify;
    ctx.$vuetify = vuetify.framework;
}
