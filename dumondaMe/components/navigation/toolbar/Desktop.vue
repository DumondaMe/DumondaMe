<template>
    <v-app-bar app elevate-on-scroll color="primary" dark dense>
        <div id="header-desktop-container">
            <search-toolbar></search-toolbar>
            <v-spacer></v-spacer>
            <v-btn icon>
                <v-icon>mdi-filter-variant</v-icon>
            </v-btn>
            <v-menu bottom left>
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list v-if="isAuthenticated">
                    <v-list-item @click="$emit('show-create-question-dialog')">
                        <v-list-item-title>{{$t("common:toolbar.askQuestion")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$emit('show-create-commitment-dialog')">
                        <v-list-item-title>{{$t("common:toolbar.createCommitment")}}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="$emit('show-import-contacts-dialog')">
                        <v-list-item-title>{{$t("common:toolbar.inviteContacts")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$router.push({name: 'setting'})">
                        <v-list-item-title>{{$t("common:toolbar.settings")}}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="logout">
                        <v-list-item-title>{{$t("common:toolbar.logout")}}</v-list-item-title>
                    </v-list-item>
                </v-list>
                <v-list v-else>
                    <v-list-item @click="$emit('show-language-dialog')">
                        <v-list-item-title>{{$t("common:toolbar.language")}}</v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="$router.push({name: 'register'})">
                        <v-list-item-title>{{$t("common:toolbar.register")}}</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$router.push({name: 'login'})">
                        <v-list-item-title>{{$t("common:toolbar.login")}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-app-bar>
</template>

<script>
    import SearchToolbar from './Search';

    export default {
        props: ['isAuthenticated', 'showNotification', 'numberOfNotifications'],
        components: {SearchToolbar},
        computed: {
        },
        methods: {
            async logout() {
                try {
                    await this.$store.dispatch('auth/logout');
                    this.$store.dispatch('notification/stopCheckNotificationChanged');
                    this.$store.commit('notification/RESET_NOTIFICATION');
                    this.$store.commit('feedFilter/SET_FILTER_TO_PUBLIC_STATE');
                    this.$store.commit('i18n/SET_LANGUAGES', [this.$store.state.i18n.language]);
                    await this.$store.dispatch('feed/getFeed');
                    this.$router.push({name: 'index'});
                } catch (e) {
                    this.showError = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    #header-desktop-container {
        max-width: 900px;
        width: 100%;
        margin: 0 auto;
        display: flex;
    }
</style>
