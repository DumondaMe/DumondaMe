<template>
    <div class="profile-image-commitment-information ely-card">
        <h3 v-if="isLoggedInUser">{{$t("pages:detailUser.commitment.loggedInUserTitle")}}</h3>
        <h3 v-else>{{$t("pages:detailUser.commitment.otherUserTitle", {userForename})}}</h3>
        <div class="commitment-container">
            <commitment :commitment="commitment" v-for="commitment of commitments"
                        :key="commitment.commitmentId"></commitment>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import Commitment from './Commitment';

    export default {
        mixins: [language],
        computed: {
            commitments() {
                return this.$store.state.userProfile.user.adminOfCommitments
            },
            userForename() {
                return this.$store.state.userProfile.user.forename;
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        components: {
            Commitment
        }
    }
</script>

<style lang="scss">
    .profile-image-commitment-information {
        margin-top: 18px;

        h3 {
            font-size: 16px;
            font-weight: 500;
        }

        .commitment-container {
            margin-top: 18px;

            .commitment-user-is-admin {

            }
        }
    }

    .profile-image-commitment-information.ely-card {
        @include defaultPaddingCard();
        @media screen and (max-width: $sm) {
            padding-left: 16px;
            padding-right: 16px;
        }
    }
</style>
