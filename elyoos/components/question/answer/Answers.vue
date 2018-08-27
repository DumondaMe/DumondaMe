<template>
    <div class="elyoos-answer-container">
        <div class="elyoos-answer-content">
            <div v-for="answer in answers" itemprop="suggestedAnswer" itemscope class="feed-card ely-card"
                 itemtype="http://schema.org/Answer">
                <text-card v-if="answer.answerType === 'Text'" :answer="answer" :hide-question="true">
                    <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                                   :has-voted="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                                   :number-of-notes="answer.numberOfNotes">
                    </answer-footer>
                </text-card>
                <youtube-card v-else-if="answer.answerType === 'Youtube'" :answer="answer" :hide-question="true">
                    <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                                   :has-voted="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                                   :number-of-notes="answer.numberOfNotes">
                    </answer-footer>
                </youtube-card>
                <link-card v-else-if="answer.answerType === 'Link'" :answer="answer" :hide-question="true">
                    <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                                   :has-voted="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                                   :number-of-notes="answer.numberOfNotes">
                    </answer-footer>
                </link-card>
                <book-card v-else-if="answer.answerType === 'Book'" :answer="answer" :hide-question="true">
                    <answer-footer slot="footer" :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                                   :has-voted="answer.hasVoted" :is-admin="answer.isAdmin" :answer-id="answer.answerId"
                                   :number-of-notes="answer.numberOfNotes">
                    </answer-footer>
                </book-card>
                <commitment-card v-else-if="answer.answerType === 'Commitment'" :answer="answer"
                                 :hide-question="true">
                    <commitment-answer-footer slot="footer"
                                              :creator="answer.creator" :number-of-up-votes="answer.upVotes"
                                              :has-voted="answer.hasVoted" :is-admin="answer.isAdmin"
                                              :answer-id="answer.answerId"
                                              :regions="answer.regions">
                    </commitment-answer-footer>
                </commitment-card>
            </div>
        </div>
    </div>
</template>

<script>
    import CommitmentCard from '~/components/feed/card/Commitment'
    import BookCard from '~/components/feed/card/Book'
    import TextCard from '~/components/feed/card/Text'
    import LinkCard from '~/components/feed/card/Link'
    import YoutubeCard from '~/components/feed/card/Youtube'
    import AnswerFooter from './card/footer/CommonAnswer';
    import CommitmentAnswerFooter from './card/footer/CommitmentAnswer';

    export default {
        components: {TextCard, YoutubeCard, LinkCard, BookCard, CommitmentCard, AnswerFooter, CommitmentAnswerFooter},
        computed: {
            answers() {
                return this.$store.state.question.question.answers;
            }
        }
    }
</script>

<style lang="scss">
    .elyoos-answer-container {
        .elyoos-answer-content {
            .new-added-answer {
                border: 1px solid $success-text;
            }
        }
    }
</style>
