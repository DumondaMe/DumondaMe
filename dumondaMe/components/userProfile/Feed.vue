<template>
    <div>
        <div class="user-feed-cards-container" v-if="feed.length > 0">
            <div class="feed-card ely-card" v-for="element in feed">
                <commitment-card :answer="element"
                                 v-if="element.type === 'Commitment' || element.type === 'CommitmentAnswer'">
                    <commitment-card-footer slot="footer" :user="element.user" :creator="element.creator"
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
                                            @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                            @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </commitment-card-footer>
                </commitment-card>
                <book-card :answer="element" v-if="element.type === 'Book'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </book-card>
                <text-card :answer="element" v-if="element.type === 'Text'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </text-card>
                <link-card :answer="element" v-if="element.type === 'Link'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </link-card>
                <youtube-card :answer="element" v-if="element.type === 'Youtube'">
                    <common-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </youtube-card>
                <question-card :question="element" v-if="element.type === 'Question'">
                    <question-card-footer slot="footer" :creator="element.creator" :user="element.user"
                                          :created="element.created" :number-of-watches="element.numberOfWatches"
                                          :number-of-answers="element.numberOfAnswers" :action="element.action"
                                          :question-id="element.questionId"
                                          :is-watched-by-user="element.isWatchedByUser"
                                          @add-watch="addQuestionWatch" @remove-watch="removeQuestionWatch"
                                          @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                          @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </question-card-footer>
                </question-card>
            </div>
        </div>
        <div v-else class="user-feed-no-content-message">
            {{$t('pages:detailUser.feed.noResults')}}
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
        },
        methods: {
            upVoted(answerId) {
                this.$store.commit('userProfile/UP_VOTE_ANSWER', answerId);
            },
            downVoted(answerId) {
                this.$store.commit('userProfile/DOWN_VOTE_ANSWER', answerId);
            },
            upVoteMenuClosed({answerId, isUpVotedByUser}) {
                if (!isUpVotedByUser && this.$store.state.userProfile.user.isLoggedInUser) {
                    this.$store.commit('userProfile/REMOVE_ANSWER', answerId);
                }
            },
            addQuestionWatch(questionId) {
                this.$store.commit('userProfile/ADD_QUESTION_WATCH', questionId);
            },
            removeQuestionWatch(questionId) {
                this.$store.commit('userProfile/REMOVE_QUESTION_WATCH', questionId);
            },
            addCommitmentWatch(commitmentId) {
                this.$store.commit('userProfile/ADD_COMMITMENT_WATCH', commitmentId);
            },
            removeCommitmentWatch(commitmentId) {
                this.$store.commit('userProfile/REMOVE_COMMITMENT_WATCH', commitmentId);
            },
            async addUserToTrustCircle(user) {
                this.$store.commit('userProfile/ADD_USER_TO_TRUST_CIRCLE', user);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('userProfile/REMOVE_USER_FROM_TRUST_CIRCLE', userId);
            }
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
