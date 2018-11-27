<template>
    <v-card id="welcome-topics-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="welcome-dialog-title">{{$t("pages:settings.topicsTitle")}}</div>
            <div class="topics-description">{{$t('pages:settings.topicsDescription')}}</div>
            <ely-select :items="topics" :existing-items="existingTopics" :select-multiple="true" :min-items="1"
                        single-selected-item-id="allTopics" @select-changed="selectChanged"
                        v-if="topics.length > 0">
            </ely-select>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click="next()" :disabled="loading" :loading="loading">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    const ID_ALL_TOPIC = 'allTopics';

    export default {
        props: ['initTopics'],
        data() {
            return {loading: true, showError: false, topics: [], existingTopics: [], selectedTopics: []}
        },
        async mounted() {
            try {
                let topics = await this.$axios.$get(`/topic`, {params: {language: this.$store.state.i18n.language}});
                this.setTopics(topics);
                if (this.existingTopics.length === 0) {
                    this.existingTopics.push({
                        id: ID_ALL_TOPIC, description: this.$t('pages:feeds.filter.topic.all'), subItems: []
                    });
                }
                this.selectedTopics = JSON.parse(JSON.stringify(this.existingTopics));
            } catch (error) {
                this.showError = true;
            } finally {
                this.loading = false;
            }
        },
        components: {ElySelect},
        methods: {
            setTopics(topics) {
                this.topics.push({
                    id: ID_ALL_TOPIC, description: this.$t('pages:feeds.filter.topic.all'), subItems: []
                });
                for (let topic of topics) {
                    let topicToPush = {id: topic.id, description: topic.description, subItems: []};
                    this.topics.push(topicToPush);
                    if (this.initTopics && this.initTopics.findIndex &&
                        this.initTopics.findIndex((initTopic) => {
                            return initTopic.id === topic.id
                        }) > -1) {
                        this.existingTopics.push(topicToPush);
                    }
                }
            },
            selectChanged(selectedTopics) {
                this.selectedTopics = selectedTopics;
            },
            getTopics() {
                if ((this.selectedTopics.length === 1 && this.selectedTopics[0].id === ID_ALL_TOPIC) ||
                    this.selectedTopics.length === this.topics.length - 1) {
                    return null;
                }
                return {topics: this.selectedTopics.map(topic => topic.id)};
            },
            async next() {
                try {
                    this.loading = true;
                    await this.$axios.$put(`/user/settings/topics`, this.getTopics());
                    this.$emit('next');
                } catch (error) {
                    this.showError = true;
                } finally {
                    this.loading = false;
                }
            }
        }

    }
</script>

<style lang="scss">
    #welcome-topics-container {
        #welcome-dialog-title {
            max-width: 400px;
            margin: 0 auto 12px auto;
        }
        .topics-description {
            max-width: 400px;
            margin: 0 auto 12px auto;
            font-weight: 300;
        }
    }
</style>
