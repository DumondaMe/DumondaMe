<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px">
            <crop-image :initial-image="initialImage" :action-label="$t('common:button.upload')"
                           :upload-running="uploadRunning"
            @close="$emit('close-dialog')" @action="uploadImage">
            </crop-image>
        </v-dialog>
    </v-layout>
</template>

<script>
    import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
    import {postWithFile} from '~/utils/files/upload.js';
    import CropImage from './CropImage';

    export default {
        props: ['initialImage'],
        data() {
            return {dialog: true, uploadRunning: false}
        },
        components: {CropImage},
        methods: {
            uploadImage(imageCropper) {
                let dataCanvas = imageCropper.getCroppedCanvas();
                if ('toDataURL' in dataCanvas) {
                    this.uploadRunning = true;
                    imageCropper.disable();
                    setTimeout(async () => {
                        try {
                            let dataUrl = dataCanvas.toDataURL();
                            let blob = dataURItoBlob(dataUrl);
                            await postWithFile(this.$axios, blob, 'user/settings/uploadProfileImage');
                            this.$emit('update-image', dataUrl);
                        } catch (e) {

                        } finally {
                            imageCropper.enable();
                            this.uploadRunning = false;
                        }
                    }, 0);
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
