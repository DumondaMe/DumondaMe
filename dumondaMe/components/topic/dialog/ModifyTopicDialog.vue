<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="650px" :fullscreen="$vuetify.breakpoint.xsOnly">
            <topics @close-dialog="$emit('close-dialog')" @finish="changeTopics" :existing-topics="existingTopics"
                    :action-button-text="$t('common:button.change')"
                    :description="$t('pages:question.createDialog.topicDescription')" :loading="loading">
                <div slot="header">
                    <div id="dumonda-me-dialog-header" class="modify-topic-dialog-header">
                        {{titleText}}
                    </div>
                    <v-divider></v-divider>
                </div>
            </topics>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    import Topics from '~/components/topic/dialog/Topics';

    export default {
        props: ['existingTopics', 'titleText', 'api', 'apiParam'],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        components: {Topics},
        methods: {
            async changeTopics(topics) {
                try {
                    this.loading = true;
                    await this.$axios.$put(`${this.api}${this.apiParam}`, {topics: topics.map(topic => topic.id)});
                    this.loading = false;
                    this.$emit('finish', topics);
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
    #dumonda-me-dialog-header.modify-topic-dialog-header {
        padding-left: 24px;
    }
</style>
