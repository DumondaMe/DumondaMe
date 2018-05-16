<template>
    <div id="question-feed-cards-container">
        <div class="question-card ely-card" v-for="element in feed">
            <commitment-card :answer="element" v-if="element.type === 'CommitmentAnswer'"></commitment-card>
            <commitment-card :answer="element" v-if="element.type === 'Commitment'"></commitment-card>
            <book-card :answer="element" v-if="element.type === 'Book'"></book-card>
            <text-card :answer="element" v-if="element.type === 'Text'"></text-card>
            <link-card :answer="element" v-if="element.type === 'Link'"></link-card>
            <youtube-card :answer="element" v-if="element.type === 'Youtube'"></youtube-card>
            <question-card :question="element" v-if="element.type === 'Question'"></question-card>
        </div>
    </div>
</template>

<script>
    import CommitmentCard from './card/Commitment'
    import BookCard from './card/Book'
    import TextCard from './card/Text'
    import LinkCard from './card/Link'
    import YoutubeCard from './card/Youtube'
    import QuestionCard from './card/Question'

    export default {
        components: {CommitmentCard, BookCard, TextCard, LinkCard, YoutubeCard, QuestionCard},
        computed: {
            feed() {
                return this.$store.state.feed.feed
            }
        }
    }
</script>

<style lang="scss">
    #question-feed-cards-container {
        margin-top: 32px;
        .question-card {
            margin-bottom: 18px;
            padding-bottom: 12px;
            h2 {
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
            .title-container {
                margin-bottom: 4px;
                .card-type-icon {
                    margin-right: 8px;
                    font-size: 18px;
                }
                .card-title {
                    cursor: pointer;
                    font-size: 16px;
                    line-height: 18px;
                    vertical-align: middle;
                    color: $primary-color;
                    .link {
                        text-decoration: none;
                    }
                    :hover.link {
                        text-decoration: underline;
                    }
                }
                :hover.card-title {
                    text-decoration: underline;
                }
            }
        }
    }
</style>
