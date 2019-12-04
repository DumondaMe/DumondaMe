<template>
    <v-card id="welcome-profile-image-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content" v-if="hideCropImageDialog">
            <!--<div id="welcome-dialog-title">{{$t("dialog:welcome.stepProfileImage.title")}}</div>-->
            <div id="profile-image-container">
                <img :src="profileImage" v-if="profileImage"/>
                <input type="file" accept="image/*" style="display: none" ref="openFileDialog"
                       @change="handleImageChange"/>
                <v-btn id="change-image-button" color="primary" @click="openUploadImage">
                    {{$t("common:button.changeImage")}}
                </v-btn>
            </div>
            <div class="profile-image-description">
                <slot name="description">{{$t("dialog:welcome.stepProfileImage.description")}}</slot>
            </div>
        </v-card-text>
        <v-divider v-if="hideCropImageDialog"></v-divider>
        <v-card-actions v-if="hideCropImageDialog">
            <slot name="footer">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="$emit('close-dialog')">
                    {{$t("common:button.later")}}
                </v-btn>
                <v-btn color="primary" @click="$emit('next')" :disabled="loading">
                    {{$t("common:button.next")}}
                </v-btn>
            </slot>
        </v-card-actions>
        <crop-image v-if="!hideCropImageDialog" :initial-image="imageToUpload"
                    :action-label="$t('common:button.changeImage')"
                    :upload-running="uploadImageRunning" :aspect-ratio="1"
                    @close="hideCropImageDialog = true" @action="uploadImage">
        </crop-image>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
    import {postWithFile} from '~/utils/files/upload.js';
    import CropImage from '~/components/common/dialog/cropper/CropImage';

    export default {
        components: {CropImage},
        data() {
            return {
                loading: true, profileImage: null, hideCropImageDialog: true, imageToUpload: null,
                uploadImageRunning: false, showError: false
            }
        },
        async mounted() {
            try {
                let result = await this.$axios.$get('user/profile/image');
                this.profileImage = result.profileImage;
            } catch (error) {

            } finally {
                this.loading = false;
            }
        },
        methods: {
            openUploadImage() {
                this.$refs.openFileDialog.value = null; //Needed to open same picture twice
                this.$refs.openFileDialog.click();
            },
            handleImageChange(e) {
                if (e.target.files.length === 1) {
                    this.hideCropImageDialog = false;
                    this.imageToUpload = e.target.files[0];
                }
            },
            uploadImage(imageCropper) {
                let dataCanvas = imageCropper.getCroppedCanvas();
                if ('toDataURL' in dataCanvas) {
                    this.uploadImageRunning = true;
                    imageCropper.disable();
                    setTimeout(async () => {
                        try {
                            let dataUrl = dataCanvas.toDataURL();
                            let blob = dataURItoBlob(dataUrl);
                            await postWithFile(this.$axios, blob, 'user/profile/image');
                            this.profileImage = dataUrl;
                            this.hideCropImageDialog = true;
                        } catch (e) {
                            this.showError = true;
                        } finally {
                            imageCropper.enable();
                            this.uploadImageRunning = false;
                        }
                    }, 0);
                }
            }
        }
    }
</script>

<style lang="scss">
    #welcome-profile-image-container {
        #profile-image-container {
            width: 148px;
            margin: 12px auto 24px auto;

            img {
                width: 100%;
                min-height: 146px;
                border-radius: 6px;
                border: 1px solid $divider;
            }

            #change-image-button {
                margin: 8px 0 0 0;
                width: 100%;
            }
        }

        .profile-image-description {
            text-align: center;
            font-weight: 300;
            max-width: 550px;
            margin: 0 auto;
        }
    }
</style>
