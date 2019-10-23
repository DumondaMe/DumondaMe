<template>
    <div>
        <div class="feed-cards-container" v-show="!isLoadingFeed && feed.length > 0">
            <div class="feed-card ely-card" v-for="element in feed">
                <commitment-card :answer="element" :hide-time="routeName === 'commitment'"
                                 v-if="element.type === 'Commitment' || element.type === 'CommitmentAnswer'">
                    <commitment-card-footer slot="footer" :user="element.user"
                                            :number-of-up-votes="element.numberOfUpVotes"
                                            :number-of-watches="element.numberOfWatches" :answer-id="element.answerId"
                                            :created="element.created" :action="element.action"
                                            :regions="element.regions" :card-type="element.type"
                                            :is-up-voted-by-user="element.isUpVotedByUser"
                                            :commitment-id="element.commitmentId"
                                            :is-watched-by-user="element.isWatchedByUser" :is-admin="element.isAdmin"
                                            @up-voted="upVoted" @down-voted="downVoted"
                                            @add-watch="addCommitmentWatch" @remove-watch="removeCommitmentWatch"
                                            @up-vote-menu-closed="upVoteMenuClosed"
                                            @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                            @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </commitment-card-footer>
                </commitment-card>
                <book-card :answer="element" v-else-if="element.type === 'Book'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </book-card>
                <default-card :answer="element" v-else-if="element.type === 'Default'"
                           :creator="element.creator ? element.creator: element.user">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </default-card>
                <event-card :event="element" v-else-if="element.type === 'Event'">
                    <event-card-footer slot="footer" :commitment="element.commitmentTitle"
                                       :commitment-id="element.commitmentId" :commitment-slug="element.commitmentSlug"
                                       :location="element.location" :region="element.region"
                                       :start-date="element.startDate" :end-date="element.endDate"
                                       :commitment-image="element.commitmentImageUrl"
                                       :commitment-image-preview="element.commitmentImageUrlPreview"
                                       :commitment-description="element.commitmentDescription">
                    </event-card-footer>
                </event-card>
                <link-card :answer="element" v-else-if="element.type === 'Link'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </link-card>
                <youtube-card :answer="element" v-else-if="element.type === 'Youtube'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </youtube-card>
                <question-card :question="element" v-else-if="element.type === 'Question'"
                               :hide-time="hideTimeQuestion">
                    <question-card-footer slot="footer" :user="element.user"
                                          :created="element.created" :number-of-watches="element.numberOfWatches"
                                          :number-of-answers="element.numberOfAnswers" :action="element.action"
                                          :question-id="element.questionId" :question-slug="element.questionSlug"
                                          :is-watched-by-user="element.isWatchedByUser" :is-admin="element.isAdmin"
                                          @add-watch="addQuestionWatch" @remove-watch="removeQuestionWatch"
                                          @add-trust-circle="(userId) => addUserToTrustCircle(userId)"
                                          @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </question-card-footer>
                </question-card>
                <social-media-card v-else-if="element.type === 'socialMediaInfo'"></social-media-card>
            </div>
        </div>
        <div v-show="isLoadingFeed" class="feed-loading-container text-center">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </div>
    </div>
</template>

<script>
    import CommitmentCard from './card/Commitment'
    import BookCard from './card/Book'
    import DefaultCard from './card/Default'
    import EventCard from './card/Event'
    import LinkCard from './card/Link'
    import YoutubeCard from './card/Youtube'
    import QuestionCard from './card/Question'
    import SocialMediaCard from './card/SocialMedia'
    import CommonCardFooter from './card/footer/CommonAnswer';
    import CommitmentCardFooter from './card/footer/Commitment';
    import QuestionCardFooter from './card/footer/Question';
    import EventCardFooter from './card/footer/Event';

    export default {
        props: ['feed', 'routeName'],
        components: {
            CommitmentCard, BookCard, DefaultCard, EventCard, LinkCard, YoutubeCard, QuestionCard, SocialMediaCard,
            CommonCardFooter, CommitmentCardFooter, QuestionCardFooter, EventCardFooter
        },
        computed: {
            isLoadingFeed() {
                return this.$store.state.feed.loading
            },
            hideTimeQuestion() {
                return (this.routeName === 'question' && this.$store.state.auth.userIsAuthenticated) ||
                    this.routeName === 'index' && !this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            upVoted(answerId) {
                this.$store.commit('feed/UP_VOTE_ANSWER', answerId);
            },
            downVoted(answerId) {
                this.$store.commit('feed/DOWN_VOTE_ANSWER', answerId);
            },
            upVoteMenuClosed({answerId, isUpVotedByUser}) {
                if (!isUpVotedByUser) {
                    this.$store.commit('feed/REMOVE_ANSWER', answerId);
                }
            },
            addQuestionWatch(questionId) {
                this.$store.commit('feed/ADD_QUESTION_WATCH', questionId);
            },
            removeQuestionWatch(questionId) {
                this.$store.commit('feed/REMOVE_QUESTION_WATCH', questionId);
            },
            addCommitmentWatch(commitmentId) {
                this.$store.commit('feed/ADD_COMMITMENT_WATCH', commitmentId);
            },
            removeCommitmentWatch(commitmentId) {
                this.$store.commit('feed/REMOVE_COMMITMENT_WATCH', commitmentId);
            },
            async addUserToTrustCircle(userId) {
                this.$store.commit('feed/ADD_USER_TO_TRUST_CIRCLE', userId);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('feed/REMOVE_USER_TO_TRUST_CIRCLE', userId);
            }
        }
    }
</script>

<style lang="scss">
    .feed-cards-container {

        @media screen and (max-width: $xs) {
            .feed-card {
                margin: 4px auto;
            }
        }
    }
</style>
