<template>
    <div class="card-footer-feed card-commitment-answer-footer">
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
            <region-menu :regions="regions">
                <div slot="icon">
                    <v-icon medium class="action-icon">
                        mdi-map-marker
                    </v-icon>
                    <span class="footer-description number">{{regions.length}}</span>
                </div>
            </region-menu>
        </div>
        <v-spacer></v-spacer>
        <up-vote-button :number-of-up-votes="numberOfUpVotes" :is-up-voted-by-user="isUpVotedByUser"
                        :is-admin="isAdmin" :answer-id="answerId"
                        @up-voted="(answerId) => $emit('up-voted', answerId)"
                        @down-voted="(answerId) => $emit('down-voted', answerId)">
        </up-vote-button>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import RegionMenu from '~/components/feed/card/footer/menu/Regions'
    import UpVoteButton from './UpVote';

    export default {
        props: ['creator', 'regions', 'numberOfUpVotes', 'isUpVotedByUser', 'isAdmin', 'answerId'],
        components: {UserMenu, RegionMenu, UpVoteButton},
        computed: {
            creatorTitle() {
                if (this.creator && this.creator.isLoggedInUser) {
                    return this.$t("pages:feeds.menu.creatorAnswer.titleIsLoggedInUser");
                }
                return this.$t("pages:feeds.menu.creatorAnswer.title");
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .card-commitment-answer-footer {
        .footer-icon.common-answer-footer-user-icon {
            margin-right: 12px;
        }
    }
</style>