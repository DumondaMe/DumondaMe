<template>
    <div id="search-commitments-container">
        <h2 class="commitments-title">{{$t("pages:search.commitments.title")}}</h2>
        <div class="commitments-container ely-card feed-card" v-for="commitment of commitments">
            <div class="feed-card-header">
                <div>
                    <h2 class="feed-card-title">
                        <span class="answer-type">{{$t('common:feedCard.answerType.commitment')}} </span>
                        <span class="card-header-link">
                            <nuxt-link :to="{name: 'commitment-commitmentId-slug',
                            params: {commitmentId: commitment.commitmentId, slug: commitment.slug}}">
                                {{commitment.title}}
                            </nuxt-link>
                        </span>
                    </h2>
                </div>
                <v-spacer></v-spacer>
                <slot name="feedMenu"></slot>
            </div>
            <div class="commitment-content">
                <div class="commitment-image">
                    <img :src="commitment.imageUrl" @click="$router.push({name: 'commitment-commitmentId-slug',
                            params: {commitmentId: commitment.commitmentId, slug: commitment.slug}})">
                </div>
                <div class="commitment-description">
                    <expand-text :expand-text="commitment.description">
                    </expand-text>
                </div>
            </div>
            <commitment-card-footer :number-of-up-votes="commitment.numberOfUpVotes"
                                    :number-of-watches="commitment.numberOfWatches"
                                    :regions="commitment.regions" :card-type="'Commitment'"
                                    :is-up-voted-by-user="commitment.isUpVotedByUser"
                                    :commitment-id="commitment.commitmentId"
                                    :is-watched-by-user="commitment.isWatchedByUser" :is-admin="commitment.isAdmin"
                                    @add-watch="addCommitmentWatch" @remove-watch="removeCommitmentWatch"
                                    @add-trust-circle="(userId) => addUserToTrustCircle({userId})"
                                    @remove-trust-circle="(userId) => removeUserFromTrustCircle(userId)">
            </commitment-card-footer>
        </div>
        <v-btn color="primary" @click="openCreateDialog">
            {{$t('pages:search.commitments.createNewCommitment')}}
        </v-btn>
        <create-commitment-dialog v-if="showCreateCommitmentDialog" @close-dialog="showCreateCommitmentDialog = false">
        </create-commitment-dialog>
        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import CommitmentCardFooter from '~/components/feed/card/footer/Commitment';
    import ExpandText from '~/components/common/text/Expand.vue'
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';
    import CreateCommitmentDialog from '~/components/commitment/dialog/CreateDialog.vue'

    export default {
        data() {
            return {showCreateCommitmentDialog: false, showLoginRequired: false}
        },
        components: {CommitmentCardFooter, ExpandText, LoginRequiredDialog, CreateCommitmentDialog},
        methods: {
            addCommitmentWatch(commitmentId) {
                this.$store.commit('search/ADD_COMMITMENT_WATCH', commitmentId);
            },
            removeCommitmentWatch(commitmentId) {
                this.$store.commit('search/REMOVE_COMMITMENT_WATCH', commitmentId);
            },
            async addUserToTrustCircle(userId) {
                this.$store.commit('search/ADD_USER_TO_TRUST_CIRCLE', userId);
            },
            async removeUserFromTrustCircle(userId) {
                this.$store.commit('search/REMOVE_USER_FROM_TRUST_CIRCLE', userId);
            },
            openCreateDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.showCreateCommitmentDialog = true
                } else {
                    this.showLoginRequired = true;
                }
            }
        },
        computed: {
            commitments() {
                return this.$store.state.search.commitments;
            }
        },
    }
</script>

<style lang="scss">
    #search-commitments-container {
        margin-bottom: 38px;
        .commitments-title {
            font-size: 22px;
            margin-bottom: 18px;
        }
        .commitments-container {
            .commitment-content {
                display: flex;
                margin-top: 4px;
                margin-bottom: 8px;
                .commitment-image {
                    cursor: pointer;
                    width: 100px;
                    min-width: 100px;
                    img {
                        width: 100%;
                    }
                }
            }
            .commitment-description {
                margin-left: 18px;
            }
        }
        button {
            margin-left: 0;
        }
    }
</style>
