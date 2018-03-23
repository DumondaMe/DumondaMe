<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <website-preview v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage = 2">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </website-preview>
            <commitment-content v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')"
                                @finish="finishCommitmentData" :action-button-text="$t('common:button.next')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </commitment-content>
            <topics v-else-if="showPage === 3" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                       :action-button-text="$t('pages:commitment.createDialog.createCommitmentButton')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
        </v-dialog>
    </v-layout>
</template>

<script>
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Content';
    import Topics from './Topics';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1}
        },
        components: {WebsitePreview, CommitmentContent, Topics, Stepper},
        mounted() {
            this.$store.commit('createCommitment/RESET');
        },
        methods: {
            finishCommitmentData({commitment, imageData}) {
                this.$store.commit('createCommitment/SET_COMMITMENT', commitment);
                if (imageData) {
                    this.$store.commit('createCommitment/SET_TITLE_IMAGE', imageData);
                }
                this.showPage = 3;
            },
            finishTopics(topics) {
                this.$store.commit('createCommitment/SET_TOPICS', topics);
            }
        }
    }
</script>

<style lang="scss">

</style>
