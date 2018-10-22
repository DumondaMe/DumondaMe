<template>
    <div class="user-trust-circle-container ely-card">
        <h3><span class="trust-circle-title">{{$t("pages:detailUser.trustCircle.title")}} </span>
            <span class="filter-icon-container">
            <v-icon class="filter-icon filter-icon-left" :class="{'active-filter': showTrustCircle}"
                    @click="showTrustCircle = true">mdi-circle-outline
            </v-icon> |
            <v-icon class="filter-icon filter-icon-right" :class="{'active-filter': !showTrustCircle}"
                    @click="showTrustCircle = false">mdi-google-circles-group
            </v-icon></span>
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
            <trust-circle-user :user="user" @remove-from-trust-circle="removeUserFromTrustCircle"
                               @add-to-trust-circle="addUserToTrustCircle">
            </trust-circle-user>
        </div>
        <v-btn outline color="primary" @click="loadNextPeople()" :loading="loading" :disabled="loading"
               v-if="people.length < numberOfPeople">
            {{$t("common:button.showMore")}}
        </v-btn>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import TrustCircleUser from '~/components/common/user/User';

    export default {
        components: {TrustCircleUser},
        data() {
            return {showTrustCircle: true, loading: false, showError: false}
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
                    } else {
                        await this.$store.dispatch('userProfile/loadNextPeopleTrustUser');
                    }
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            },
            addUserToTrustCircle(userId) {
                this.$store.dispatch('userProfile/addUserToTrustCircle', userId);
            },
            removeUserFromTrustCircle(userId) {
                this.$store.dispatch(`userProfile/removeUserFromTrustCircle`, userId);
            }
        }
    }
</script>

<style lang="scss">
    .user-trust-circle-container {
        margin-top: 24px;
        @media screen and (max-width: $sm) {
            margin-top: 12px;
        }
        h3 {
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
            margin-bottom: 4px;
            display: flex;
            .trust-circle-title {
                margin-right: 8px;
            }
            .filter-icon-container {
                display: inline-block;
                vertical-align: top;
                line-height: 24px;
                font-size: 12px;
                padding-bottom: 2px;
                .filter-icon-left {
                    padding-right: 4px;
                }
                .filter-icon-right {
                    padding-left: 4px;
                }
                .filter-icon.v-icon {
                    padding-top: 4px;
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
            margin-bottom: 18px;
        }

        button {
            margin-left: 0;
        }

    }
    .user-trust-circle-container.ely-card {
        @media screen and (max-width: $sm) {
            padding-left: 16px;
            padding-right: 16px;
        }
    }
</style>
