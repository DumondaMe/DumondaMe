<template>
    <div class="card-footer-feed card-commitment-answer-footer">
        <div class="footer-icon common-answer-footer-user-icon">
            <user-menu :menu-title="creatorTitle" :user-image="creator.userImagePreview"
                       :user-name="creator.name" :user-id="creator.userId" :user-slug="creator.slug"
                       :is-trust-user="creator.isTrustUser" :is-logged-in-user="creator.isLoggedInUser">
                <div class="user-icon creator-icon" slot="icon">
                    <img :src="creator.userImage">
                </div>
            </user-menu>
        </div>
        <div class="footer-icon">
            <v-tooltip bottom>
                <div slot="activator">
                    <v-icon medium class="action-icon">
                        mdi-map-marker
                    </v-icon>
                    <span class="footer-description number">{{regions.length}}</span>
                </div>
                <span>{{$t("common:feedCard.region.tooltipDescription")}}</span>
            </v-tooltip>
        </div>
        <v-spacer></v-spacer>
        <up-vote-button :number-of-up-votes="numberOfUpVotes" :has-voted="hasVoted"
                        :is-admin="isAdmin" :answer-id="answerId">
        </up-vote-button>
    </div>
</template>

<script>
    import UserMenu from '~/components/feed/card/footer/menu/User';
    import UpVoteButton from './UpVote';

    export default {
        props: ['creator', 'regions', 'numberOfUpVotes', 'hasVoted', 'isAdmin', 'answerId'],
        components: {UserMenu, UpVoteButton},
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