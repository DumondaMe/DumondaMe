<template>
    <div id="feed-sub-filter-activity">
        <select-region :init-region="[$store.state.feedFilter.regionFilter]"></select-region>
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
