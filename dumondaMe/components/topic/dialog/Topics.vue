<template>
    <v-card id="dialog-topic">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text id="dialog-topic-content">
            <div id="topic-description">
                {{description}}
            </div>
            <ely-select :items="topics" :existing-items="existingTopics" :select-multiple="true" :max-items="10"
                        @select-changed="selectChanged">
            </ely-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <div id="number-of-topics" :class="{'max-number-of-topics': selectedTopics.length === 10}">
                <span class="topic-description">{{$t("common:topic", {count: selectedTopics.length})}}</span>
                {{selectedTopics.length}}/10
            </div>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click.native="$emit('finish', selectedTopics)" :loading="loading"
                   :disabled="loading || selectedTopics.length === 0 || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    export default {
        props: ['actionButtonText', 'description', 'loading', 'existingTopics'],
        data() {
            return {topics: [], selectedTopics: [], hasChanged: true}
        },
        async mounted() {
            this.topics = await this.$axios.$get(`/topic`, {params: {language: this.$store.state.i18n.language}});
            if (this.existingTopics) {
                this.selectedTopics = JSON.parse(JSON.stringify(this.existingTopics));
            }
            this.hasChanged = this.checkHasChanged();
        },
        components: {ElySelect},
        methods: {
            checkHasChanged() {
                if (this.existingTopics) {
                    return this.existingTopics.length !== this.selectedTopics.length &&
                        !this.existingTopics.every(existingTopic => this.selectedTopics.includes(existingTopic));
                }
                return true;
            },
            selectChanged(selectedTopics) {
                this.selectedTopics = selectedTopics;
                this.hasChanged = this.checkHasChanged();
            }
        },
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
        #number-of-topics {
            padding-left: 16px;
            font-size: 14px;
            .topic-description {
                @media screen and (max-width: 700px) {
                    display: none;
                }
            }
        }
        .max-number-of-topics {
            color: $error-text;
        }
    }
</style>
