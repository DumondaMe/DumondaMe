<template>
    <v-card id="search-book-answer-container">
        <v-card-title id="book-answer-title" v-html="$t('pages:question.answerDialog.title', {question})">
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text id="book-answer-content" class="mobile-dialog-content">
            <div class="info-answer">{{$t('pages:question.answerDialog.answerInfoBook')}}</div>
            <v-text-field v-model="title" :loading="searchBookRunning"
                          :label="$t('pages:detailQuestion.searchBook')"
                          :rules="[ruleFieldRequired($t('validation:fieldRequired')),
                                               ruleToManyChars($t('validation:toManyChars'), 200)]">
            </v-text-field>
            <div v-for="book in searchResult.books" class="book-preview-element"
                 @click="$emit('selected-book', book)">
                <div class="book-thumbnail-image">
                    <img :src="book.thumbnail"/>
                </div>
                <div class="book-content">
                    <h3 class="book-title">
                        {{book.title}}
                    </h3>
                    <p class="book-authors">{{book.authors}}</p>
                    <p class="book-description">
                        {{book.description}}
                    </p>
                </div>
            </div>
            <div v-if="searchResult.books && searchResult.books.length < searchResult.numberOfBooks">
                <v-btn outlined color="primary" @click="loadNextBooks()" :disabled="this.searchBookRunning"
                       slot="activator">
                    {{$t("common:button.next")}}
                </v-btn>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary"
                   :disabled="true">
                {{$t("pages:detailQuestion.createAnswerButton")}}
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
    import debounce from 'debounce';

    const GOOGLE_BOOK_API = `https://www.googleapis.com/books/v1/volumes`;

    export default {
        data() {
            return {
                searchBookRunning: false,
                title: '', lastTitleSearch: '', skip: 0,
                searchResult: {}, showError: false
            }
        },
        mixins: [validationRules, languages],
        computed: {
            question() {
                return `<span class="question-title"> ${this.$store.state.question.question.question}</span>`;
            }
        },
        methods: {
            truncateDescription: function (description) {
                let truncated = '';
                if (typeof description === 'string') {
                    let index = description.length;
                    if (index > 1000) {
                        index = 1000;
                    }
                    truncated = description.slice(0, index);
                }
                return truncated;
            },
            getNormalizedResults: function (books) {
                const normalizedBooks = [];
                if (books) {
                    for (let book of books) {
                        if (book.volumeInfo) {
                            let normalizedBook = {
                                title: book.volumeInfo.title,
                                googleBookId: book.id,
                                description: this.truncateDescription(book.volumeInfo.description),
                            };
                            if (Array.isArray(book.volumeInfo.authors)) {
                                normalizedBook.authors = book.volumeInfo.authors.join(', ')
                            }
                            if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                                normalizedBook.thumbnail = book.volumeInfo.imageLinks.thumbnail
                            }
                            normalizedBooks.push(normalizedBook);
                        }
                    }
                }
                return normalizedBooks;
            },
            searchBook: async function (bookTitle, skip) {
                const link = `${GOOGLE_BOOK_API}?q=${bookTitle}&fields=totalItems,items(id,volumeInfo/title,volumeInfo/description,volumeInfo/authors,volumeInfo/imageLinks/thumbnail)&prettyPrint=false&startIndex=${skip}`;
                const result = await this.$axios.get(link);
                return {books: this.getNormalizedResults(result.data.items), numberOfBooks: result.data.totalItems};
            },
            loadNextBooks: async function () {
                try {
                    if (!this.searchBookRunning) {
                        const searchTitle = this.lastTitleSearch;
                        const result = await this.searchBook(this.lastTitleSearch, this.skip + 10);
                        if (searchTitle === this.lastTitleSearch && !this.searchBookRunning) {
                            this.skip = this.skip + 10;
                            this.searchResult.books = this.searchResult.books.concat(result.books);
                        }
                    }
                } catch (err) {
                    this.showError = true;
                }
            }

        },
        watch: {
            title: {
                handler: debounce(async function (newTitle) {
                    if (typeof newTitle === 'string' && newTitle.trim().length > 0)
                        try {
                            this.searchBookRunning = true;
                            this.searchResult = await this.searchBook(newTitle.trim(), 0);
                            this.lastTitleSearch = newTitle;
                            this.skip = 0;
                            this.searchBookRunning = false;
                        } catch (error) {
                            this.searchBookRunning = false;
                        }
                }, 400)
            }
        }
    }
</script>

<style lang="scss">
    #search-book-answer-container {
        #book-answer-title {
            display: block;
            .question-title {
                color: $primary-color;
                white-space: normal;
            }
        }
        .info-answer {
            font-weight: 300;
            margin-bottom: 12px;
        }
        #book-answer-content {
            .book-preview-element {
                padding-bottom: 6px;
                padding-top: 6px;
                display: flex;
                cursor: pointer;
                .book-thumbnail-image {
                    img {
                        margin-top: 6px;
                        max-height: 80px;
                    }
                }
                .book-content {
                    margin-left: 24px;
                    .book-title {
                        font-size: 16px;
                    }
                    .book-authors {
                        font-size: 12px;
                        color: $secondary-text;
                        margin-bottom: 6px;
                    }
                    .book-description {
                        font-size: 14px;
                        font-weight: 300;
                        line-height: 1.4em;
                        max-height: 4.2em;
                        overflow-y: hidden;
                    }
                }
            }
            :hover.book-preview-element {
                background: $hover;
                border-radius: 4px;
            }
        }
    }
</style>
