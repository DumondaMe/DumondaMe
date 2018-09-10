<template>
    <div class="elyoos-answer-container">
        <div class="elyoos-answer-content">
            <div v-for="answer in answers" itemprop="suggestedAnswer" itemscope class="feed-card ely-card"
                 itemtype="http://schema.org/Answer">
                <text-card v-if="answer.answerType === 'Text'" :answer="answer"
                           @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                           @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </text-card>
                <youtube-card v-else-if="answer.answerType === 'Youtube'" :answer="answer"
                              @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                              @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </youtube-card>
                <link-card v-else-if="answer.answerType === 'Link'" :answer="answer"
                           @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                           @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </link-card>
                <book-card v-else-if="answer.answerType === 'Book'" :answer="answer"
                           @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                           @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </book-card>
                <commitment-card v-else-if="answer.answerType === 'Commitment'" :answer="answer"
                                 @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                 @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                </commitment-card>
            </div>
        </div>
    </div>
</template>

<script>
    import CommitmentCard from './card/Commitment'
    import BookCard from './card/Book'
    import TextCard from './card/Text'
    import LinkCard from './card/Link'
    import YoutubeCard from './card/Youtube'
    import AnswerFooter from './card/footer/CommonAnswer';
    import CommitmentAnswerFooter from './card/footer/CommitmentAnswer';

    export default {
        components: {TextCard, YoutubeCard, LinkCard, BookCard, CommitmentCard, AnswerFooter, CommitmentAnswerFooter},
        computed: {
            answers() {
                return this.$store.state.question.question.answers;
            }
        },
        methods: {
            async addUserToTrustCircle(userId) {
                this.$store.commit('question/ADD_USER_TO_TRUST_CIRCLE', userId);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('question/REMOVE_USER_FROM_TRUST_CIRCLE', userId);
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
