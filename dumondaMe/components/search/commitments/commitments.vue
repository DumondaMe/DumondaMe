<template>
    <div id="search-commitments-container">
        <h2 class="commitments-title">{{$t("pages:search.commitments.title")}}</h2>
        <div class="commitments-container ely-card feed-card" v-for="(commitment, index) of commitments"
             :class="{'last-card-element': index === commitments.length - 1}">
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
        <div class="search-commitment-commands">
            <v-btn outline color="primary" v-if="hasMoreCommitments" class="has-more-button" @click="getNextCommitments"
                   :loading="loadingNextCommitments" :disabled="loadingNextCommitments">
                {{$t('common:button.showMore')}}
            </v-btn>
            <v-btn color="primary" @click="openCreateDialog" class="create-commitment-button">
                {{$t('pages:search.commitments.createNewCommitment')}}
            </v-btn>
        </div>
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
            return {showCreateCommitmentDialog: false, showLoginRequired: false, loadingNextCommitments: false}
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
            },
            async getNextCommitments() {
                try {
                    this.loadingNextCommitments = true;
                    await this.$store.dispatch('search/searchNextCommitments');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loadingNextCommitments = false;
                }
            }
        },
        computed: {
            commitments() {
                return this.$store.state.search.commitments;
            },
            hasMoreCommitments() {
                return this.$store.state.search.hasMoreCommitments;
            }
        },
    }
</script>

<style lang="scss">
    #search-commitments-container {
        margin-bottom: 38px;
        @media screen and (max-width: $xs) {
            padding-bottom: 12px;
            margin-bottom: 20px;
            border-bottom: 1px solid $divider;
        }
        .commitments-title {
            font-size: 22px;
            margin-bottom: 18px;
            @media screen and (max-width: $xs) {
                display: none;
            }
        }
        .commitments-container {
            @media screen and (max-width: $xs) {
                padding-bottom: 8px;
            }
            .commitment-content {
                display: flex;
                margin-top: 4px;
                margin-bottom: 8px;
                @media screen and (max-width: $xs) {
                    margin-bottom: 0;
                }
                .commitment-image {
                    cursor: pointer;
                    width: 100px;
                    min-width: 100px;
                    @media screen and (max-width: $xs) {
                        width: 80px;
                        min-width: 80px;
                    }
                    img {
                        width: 100%;
                        border-radius: 6px;
                    }
                }
            }
            .commitment-description {
                margin-left: 18px;
            }
        }
        .commitments-container.last-card-element {
            @media screen and (max-width: $xs) {
                border-bottom: none;
            }
        }
        .search-commitment-commands {
            margin-top: 12px;
            display: flex;
            .has-more-button {
                margin-left: 0;
                margin-right: 16px;
                @media screen and (max-width: $xs) {
                    margin-left: 16px;
                    margin-right: 0;
                }
            }
            .create-commitment-button {
                margin-left: 0;
                @media screen and (max-width: $xs) {
                    margin-left: 16px;
                }
            }
        }
    }
</style>
