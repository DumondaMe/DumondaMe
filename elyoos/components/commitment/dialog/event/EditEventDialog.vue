<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <event-content @close-dialog="$emit('close-dialog')" :loading="loading"
                           @finish="finish" :action-button-text="$t('common:button.change')"
                           :init-event="initEvent">
                <div slot="header">
                    <div id="elyoos-dialog-header"
                         v-html="$t('pages:detailCommitment.events.editDialog.title', {title})">
                    </div>
                    <v-divider></v-divider>
                </div>
            </event-content>
        </v-dialog>
    </v-layout>
</template>

<script>
    import EventContent from './Event';

    export default {
        props: ['initEvent'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {EventContent},
        computed: {
            title() {
                return `<span class="title-element-primary">${this.initEvent.title}</span>`
            }
        },
        methods: {
            async finish({event}) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('commitment/editEvent', event);
                    this.$emit('finish');
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
