<template>
    <div>
        <div class="feed-cards-container" v-if="!isLoadingFeed && feed.length > 0">
            <div class="feed-card ely-card" v-for="element in feed">
                <commitment-card :answer="element"
                                 v-if="element.type === 'Commitment' || element.type === 'CommitmentAnswer'">
                    <commitment-card-footer slot="footer" :user="element.user" :creator="element.creator"
                                            :created="element.created" :action="element.action"
                                            :regions="element.regions" :card-type="element.type">
                    </commitment-card-footer>
                </commitment-card>
                <book-card :answer="element" v-if="element.type === 'Book'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </book-card>
                <text-card :answer="element" v-if="element.type === 'Text'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </text-card>
                <event-card :event="element" v-if="element.type === 'Event'">
                    <event-card-footer slot="footer" :creator="element.commitmentTitle" :creatorId="element.commitmentId"
                                 :creatorSlug="element.commitmentSlug" :location="element.location" :region="element.region"
                                 :start-date="element.startDate" :end-date="element.endDate">
                    </event-card-footer>
                </event-card>
                <link-card :answer="element" v-if="element.type === 'Link'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </link-card>
                <youtube-card :answer="element" v-if="element.type === 'Youtube'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </youtube-card>
                <question-card :question="element" v-if="element.type === 'Question'">
                    <question-card-footer slot="footer" :creator="element.creator" :user="element.user" :created="element.created"
                                 :number-of-answers="element.numberOfAnswers" :action="element.action">
                    </question-card-footer>
                </question-card>
            </div>
        </div>
        <div v-else-if="isLoadingFeed" class="feed-loading-container text-xs-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
        <div v-else-if="feed.length === 0" class="feed-no-content-message">
            {{$t('pages:feeds.filter.noResults')}}
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
    import CommonCardFooter from './card/footer/CommonAnswer';
    import CommitmentCardFooter from './card/footer/Commitment';
    import QuestionCardFooter from './card/footer/Question';
    import EventCardFooter from './card/footer/Event';

    export default {
        props: ['feed'],
        components: {
            CommitmentCard, BookCard, TextCard, EventCard, LinkCard, YoutubeCard, QuestionCard,
            CommonCardFooter, CommitmentCardFooter, QuestionCardFooter, EventCardFooter
        },
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

    .feed-no-content-message {
        margin-top: 28px;
        font-size: 22px;
        font-weight: 300;
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
