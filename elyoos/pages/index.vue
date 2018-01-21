<template>
    <feed-layout>
        <div slot="sidebar">
            <feeds>
            </feeds>
        </div>
        <div slot="content">
            <question-activity>
            </question-activity>
            <question-cards>
            </question-cards>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed.vue';
    import Feeds from '~/components/feed/sidebar/Feeds.vue';
    import QuestionActivity from '~/components/feed/question/QuestionActivity.vue';
    import QuestionCards from '~/components/feed/question/QuestionCards.vue';

    export default {
        async fetch({params, app, error, store}) {
            try {
                await store.dispatch(`feedQuestion/getQuestionFeed`, params.page);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {FeedLayout, Feeds, QuestionActivity, QuestionCards}
    }
</script>

<style lang="scss">

</style>