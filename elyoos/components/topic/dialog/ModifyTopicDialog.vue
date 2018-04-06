<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <topics @close-dialog="$emit('close-dialog')" @finish="changeTopics" :existing-topics="existingTopics"
                    :action-button-text="$t('pages:question.modifyTopicDialog.changeButton')"
                    :description="$t('pages:question.createDialog.topicDescription')" :loading="loading">
                <div slot="header">
                    <div id="elyoos-dialog-header" class="modify-topic-dialog-header">
                        {{$t('pages:question.modifyTopicDialog.title', {question})}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </topics>
        </v-dialog>
    </v-layout>
</template>

<script>
    import Topics from '~/components/topic/dialog/Topics';

    export default {
        props: ['existingTopics', 'question'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {Topics},
        methods: {
            async changeTopics(topics) {
                try {
                    this.loading = true;
                    //let response = await this.$store.dispatch('createCommitment/createCommitment');
                    this.loading = false;
                    this.$emit('close-dialog');
                }
                catch (e) {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #elyoos-dialog-header.modify-topic-dialog-header {
        padding-left: 24px;
    }
</style>
