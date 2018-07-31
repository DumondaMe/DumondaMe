<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-main-topic-dialog-content @close-dialog="$emit('close-dialog')" @finish="editTopic"
                                              :init-topic="this.initTopic" :has-changed="hasChanged"
                                              :init-parent-topic-id="initParentTopicId"
                                              :action-button-text="$t('common:button.edit')">
            </create-main-topic-dialog-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import CreateMainTopicDialogContent from './Topic';

    export default {
        props: ['initTopic', 'initParentTopicId'],
        data() {
            return {
                dialog: true, running: false, showError: false,
                topicToCompare: JSON.parse(JSON.stringify(this.initTopic)),
                parentTopicIdCompare: this.initParentTopicId
            }
        },
        components: {CreateMainTopicDialogContent},
        methods: {
            async editTopic(topic) {
                try {
                    this.running = true;
                    await this.$store.dispatch('topics/editTopic', topic);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            }, hasChanged(topic, parentTopicId) {
                return JSON.stringify(topic) !== JSON.stringify(this.topicToCompare) ||
                    parentTopicId !== this.parentTopicIdCompare;
            }
        },
    }
</script>

<style lang="scss">

</style>
