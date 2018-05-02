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
        async fetch({query, app, error, store}) {
            try {
                if (query.typeFilter) {
                    store.commit(`feedQuestion/SET_TYPE_FILTER`, query.typeFilter);
                } else {
                    store.commit(`feedQuestion/SET_TYPE_FILTER`, null);
                }
                await store.dispatch(`feedQuestion/getQuestionFeed`,
                    {
                        page: query.page, isAuthenticated: store.state.auth.userIsAuthenticated,
                        typeFilter: query.typeFilter
                    });
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