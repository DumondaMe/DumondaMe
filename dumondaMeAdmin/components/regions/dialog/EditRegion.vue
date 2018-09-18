<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-region-dialog-content @close-dialog="$emit('close-dialog')" @finish="editRegion"
                                          :init-region="this.initRegion" :has-changed="hasChanged"
                                          :init-parent-region-id="initParentRegionId"
                                          :action-button-text="$t('common:button.edit')">
            </create-region-dialog-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import CreateRegionDialogContent from './Region';

    export default {
        props: ['initRegion', 'initParentRegionId'],
        data() {
            return {
                dialog: true, running: false, showError: false,
                regionToCompare: JSON.parse(JSON.stringify(this.initRegion)),
                parentRegionIdCompare: this.initParentRegionId
            }
        },
        components: {CreateRegionDialogContent},
        methods: {
            async editRegion(region) {
                try {
                    this.running = true;
                    await this.$store.dispatch('regions/editRegion', region);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }, hasChanged(region, parentRegionId) {
                return JSON.stringify(region) !== JSON.stringify(this.regionToCompare) ||
                    parentRegionId !== this.parentRegionIdCompare;
            }
        },
    }
</script>

<style lang="scss">

</style>
