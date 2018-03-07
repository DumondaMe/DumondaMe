<template>
    <div id="elyoos-user-profile">
        <div id="elyoos-user-profile-content">
            <div id="elyoos-user-image-container">
                <img :src="user.profileImage"/>
                <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                       @change="handleImageChange"/>
                <v-btn id="button-change-image" color="primary" @click="openUploadImage()">
                    {{$t("common:button.uploadImage")}}
                </v-btn>
            </div>
            <div id="profile-info-container">
                <div class="user-name">{{user.forename}} {{user.surname}}</div>
                <div class="email-address">{{user.email}}</div>
                <v-btn outline fab color="primary" id="button-change-profile-data">
                    <v-icon>edit</v-icon>
                </v-btn>
            </div>
        </div>
        <upload-cropped-image-dialog v-if="dialogUploadImage" @close-dialog="dialogUploadImage = false"
                                     @update-image="updateProfileImage"
                                     :initial-image="imageToUpload">
        </upload-cropped-image-dialog>
    </div>
</template>

<script>
    import UploadCroppedImageDialog from '~/components/common/dialog/UploadCroppedImage.vue';

    export default {
        components: {UploadCroppedImageDialog},
        data() {
            return {dialogUploadImage: false, imageToUpload: null}
        },
        computed: {
            user() {
                return this.$store.state.userProfile.user;
            }
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
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-user-profile {
        #elyoos-user-profile-content {
            border-bottom: 1px solid $divider;
            #elyoos-user-image-container {
                float: left;
                height: 142px;
                width: 142px;
                img {
                    border-radius: 50%;
                    height: 100%;
                    width: 100%;
                }
                #button-change-image {
                    width: 142px;
                    margin-top: 18px;
                    margin-left: 0;
                }
            }
            #profile-info-container {
                margin-left: 200px;
                min-height: 220px;
                .user-name {
                    font-weight: 300;
                    font-size: 32px;
                    line-height: 28px;
                }
                .email-address {
                    margin-top: 8px;
                    font-size: 14px;
                    color: $secondary-text;
                }
                #button-change-profile-data {
                    height: 36px;
                    width: 36px;
                    margin-top: 8px;
                    margin-left: 0;
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
