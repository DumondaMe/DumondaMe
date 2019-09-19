<template>
    <div id="dumonda-me-user-profile" class="ely-card">
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
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" rounded @click="removeUserFromTrustCircle()" v-on="on"
                               v-if="user.isPersonOfTrustOfLoggedInUser">
                            <v-icon left>mdi-check</v-icon>
                            {{$t("common:trustCircle")}}
                        </v-btn>
                    </template>
                    <span>{{$t('common:removeFromTrustCircle')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-else>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" rounded @click="addUserToTrustCircle()" v-on="on">
                            <v-icon left>mdi-account-plus</v-icon>
                            {{$t("common:trustCircle")}}
                        </v-btn>
                    </template>
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
        position: relative;
        padding-bottom: 32px;
        background-color: #e0f2f1;
        @media screen and (max-width: $xs) {
            padding-bottom: 0;
        }

        #profile-info-container {
            @media screen and (max-width: $xs) {
                padding: 0 16px;
            }

            #user-name {
                text-align: start;
                font-weight: 500;
                font-size: 26px;
                line-height: 42px;
                color: $primary-color;
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
                position: absolute;
                bottom: -18px;
                right: 18px;
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
