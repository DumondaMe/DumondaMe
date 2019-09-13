<template>
    <div id="feed-mobile-filter">
        <v-tabs centered color="mobile-filter-color" light fixed-tabs v-model="selectedTab">
            <v-tab nuxt :to="{name: 'index'}" exact v-if="isAuthenticated">
                <v-icon>mdi-heart-pulse</v-icon>
            </v-tab>
            <v-tab @click="showLoginRequired = true" v-else>
                <v-icon>mdi-heart-pulse</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'question'}" v-if="isAuthenticated">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'index'}" v-else exact>
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'commitment'}">
                <v-icon>mdi-human-handsup</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'event'}">
                <v-icon>mdi-calendar</v-icon>
            </v-tab>
        </v-tabs>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false"
                               :login-description="$t('pages:feeds.filter.activity.loginDescription')">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired.vue';
    import Vue from 'vue';

    export default {
        data() {
            return {showLoginRequired: false, selectedTab: null};
        },
        components: {LoginRequiredDialog},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        watch: {
            async selectedTab(newTab, previousTab) {
                if (newTab === 0 && previousTab !== 0 && previousTab) {
                    await Vue.nextTick();
                    this.selectedTab = previousTab;
                }
            }
        }
    }
</script>

<style lang="scss">
    #feed-mobile-filter {
        position: fixed;
        top: 56px;
        left: 0;
        right: 0;
        z-index: 30;
        margin-bottom: 12px;

        .mobile-filter-color--text {
            background-color: $background-normal !important;
            color: $secondary-color !important;
        }
    }
</style>
