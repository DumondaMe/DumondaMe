<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <website-preview v-if="showLinkPreview" @close-dialog="$emit('close-dialog')" @next="next">
            </website-preview>
            <commitment-content v-else @close-dialog="$emit('close-dialog')">
            </commitment-content>
        </v-dialog>
    </v-layout>
</template>

<script>
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Content';

    export default {
        data() {
            return {dialog: true, showLinkPreview: true, preview: {}}
        },
        components: {WebsitePreview, CommitmentContent},
        methods: {
            next(preview) {
                this.showLinkPreview = false;
                this.preview = preview;
            }
        }
    }
</script>

<style lang="scss">

</style>
