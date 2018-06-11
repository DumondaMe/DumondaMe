<template>
    <div id="elyoos-user-profile-image">
        <div id="elyoos-user-image-container">
            <img :src="user.profileImage"/>
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
    #elyoos-user-profile-image {
        #elyoos-user-image-container {
            width: 180px;
            img {
                border-radius: 6px;
                height: 180px;
                width: 180px;
            }
            #button-change-image {
                width: 180px;
                margin-top: 12px;
                margin-left: 0;
            }
        }
    }
</style>
