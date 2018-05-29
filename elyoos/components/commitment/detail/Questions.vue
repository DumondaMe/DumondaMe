<template>
    <div id="questions-container" v-if="questions.length > 0">
        <h2>{{$t('pages:detailCommitment.questions.title')}}</h2>
        <div class="question ely-card" :class="{'last-question': index === questions.length - 1}"
             v-for="(question, index) in questions" @click="$router.push({name: 'question-questionId-slug',
                     params: {questionId: question.questionId, slug: question.slug}})">
            <div class="question-title">{{question.question}}</div>
            <div class="description">{{question.description}}</div>
            <div class="info-container">
                <div class="info-icon-element">
                    <v-icon class="info-icon">mdi-arrow-up</v-icon>
                    <span class="info-text"><span class="number">{{question.upVotes}}</span>
                        {{$t('pages:detailCommitment.questions.upVotes', {count: question.upVotes})}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "questions",
        computed: {
            questions() {
                return this.$store.state.commitment.commitment.linkedWithQuestions;
            }
        },
    }
</script>

<style lang="scss">
    #questions-container {
        .question {
            cursor: pointer;
            margin-bottom: 12px;
            .question-title {
                color: $primary-color;
                font-size: 16px;
            }
            .description {
                font-size: 16px;
                font-weight: 300;
            }
            .info-container {
                margin-top: 12px;
                margin-left: -2px;
                .info-icon-element {
                    display: inline-block;
                    font-size: 12px;
                    font-weight: 400;
                    color: $secondary-text;
                    .info-icon {
                        color: #009688;
                        font-size: 16px;
                    }
                    .info-text {
                        margin-left: 4px;
                        vertical-align: middle;
                        line-height: 16px;
                        .number {
                            font-weight: 400;
                        }
                    }
                }
            }
        }
        .question.last-question {
            margin-bottom: 0;
        }
    }
</style>