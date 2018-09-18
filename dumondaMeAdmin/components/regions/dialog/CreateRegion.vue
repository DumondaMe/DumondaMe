<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-region-dialog-content @close-dialog="$emit('close-dialog')" @finish="createRegion"
                                          :init-region="{de: '', en: ''}"
                                          :init-parent-region-id="initParentRegionId"
                                          :has-changed="() => {return true}"
                                          :action-button-text="$t('common:button.create')">
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
        props: ['initParentRegionId'],
        data() {
            return {dialog: true, running: false, showError: false}
        },
        components: {CreateRegionDialogContent},
        methods: {
            async createRegion(region) {
                try {
                    this.running = true;
                    await this.$store.dispatch('regions/createRegion', region);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }
        }
    }
</script>

<style lang="scss">

</style>
