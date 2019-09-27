<template>
    <div id="ely-user-profile-layout">
        <detail-layout>
            <div slot="content" id="question-detail">
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
    </div>
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
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`userProfile/getProfileOtherUser`, params.userId);
            } catch (e) {
                if (e && e.request && e.request.res && e.request.res.statusCode) {
                    error({statusCode: e.request.res.statusCode});
                } else if (e.message === 'Network Error') {
                    error({statusCode: 600});
                }
            }
            store.commit('toolbar/SHOW_BACK_BUTTON');
        },
        head() {
            return {
                title: this.$store.state.userProfile.user.forename,
            }
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
    #ely-user-profile-layout {
        padding-top: 18px;

        .user-mobile-content {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }
    }
</style>