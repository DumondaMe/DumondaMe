<template>
    <div id="elyoos-user-profile">
        <div id="profile-info-container">
            <h1 id="user-name">{{user.forename}} {{user.surname}}</h1>
            <div class="user-status-info in-circle"
                 v-if="isAuthenticated && !isLoggedInUser && user.isPersonOfTrustOfLoggedInUser">
                <v-icon>mdi-account-circle</v-icon>
                {{$t("pages:detailUser.trustCircle.inYourCircle")}}
            </div>
            <div class="user-status-info"
                 v-else-if="isAuthenticated && !isLoggedInUser && !user.isPersonOfTrustOfLoggedInUser">
                <v-icon>mdi-account-circle</v-icon>
                {{$t("pages:detailUser.trustCircle.notInYourCircle")}}
            </div>
            <div class="user-description">{{user.userDescription}}</div>
            <v-btn color="primary" id="button-change-profile-data" v-if="isLoggedInUser"
                   @click="showUploadUserDataDialog = true">
                <v-icon>mdi-account</v-icon>
                {{$t("pages:detailUser.profileData.changeProfileDataButton")}}
            </v-btn>
            <div v-if="isAuthenticated && !isLoggedInUser" id="other-user-commands">
                <v-btn color="primary" outline @click="removeUserFromTrustCircle()" slot="activator"
                       v-if="user.isPersonOfTrustOfLoggedInUser">
                    <v-icon left>mdi-check</v-icon>
                    {{$t("common:trustCircle")}}
                </v-btn>
                <v-btn color="primary" outline @click="addUserToTrustCircle()" slot="activator" v-else>
                    <v-icon left>mdi-account-plus</v-icon>
                    {{$t("common:trustCircle")}}
                </v-btn>
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
    #elyoos-user-profile {
        padding-bottom: 32px;
        #profile-info-container {
            #user-name {
                font-weight: 300;
                font-size: 32px;
                line-height: 28px;
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
                i.icon {
                    margin-right: 12px;
                }
            }
        }
        .user-profile-title {
            margin-top: 12px;
            font-size: 18px;
            font-weight: 400;
        }
    }
</style>
