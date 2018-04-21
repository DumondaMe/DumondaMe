<template>
    <feed-layout>
        <div slot="sidebar">
            <feeds>
            </feeds>
        </div>
        <div slot="content">
            <question-filter>
            </question-filter>
            <personalization-filter v-if="isAuthenticated">
            </personalization-filter>
            <question-cards>
            </question-cards>
        </div>
    </feed-layout>
</template>

<script>
    import FeedLayout from '~/components/layouts/Feed.vue';
    import Feeds from '~/components/feed/sidebar/Feeds.vue';
    import QuestionFilter from '~/components/feed/question/Filter.vue';
    import PersonalizationFilter from '~/components/feed/question/Personalization.vue';
    import QuestionCards from '~/components/feed/question/Cards.vue';

    export default {
        async fetch({params, app, error, store}) {
            try {
                await store.dispatch(`feedQuestion/getQuestionFeed`,
                    {page: params.page, isAuthenticated: store.state.auth.userIsAuthenticated});
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {FeedLayout, Feeds, QuestionFilter, PersonalizationFilter, QuestionCards},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">

</style>