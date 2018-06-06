<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <region @close-dialog="$emit('close-dialog')" @finish="changeRegions"
                    :init-selected-regions="existingRegions" :action-button-text="$t('common:button.change')"
                    :description="$t('pages:commitment.createDialog.regionDescription')" :loading="loading">
                <div slot="header">
                    <div id="elyoos-dialog-header">
                        <div v-html="titleText"></div>
                    </div>
                    <v-divider></v-divider>
                </div>
            </region>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Region from '~/components/region/dialog/Region';

    export default {
        props: ['existingRegions', 'titleText', 'api', 'apiParam'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {Region},
        methods: {
            async changeRegions(regions) {
                try {
                    this.loading = true;
                    await this.$axios.$put(`${this.api}${this.apiParam}`, {regions});
                    this.loading = false;
                    this.$emit('finish', regions);
                }
                catch (e) {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-dialog-header.modify-region-dialog-header {
        padding-left: 24px;
    }
</style>
