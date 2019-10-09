<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="500px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <crop-image :initial-image="initialImage" :action-label="$t('common:button.upload')"
                        :upload-running="uploadRunning" :aspect-ratio="ratio"
                        @close="$emit('close-dialog')" @action="uploadImage">
            </crop-image>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import {dataURItoBlob} from '~/utils/files/fileReaderUtil.js';
    import {postWithFile} from '~/utils/files/upload.js';
    import CropImage from './CropImage';

    export default {
        props: ['initialImage', 'api', 'ratio'],
        data() {
            return {dialog: true, uploadRunning: false, showError: false}
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
                            await postWithFile(this.$axios, blob, this.api);
                            this.$emit('update-image', dataUrl);
                        } catch (e) {
                            this.showError = true;
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
