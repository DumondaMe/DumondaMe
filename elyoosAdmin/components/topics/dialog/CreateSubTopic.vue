<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="600px">
            <create-topic-dialog-content @close-dialog="$emit('close-dialog')" @finish="createSubTopic"
                                         :init-topic="{de: '', en: ''}"
                                         :has-changed="() => {return true}"
                                         :action-button-text="$t('common:button.create')">
                <div slot="parentTopic">
                    <parent-topic-id :init-parent-topic-id="initParentTopicId"
                                     @topic-id-changed="parentTopicIdChanged">
                    </parent-topic-id>
                </div>
            </create-topic-dialog-content>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import CreateTopicDialogContent from './Topic';
    import ParentTopicId from './ParentTopicId';

    export default {
        props: ['initParentTopicId'],
        data() {
            return {dialog: true, running: false, showError: false, parentTopicId: this.initParentTopicId}
        },
        components: {ParentTopicId, CreateTopicDialogContent},
        methods: {
            async createSubTopic(subTopic) {
                try {
                    this.running = true;
                    subTopic.parentTopicId = this.parentTopicId;
                    await this.$store.dispatch('topics/createSubTopic', subTopic);
                    this.$emit('close-dialog');
                } catch (error) {
                    this.showError = true;
                    this.running = false;
                }
            },
            parentTopicIdChanged(topicId) {
                this.parentTopicId = topicId;
            }
        }
    }
</script>

<style lang="scss">

</style>
