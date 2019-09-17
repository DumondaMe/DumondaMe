<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <commitment @close-dialog="$emit('close-dialog')" @finish="changeCommitment" :loading="loading"
                        :init-commitment="$store.getters['commitment/getCommitment']"
                        :action-button-text="$t('pages:commitment.modifyCommitmentDialog.changeButton')"
                        :is-modify-mode="true">
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        {{$t('pages:commitment.modifyCommitmentDialog.title', getTitle())}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </commitment>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
        <v-snackbar top v-model="showWarning" color="warning" :timeout="0">
            {{$t("pages:commitment.createDialog.warningToSmallImage")}}
            <v-btn dark text @click="showWarning = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Commitment from './Commitment';

    const ERROR_CODE_IMAGE_TO_SMALL = 1;

    export default {
        props: [],
        data() {
            return {dialog: true, loading: false, showError: false, showWarning: false}
        },
        components: {Commitment},
        methods: {
            getTitle() {
                return JSON.parse(JSON.stringify({commitment: this.$store.getters['commitment/getCommitment'].title}));
            },
            async changeCommitment({commitment, imageHasChanged}) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('commitment/updateCommitment',
                        {commitment, commitmentId: this.$route.params.commitmentId, imageHasChanged});
                    this.$emit('finish');
                }
                catch (error) {
                    if (error.response && error.response.data &&
                        error.response.data.errorCode === ERROR_CODE_IMAGE_TO_SMALL) {
                        this.showWarning = true;
                    } else {
                        this.showError = true;
                    }
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
