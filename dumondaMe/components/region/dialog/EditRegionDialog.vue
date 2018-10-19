<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <region @close-dialog="$emit('close-dialog')" @finish="changeRegions" :select-multiple="selectMultiple"
                    :existing-regions="existingRegions" :action-button-text="$t('common:button.change')"
                    :description="$t('pages:commitment.createDialog.regionDescription')" :loading="loading"
                    :hide-item="hideItem" >
                <div slot="header">
                    <div id="dumonda-me-dialog-header">
                        <div v-html="titleText"></div>
                    </div>
                    <v-divider></v-divider>
                </div>
            </region>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Region from '~/components/region/dialog/Region';

    export default {
        props: ['existingRegions', 'titleText', 'api', 'apiParam', 'selectMultiple', 'hideItem'],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {Region},
        methods: {
            async changeRegions(regions) {
                try {
                    this.loading = true;
                    await this.$axios.$put(`${this.api}${this.apiParam}`, {regions: regions.map(region => region.id)});
                    this.loading = false;
                    this.$emit('finish', regions);
                }
                catch (e) {
                    this.showError = true;
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-dialog-header.modify-region-dialog-header {
        padding-left: 24px;
    }
</style>
