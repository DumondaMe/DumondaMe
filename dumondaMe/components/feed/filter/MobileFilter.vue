<template>
    <div id="feed-mobile-filter">
        <v-tabs centered background-color="primary" dark v-model="selectedTab" show-arrows>
            <v-tab nuxt :to="{name: 'index'}" exact v-if="isAuthenticated">
                {{$t('common:navigation.activities')}}
            </v-tab>
            <v-tab nuxt :to="{name: 'question'}">
                {{$t('common:navigation.questions')}}
            </v-tab>
            <v-tab nuxt :to="{name: 'commitment'}">
                {{$t('common:navigation.commitments')}}
            </v-tab>
            <v-tab nuxt :to="{name: 'event'}">
                {{$t('common:navigation.events')}}
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
        top: 48px;
        left: 0;
        right: 0;
        z-index: 2;
        margin-bottom: 12px;
    }
</style>
