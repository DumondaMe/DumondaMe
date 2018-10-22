<template>
    <div id="dumonda-me-user-profile">
        <div id="profile-info-container">
            <h1 id="user-name">{{user.forename}} {{user.surname}}</h1>
            <div class="user-description">{{user.userDescription}}</div>
            <v-btn color="primary" id="button-change-profile-data" v-if="isLoggedInUser"
                   @click="showUploadUserDataDialog = true">
                <v-icon left>mdi-account-edit</v-icon>
                {{$t("pages:detailUser.profileData.changeProfileDataButton")}}
            </v-btn>
            <div v-if="isAuthenticated && !isLoggedInUser" id="other-user-commands">
                <v-tooltip bottom v-if="user.isPersonOfTrustOfLoggedInUser">
                    <v-btn color="primary" @click="removeUserFromTrustCircle()" slot="activator"
                           v-if="user.isPersonOfTrustOfLoggedInUser">
                        <v-icon left>mdi-check</v-icon>
                        {{$t("common:trustCircle")}}
                    </v-btn>
                    <span>{{$t('common:removeFromTrustCircle')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-else>
                    <v-btn color="primary" @click="addUserToTrustCircle()" slot="activator">
                        <v-icon left>mdi-account-plus</v-icon>
                        {{$t("common:trustCircle")}}
                    </v-btn>
                    <span>{{$t('common:addToTrustCircle')}}</span>
                </v-tooltip>
            </div>
        </div>
        <upload-user-data-dialog v-if="showUploadUserDataDialog" @close-dialog="showUploadUserDataDialog = false">
        </upload-user-data-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import UploadUserDataDialog from './UploadUserDataDialog.vue';

    export default {
        components: {UploadUserDataDialog},
        data() {
            return {showUploadUserDataDialog: false}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            user() {
                return this.$store.state.userProfile.user;
            },
            ...mapGetters({isLoggedInUser: 'userProfile/isLoggedInUser'})
        },
        methods: {
            addUserToTrustCircle() {
                this.$store.dispatch('userProfile/addUserToTrustCircle', this.user.userId);
            },
            removeUserFromTrustCircle() {
                this.$store.dispatch(`userProfile/removeUserFromTrustCircle`, this.user.userId);
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-user-profile {
        padding-bottom: 32px;
        @media screen and (max-width: $xs) {
            padding-bottom: 0;
        }
        #profile-info-container {
            @media screen and (max-width: $xs) {
                padding: 0 16px;
            }
            #user-name {
                text-align: start;
                font-weight: 400;
                font-size: 30px;
                line-height: 42px;
                @media screen and (max-width: $xs) {
                    font-size: 24px;
                    line-height: 28px;
                }
            }
            .user-status-info {
                margin-top: 6px;
                color: $secondary-text;

            }
            .user-description {
                margin-top: 18px;
                font-size: 16px;
                font-weight: 300;
            }
            .user-status-info.in-circle {
                i {
                    color: $success-text;
                }
            }
            #other-user-commands {
                button {
                    margin-left: 0;
                }
            }
            #button-change-profile-data {
                margin-top: 12px;
                margin-left: 0;
            }
        }
        .user-profile-title {
            margin-top: 12px;
            font-size: 18px;
            font-weight: 400;
        }
    }
</style>
