<template>
    <feed-layout>
        <div slot="sidebar">
            <feeds></feeds>
        </div>
        <div slot="content">
            <question-activity></question-activity>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed.vue';
    import Feeds from '~/components/feed/sidebar/Feeds.vue';
    import QuestionActivity from '~/components/feed/question/QuestionActivity.vue';

    export default {
        components: {FeedLayout, Feeds, QuestionActivity}
    }
</script>

<style lang="scss">

</style>