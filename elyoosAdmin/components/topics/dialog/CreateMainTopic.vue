<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-main-topic-dialog-content @close-dialog="$emit('close-dialog')" @finish="createMainTopic"
                                              :init-main-topic="{de: '', en: ''}"
                                              :action-button-text="$t('common:button.create')">
            </create-main-topic-dialog-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import CreateMainTopicDialogContent from './MainTopic';

    export default {
        data() {
            return {dialog: true, running: false, showError: false}
        },
        components: {CreateMainTopicDialogContent},
        methods: {
            async createMainTopic(mainTopic) {
                try {
                    this.running = true;
                    await this.$store.dispatch('topics/createMainTopic', mainTopic);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }
        },
    }
</script>

<style lang="scss">

</style>
