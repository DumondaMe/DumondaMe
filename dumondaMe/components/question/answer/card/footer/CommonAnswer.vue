<template>
    <div>
        <div class="card-footer-feed card-common-answer-footer">
            <div class="footer-icon common-answer-footer-user-icon">
                <user-menu :menu-title="creatorTitle" :user="creator"
                           @add-trust-circle="(userId) => $emit('add-trust-circle', userId)"
                           @remove-trust-circle="(userId) => $emit('remove-trust-circle', userId)">
                    <div class="user-icon creator-icon" slot="icon">
                        <img :src="creator.userImage">
                    </div>
                </user-menu>
            </div>
            <div class="footer-icon">
                <note-menu :title="answerTitle" :number-of-notes="numberOfNotes" :answer-id="answerId" :notes="notes">
                    <v-tooltip bottom slot="icon">
                        <div slot="activator">
                            <v-icon medium class="action-icon">
                                mdi-note
                            </v-icon>
                            <span class="footer-description number" slot="number">{{numberOfNotes}}</span>
                        </div>
                        <span>{{$t('pages:question.answer.note.tooltip')}}</span>
                    </v-tooltip>
                </note-menu>
            </div>
            <v-spacer></v-spacer>
            <up-vote-button :number-of-up-votes="numberOfUpVotes" :is-up-voted-by-user="isUpVotedByUser"
                            :is-admin="isAdmin" :answer-id="answerId"
                            @up-voted="(answerId) => $emit('up-voted', answerId)"
                            @down-voted="(answerId) => $emit('down-voted', answerId)">
            </up-vote-button>
        </div>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import NoteMenu from './menu/NoteMenu';
    import UpVoteButton from './UpVote';

    export default {
        props: ['creator', 'numberOfNotes', 'numberOfUpVotes', 'isUpVotedByUser', 'isAdmin', 'answerId', 'answerTitle',
            'notes'],
        components: {NoteMenu, UserMenu, UpVoteButton},
        data() {
            return {
                showLoginRequired: false, showNoteDialog: false, upVoteRunning: false, showError: false
            }
        },
        computed: {
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorAnswer.title");
            }
        }
    }
</script>

<style lang="scss">
    .card-footer-feed.card-common-answer-footer {
        .footer-icon.common-answer-footer-user-icon {
            margin-right: 12px;
        }

        .footer-icon {
            .action-icon {
                margin-right: 6px;
            }
        }
    }
</style>