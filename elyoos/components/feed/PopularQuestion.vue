<template>
    <div class="feed-additional-info-container">
        <h3 class="additional-info-title">{{$t("pages:feeds.popularQuestion.title")}}</h3>
        <div class="popular-question-container">
            <div class="popular-question" v-for="question in popularQuestions">
                <router-link
                        :to="{ name: 'question-questionId-slug', params: {questionId: question.questionId, slug: question.questionSlug}}">
                    {{question.question}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "popularQuestion",
        computed: {
            popularQuestions() {
                return this.$store.state.feed.popularQuestions
            }
        }
    }
</script>

<style lang="scss">
    .popular-question-container {
        .popular-question {
            margin-top: 4px;
            a {
                display: inline-block;
                vertical-align: top;
                font-size: 14px;
                white-space: normal;
                line-height: 20px;
                text-decoration: none;
            }
        }
    }
</style>