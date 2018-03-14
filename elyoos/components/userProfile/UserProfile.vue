<template>
    <div id="elyoos-user-profile">
        <div id="elyoos-user-profile-content">
            <div id="elyoos-user-image-container">
                <img :src="user.profileImage"/>
                <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                       @change="handleImageChange"/>
                <v-btn id="button-change-image" color="primary" @click="openUploadImage()"
                       v-if="isLoggedInUser">
                    {{$t("common:button.uploadImage")}}
                </v-btn>
            </div>
            <div id="profile-info-container">
                <h1 id="user-name">{{user.forename}} {{user.surname}}</h1>
                <div class="user-status-info in-circle"
                     v-if="isAuthenticated && !isLoggedInUser && user.isContactOfLoggedInUser">
                    <v-icon>account_circle</v-icon>
                    {{$t("pages:detailUser.trustCircle.inYourCircle")}}
                </div>
                <div class="user-status-info"
                     v-else-if="isAuthenticated && !isLoggedInUser && !user.isContactOfLoggedInUser">
                    <v-icon>account_circle</v-icon>
                    {{$t("pages:detailUser.trustCircle.notInYourCircle")}}
                </div>
                <v-btn outline fab small color="primary" id="button-change-profile-data" v-if="isLoggedInUser">
                    <v-icon>edit</v-icon>
                </v-btn>
            </div>
        </div>
        <div v-if="isAuthenticated && !isLoggedInUser" id="other-user-commands">
            <v-btn color="primary" @click="removeUserFromTrustCircle()" slot="activator"
                   v-if="user.isContactOfLoggedInUser">
                {{$t("pages:detailUser.trustCircle.removeFromYourCircle")}}
            </v-btn>
            <v-btn color="primary" @click="addUserToTrustCircle()" slot="activator" v-else>
                {{$t("pages:detailUser.trustCircle.addToYourCircle")}}
            </v-btn>
        </div>
        <upload-cropped-image-dialog v-if="dialogUploadImage" @close-dialog="dialogUploadImage = false"
                                     @update-image="updateProfileImage"
                                     :initial-image="imageToUpload">
        </upload-cropped-image-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import UploadCroppedImageDialog from '~/components/common/dialog/UploadCroppedImage.vue';

    export default {
        components: {UploadCroppedImageDialog},
        data() {
            return {dialogUploadImage: false, imageToUpload: null}
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
            openUploadImage() {
                this.$refs.openFileDialog.value = null; //Needed to open same picture twice
                this.$refs.openFileDialog.click();
            },
            handleImageChange(e) {
                if (e.target.files.length === 1) {
                    this.dialogUploadImage = true;
                    this.imageToUpload = e.target.files[0];
                }
            },
            updateProfileImage(dataUrl) {
                this.dialogUploadImage = false;
                this.$store.commit('userProfile/UPDATE_USER_PROFILE_IMAGE', dataUrl);
            },
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
        padding-bottom: 12px;
        border-bottom: 1px solid $divider;
        #elyoos-user-profile-content {
            display: flex;
            #elyoos-user-image-container {
                width: 142px;
                img {
                    border-radius: 50%;
                    height: 142px;
                    width: 142px;
                }
                #button-change-image {
                    width: 142px;
                    margin-top: 18px;
                    margin-left: 0;
                }
            }
            #profile-info-container {
                flex-grow: 1;
                margin-left: 52px;
                #user-name {
                    font-weight: 300;
                    font-size: 32px;
                    line-height: 28px;
                }
                .user-status-info {
                    margin-top: 6px;
                    color: $secondary-text;
                }
                .user-status-info.in-circle {
                    i {
                        color: $success-text;
                    }
                }
                #button-change-profile-data {
                    margin-top: 12px;
                    margin-left: 0;
                }
            }
        }
        #other-user-commands {
            margin-top: 12px;
            button {
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
