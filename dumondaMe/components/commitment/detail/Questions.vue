<template xmlns="http://www.w3.org/1999/html">
    <div id="commitment-questions-container" v-if="questions.length > 0">
        <h2>{{$t('pages:detailCommitment.questions.title')}}</h2>
        <div class="question ely-card feed-card" :class="{'last-question': index === questions.length - 1}"
             v-for="(question, index) in questions">
            <div class="question-title"><span class="question-type">{{$t('common:question')}} </span>
                <span class="question" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: question.questionId, slug: question.slug}})">{{question.question}}</span>
            </div>
            <div class="description">{{question.description}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "questions",
        computed: {
            questions() {
                return this.$store.state.commitment.commitment.linkedWithQuestions;
            },
            isAdmin() {
                return this.$store.state.commitment.commitment.isAdmin;
            },
        },
        methods: {
            upVote(answerId) {
                this.$store.commit('commitment/UP_VOTE_ANSWER', answerId)
            },
            downVote(answerId) {
                this.$store.commit('commitment/DOWN_VOTE_ANSWER', answerId)
            }
        }
    }
</script>

<style lang="scss">
    #commitment-questions-container {
        h2 {
            @media screen and (max-width: $sm) {
                padding-left: 16px;
                padding-right: 16px;
                border-bottom: none;
                font-weight: 500;
                margin-top: 12px;
            }
        }
        .question.feed-card {
            padding-left: 18px;
            padding-bottom: 12px;
            margin-bottom: 12px;
            .question-title {
                color: $primary-color;
                font-size: 16px;
                margin-bottom: 12px;
                @media screen and (max-width: $sm) {
                    margin-bottom: 6px;
                }
                .question-type {
                    color: $primary-text;
                    font-weight: 500;
                }
                :hover.question {
                    cursor: pointer;
                    text-decoration: underline;
                }
            }
            .description {
                font-size: 16px;
                font-weight: 300;
                margin-bottom: 12px;
                @media screen and (max-width: $sm) {
                    margin-top: 6px;
                }
            }
        }
        .question.last-question {
            margin-bottom: 0;
        }
    }
</style>