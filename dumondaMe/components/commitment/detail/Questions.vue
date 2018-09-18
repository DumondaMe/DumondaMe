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
            <div class="card-footer-feed">
                <div class="footer-icon">
                    <up-vote-menu :answer-id="question.commitmentAnswerId"
                                  :is-admin="question.isCreatedByUser" :up-voted-by-user="question.isUpVotedByUser"
                                  :number-of-up-votes="question.upVotes"
                                  @up-voted="upVote" @down-voted="downVote"
                                  :custom-text-has-up-voted="$t('pages:detailCommitment.menu.upVote.hasUpVoted',
                                  {question: `<span class='primary-title'>${question.question}</span>`})"
                                  :custom-text-has-not-up-voted="$t('pages:detailCommitment.menu.upVote.hasNotUpVoted',
                                  {question: `<span class='primary-title'>${question.question}</span>`})"
                                  :custom-text-is-admin="$t('pages:detailCommitment.menu.upVote.isAdmin',
                                  {question: `<span class='primary-title'>${question.question}</span>`})">
                        <div slot="icon">
                            <v-icon medium class="action-icon">mdi-thumb-up</v-icon>
                            <span class="footer-description number">{{question.upVotes}}</span>
                        </div>
                    </up-vote-menu>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import UpVoteMenu from '~/components/feed/card/footer/menu/UpVote';

    export default {
        name: "questions",
        components: {UpVoteMenu},
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
        .question.feed-card {
            padding-left: 18px;
            padding-bottom: 12px;
            margin-bottom: 12px;
            .question-title {
                color: $primary-color;
                font-size: 16px;
                margin-bottom: 12px;
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
            }

            .card-footer-feed {
                .footer-icon {
                    .action-icon {
                        margin-left: 0;
                    }
                    .footer-description.number {
                        margin-left: 4px;
                    }
                }
            }
        }
        .question.last-question {
            margin-bottom: 0;
        }
    }
</style>