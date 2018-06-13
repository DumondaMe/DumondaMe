<template>
    <div class="user-trust-circle-container">
        <h3>{{$t("pages:detailUser.trustCircle.title")}}
            <span class="filter-icon-container"> (
            <v-icon class="filter-icon filter-icon-left" :class="{'active-filter': showTrustCircle}"
                    @click="showTrustCircle = true">mdi-circle-outline
            </v-icon> |
            <v-icon class="filter-icon filter-icon-right" :class="{'active-filter': !showTrustCircle}"
                    @click="showTrustCircle = false">mdi-google-circles-group
            </v-icon> )</span>
        </h3>
        <div class="general-user-info" v-if="showTrustCircle">
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.trustCircle.loggedInUserInfo", {count: numberOfPeople})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.trustCircle.otherUserInfo", {count: numberOfPeople})}}
            </span>
        </div>
        <div class="general-user-info" v-else>
            <span v-if="isLoggedInUser">
                {{$t("pages:detailUser.peopleTrustUser.loggedInUserInfo", {count: numberOfPeople})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.peopleTrustUser.otherUserInfo", {count: numberOfPeople, name: userForename})}}
            </span>
        </div>
        <div class="user-info" v-for="user in people">
            <trust-circle-user :user="user">
            </trust-circle-user>
        </div>
        <v-btn outline color="primary" @click="loadNextPeople()" :loading="loading" :disabled="loading"
               v-if="people.length < numberOfPeople">
            {{$t("common:button.showMore")}}
        </v-btn>
    </div>
</template>

<script>
    import TrustCircleUser from './User';

    export default {
        components: {TrustCircleUser},
        data() {
            return {showTrustCircle: true, loading: false}
        },
        computed: {
            numberOfPeople() {
                if (this.showTrustCircle) {
                    return this.$store.state.userProfile.user.numberOfPeopleOfTrust
                }
                return this.$store.state.userProfile.user.numberOfPeopleTrustUser
            },
            people() {
                if (this.showTrustCircle) {
                    return this.$store.state.userProfile.user.peopleOfTrust
                }
                return this.$store.state.userProfile.user.peopleTrustUser
            },
            userForename() {
                return this.$store.state.userProfile.user.forename;
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {
            async loadNextPeople() {
                try {
                    this.loading = true;
                    if (this.showTrustCircle) {
                        await this.$store.dispatch('userProfile/loadNextPeopleOfTrust');
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
    .user-trust-circle-container {
        margin-top: 48px;
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
