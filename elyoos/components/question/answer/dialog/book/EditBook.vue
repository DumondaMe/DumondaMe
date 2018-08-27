<template>
    <v-card id="edit-book-answer-container">
        <v-card-title id="book-answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="book-answer-content">
            <v-form v-model="valid">
                <div id="book-container">
                    <div v-if="book.thumbnail" id="book-image">
                        <img :src="book.thumbnail"/>
                    </div>
                    <div id="book-content" :class="{'image-missing': !book.thumbnail}">
                        <div class="book-title">{{book.title}}</div>
                        <div class="book-authors">{{book.authors}}</div>
                        <v-textarea v-model="book.description" rows="5"
                                      :label="$t('pages:question.answerDialog.answerDescriptionBook')"
                                      :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 1000)]" :counter="1000">
                        </v-textarea>

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
            <v-btn color="primary" flat @click.native="$emit('selected-book', null)" v-show="book && !answerId">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click.native="bookAnswer()" :loading="uploadRunning"
                   :disabled="!valid || uploadRunning || !hasChanged">
                {{actionButtonText}}
            </v-btn>
        </v-card-actions>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-card>
</template>

<script>
    import languages from '~/mixins/languages.js';
    import validationRules from '~/mixins/validationRules.js';

    export default {
        props: ['initBook', 'answerId', 'actionButtonText'],
        data() {
            return {
                valid: false, uploadRunning: false, book: JSON.parse(JSON.stringify(this.initBook)),
                showError: false
            }
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            },
            hasChanged() {
                if (this.answerId) {
                    return this.initBook.description !== this.book.description;
                }
                return true;
            }
        },
        methods: {
            async bookAnswer() {
                this.uploadRunning = true;
                try {
                    let answerId;
                    if (this.answerId) {
                        await this.$store.dispatch('question/editBookAnswer', {
                            description: this.book.description, answerId: this.answerId
                        });
                    } else {
                        answerId = await this.$store.dispatch('question/createBookAnswer', {
                            title: this.book.title, description: this.book.description,
                            imageUrl: this.book.thumbnail, authors: this.book.authors,
                            googleBookId: this.book.googleBookId
                        });
                    }
                    this.$emit('close-dialog', answerId);
                } catch (error) {
                    this.showError = true;
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
