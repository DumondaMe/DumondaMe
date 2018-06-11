<template>
    <div class="profile-image-general-information">
        <div class="user-profile-info">
            <v-icon class="info-icon">mdi-circle-outline</v-icon>
            <div v-if="user.numberOfPeopleOfTrust > 0">
                {{$t('pages:detailUser.profileInfo.trustCircle', {count: user.numberOfPeopleOfTrust})}}
            </div>
            <div v-else>{{$t('pages:detailUser.profileInfo.noTrustCircle')}}</div>
        </div>
        <div class="user-profile-info">
            <v-icon class="info-icon">mdi-google-circles-group</v-icon>
            <div v-if="user.numberOfPeopleTrustUser > 0">
                {{$t('pages:detailUser.profileInfo.trustCircleOtherUser', {count: user.numberOfPeopleTrustUser})}}
            </div>
            <div v-else>{{$t('pages:detailUser.profileInfo.noTrustCircleOtherUser')}}</div>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';

    export default {
        mixins: [language],
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            }
        }
    }
</script>

<style lang="scss">
    .profile-image-general-information {
        margin-top: 12px;
        .user-profile-info {
            display: block;
            font-size: 14px;
            margin-bottom: 6px;
            font-weight: 300;
            width: 100%;
            .info-icon {
                margin-top: 2px;
                float: left;
                margin-right: 12px;
                font-size: 18px;
                color: #90A4AE;
            }
        }
    }
</style>
