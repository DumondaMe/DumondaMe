<template>
    <div id="feed-sub-filter-activity">
        <select-menu :items="[{id: 'mostPopular', description: this.$t('pages:feeds.filter.order.popular')},
                        {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')},
                        {id: 'noQuestionLink', description: this.$t('pages:feeds.filter.order.noQuestionLink')}]"
                     :selected-item="'mostPopular'"
                     @changed="orderChanged">
        </select-menu>
        <select-menu :items="[{id: 'anyTime', description: this.$t('pages:feeds.filter.time.anyTime')},
                        {id: 'week', description: this.$t('pages:feeds.filter.time.week')},
                         {id: 'month', description: this.$t('pages:feeds.filter.time.month')}]"
                     :selected-item="'anyTime'" @changed="timeChanged" v-if="showTime">
        </select-menu>
        <select-region :init-region="[$store.state.feedFilter.regionFilter]"
                       @region-changed="regionChanged"></select-region>
    </div>
</template>

<script>
    import SelectMenu from './SelectMenu';
    import SelectRegion from './SelectRegion';

    export default {
        components: {SelectMenu, SelectRegion},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        data: function () {
            return {showTime: true}
        },
        methods: {
            async orderChanged(item) {
                this.showTime = item.id === 'mostPopular';
                this.$store.commit('feedFilter/SET_COMMITMENT_ORDER_FILTER', item);
                await this.$store.dispatch('feed/getFeed')
            },
            async timeChanged(item) {
                this.$store.commit('feedFilter/SET_PERIOD_OF_TIME_FILTER', item);
                await this.$store.dispatch('feed/getFeed')
            },
            async regionChanged(region) {
                this.$store.commit('feedFilter/SET_REGION_FILTER', region);
                await this.$store.dispatch('feed/getFeed')
            }
        }
    }
</script>

<style lang="scss">
    #feed-sub-filter-activity {

    }
</style>
