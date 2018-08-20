<template>
    <div id="feed-sub-filter-activity">
        <div class="select-filter-container">
            <select-menu :items="getOrder" @changed="orderChanged" selected-item="mostPopular">
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
                return [{id: 'mostPopular', description: this.$t('pages:feeds.filter.order.popular')},
                    {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')},
                    {id: 'notAnswered', description: this.$t('pages:feeds.filter.order.notAnswered')},
                    {id: 'onlyFewAnswers', description: this.$t('pages:feeds.filter.order.onlyFewAnswer')}]
            }
        },
        data: function () {
            return {showTime: true}
        },
        methods: {
            async orderChanged(item) {
                this.showTime = item.id === 'mostPopular';
                this.$store.commit('feedFilter/SET_QUESTION_ORDER_FILTER', item);
                await this.$store.dispatch('feed/getFeed')
            },
            async timeChanged(item) {
                this.$store.commit('feedFilter/SET_PERIOD_OF_TIME_FILTER', item);
                await this.$store.dispatch('feed/getFeed')
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
