<template>
    <div id="dumonda-me-header">
        <desktop-toolbar :is-authenticated="isAuthenticated" id="desktop-toolbar"
                         :show-notification="showNotification"
                         :number-of-notifications="numberOfUnreadNotifications"
                         @show-create-question-dialog="$emit('show-create-question-dialog')"
                         @show-create-commitment-dialog="$emit('show-create-commitment-dialog')"
                         @show-import-contacts-dialog="$emit('show-import-contacts-dialog')"
                         @show-language-dialog="$emit('show-language-dialog')"
                         @open-drawer="$emit('open-drawer')" v-if="$route.name !== 'auth'">
        </desktop-toolbar>
        <!--<mobile-toolbar :is-authenticated="isAuthenticated" id="mobile-toolbar"
                        :show-notification="showNotification"
                        :number-of-notifications="numberOfUnreadNotifications"
                        @show-create-question-dialog="emit('show-create-question-dialog')"
                        @show-create-commitment-dialog="emit('show-create-commitment-dialog')"
                        @show-import-contacts-dialog="emit('show-import-contacts-dialog')"
                        @show-language-dialog="emit('show-language-dialog')"
                        @open-drawer="$emit('open-drawer')" v-if="$route.name !== 'auth'">
        </mobile-toolbar>-->
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import DesktopToolbar from './Desktop';
    import MobileToolbar from './Mobile';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {showError: false}
        },
        components: {DesktopToolbar, MobileToolbar},
        mounted: function () {
            if (this.$store.state.auth.userIsAuthenticated && this.$route.name !== 'notifications') {
                this.$store.dispatch('notification/startCheckNotificationChanged');
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            showNotification() {
                return this.numberOfUnreadNotifications > 0;
            },
            ...mapGetters({
                numberOfUnreadNotifications: 'notification/numberOfUnreadNotifications'
            })
        }
    }
</script>

<style lang="scss">
    #dumonda-me-header {

    }
</style>
