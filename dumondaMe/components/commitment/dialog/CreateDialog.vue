<template>
    <div>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <acknowledge v-if="showPage === 0" @close-dialog="$emit('close-dialog')" @next="showPage = 1">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:commitment.createDialog.acknowledgeTitle')}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </acknowledge>
            <region v-else-if="showPage === 1" @close-dialog="$emit('close-dialog')" @finish="finishRegion"
                    :action-button-text="$t('common:button.next')" :select-multiple="true" hide-item="international"
                    :description="$t('pages:commitment.createDialog.regionDescription')"
                    :existing-regions="getExistingRegions()" :not-check-if-changed="true">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </region>
            <topics v-else-if="showPage === 2" @close-dialog="$emit('close-dialog')" @finish="finishTopics"
                    :action-button-text="$t('common:button.next')"
                    :description="$t('pages:commitment.createDialog.topicDescription')"
                    :existing-topics="getExistingTopics()" :not-check-if-changed="true">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </topics>
            <website-preview v-if="showPage === 3" @close-dialog="$emit('close-dialog')" @next="showPage = 4">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </website-preview>
            <commitment-content v-else-if="showPage === 4" @close-dialog="$emit('close-dialog')"
                                @finish="finishCommitmentData" :loading="loading"
                                :action-button-text="$t('pages:commitment.createDialog.createCommitmentButton')"
                                :init-commitment="$store.getters['createCommitment/getCommitment']">
                <stepper slot="header" :selected-step="showPage" @navigate-to-step="navigateToStep"></stepper>
            </commitment-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
        <v-snackbar top v-model="showWarning" color="warning" :timeout="0">
            {{$t("pages:commitment.createDialog.warningToSmallImage")}}
            <v-btn dark text @click="showWarning = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import Acknowledge from './Acknowledge';
    import WebsitePreview from './WebsitePreview';
    import CommitmentContent from './Commitment';
    import Topics from '~/components/topic/dialog/Topics';
    import Region from '~/components/region/dialog/Region';
    import Stepper from './Stepper';

    const ERROR_CODE_IMAGE_TO_SMALL = 1;

    export default {
        data() {
            return {dialog: true, showPage: 0, loading: false, showError: false, showWarning: false}
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
                } catch (error) {
                    if (error.response && error.response.data &&
                        error.response.data.errorCode === ERROR_CODE_IMAGE_TO_SMALL) {
                        this.showWarning = true;
                    } else {
                        this.showError = true;
                    }
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
            },
            navigateToStep(step) {
                this.showPage = step;
            },
            getExistingRegions() {
                return this.$store.state.createCommitment.commitment.regions.map(function (id) {
                    return {id};
                });
            },
            getExistingTopics() {
                return this.$store.state.createCommitment.commitment.topics.map(function (id) {
                    return {id};
                });
            }
        }
    }
</script>

<style lang="scss">

</style>
