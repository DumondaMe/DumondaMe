<template>
    <detail-layout class="ely-user-logged-in-profile-layout">
        <div slot="content">
            <div class="user-mobile-content">
                <profile-image></profile-image>
            </div>
            <user-profile-card></user-profile-card>
            <div class="user-mobile-content" v-if="!isHarvestingUser">
                <commitments-of-user v-if="isAdminOfCommitments"></commitments-of-user>
                <trust-circle></trust-circle>
            </div>
            <feed :feed="feed"></feed>
        </div>
        <div slot="sidebar">
            <profile-image></profile-image>
            <general-information v-if="!isHarvestingUser"></general-information>
            <commitments-of-user v-if="isAdminOfCommitments"></commitments-of-user>
            <trust-circle v-if="!isHarvestingUser"></trust-circle>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfileCard from '~/components/userProfile/UserProfileCard.vue';
    import ProfileImage from '~/components/userProfile/ProfileImage.vue';
    import CommitmentsOfUser from '~/components/userProfile/commitment/Commitments.vue';
    import GeneralInformation from '~/components/userProfile/GeneralInformation.vue';
    import Feed from '~/components/userProfile/Feed.vue';
    import TrustCircle from '~/components/userProfile/trustCircle/UserTrustCircle.vue';

    export default {
        components: {
            DetailLayout, UserProfileCard, ProfileImage, CommitmentsOfUser, GeneralInformation, Feed, TrustCircle
        },
        computed: {
            feed() {
                return this.$store.state.userProfile.user.feed
            },
            isHarvestingUser() {
                return this.$store.state.userProfile.user.isHarvestingUser;
            },
            isAdminOfCommitments() {
                return this.$store.state.userProfile.user.adminOfCommitments &&
                    this.$store.state.userProfile.user.adminOfCommitments.length > 0;
            }
        }
    }
</script>

<style lang="scss">
    .ely-user-logged-in-profile-layout {
        padding-top: 18px;

        .user-mobile-content {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }
    }
</style>