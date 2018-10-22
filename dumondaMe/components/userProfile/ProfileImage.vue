<template>
    <div id="dumonda-me-user-profile-image">
        <div id="dumonda-me-user-image-container">
            <div class="user-image">
                <img :src="user.profileImage"/>
            </div>
            <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                   @change="handleImageChange"/>
            <v-btn id="button-change-image" color="primary" @click="openUploadImage()"
                   v-if="isLoggedInUser">
                {{$t("common:button.uploadImage")}}
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
                @media screen and (max-width: $sm) {
                    margin: 18px 0 18px 16px;
                }
                img {
                    border-radius: 6px;
                    height: 100%;
                    width: 100%;
                }
            }
            #button-change-image {
                width: 180px;
                margin-top: 12px;
                margin-left: 180px;
                margin-right: 0;
                @media screen and (max-width: $sm) {
                    display: block;
                    margin-left: 16px;
                    margin-bottom: 28px;
                }
            }
        }
    }
</style>
