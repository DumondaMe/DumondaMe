<template>
    <div id="ely-user-profile-layout">
        <detail-layout>
            <div slot="content" id="question-detail">
                <user-profile></user-profile>
                <trust-circle></trust-circle>
            </div>
            <div slot="sidebar">
                <profile-image></profile-image>
                <general-information></general-information>
            </div>
        </detail-layout>
    </div>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfile from '~/components/userProfile/UserProfile.vue';
    import ProfileImage from '~/components/userProfile/ProfileImage.vue';
    import GeneralInformation from '~/components/userProfile/GeneralInformation.vue';
    import TrustCircle from '~/components/userProfile/trustCircle/UserTrustCircle.vue';

    export default {
        async fetch({params, store, error}) {
            try {
                await store.dispatch(`userProfile/getProfileOtherUser`, params.userId);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        head() {
            return {
                title: this.$store.state.userProfile.user.forename,
            }
        },
        components: {DetailLayout, UserProfile, ProfileImage, GeneralInformation, TrustCircle}
    }
</script>

<style lang="scss">
    #ely-user-profile-layout {
        #detail-layout {
            #detail-content {
                width: 550px;
            }
            #detail-sidebar {
                margin-left: 650px;
            }
        }
    }
</style>