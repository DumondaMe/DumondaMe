<template>
    <div id="dumonda-me-header" :class="{'header-without-boarder': $route.name === 'index' ||
    $route.name === 'commitment' || $route.name === 'event' || $route.name === 'activity' ||
    $route.name === 'question'}">
        <desktop-toolbar :is-authenticated="isAuthenticated" id="desktop-toolbar"
                         :show-notification="showNotification"
                         :number-of-notifications="numberOfUnreadNotifications"
                         @show-create-question-dialog="emit('show-create-question-dialog')"
                         @show-create-commitment-dialog="emit('show-create-commitment-dialog')"
                         @show-import-contacts-dialog="emit('show-import-contacts-dialog')"
                         @show-language-dialog="emit('show-language-dialog')"
                         @open-drawer="$emit('open-drawer')" v-if="$route.name !== 'auth'">
        </desktop-toolbar>
        <mobile-toolbar :is-authenticated="isAuthenticated" id="mobile-toolbar"
                        :show-notification="showNotification"
                        :number-of-notifications="numberOfUnreadNotifications"
                        @show-create-question-dialog="emit('show-create-question-dialog')"
                        @show-create-commitment-dialog="emit('show-create-commitment-dialog')"
                        @show-import-contacts-dialog="emit('show-import-contacts-dialog')"
                        @show-language-dialog="emit('show-language-dialog')"
                        @open-drawer="$emit('open-drawer')" v-if="$route.name !== 'auth'">
        </mobile-toolbar>
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
        position: fixed;
        z-index: 100;
        top: 0;
        height: 56px;
        right: 0;
        left: 0;
        background-color: white;
        border-bottom: 1px solid #ddd;
        @media screen and (max-width: $xs) {
            border-bottom: none;
            box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12);
        }
        #desktop-toolbar {
            @media screen and (max-width: $xs) {
                display: none;
            }
        }
        #mobile-toolbar {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }
    }

    #dumonda-me-header.header-without-boarder {
        @media screen and (max-width: $xs) {
            box-shadow: none;
        }
    }
</style>
