<template>
    <div class="user-answers-container">
        <h3>{{$t("pages:detailUser.answer.title")}}
            <span class="filter-icon-container"> (
            <v-icon class="filter-icon filter-icon-left" :class="{'active-filter': showCreatedAnswers}"
                    @click="showCreatedAnswers = true">$vuetify.icons.mdiPencil
            </v-icon> |
            <v-icon class="filter-icon filter-icon-right" :class="{'active-filter': !showCreatedAnswers}"
                    @click="showCreatedAnswers = false">{{$icons.mdiArrowUpBoldCircleOutline}}
            </v-icon> )</span>
        </h3>
        <div class="general-user-info" v-if="showCreatedAnswers">
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.createdAnswers.loggedInUserInfo", {count: numberOfAnswers})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.createdAnswers.otherUserInfo", {count: numberOfAnswers})}}
            </span>
        </div>
        <div class="general-user-info" v-else>
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.upVotedAnswers.loggedInUserInfo", {count: numberOfAnswers})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.upVotedAnswers.otherUserInfo", {count: numberOfAnswers, name: userForename})}}
            </span>
        </div>
        <cards :feed="answers"></cards>
        <v-btn outlined color="primary" @click="loadNextAnswers()" :loading="loading" :disabled="loading"
               v-if="answers.length < numberOfAnswers">
            {{$t("common:button.showMore")}}
        </v-btn>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Cards from '~/components/feed/Cards';
    import {mdiArrowUpBoldCircleOutline} from "@mdi/js";

    export default {
        components: {Cards},
        data() {
            return {
                showCreatedAnswers: !(this.$store.state.userProfile.user.numberOfAnswers === 0 &&
                    this.$store.state.userProfile.user.numberOfUpVotedAnswers > 0), loading: false, showError: false
            }
        },
        created() {
            this.$icons = {mdiArrowUpBoldCircleOutline}
        },
        computed: {
            numberOfAnswers() {
                if (this.showCreatedAnswers) {
                    return this.$store.state.userProfile.user.numberOfAnswers
                }
                return this.$store.state.userProfile.user.numberOfUpVotedAnswers
            },
            answers() {
                if (this.showCreatedAnswers) {
                    return this.$store.state.userProfile.user.answers
                }
                return this.$store.state.userProfile.user.upVotedAnswers
            },
            userForename() {
                return this.$store.state.userProfile.user.forename;
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {
            async loadNextAnswers() {
                try {
                    this.loading = true;
                    if (this.showCreatedAnswers) {
                        await this.$store.dispatch('userProfile/loadNextCreatedAnswers');
                    } else {
                        await this.$store.dispatch('userProfile/loadNextUpVotedAnswers');
                    }
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .user-answers-container {
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
                .filter-icon.v-icon {
                    font-size: 16px;
                    cursor: pointer;
                }
                .active-filter.filter-icon.v-icon {
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
