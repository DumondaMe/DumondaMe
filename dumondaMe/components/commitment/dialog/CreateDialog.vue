<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <acknowledge v-if="showPage === 0" @close-dialog="$emit('close-dialog')" @next="showPage = 1">
            </acknowledge>
            <region v-else-if="showPage === 1" @close-dialog="$emit('close-dialog')" @finish="finishRegion"
                    :action-button-text="$t('common:button.next')" :select-multiple="true" hide-item="international"
                    :description="$t('pages:commitment.createDialog.regionDescription')">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </region>
            <topics v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                    :action-button-text="$t('common:button.next')"
                    :description="$t('pages:commitment.createDialog.topicDescription')" :loading="loading">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </topics>
            <website-preview v-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="showPage = 4">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </website-preview>
            <commitment-content v-else-if="showPage === 4" @close-dialog="$emit('close-dialog')"
                                @finish="finishCommitmentData"
                                :action-button-text="$t('pages:commitment.createDialog.createCommitmentButton')"
                                :init-commitment="$store.getters['createCommitment/getCommitmentCopy']">
                <stepper slot="header" :selected-step="showPage"></stepper>
            </commitment-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Acknowledge from './Acknowledge';
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Commitment';
    import Topics from '~/components/topic/dialog/Topics';
    import Region from '~/components/region/dialog/Region';
    import Stepper from './Stepper';

    export default {
        data() {
            return {dialog: true, showPage: 0, loading: false, showError: false}
        },
        components: {Acknowledge, WebsitePreview, CommitmentContent, Topics, Region, Stepper},
        mounted() {
            this.$store.commit('createCommitment/RESET');
        },
        methods: {
            async finishCommitmentData({commitment}) {
                try {
                    this.$store.commit('createCommitment/SET_COMMITMENT', commitment);
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
            },
            finishRegion(regions) {
                this.$store.commit('createCommitment/SET_REGIONS', regions.map(region => region.id));
                this.showPage = 2;
            },
            finishTopics(topics) {
                this.$store.commit('createCommitment/SET_TOPICS', topics.map(topic => topic.id));
                this.showPage = 3;
            }
        }
    }
</script>

<style lang="scss">

</style>
