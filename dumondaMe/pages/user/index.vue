<template>
    <div id="ely-user-logged-in-profile-layout">
        <detail-layout>
            <div slot="content">
                <div class="user-mobile-content">
                    <profile-image></profile-image>
                </div>
                <user-profile></user-profile>
                <div class="user-mobile-content">
                    <trust-circle></trust-circle>
                </div>
                <feed :feed="feed"></feed>
            </div>
            <div slot="sidebar">
                <profile-image></profile-image>
                <general-information></general-information>
                <trust-circle></trust-circle>
            </div>
        </detail-layout>
    </div>
</template>

<script>
    import DetailLayout from '~/components/layouts/Detail.vue';
    import UserProfile from '~/components/userProfile/UserProfile.vue';
    import ProfileImage from '~/components/userProfile/ProfileImage.vue';
    import GeneralInformation from '~/components/userProfile/GeneralInformation.vue';
    import Feed from '~/components/userProfile/Feed.vue';
    import TrustCircle from '~/components/userProfile/trustCircle/UserTrustCircle.vue';

    export default {
        async fetch({store, error}) {
            try {
                await store.dispatch(`userProfile/getProfile`);
            } catch (e) {
                error({statusCode: e.statusCode})
            }
        },
        components: {
            DetailLayout, UserProfile, ProfileImage, GeneralInformation, Feed, TrustCircle
        },
        computed: {
            feed() {
                return this.$store.state.userProfile.user.feed
            }
        }
    }
</script>

<style lang="scss">
    #ely-user-logged-in-profile-layout {
        #detail-layout {
            #detail-content {
                width: 550px;
            }
            #detail-sidebar {
                margin-left: 650px;
            }
        }
        .user-mobile-content {
            @media screen and (min-width: $xs) {
                display: none;
            }
        }
    }
</style>