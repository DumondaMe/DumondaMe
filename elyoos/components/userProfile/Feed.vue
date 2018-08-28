<template>
    <div>
        <div class="user-feed-cards-container" v-if="feed.length > 0">
            <div class="feed-card ely-card" v-for="element in feed">
                <commitment-card :answer="element"
                                 v-if="element.type === 'Commitment' || element.type === 'CommitmentAnswer'">
                    <commitment-card-footer slot="footer" :user="element.user" :creator="element.creator"
                                            :number-of-up-votes="element.numberOfUpVotes"
                                            :number-of-watches="element.numberOfWatches"
                                            :created="element.created" :action="element.action"
                                            :regions="element.regions" :card-type="element.type">
                    </commitment-card-footer>
                </commitment-card>
                <book-card :answer="element" v-if="element.type === 'Book'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </book-card>
                <text-card :answer="element" v-if="element.type === 'Text'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </text-card>
                <link-card :answer="element" v-if="element.type === 'Link'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </link-card>
                <youtube-card :answer="element" v-if="element.type === 'Youtube'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes"
                                        :created="element.created" :action="element.action">
                    </common-card-footer>
                </youtube-card>
                <question-card :question="element" v-if="element.type === 'Question'">
                    <question-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                          :created="element.created" :number-of-watches="element.numberOfWatches"
                                          :number-of-answers="element.numberOfAnswers" :action="element.action">
                    </question-card-footer>
                </question-card>
            </div>
        </div>
        <div v-else class="user-feed-no-content-message">
            {{$t('pages:feeds.filter.noResults')}}
        </div>
    </div>
</template>

<script>
    import CommitmentCard from '~/components/feed/card/Commitment'
    import BookCard from '~/components/feed/card/Book'
    import TextCard from '~/components/feed/card/Text'
    import LinkCard from '~/components/feed/card/Link'
    import YoutubeCard from '~/components/feed/card/Youtube'
    import QuestionCard from '~/components/feed/card/Question'
    import CommonCardFooter from '~/components/feed/card/footer/CommonAnswer';
    import CommitmentCardFooter from '~/components/feed/card/footer/Commitment';
    import QuestionCardFooter from '~/components/feed/card/footer/Question';

    export default {
        props: ['feed'],
        components: {
            CommitmentCard, BookCard, TextCard, LinkCard, YoutubeCard, QuestionCard,
            CommonCardFooter, CommitmentCardFooter, QuestionCardFooter
        }
    }
</script>

<style lang="scss">
    .user-feed-cards-container {
        margin-top: 32px;
    }

    .user-feed-no-content-message {
        margin-top: 28px;
        font-size: 22px;
        font-weight: 300;
    }
</style>
