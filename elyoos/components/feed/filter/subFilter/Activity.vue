<template>
    <div id="feed-sub-filter-activity">
        <select-menu :items="[{id: 'selectAll', description: $t('pages:feeds.filter.post.all')},
            {id: 'onlyVideo', description: $t('pages:feeds.filter.post.onlyVideo')},
            {id: 'onlyText', description: $t('pages:feeds.filter.post.onlyText')},
            {id: 'onlyBook', description: $t('pages:feeds.filter.post.onlyBook')},
            {id: 'onlyLink', description: $t('pages:feeds.filter.post.onlyLink')},
            {id: 'onlyCommitment', description: $t('pages:feeds.filter.post.onlyCommitment')},
            {id: 'onlyEvent', description: $t('pages:feeds.filter.post.onlyEvent')}]"
                     :selected-item="{id: 'selectAll', description: $t('pages:feeds.filter.post.all')}"
                     @changed="activityChanged">
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
            return {}
        },
        methods: {
            activityChanged(item) {

            }
        }
    }
</script>

<style lang="scss">
    #feed-sub-filter-activity {

    }
</style>
