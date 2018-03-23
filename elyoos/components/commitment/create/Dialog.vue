<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <website-preview v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage = 2">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </website-preview>
            <commitment-content v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @next="showPage = 3">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </commitment-content>
            <topics v-else-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="showPage = 4">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
            <key-terms v-else-if="showPage === 4" @close-dialog="$emit('close-dialog')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </key-terms>
        </v-dialog>
    </v-layout>
</template>

<script>
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Content';
    import KeyTerms from './KeyTerms';
    import Topics from './Topics';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1}
        },
        components: {WebsitePreview, CommitmentContent, KeyTerms, Topics, Stepper},
        mounted() {
            this.$store.commit('createCommitment/RESET');
        }
    }
</script>

<style lang="scss">

</style>
