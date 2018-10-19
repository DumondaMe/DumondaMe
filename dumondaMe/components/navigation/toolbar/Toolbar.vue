<template>
    <div id="dumonda-me-header">
        <desktop-toolbar :is-authenticated="isAuthenticated" :languages="languages" id="desktop-toolbar"
                         :selected-language="selectedLanguage" :logo-url="logoUrl" :show-notification="showNotification"
                         :number-of-notifications="numberOfNotifications" @logout="logout"
                         @change-language="changeLanguage" @create-question="showCreateQuestion = true"
                         @create-commitment="showCreateCommitment = true">
        </desktop-toolbar>
        <mobile-toolbar :is-authenticated="isAuthenticated" :languages="languages" id="mobile-toolbar"
                        :selected-language="selectedLanguage" :logo-url="logoUrl" :show-notification="showNotification"
                        :number-of-notifications="numberOfNotifications" @logout="logout"
                        @change-language="changeLanguage" @create-question="showCreateQuestion = true"
                        @create-commitment="showCreateCommitment = true"
                        @open-drawer="$emit('open-drawer')">
        </mobile-toolbar>
        <create-commitment-dialog v-if="showCreateCommitment" @close-dialog="showCreateCommitment = false">
        </create-commitment-dialog>
        <create-question-dialog v-if="showCreateQuestion" @close-dialog="showCreateQuestion = false">
        </create-question-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'
    import CreateQuestionDialog from '~/components/question/dialog/CreateQuestionDialog.vue'
    import DesktopToolbar from './Desktop';
    import MobileToolbar from './Mobile';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {showCreateCommitment: false, showCreateQuestion: false, showError: false}
        },
        components: {CreateCommitmentDialog, CreateQuestionDialog, DesktopToolbar, MobileToolbar},
        mounted: function () {
            if (this.$store.state.auth.userIsAuthenticated && this.$route.name !== 'user-notifications') {
                this.$store.dispatch('notification/startCheckNotificationChanged');
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            languages() {
                return this.$store.state.i18n.languages
            },
            selectedLanguage() {
                return this.$store.state.i18n.languages.find(lang => lang.key === this.$store.state.i18n.language);
            },
            logoUrl() {
                return `${process.env.staticUrl}/img/logo.jpg`;
            },
            showNotification() {
                return this.numberOfNotifications > 0;
            },
            ...mapGetters({
                numberOfNotifications: 'notification/numberOfNotifications'
            })
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                    this.$store.dispatch('notification/stopCheckNotificationChanged');
                    this.$store.commit('notification/RESET_NOTIFICATION');
                    this.$store.commit('feedFilter/SET_FILTER_TO_PUBLIC_STATE');
                    await this.$store.dispatch('feed/getFeed');
                    this.$router.push({name: 'index'});
                } catch (e) {
                    this.showError = true;
                }
            },
            changeLanguage(lang) {
                this.$store.dispatch('i18n/setLanguage', {language: lang});
            }
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
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12);
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
</style>