<template>
    <div id="feed-sub-filter-activity">
        <select-menu :items="[{id: 'popular', description: this.$t('pages:feeds.filter.order.popular')},
                        {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')}]"
                     :selected-item="{id: 'popular', description: $t('pages:feeds.filter.order.popular')}"
                     @changed="orderChanged">
        </select-menu>
        <select-menu :items="[{id: 'anyTime', description: this.$t('pages:feeds.filter.time.anyTime')},
                        {id: 'week', description: this.$t('pages:feeds.filter.time.week')},
                         {id: 'month', description: this.$t('pages:feeds.filter.time.month')}]"
                     :selected-item="{id: 'anyTime', description: $t('pages:feeds.filter.time.anyTime')}"
                     @changed="timeChanged" v-if="showTime">
        </select-menu>
        <select-region :selected-region="{id: 'international', description: 'Alle Regionen'}"></select-region>
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
            orderChanged(item) {
                this.showTime = item.id === 'popular';
            },
            timeChanged(item) {

            }
        }
    }
</script>

<style lang="scss">
    #feed-sub-filter-activity {

    }
</style>
