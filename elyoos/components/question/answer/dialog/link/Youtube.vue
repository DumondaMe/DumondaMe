<template>
    <v-flex xs12>
        <v-layout row wrap>
            <v-flex xs12 md6>
                <iframe width="300" height="200" :src="linkData.linkEmbed" frameBorder="0"></iframe>
            </v-flex>
            <v-flex xs12 md6>
                <v-text-field v-model="linkData.title"
                              :label="$t('common:title')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 100)]" :counter="100">
                </v-text-field>
                <v-text-field v-model="linkData.description" multi-line rows="4"
                              :label="$t('common:description')"
                              :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                       ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                </v-text-field>
            </v-flex>
        </v-layout>
    </v-flex>
</template>

<script>
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initLinkData', 'link'],
        data() {
            return {
                linkData: JSON.parse(JSON.stringify(this.initLinkData))
            }
        },
        mixins: [validationRules],
        mounted() {
            this.$emit('upload-command', this.createYoutubeAnswer)
        },
        methods: {
            async createYoutubeAnswer() {
                let answerId = await this.$store.dispatch('question/createYoutubeAnswer',
                    {link: this.link, title: this.linkData.title, description: this.linkData.description});
                this.$emit('close-dialog', answerId);
            }

        }
    }
</script>

