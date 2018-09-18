<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-topic-dialog-content @close-dialog="$emit('close-dialog')" @finish="createTopic"
                                         :init-topic="{de: '', en: ''}"
                                         :init-parent-topic-id="initParentTopicId"
                                         :has-changed="() => {return true}"
                                         :action-button-text="$t('common:button.create')">
            </create-topic-dialog-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import CreateTopicDialogContent from './Topic';

    export default {
        props: ['initParentTopicId'],
        data() {
            return {dialog: true, running: false, showError: false}
        },
        components: {CreateTopicDialogContent},
        methods: {
            async createTopic(topic) {
                try {
                    this.running = true;
                    if (topic.parentTopicId) {
                        await this.$store.dispatch('topics/createSubTopic', topic);
                    } else {
                        await this.$store.dispatch('topics/createMainTopic', topic);
                    }
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
