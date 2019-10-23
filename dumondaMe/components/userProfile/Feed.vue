<template>
    <div>
        <div class="user-feed-cards-container" v-if="feed.length > 0">
            <div class="feed-card ely-card" v-for="element in feed">
                <commitment-card :answer="element"
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
                                            @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                            @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </commitment-card-footer>
                </commitment-card>
                <book-card :answer="element" v-if="element.type === 'Book'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </book-card>
                <default-card :answer="element" v-if="element.type === 'Default'" :creator="element.user">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </default-card>
                <link-card :answer="element" v-if="element.type === 'Link'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </link-card>
                <youtube-card :answer="element" v-if="element.type === 'Youtube'">
                    <common-card-footer slot="footer" :user="element.user"
                                        :number-of-up-votes="element.numberOfUpVotes" :answer-id="element.answerId"
                                        :created="element.created" :action="element.action"
                                        :is-up-voted-by-user="element.isUpVotedByUser" :is-admin="element.isAdmin"
                                        @up-voted="upVoted" @down-voted="downVoted"
                                        @up-vote-menu-closed="upVoteMenuClosed"
                                        @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                        @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </common-card-footer>
                </youtube-card>
                <question-card :question="element" v-if="element.type === 'Question'">
                    <question-card-footer slot="footer" :user="element.user"
                                          :created="element.created" :number-of-watches="element.numberOfWatches"
                                          :number-of-answers="element.numberOfAnswers" :action="element.action"
                                          :question-id="element.questionId" :question-slug="element.questionSlug"
                                          :is-watched-by-user="element.isWatchedByUser" :is-admin="element.isAdmin"
                                          @add-watch="addQuestionWatch" @remove-watch="removeQuestionWatch"
                                          @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                          @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
                    </question-card-footer>
                </question-card>
                <harvesting-question-card :question="element" v-if="element.type === 'HarvestingQuestion'">
                </harvesting-question-card>
            </div>
        </div>
        <div v-else class="user-feed-no-content-message ely-card">
            <span v-if="isHarvestingUser">
                <div>{{$t('pages:detailUser.feed.noResultsHarvestingUser')}}</div>
                <div class="start-event-description"
                     v-html="$t('pages:detailUser.feed.noResultsHarvestingUserStart', {date: startDate})"></div>
            </span>
            <span v-else>{{$t('pages:detailUser.feed.noResults')}}</span>
        </div>
    </div>
</template>

<script>
    import CommitmentCard from '~/components/feed/card/Commitment'
    import BookCard from '~/components/feed/card/Book'
    import DefaultCard from '~/components/feed/card/Default'
    import LinkCard from '~/components/feed/card/Link'
    import YoutubeCard from '~/components/feed/card/Youtube'
    import QuestionCard from '~/components/feed/card/Question'
    import HarvestingQuestionCard from '~/components/userHarvestingProfile/Question'
    import CommonCardFooter from '~/components/feed/card/footer/CommonAnswer';
    import CommitmentCardFooter from '~/components/feed/card/footer/Commitment';
    import QuestionCardFooter from '~/components/feed/card/footer/Question';

    export default {
        props: ['feed', 'startDate'],
        components: {
            CommitmentCard, BookCard, DefaultCard, LinkCard, YoutubeCard, QuestionCard, HarvestingQuestionCard,
            CommonCardFooter, CommitmentCardFooter, QuestionCardFooter
        },
        computed: {
            isHarvestingUser() {
                return this.$store.state.userProfile.user.isHarvestingUser;
            }
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
        @media screen and (max-width: $sm) {
            margin-top: 16px;
        }
    }

    .user-feed-no-content-message {
        @include defaultPaddingCard();
        margin-top: 28px;
        font-size: 18px;
        color: $secondary-text;

        .start-event-description {
            margin-top: 12px;
            b {
                color: $primary-color;
                font-weight: 500;
            }
        }
    }
</style>
