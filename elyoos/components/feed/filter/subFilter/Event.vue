<template>
    <div id="feed-sub-filter-event">
        <select-region :init-region="[$store.state.feedFilter.regionFilter]"
                       @region-changed="regionChanged"></select-region>
        <v-spacer></v-spacer>
        <div class="interested-only-command" v-if="isAuthenticated">
            <v-tooltip bottom v-if="!$store.state.feedFilter.eventInterestedOnly">
                <v-icon slot="activator" @click="interestedChanged(true)">
                    mdi-star
                </v-icon>
                <span>{{$t('pages:feeds.filter.onlyInterestedEvent.deactivated')}}</span>
            </v-tooltip>
            <v-tooltip bottom v-else>
                <v-icon slot="activator" @click="interestedChanged(false)"
                        class="activated-interested-filter">
                    mdi-star
                </v-icon>
                <span>{{$t('pages:feeds.filter.onlyInterestedEvent.activated')}}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    import SelectRegion from './SelectRegion';

    export default {
        components: {SelectRegion},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            async regionChanged(region) {
                this.$store.commit('feedFilter/SET_REGION_FILTER', region);
                await this.$store.dispatch('feed/getFeed')
            },
            async interestedChanged(interested) {
                this.$store.commit('feedFilter/SET_EVENT_INTERESTED_ONLY_FILTER', interested);
                await this.$store.dispatch('feed/getFeed')
            }
        }
    }
</script>

<style lang="scss">
    #feed-sub-filter-event {
        display: flex;
        .interested-only-command {
            i.icon {
                cursor: pointer;
                height: 20px;
                width: 20px;
                font-size: 20px;
            }
            i.icon.activated-interested-filter {
                color: $primary-color;
            }
        }
    }
</style>
