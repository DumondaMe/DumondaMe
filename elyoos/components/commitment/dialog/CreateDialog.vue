<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <website-preview v-if="showPage === 1" @close-dialog="$emit('close-dialog')" @next="showPage = 2">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </website-preview>
            <commitment-content v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')"
                                @finish="finishCommitmentData" :action-button-text="$t('common:button.next')"
                                :init-commitment="$store.getters['createCommitment/getCommitmentCopy']">
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
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Commitment';
    import Topics from '~/components/topic/dialog/Topics';
    import Region from '~/components/region/dialog/Region';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 1, loading: false, showError: false}
        },
        components: {WebsitePreview, CommitmentContent, Topics, Region, Stepper},
        mounted() {
            this.$store.commit('createCommitment/RESET');
        },
        methods: {
            finishCommitmentData({commitment}) {
                this.$store.commit('createCommitment/SET_COMMITMENT', commitment);
                this.showPage = 3;
            },
            finishRegion(regions) {
                this.$store.commit('createCommitment/SET_REGIONS', regions.map(region => region.id));
                this.showPage = 4;
            },
            async finishTopics(topics) {
                try {
                    this.$store.commit('createCommitment/SET_TOPICS', topics.map(topic => topic.id));
                    this.loading = true;
                    let response = await this.$store.dispatch('createCommitment/createCommitment');
                    this.$emit('close-dialog');
                    this.$router.push({
                        name: 'commitment-commitmentId-slug',
                        params: {commitmentId: response.commitmentId, slug: response.slug}
                    });
                }
                catch (e) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
