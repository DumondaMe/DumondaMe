<template>
    <detail-layout class="ely-user-logged-in-profile-layout">
        <div slot="content">
            <div class="user-mobile-content">
                <profile-image></profile-image>
            </div>
            <user-profile></user-profile>
            <div class="user-mobile-content">
                <commitments-of-user v-if="isAdminOfCommitments"></commitments-of-user>
                <trust-circle></trust-circle>
            </div>
            <feed :feed="feed"></feed>
        </div>
        <div slot="sidebar">
            <profile-image></profile-image>
            <general-information></general-information>
            <commitments-of-user v-if="isAdminOfCommitments"></commitments-of-user>
            <trust-circle></trust-circle>
        </div>
    </detail-layout>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfile from '~/components/userProfile/UserProfile.vue';
    import ProfileImage from '~/components/userProfile/ProfileImage.vue';
    import CommitmentsOfUser from '~/components/userProfile/commitment/Commitments.vue';
    import GeneralInformation from '~/components/userProfile/GeneralInformation.vue';
    import Feed from '~/components/userProfile/Feed.vue';
    import TrustCircle from '~/components/userProfile/trustCircle/UserTrustCircle.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`userProfile/getProfile`);
            } catch (e) {
                error({statusCode: e.request.res.statusCode})
            }
            store.commit('toolbar/HIDE_BACK_BUTTON');
        },
        components: {
            DetailLayout, UserProfile, ProfileImage, CommitmentsOfUser, GeneralInformation, Feed, TrustCircle
        },
        computed: {
            feed() {
                return this.$store.state.userProfile.user.feed
            },
            isAdminOfCommitments() {
                return this.$store.state.userProfile.user.adminOfCommitments.length > 0;
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