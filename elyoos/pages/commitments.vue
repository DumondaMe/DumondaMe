<template>
    <feed-layout>
        <div slot="sidebar">
            <feeds></feeds>
        </div>
        <div slot="content">
            <commitment-filter>
            </commitment-filter>
            <commitment-cards>
            </commitment-cards>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed.vue';
    import Feeds from '~/components/feed/sidebar/Feeds.vue';
    import CommitmentFilter from '~/components/feed/commitment/Filter.vue';
    import CommitmentCards from '~/components/feed/commitment/Cards.vue';

    export default {
        components: {FeedLayout, Feeds, CommitmentFilter, CommitmentCards},
        async fetch({params, app, error, store}) {
            try {
                await store.dispatch(`feedCommitment/getCommitmentFeed`, params.page);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        }
    }
</script>

<style lang="scss">

</style>