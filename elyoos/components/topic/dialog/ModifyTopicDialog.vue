<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px">
            <topics @close-dialog="$emit('close-dialog')" @finish="changeTopics" :existing-topics="existingTopics"
                    :action-button-text="$t('pages:question.modifyTopicDialog.changeButton')"
                    :description="$t('pages:question.createDialog.topicDescription')" :loading="loading">
                <div slot="header">
                    <div id="elyoos-dialog-header" class="modify-topic-dialog-header">
                        {{titleText}}
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
        props: ['existingTopics', 'titleText', 'api', 'apiParam'],
        data() {
            return {dialog: true, loading: false}
        },
        components: {Topics},
        methods: {
            async changeTopics(topics) {
                try {
                    this.loading = true;
                    await this.$axios.$put(`${this.api}${this.apiParam}`, {topics});
                    this.loading = false;
                    this.$emit('finish', topics);
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
