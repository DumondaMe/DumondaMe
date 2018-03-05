<template>
    <div id="question-cards-container">
        <div class="question-card ely-card" v-for="question in questions" :key="question.questionId">
            <h2>
                <nuxt-link :to="{name: 'question-questionId-slug',
                                 params: {questionId: question.questionId, slug: question.slug}}">
                    {{question.question}}
                </nuxt-link>
            </h2>
            <p class="description">
                <nuxt-link :to="{name: 'question-questionId-slug',
                                 params: {questionId: question.questionId, slug: question.slug}}">
                    {{question.description}}
                </nuxt-link>
            </p>
            <v-layout row class="question-info">
                <div class="answer-icon">
                    <v-icon>chat_bubble_outline</v-icon>
                    <span class="answer-text">{{question.numberOfAnswers}} Antworten</span>
                </div>
            </v-layout>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            questions() {
                return this.$store.state.feedQuestion.questions
            }
        }
    }
</script>

<style lang="scss">
    #question-cards-container {
        margin-top: 28px;
        .question-card {
            margin-bottom: 12px;
            h2 {
                margin-bottom: 8px;
                font-size: 18px;
                font-weight: 400;
                a {
                    color: $primary-text;
                    text-decoration: none;
                }
            }
            .description {
                margin-top: 12px;
                a {
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 300;
                    color: $primary-text;
                }
            }
        }
        .question-info {
            .answer-icon {
                i.icon {
                    color: $primary-color;
                }
                .answer-text {
                    margin-left: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: $secondary-text;
                }
            }
        }
    }
</style>
