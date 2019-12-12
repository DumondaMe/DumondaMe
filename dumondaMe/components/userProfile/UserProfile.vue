<template>
    <detail-layout class="ely-user-logged-in-profile-layout">
        <div slot="content">
            <div class="user-mobile-content">
                <profile-image></profile-image>
            </div>
            <user-profile-card></user-profile-card>
            <div class="user-mobile-content" v-if="!isHarvestingUser">
                <challenge-status :challenge-status="challengeStatus" v-if="challengeStatus">
                </challenge-status>
                <commitments-of-user v-if="isAdminOfCommitments"></commitments-of-user>
                <trust-circle></trust-circle>
            </div>
            <div v-else class="user-mobile-content">
                <general-information-harvesting-user></general-information-harvesting-user>
                <about-harvesting-user></about-harvesting-user>
            </div>
            <feed :feed="feed" :start-date="startDate"></feed>
        </div>
        <div slot="sidebar">
            <profile-image></profile-image>
            <challenge-status :challenge-status="challengeStatus" v-if="challengeStatus">
            </challenge-status>
            <general-information v-if="!isHarvestingUser"></general-information>
            <div v-else>
                <general-information-harvesting-user></general-information-harvesting-user>
                <about-harvesting-user></about-harvesting-user>
            </div>
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
    import GeneralInformationHarvestingUser from '~/components/userHarvestingProfile/GeneralInformation.vue';
    import AboutHarvestingUser from '~/components/userHarvestingProfile/AboutHarvesting.vue';
    import Feed from '~/components/userProfile/Feed.vue';
    import TrustCircle from '~/components/userProfile/trustCircle/UserTrustCircle.vue';
    import ChallengeStatus from '~/components/notification/info/ChallengeStatus';
    import format from 'date-fns/format'

    export default {
        components: {
            DetailLayout, UserProfileCard, ProfileImage, CommitmentsOfUser, GeneralInformation, Feed, TrustCircle,
            GeneralInformationHarvestingUser, AboutHarvestingUser, ChallengeStatus
        },
        computed: {
            feed() {
                return this.$store.state.userProfile.user.feed
            },
            startDate() {
                return format(this.$store.state.userProfile.user.start * 1000, 'D.MM.YYYY H:mm');
            },
            isHarvestingUser() {
                return this.$store.state.userProfile.user.isHarvestingUser;
            },
            isAdminOfCommitments() {
                return this.$store.state.userProfile.user.adminOfCommitments &&
                    this.$store.state.userProfile.user.adminOfCommitments.length > 0;
            },
            challengeStatus() {
                return this.$store.state.userProfile.user.challengeStatus;
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