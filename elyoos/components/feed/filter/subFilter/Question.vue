<template>
    <div id="feed-sub-filter-activity">
        <div class="select-filter-container">
            <select-menu :items="getOrder" @changed="orderChanged" selected-item="popular">
            </select-menu>
            <select-menu :items="[{id: 'anyTime', description: this.$t('pages:feeds.filter.time.anyTime')},
                        {id: 'week', description: this.$t('pages:feeds.filter.time.week')},
                         {id: 'month', description: this.$t('pages:feeds.filter.time.month')}]"
                         selected-item="anyTime" @changed="timeChanged" v-if="showTime">
            </select-menu>
        </div>
    </div>
</template>

<script>
    import SelectMenu from './SelectMenu';

    export default {
        components: {SelectMenu},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            getOrder() {
                return [{id: 'popular', description: this.$t('pages:feeds.filter.order.popular')},
                    {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')},
                    {id: 'notAnswered', description: this.$t('pages:feeds.filter.order.notAnswered')},
                    {id: 'onlyFewAnswer', description: this.$t('pages:feeds.filter.order.onlyFewAnswer')}]
            }
        },
        data: function () {
            return {showTime: true}
        },
        methods: {
            questionChanged(item) {

            },
            orderChanged(item) {
                this.showTime = item.id === 'popular'
            },
            timeChanged(item) {

            }
        }
    }
</script>

<style lang="scss">
    #feed-sub-filter-activity {
        .select-filter-container {

        }
    }
</style>
