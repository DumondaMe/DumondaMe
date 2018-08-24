<template>
    <div id="feed-sub-filter-activity">
        <select-menu :items="[{id: 'selectAll', description: $t('pages:feeds.filter.post.all')},
            {id: 'Video', description: $t('pages:feeds.filter.post.onlyVideo')},
            {id: 'Text', description: $t('pages:feeds.filter.post.onlyText')},
            {id: 'Book', description: $t('pages:feeds.filter.post.onlyBook')},
            {id: 'Link', description: $t('pages:feeds.filter.post.onlyLink')},
            {id: 'Commitment', description: $t('pages:feeds.filter.post.onlyCommitment')}]"
                     :selected-item="'selectAll'" @changed="activityChanged">
        </select-menu>
        <select-region v-if="typeFilterWithRegion" :init-region="[$store.state.feedFilter.regionFilter]"
                       @region-changed="regionChanged">
        </select-region>
    </div>
</template>

<script>
    import SelectMenu from './SelectMenu';
    import SelectRegion from './SelectRegion';

    export default {
        components: {SelectMenu, SelectRegion},
        computed: {
            typeFilterWithRegion() {
                return this.$store.state.feedFilter.activityTypeFilter === 'selectAll' ||
                    this.$store.state.feedFilter.activityTypeFilter === 'Commitment';
            }
        },
        data: function () {
            return {}
        },
        methods: {
            async activityChanged(item) {
                this.$store.commit('feedFilter/SET_ACTIVITY_TYPE_FILTER', item);
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
