<template>
    <div id="show-other-answer-types-for-text-answer">
        <div class="other-answer-description" v-if="!answerExist">
            {{$t('pages:question.answerTextDialog.answerOtherTypeDescription')}}
        </div>
        <div id="existing-answers-container" v-else>
            <div v-for="commitment of commitments" v-if="commitment.usedAsAnswer">
                <div class="commitment-preview-container">
                    <div class="commitment-image">
                        <img :src="commitment.imageUrl">
                    </div>
                    <div class="commitment-content">
                        <div v-html="$t('pages:question.answerTextDialog.commitmentAnswerExists',
                                                 {commitment: commitment.title})"></div>
                        <expand-text :expand-text="commitment.description"
                                     class="commitment-description">
                        </expand-text>
                    </div>
                </div>
            </div>
            <div v-for="youtubeLink of youtube" v-if="youtubeLink.usedAsAnswer">
                <div v-html="$t('pages:question.answerTextDialog.youtubeAnswerExists',
                                                 {youtubeLink: youtubeLink.url})"></div>
            </div>
            <div v-for="link of links" v-if="link.usedAsAnswer">
                <div v-html="$t('pages:question.answerTextDialog.linkAnswerExists',
                                                 {link: link.url})"></div>
            </div>
        </div>
        <v-radio-group v-model="selectedType" column id="select-type-container">
            <div v-for="commitment of commitments" v-if="!commitment.usedAsAnswer">
                <v-radio :value="commitment">
                    <div slot="label" class="commitment-preview-container">
                        <div class="commitment-image">
                            <img :src="commitment.imageUrl">
                        </div>
                        <div class="commitment-content">
                            <div v-html="$t('pages:question.answerTextDialog.commitmentAnswerSuggestion',
                                                 {commitment: commitment.title})"></div>
                            <expand-text :expand-text="commitment.description"
                                         class="commitment-description">
                            </expand-text>
                        </div>
                    </div>
                </v-radio>
            </div>
            <div v-for="youtubeLink of youtube" v-if="!youtubeLink.usedAsAnswer">
                <v-radio :value="youtubeLink">
                    <div slot="label"
                         v-html="$t('pages:question.answerTextDialog.youtubeAnswerSuggestion',
                                         {youtubeLink: youtubeLink.url})">
                    </div>
                </v-radio>
            </div>
            <div v-for="link of links" v-if="!link.usedAsAnswer">
                <v-radio :value="link">
                    <div slot="label"
                         v-html="$t('pages:question.answerTextDialog.linkAnswerSuggestion',
                                         {link: link.url})">
                    </div>
                </v-radio>
            </div>
            <v-radio value="textAnswer">
                <div slot="label" v-html="$t('pages:question.answerTextDialog.createTextAnswer')">
                </div>
            </v-radio>
        </v-radio-group>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['commitments', 'youtube', 'links'],
        components: {ExpandText},
        data() {
            return {selectedType: null}
        },
        computed: {
            answerExist() {
                for (let commitment of this.commitments) {
                    if (commitment.usedAsAnswer) {
                        return true;
                    }
                }
                for (let youtube of this.youtube) {
                    if (youtube.usedAsAnswer) {
                        return true;
                    }
                }
                for (let link of this.links) {
                    if (link.usedAsAnswer) {
                        return true;
                    }
                }
                return false;
            }
        },
        watch: {
            selectedType(value) {
                this.$emit('select-changed', value)
            }
        }
    }
</script>

<style lang="scss">
    #show-other-answer-types-for-text-answer {
        margin-top: 12px;
        font-weight: 300;
        .other-answer-description {
            color: $warning;
            font-weight: 400;
            margin-bottom: 18px;
        }
        b {
            font-weight: 500;
            color: $primary-text;
        }
        .main-label {
            color: $primary-color;
        }
        #select-type-container {
            margin-top: 8px;
            .v-radio {
                margin-bottom: 18px;
                font-weight: 400;
            }
        }
        #existing-answers-container {
            margin-bottom: 32px;
            .main-label {
                color: $warning;
            }
        }
        .commitment-preview-container {
            display: flex;
            .commitment-image {
                width: 80px;
                flex: 0 0 80px;
                img {
                    margin-top: 5px;
                    width: 100%;
                    border-radius: 4px;
                }
            }
            .commitment-content {
                margin-left: 12px;
                .commitment-description {
                    margin-top: 4px;
                }
            }
        }
    }
</style>
