<template>
    <v-card id="dialog-topic">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-topic-content">
            <div id="topic-description">
                {{description}}
            </div>
            <ely-select :items="topics" @select-changed="selectChanged"></ely-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('finish', selectedTopics)" :loading="loading"
                   :disabled="loading || selectedTopics.length === 0">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    const MAX_NUMBER_OF_TOPICS = 10;

    export default {
        props: ['actionButtonText', 'description', 'loading'],
        data() {
            return {topics: [], selectedTopics: []}
        },
        async mounted() {
            this.topics = await this.$axios.$get(`/topic`, {params: {language: this.$store.state.i18n.language}});
        },
        components: {ElySelect},
        methods: {
            selectChanged(selectedTopics) {
                this.selectedTopics = selectedTopics;
            }
        }
    }
</script>

<style lang="scss">
    #dialog-topic {
        max-width: 650px;
        #dialog-topic-content {
            max-width: 100%;
            #topic-description {
                font-weight: 300;
                max-width: 400px;
                margin: 0 auto 12px auto;
            }
        }
    }
</style>
