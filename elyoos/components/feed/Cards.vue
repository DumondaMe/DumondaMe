<template>
    <div>
        <div class="feed-cards-container" v-if="!isLoadingFeed">
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
        <div v-else class="feed-loading-container text-xs-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
            isLoadingFeed() {
                return this.$store.state.feed.loading
            }
        }
    }
</script>

<style lang="scss">
    .feed-cards-container {
        margin-top: 32px;
        .feed-card {
            margin-bottom: 18px;
            padding-bottom: 24px;
            padding-left: 22px;
            padding-right: 22px;
            max-width: 550px;
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
                    font-size: 16px;
                    line-height: 16px;
                }
                .card-header-link {
                    a {
                        font-size: 16px;
                        line-height: 16px;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                }
                .secondary-text {
                    font-size: 12px;
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

    .feed-loading-container {
        margin-top: 48px;
    }

    .card-footer-feed {
        .footer-icon {
            vertical-align: middle;
            display: inline-block;
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
            .user-icon {
                cursor: pointer;
                height: 40px;
                width: 40px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }
            .user-icon.creator-icon {
                margin-right: 0;
            }
            .action-icon {
                margin-left: 16px;
                margin-top: 2px;
                cursor: pointer;
                color: #009688;
            }
            .action-icon:hover {
                color: $primary-color;
            }
            .badge__badge {
                right: -14px;
            }
        }
        .separator-icon {
            display: inline-block;
            margin-right: 12px;
        }
    }
</style>
