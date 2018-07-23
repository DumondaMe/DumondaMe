<template>
    <div class="feed-cards-container">
        <div class="feed-card ely-card" v-for="element in feed">
            <commitment-card :answer="element" v-if="element.type === 'CommitmentAnswer'"></commitment-card>
            <commitment-card :answer="element" v-if="element.type === 'Commitment'"></commitment-card>
            <book-card :answer="element" v-if="element.type === 'Book'"></book-card>
            <text-card :answer="element" v-if="element.type === 'Text'"></text-card>
            <event-card :event="element" v-if="element.type === 'Event'"></event-card>
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
    import EventCard from './card/Event'
    import LinkCard from './card/Link'
    import YoutubeCard from './card/Youtube'
    import QuestionCard from './card/Question'

    export default {
        props: ['feed'],
        components: {CommitmentCard, BookCard, TextCard, EventCard, LinkCard, YoutubeCard, QuestionCard},
        computed: {

        }
    }
</script>

<style lang="scss">
    .feed-cards-container {
        margin-top: 32px;
        .feed-card {
            margin-bottom: 18px;
            padding-bottom: 12px;
            max-width: 500px;
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
            .feed-card-header {
                margin-bottom: 12px;
                .answer-type {
                    font-weight: 500;
                    font-size: 18px;
                    line-height: 16px;
                }
                .card-header-link {
                    a {
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 16px;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                }
                .secondary-text {
                    font-size: 14px;
                    line-height: 16px;
                    font-weight: 300;
                    color: $secondary-text
                }
            }
            .title-container {
                line-height: 18px;
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
                    a {
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                }
                :hover.card-title {
                    text-decoration: underline;
                }
            }
        }
    }
    .card-footer-feed {
        .footer-icon {
            margin-right: 12px;
            display: inline-block;
            i.icon {
                font-size: 18px;
            }
            .footer-text {
                margin-left: 4px;
                font-size: 12px;
                font-weight: 400;
                color: $secondary-text;
                .footer-link {
                    cursor: pointer;
                }
                :hover.footer-link {
                    text-decoration: underline;
                }
            }
            .action-icon {
                color: #009688;
            }
            .action-icon.icon {
                font-size: 24px;
            }
        }
    }
</style>
