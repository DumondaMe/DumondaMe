<template>
    <div id="search-content">
        <questions v-if="hasQuestions"></questions>
        <users v-if="hasUsers"></users>

        <questions-no-result v-if="!hasQuestions"></questions-no-result>
        <users-no-result v-if="!hasUsers"></users-no-result>
    </div>
</template>

<script>
    import Users from '~/components/search/users/users';
    import UsersNoResult from '~/components/search/users/noResult';
    import Questions from '~/components/search/questions/questions';
    import QuestionsNoResult from '~/components/search/Questions/noResult';

    export default {
        async fetch({error, store, query}) {
            try {
                await store.dispatch(`search/search`, query.query)
            } catch (e) {
                error({statusCode: e.statusCode});
            }
        },
        components: {Users, UsersNoResult, Questions, QuestionsNoResult},
        head() {
            return {
                htmlAttrs: {
                    lang: this.$store.state.i18n.language
                }
            }
        },
        data() {
            return {loadNextRunning: false}
        },
        computed: {
            hasUsers() {
                return this.$store.state.search.users.length > 0;
            },
            hasQuestions() {
                return this.$store.state.search.questions.length > 0;
            },
            hasCommitments() {
                return this.$store.state.search.commitments.length > 0;
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #search-content {
        max-width: 470px;
        margin: 0 auto;
    }
</style>