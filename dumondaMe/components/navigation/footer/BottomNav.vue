<template>
    <div id="dumonda-me-mobile-bottom-nav">
        <v-bottom-navigation color="primary" app light grow v-show="$vuetify.breakpoint.mdAndDown"
                             v-model="bottomNav">

            <!--Needed to deselect icons-->
            <v-btn value="none" v-show="false">
                <v-icon>$vuetify.icons.mdiHome</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'index'})" value="home" v-if="!isAuthenticated">
                <v-icon>$vuetify.icons.mdiCardBulletedOutline</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'topics'})" value="topics">
                <v-icon>$vuetify.icons.mdiBookOutline</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'harvestingEvents'})" value="harvestingEvents"
                   v-show="$vuetify.breakpoint.width < 700">
                <v-icon>$vuetify.icons.mdiBriefcaseOutline</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'index'})" value="feed" v-if="isAuthenticated">
                <v-icon>$vuetify.icons.mdiRss</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'question'})" value="feed" v-else>
                <v-icon>$vuetify.icons.mdiRss</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'user'})" value="account" v-if="isAuthenticated">
                <v-icon>$vuetify.icons.mdiAccountOutline</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'notifications'})" value="notifications" v-if="isAuthenticated">
                <v-badge v-if="numberOfUnreadNotifications > 0" overlap :left="$vuetify.breakpoint.width < 700"
                         color="secondary">
                    <template v-slot:badge> {{numberOfUnreadNotifications}}</template>
                    <v-icon>$vuetify.icons.mdiBellOutline</v-icon>
                </v-badge>
                <v-icon v-else>$vuetify.icons.mdiBellOutline</v-icon>
            </v-btn>
            <v-btn @click="$router.push({name: 'login'})" value="login" v-if="!isAuthenticated">
                <v-icon>$vuetify.icons.mdiLogin</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "DumondaMeMobileBottomNav",
        data() {
            return {bottomNav: ''};
        },
        mounted() {
            this.setBottomNav();
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            ...mapGetters({
                numberOfUnreadNotifications: 'notification/numberOfUnreadNotifications'
            })
        },
        methods: {
            setBottomNav() {
                if (this.$route.name === 'index' || this.$route.name === 'question' || this.$route.name === 'commitment'
                    || this.$route.name === 'event') {
                    this.bottomNav = 'feed';
                } else if (this.$route.name === 'user') {
                    this.bottomNav = 'account';
                } else if (this.$route.name === 'notifications') {
                    this.bottomNav = 'notifications';
                } else if (this.$route.name === 'login') {
                    this.bottomNav = 'login';
                } else if (this.$route.name === 'topics') {
                    this.bottomNav = 'topics';
                } else if (this.$route.name === 'harvestingEvents') {
                    this.bottomNav = 'harvestingEvents';
                } else {
                    this.bottomNav = 'none';
                }
            }
        },
        watch: {
            $route() {
                this.setBottomNav();
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-mobile-bottom-nav {
    }
</style>