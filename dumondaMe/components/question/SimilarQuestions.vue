<template>
    <div class="similar-question-container ely-card" v-if="questions.length > 0">
        <h3 class="similar-question-title">{{$t('pages:question.similarQuestion.title')}}</h3>
        <div class="questions-container">
            <div class="question" v-for="question in questions">
                <nuxt-link class="question-title" :to="{name: 'question-questionId-slug',
                        params: {questionId: question.questionId, slug: question.questionSlug}}">{{question.question}}
                </nuxt-link>
                <div class="number-of-answers">{{$t('pages:question.similarQuestion.answers',
                    {count: question.numberOfAnswers})}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            questions() {
                return this.$store.state.question.question.similarQuestions;
            }
        },
    }
</script>

<style lang="scss">
    .similar-question-container.ely-card {
        @include defaultPaddingCard();
        @media screen and (max-width: $xs) {
            padding: 12px 16px;
            max-width: 518px;
        }

        h3.similar-question-title {
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
        }

        .questions-container {
            .question {
                margin-bottom: 8px;
                @media screen and (max-width: $xs) {
                    margin-bottom: 14px;
                }

                .question-title {
                    font-size: 14px;
                    text-decoration: none;
                    color: $primary-color;
                    font-weight: 400;
                    @media screen and (max-width: $xs) {
                        font-size: 16px;
                    }
                }

                :hover.question-title {
                    text-decoration: underline;
                }

                .number-of-answers {
                    font-size: 14px;
                    color: $secondary-text;
                }
            }
        }
    }
</style>
