import Vue from 'vue';
import Vuetify, {
    VApp,
    VAppBar,
    VAppBarNavIcon,
    VBtn,
    VBadge,
    VBottomNavigation,
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
    VDatePicker,
    VCarousel,
    VCarouselItem
} from 'vuetify/lib';

import IconClap from '~/components/icons/Clap';
import {
    mdiAccount,
    mdiAccountCircle,
    mdiAccountOutline,
    mdiAccountPlus,
    mdiArrowLeft,
    mdiBellOutline,
    mdiBookOutline,
    mdiBriefcaseOutline,
    mdiCalendar,
    mdiCardBulletedOutline,
    mdiCheck,
    mdiCircleOutline,
    mdiDelete,
    mdiDotsVertical,
    mdiForum,
    mdiGoogleCirclesGroup,
    mdiInformationOutline,
    mdiKey,
    mdiLink,
    mdiLogin,
    mdiHeartPulse,
    mdiHelp,
    mdiMagnify,
    mdiNote,
    mdiMapMarker,
    mdiHumanHandsup,
    mdiHome,
    mdiRss,
    mdiSortDescending,
    mdiStarOutline,
    mdiStar,
    mdiThumbUp,
    mdiThumbUpOutline,
    mdiThumbDownOutline,
    mdiPencil,
    mdiPlus
} from '@mdi/js'

Vue.use(Vuetify);

export default ctx => {
    const vuetify = new Vuetify({
        icons: {
            iconfont: 'mdiSvg',
            values: {
                mdiAccount,
                mdiAccountCircle,
                mdiAccountOutline,
                mdiAccountPlus,
                mdiArrowLeft,
                mdiBellOutline,
                mdiBookOutline,
                mdiBriefcaseOutline,
                mdiCalendar,
                mdiCardBulletedOutline,
                mdiCheck,
                mdiCircleOutline,
                mdiDelete,
                mdiDotsVertical,
                mdiForum,
                mdiGoogleCirclesGroup,
                mdiInformationOutline,
                mdiKey,
                mdiLink,
                mdiLogin,
                mdiHeartPulse,
                mdiHelp,
                mdiMagnify,
                mdiNote,
                mdiMapMarker,
                mdiHumanHandsup,
                mdiHome,
                mdiRss,
                mdiSortDescending,
                mdiStarOutline,
                mdiStar,
                mdiThumbUp,
                mdiThumbUpOutline,
                mdiThumbDownOutline,
                mdiPencil,
                mdiPlus,
                clap: {
                    component: IconClap
                }
            }
        },
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
            VAppBar,
            VAppBarNavIcon,
            VBtn,
            VBadge,
            VBottomNavigation,
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
            VDatePicker,
            VCarousel,
            VCarouselItem
        }
    });

    ctx.app.vuetify = vuetify;
    ctx.$vuetify = vuetify.framework;
}
