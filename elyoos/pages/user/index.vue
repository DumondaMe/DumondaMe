<template>
    <div id="ely-user-logged-in-profile-layout">
        <detail-layout>
            <div slot="content">
                <user-profile></user-profile>
                <commitments></commitments>
                <questions></questions>
                <answers></answers>
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
    import Questions from '~/components/userProfile/question/Questions.vue';
    import Answers from '~/components/userProfile/answers/Answers.vue';
    import Commitments from '~/components/userProfile/commitment/Commitments.vue';
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
            DetailLayout, UserProfile, ProfileImage, GeneralInformation, Questions, Answers, Commitments,
            TrustCircle
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
    }
</style>