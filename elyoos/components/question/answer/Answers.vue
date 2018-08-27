<template>
    <div class="elyoos-answer-container">
        <div class="elyoos-answer-content">
            <div v-for="answer in answers" itemprop="suggestedAnswer" itemscope class="feed-card ely-card"
                 itemtype="http://schema.org/Answer">
                <text-card v-if="answer.answerType === 'Text'" :answer="answer" :hide-question="true">
                </text-card>
                <youtube-card v-else-if="answer.answerType === 'Youtube'" :answer="answer" :hide-question="true">
                </youtube-card>
                <link-card v-else-if="answer.answerType === 'Link'" :answer="answer" :hide-question="true">
                </link-card>
                <book-card v-else-if="answer.answerType === 'Book'" :answer="answer" :hide-question="true">
                </book-card>
                <commitment-card v-else-if="answer.answerType === 'Commitment'" :answer="answer"
                                 :hide-question="true">
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

    export default {
        components: {TextCard, YoutubeCard, LinkCard, BookCard, CommitmentCard},
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
