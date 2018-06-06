<template>
    <div class="user-trust-circle-container">
        <h3>{{$t("pages:detailUser.trustCircle.title")}}</h3>
        <div class="general-user-info">
            <span v-if="user.isLoggedInUser">
                {{$t("pages:detailUser.trustCircle.loggedInUserInfo", {count: user.numberOfContacts})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.trustCircle.otherUserInfo", {count: user.numberOfContacts})}}
            </span>
        </div>
        <div class="user-info" v-for="contact in user.contacts">
            <trust-circle-user :contact="contact">
            </trust-circle-user>
        </div>
        <v-btn outline color="primary" @click="loadNextContacts()" v-if="user.contacts.length < user.numberOfContacts">
            {{$t("common:button.showMore")}}
        </v-btn>
    </div>
</template>

<script>
    import TrustCircleUser from './User';

    export default {
        components: {TrustCircleUser},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            user() {
                return this.$store.state.userProfile.user;
            }
        },
        methods: {
            getDate(date) {
                return this.$options.filters.formatDateOnly(date);
            },
            async loadNextContacts() {

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
        h3 {
            font-size: 16px;
            font-weight: 400;
            margin-top: 18px;
            margin-bottom: 12px;
            border-bottom: 1px solid $divider;
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
