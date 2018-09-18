<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <location @close-dialog="$emit('close-dialog')" @finish="finish"
                      :action-button-text="$t('common:button.change')"
                      :loading="loading" :init-location="initEvent.location" :init-region="[initEvent.region]">
                <div slot="header">
                    <div id="dumonda-me-dialog-header"
                         v-html="$t('pages:detailCommitment.events.editLocationDialog.title', {title})">
                    </div>
                    <v-divider></v-divider>
                </div>
            </location>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Location from './Location';

    export default {
        props: ['initEvent'],
        data() {
            return {dialog: true, loading: false, event: JSON.parse(JSON.stringify(this.initEvent)), showError: false}
        },
        components: {Location},
        computed: {
            title() {
                return `<span class="title-element-primary">${this.initEvent.title}</span>`
            }
        },
        methods: {
            async finish({location, region}) {
                try {
                    this.loading = true;
                    this.event.location = location;
                    this.event.region = region;
                    await this.$store.dispatch('commitment/editEvent', this.event);
                    this.$emit('finish');
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

</style>
