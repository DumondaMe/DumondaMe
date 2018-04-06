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
            <region v-else-if="showPage === 3" @close-dialog="$emit('close-dialog')" @finish="finishRegion"
                    :action-button-text="$t('common:button.next')"
                    :description="$t('pages:commitment.createDialog.regionDescription')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </region>
            <topics v-else-if="showPage === 4" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                       :action-button-text="$t('pages:commitment.createDialog.createCommitmentButton')"
                       :description="$t('pages:commitment.createDialog.topicDescription')" :loading="loading">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
        </v-dialog>
    </v-layout>
</template>

<script>
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Content';
    import Topics from '~/components/topic/dialog/Topics';
    import Region from '~/components/region/dialog/Region';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1, loading: false}
        },
        components: {WebsitePreview, CommitmentContent, Topics, Region, Stepper},
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
            finishRegion(regions) {
                this.$store.commit('createCommitment/SET_REGIONS', regions);
                this.showPage = 4;
            },
            async finishTopics(topics) {
                try {
                    this.$store.commit('createCommitment/SET_TOPICS', topics);
                    this.loading = true;
                    let response = await this.$store.dispatch('createCommitment/createCommitment');
                    this.loading = false;
                    this.$emit('close-dialog');
                    this.$router.push({
                        name: 'commitment-answerId-slug',
                        params: {answerId: response.answerId, slug: response.slug}
                    });
                }
                catch (e) {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
