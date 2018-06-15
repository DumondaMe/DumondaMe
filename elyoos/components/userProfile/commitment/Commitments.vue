<template>
    <div class="user-commitment-container">
        <h3>{{$t("pages:detailUser.commitment.title")}}
            <span class="filter-icon-container"> (
            <v-icon class="filter-icon filter-icon-left" :class="{'active-filter': showAdminCommitments}"
                    @click="showAdminCommitments = true">mdi-pencil
            </v-icon> |
            <v-icon class="filter-icon filter-icon-right" :class="{'active-filter': !showAdminCommitments}"
                    @click="showAdminCommitments = false">mdi-star
            </v-icon> )</span>
        </h3>
        <div class="general-user-info" v-if="showAdminCommitments">
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.adminCommitment.loggedInUserInfo", {count: numberOfCommitments})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.adminCommitment.otherUserInfo", {count: numberOfCommitments})}}
            </span>
        </div>
        <div class="general-user-info" v-else>
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.interestedInTheCommitment.loggedInUserInfo", {count: numberOfCommitments})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.interestedInTheCommitment.otherUserInfo", {count: numberOfCommitments, name: userForename})}}
            </span>
        </div>
        <div class="question-info" v-for="commitment in commitments">
            <commitment :commitment="commitment">
            </commitment>
        </div>
        <v-btn outline color="primary" @click="loadNextCommitments()" :loading="loading" :disabled="loading"
               v-if="commitments.length < numberOfCommitments">
            {{$t("common:button.showMore")}}
        </v-btn>
    </div>
</template>

<script>
    import Commitment from './Commitment';

    export default {
        components: {Commitment},
        data() {
            return {showAdminCommitments: !(this.$store.state.userProfile.user.numberOfCommitments === 0 &&
                    this.$store.state.userProfile.user.numberOfWatchingCommitments > 0), loading: false}
        },
        computed: {
            numberOfCommitments() {
                if (this.showAdminCommitments) {
                    return this.$store.state.userProfile.user.numberOfCommitments
                }
                return this.$store.state.userProfile.user.numberOfWatchingCommitments
            },
            commitments() {
                if (this.showAdminCommitments) {
                    return this.$store.state.userProfile.user.commitments
                }
                return this.$store.state.userProfile.user.watchingCommitments
            },
            userForename() {
                return this.$store.state.userProfile.user.forename;
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {
            async loadNextCommitments() {
                try {
                    this.loading = true;
                    if (this.showAdminCommitments) {
                        await this.$store.dispatch('userProfile/loadNextAdminCommitments');
                    } else {
                        await this.$store.dispatch('userProfile/loadNextWatchedCommitments');
                    }
                } catch (error) {

                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .user-commitment-container {
        margin-bottom: 38px;
        h3 {
            font-size: 16px;
            font-weight: 400;
            margin-top: 18px;
            line-height: 24px;
            margin-bottom: 12px;
            border-bottom: 1px solid $divider;
            .filter-icon-container {
                display: inline-block;
                vertical-align: middle;
                line-height: normal;
                font-size: 12px;
                padding-bottom: 2px;
                .filter-icon-left {
                    padding-right: 4px;
                }
                .filter-icon-right {
                    padding-left: 4px;
                }
                .filter-icon.icon {
                    font-size: 16px;
                    cursor: pointer;
                }
                .active-filter.filter-icon.icon {
                    color: $primary-color;
                }
            }
        }
        .general-user-info {
            font-size: 14px;
            color: $secondary-text;
            margin-bottom: 12px;
        }

        button {
            margin-left: 0;
        }

    }
</style>
