<template>
    <feed-layout>
        <div slot="sidebar">
            <feeds></feeds>
        </div>
        <div slot="content">Coming soon ;-)</div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed.vue';
    import Feeds from '~/components/feed/sidebar/Feeds.vue';

    export default {
        components: {FeedLayout, Feeds}
    }
</script>

<style lang="scss">

</style>