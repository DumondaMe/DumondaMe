<template>
    <div id="feed-mobile-filter">
        <v-tabs centered color="mobile-filter-color" light fixed-tabs>
            <v-tab nuxt :to="{name: 'index'}" exact>
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'commitment'}">
                <v-icon>mdi-human-handsup</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'event'}">
                <v-icon>mdi-calendar</v-icon>
            </v-tab>
            <v-tab nuxt :to="{name: 'activity'}" v-if="isAuthenticated">
                <v-icon>mdi-clipboard-pulse-outline</v-icon>
            </v-tab>
        </v-tabs>
    </div>
</template>

<script>
    export default {
        data() {
            return {index: 1};
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            mainFilter() {
                return this.$store.state.feedFilter.mainFilter;
            }
        },
        methods: {
            async setFilter(filter) {
                if (!(filter === 'activity' && !this.$store.state.auth.userIsAuthenticated)) {
                    if (filter !== 'question') {
                        this.$router.push({name: filter});
                    } else {
                        this.$router.push({name: 'index'});
                    }
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
        z-index: 100;
        .mobile-filter-color {
            background-color: $background-normal;
        }
    }
</style>
