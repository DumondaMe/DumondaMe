<template>
    <div class="profile-image-general-information ely-card">
        <div class="user-profile-info" v-if="!isLoggedInUser && isAuthenticated">
            <v-icon class="info-icon" :class="{'in-circle': user.isPersonOfTrustOfLoggedInUser}"
                    size="18">
                $vuetify.icons.mdiAccountCircle
            </v-icon>
            <span v-if="user.isPersonOfTrustOfLoggedInUser">
                {{$t("pages:detailUser.trustCircle.inYourCircle")}}</span>
            <span v-else>
                {{$t("pages:detailUser.trustCircle.notInYourCircle")}}</span>
        </div>
        <div class="user-profile-info">
            <v-icon class="info-icon" size="18">$vuetify.icons.mdiCircleOutline</v-icon>
            <div v-if="user.numberOfPeopleOfTrust > 0">
                {{$t('pages:detailUser.profileInfo.trustCircle', {count: user.numberOfPeopleOfTrust})}}
            </div>
            <div v-else>{{$t('pages:detailUser.profileInfo.noTrustCircle')}}</div>
        </div>
        <div class="user-profile-info">
            <v-icon class="info-icon" size="18">$vuetify.icons.mdiGoogleCirclesGroup</v-icon>
            <div v-if="user.numberOfPeopleTrustUser > 0">
                {{$t('pages:detailUser.profileInfo.trustCircleOtherUser', {count: user.numberOfPeopleTrustUser})}}
            </div>
            <div v-else>{{$t('pages:detailUser.profileInfo.noTrustCircleOtherUser')}}</div>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [language],
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            },
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            ...mapGetters({isLoggedInUser: 'userProfile/isLoggedInUser'})
        }
    }
</script>

<style lang="scss">
    .profile-image-general-information {
        margin-top: 18px;
        @include defaultPaddingCard();

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

            i.v-icon.in-circle {
                color: $success-text;
            }
        }
    }
</style>
