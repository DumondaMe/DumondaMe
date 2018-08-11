<template>
    <div id="feed-sub-filter-activity">
        <div class="select-filter-container">
            <select-menu :items="[{id: 'onlyQuestion', description: $t('pages:feeds.filter.question.onlyQuestion')},
            {id: 'onlyAnswer', description: $t('pages:feeds.filter.question.onlyAnswer')}]"
                         :selected-item="{id: 'onlyQuestion', description: $t('pages:feeds.filter.question.onlyQuestion')}"
                         @changed="questionChanged">
            </select-menu>
            <select-menu v-if="showSelectAnswerType" :items="[{id: 'selectAll', description: $t('pages:feeds.filter.answer.all')},
            {id: 'onlyVideo', description: $t('pages:feeds.filter.post.onlyVideo')},
            {id: 'onlyText', description: $t('pages:feeds.filter.post.onlyText')},
            {id: 'onlyBook', description: $t('pages:feeds.filter.post.onlyBook')},
            {id: 'onlyLink', description: $t('pages:feeds.filter.post.onlyLink')},
            {id: 'onlyCommitment', description: $t('pages:feeds.filter.post.onlyCommitment')}]"
                         :selected-item="{id: 'selectAll', description: $t('pages:feeds.filter.answer.all')}"
                         @changed="answerTypeChanged">
            </select-menu>
            <select-menu :items="getOrder" @changed="orderChanged"
                         :selected-item="{id: 'popular', description: $t('pages:feeds.filter.order.popular')}">
            </select-menu>
            <select-menu :items="[{id: 'anyTime', description: this.$t('pages:feeds.filter.time.anyTime')},
                        {id: 'week', description: this.$t('pages:feeds.filter.time.week')},
                         {id: 'month', description: this.$t('pages:feeds.filter.time.month')}]"
                         :selected-item="{id: 'anyTime', description: $t('pages:feeds.filter.time.anyTime')}"
                         @changed="timeChanged" v-if="showTime">
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
                if (this.showSelectAnswerType) {
                    return [{id: 'popular', description: this.$t('pages:feeds.filter.order.popular')},
                        {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')}]
                }
                return [{id: 'popular', description: this.$t('pages:feeds.filter.order.popular')},
                    {id: 'newest', description: this.$t('pages:feeds.filter.order.newest')},
                    {id: 'notAnswered', description: this.$t('pages:feeds.filter.order.notAnswered')},
                    {id: 'onlyFewAnswer', description: this.$t('pages:feeds.filter.order.onlyFewAnswer')}]
            }
        },
        data: function () {
            return {showSelectAnswerType: false, showTime: true}
        },
        methods: {
            questionChanged(item) {
                this.showSelectAnswerType = item.id === 'onlyAnswer';
            },
            answerTypeChanged(item) {

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
