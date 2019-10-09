<template>
    <div id="dumonda-me-user-profile-image">
        <div id="dumonda-me-user-image-container">
            <div class="user-image" :class="{'is-harvesting-user': isHarvestingUser}">
                <img :src="user.profileImage"/>
            </div>
            <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                   @change="handleImageChange"/>
            <v-btn id="button-change-image" color="primary" @click="openUploadImage()"
                   v-if="isLoggedInUser">
                {{$t("common:button.uploadImage")}}
            </v-btn>
        </div>
        <upload-cropped-image-dialog v-if="dialogUploadImage"
                                     :api="getAPI" :ratio="getRadio" :initial-image="imageToUpload"
                                     @close-dialog="dialogUploadImage = false"
                                     @update-image="updateProfileImage">
        </upload-cropped-image-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import UploadCroppedImageDialog from '~/components/common/dialog/cropper/UploadCroppedImage.vue';

    export default {
        components: {UploadCroppedImageDialog},
        data() {
            return {dialogUploadImage: false, imageToUpload: null}
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            isHarvestingUser() {
                return this.$store.state.userProfile.user.isHarvestingUser;
            },
            getRadio() {
                if (this.isHarvestingUser) {
                    return 1.3364
                }
                return 1;
            },
            getAPI() {
                if (this.isHarvestingUser) {
                    return 'userHarvesting/profile/image'
                }
                return 'user/profile/image';
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
    #dumonda-me-user-profile-image {
        #dumonda-me-user-image-container {
            .user-image {
                width: 180px;
                height: 180px;
                margin-left: 180px;
                margin-bottom: 12px;
                @media screen and (max-width: $sm) {
                    width: 180px;
                    margin-left: 0;
                    margin-right: 0;
                }
                @media screen and (max-width: $xs) {
                    margin-right: auto;
                    margin-left: auto;
                }

                img {
                    border-radius: 4px;
                    height: 100%;
                    width: 100%;
                    border: 1px solid $divider;
                }
            }

            .user-image.is-harvesting-user {
                width: 360px;
                height: auto;
                margin-left: 0;

                @media screen and (max-width: $sm) {
                    width: 100%;
                }
                @media screen and (max-width: $xs) {
                    width: 360px;
                    margin-right: auto;
                    margin-left: auto;
                }
                @media screen and (max-width: 380px) {
                    width: 100%;
                }
            }

            #button-change-image {
                width: 180px;
                margin-left: 180px;
                margin-right: 0;
                @media screen and (max-width: $sm) {
                    margin-left: auto;
                    margin-right: 0;
                }
                @media screen and (max-width: $xs) {
                    display: block;
                    margin-right: auto;
                    margin-bottom: 28px;
                }
            }
        }
    }
</style>
