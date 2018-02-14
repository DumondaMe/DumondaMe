<template>
    <v-card id="edit-book-answer-container">
        <v-card-title id="book-answer-title">Answer the question<span class="question-title"> {{question}} </span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="book-answer-content">
            <v-form v-model="valid">
                <div id="book-container">
                    <div v-if="selected.thumbnail" id="book-image">
                        <img :src="selected.thumbnail"/>
                    </div>
                    <div id="book-content" :class="{'image-missing': !selected.thumbnail}">
                        <div class="book-title">{{selected.title}}</div>
                        <div class="book-authors">{{selected.authors}}</div>
                        <v-text-field v-model="selected.description" multi-line rows="5"
                                      :label="$t('common:description')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                        </v-text-field>

                    </div>
                </div>
            </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" flat @click.native="$emit('selected-book', null)" v-show="selected">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" flat @click.native="createBookAnswer()" :loading="uploadRunning"
                   :disabled="!valid || uploadRunning">
                {{$t("common:button.create")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['selected'],
        data() {
            return {valid: false, uploadRunning: false}
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return this.$store.state.question.question.question;
            }
        },
        methods: {
            async createBookAnswer() {
                this.uploadRunning = true;
                try {
                    let answerId = await this.$store.dispatch('question/createBookAnswer',
                        {
                            title: this.selected.title, description: this.selected.description,
                            imageUrl: this.selected.thumbnail, authors: this.selected.authors,
                            googleBookId: this.selected.googleBookId
                        });
                    this.$emit('close-dialog', answerId);
                } catch (error) {
                    this.uploadRunning = false;
                }
            }

        }
    }
</script>

<style lang="scss">
    #edit-book-answer-container {
        #book-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        #book-answer-content {
            #book-container {
                #book-image {
                    @media screen and (min-width: 700px) {
                        float: left;
                    }
                    img {
                        width: 125px;
                        @media screen and (max-width: 699px) {
                            display: block;
                            margin: 0 auto 18px auto;
                        }
                    }
                }
                #book-content {
                    @media screen and (min-width: 700px) {
                        margin-left: 168px;
                    }
                    .book-title {
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .book-authors {
                        font-size: 12px;
                        color: $secondary-text;
                        margin-bottom: 18px;
                    }
                }
                #book-content.image-missing {
                    margin-left: 0;
                }
            }
        }
    }
</style>
