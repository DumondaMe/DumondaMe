<template>
    <div class="user-trust-circle-container">
        <h3>{{$t("pages:detailUser.trustCircle.title")}}</h3>
        <div class="general-user-info">
            <span v-if="user.isLoggedInUser">
                {{$t("pages:detailUser.trustCircle.loggedInUserInfo", {count: user.numberOfPeopleOfTrust})}}
            </span>
            <span v-else>
                {{$t("pages:detailUser.trustCircle.otherUserInfo", {count: user.numberOfPeopleOfTrust})}}
            </span>
        </div>
        <div class="user-info" v-for="personOfTrust in user.peopleOfTrust">
            <trust-circle-user :user="personOfTrust">
            </trust-circle-user>
        </div>
        <v-btn outline color="primary" @click="loadNextPeopleOfTrust()"
               v-if="user.peopleOfTrust.length < user.numberOfPeopleOfTrust">
            {{$t("common:button.showMore")}}
        </v-btn>
    </div>
</template>

<script>
    import TrustCircleUser from './User';

    export default {
        components: {TrustCircleUser},
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            }
        },
        methods: {
            async loadNextPeopleOfTrust() {

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
