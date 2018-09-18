<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y left max-height="400"
            class="select-topic-container">
        <v-icon slot="activator" :class="{'topic-selected': localSelectedTopics[0].id !== 'allTopics'}">
            mdi-bookmark-outline
        </v-icon>
        <v-card class="ely-menu-topic-container">
            <ely-select :items="topics" :select-multiple="true" :min-items='1' :dis-select-parent-items="true"
                        :single-selected-item-id="'allTopics'" :existing-items="initTopics"
                        @select-changed="changeTopic">
            </ely-select>
        </v-card>
    </v-menu>
</template>

<script>
    import ElySelect from '~/components/common/select/Select';

    export default {
        props: ['initTopics'],
        components: {ElySelect},
        computed: {
            topics() {
                return [{id: 'allTopics', description: this.$t('pages:feeds.filter.topic.all'), subItems: []}]
                    .concat(this.$store.state.topic.topics)
            }
        },
        data: function () {
            return {
                menu: false, localSelectedTopics: JSON.parse(JSON.stringify(this.initTopics))
            }
        },
        methods: {
            changeTopic(selectedTopics) {
                this.localSelectedTopics = selectedTopics;
                this.$emit('topic-changed', this.localSelectedTopics)
            }
        },
        watch: {
            async menu(showMenu) {
                if (showMenu) {
                    this.hasChanged = false;
                    await this.$store.dispatch('topic/getTopics');
                }
            }
        }
    }
</script>

<style lang="scss">
    .select-topic-container {
        i.v-icon.topic-selected {
            color: $primary-color;
        }
    }
</style>
