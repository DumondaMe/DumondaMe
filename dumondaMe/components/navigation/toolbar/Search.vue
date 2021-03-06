<template>
    <div id="toolbar-search">
        <div class="search-content">
            <div class="search-input">
                <input type="text" v-model="searchText" :placeholder="$t('pages:toolbar.search')"
                       @focus="inputFocus" @blur="closeAutocomplete" @keydown.down="keySelectDown"
                       @keydown.up="keySelectUp" @keydown.enter="selectItemKey">
                <v-icon class="search-icon" @click="search" size="36">$vuetify.icons.mdiMagnify</v-icon>
            </div>
            <v-btn text class="close-search" @click="$emit('close-search')">Abbrechen</v-btn>
        </div>
        <div class="autocomplete-results" v-show="showResults && this.searchText !== this.lastSearchText">
            <div class="autocomplete-result" v-for="(result, index) of results"
                 :class="{'selected-autocomplete-result': keySelected === index}"
                 @click="selectItem(index)">
                {{result}}
            </div>
        </div>
        <v-snackbar bottom v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark text @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import debounce from 'debounce';

    export default {
        props: [],
        data() {
            let initSearchText = '';
            if (this.$route.name === 'search' && this.$route.query && this.$route.query.query) {
                initSearchText = this.$route.query.query;
            }
            return {
                showResults: false, searchText: initSearchText, results: [], keySelected: null,
                ignoreSearchTextChange: false, showError: false, lastSearchText: initSearchText
            }
        },
        methods: {
            async autocomplete() {
                if (this.searchText.trim().length >= 2) {
                    const response = await this.$axios.get('search/autocomplete',
                        {params: {query: this.searchText}, progress: false});
                    this.results = response.data;
                    this.showResults = true;
                    this.keySelected = null;
                } else {
                    this.showResults = false;
                }
            },
            async search() {
                if (this.searchText.trim().length >= 2) {
                    let routeName = this.$route.name;
                    this.lastSearchText = this.searchText;
                    this.$router.push({name: 'search', query: {query: this.searchText}});
                    if (routeName === 'search') {
                        try {
                            await this.$store.dispatch(`search/search`, this.searchText)
                        } catch (e) {
                            this.showError = true;
                            this.lastSearchText = '';
                        }
                    }
                    this.showResults = false;
                }
            },
            closeAutocomplete() {
                setTimeout(() => this.showResults = false, 200);
            },
            inputFocus() {
                if (this.results.length > 0) {
                    this.showResults = true;
                }
            },
            keySelectDown() {
                if (this.keySelected === null) {
                    this.keySelected = 0;
                } else if (this.keySelected < this.results.length - 1) {
                    this.keySelected++
                }
            },
            keySelectUp() {
                if (this.keySelected > 0) {
                    this.keySelected--;
                } else if (this.keySelected === 0) {
                    this.keySelected = null;
                }
            },
            async selectItemKey() {
                if (this.keySelected !== null) {
                    this.searchText = this.results[this.keySelected];
                    this.ignoreSearchTextChange = true;
                    this.keySelected === null;
                    this.results = [];
                }
                this.search();
            },
            async selectItem(index) {
                this.searchText = this.results[index];
                this.ignoreSearchTextChange = true;
                this.keySelected === null;
                this.results = [];
                this.search();
            }
        },
        watch: {
            searchText: debounce(async function () {
                if (this.searchText !== this.lastSearchText) {
                    await this.autocomplete();
                }
            }, 500),
            $route(to) {
                if (to.name === 'search' && to.query && to.query.query) {
                    this.searchText = to.query.query;
                    this.lastSearchText = to.query.query;
                } else {
                    this.searchText = '';
                    this.lastSearchText = '';
                }
            }
        }
    }
</script>

<style lang="scss">
    #toolbar-search {
        position: relative;
        width: 100%;

        .search-content {
            width: 360px;
            margin-right: auto;
            display: flex;
            @media screen and (max-width: $md - 1px) {
                width: 100%;
            }

            .search-input {
                position: relative;
                width: 100%;

                input {
                    padding: 0 36px 0 7px;
                    margin-top: 10px;
                    height: 28px;
                    width: 100%;
                    background: white;
                    border: 1px solid #dbdbdb;
                    border-radius: 4px;
                    font-size: 14px;
                    color: $secondary-text;

                    @media screen and (max-width: $md - 1px) {
                        font-size: 16px;
                        margin-top: 0;
                        height: 36px;
                    }
                }

                input:focus {
                    outline: none;
                }

                input::placeholder {
                    color: $secondary-text;
                    opacity: 1;
                }

                input:-ms-input-placeholder {
                    color: $secondary-text;;
                }

                input::-ms-input-placeholder {
                    color: $secondary-text;;
                }

                .search-icon {
                    position: absolute;
                    right: 0;
                    top: 6px;
                    padding: 0 6px;
                    color: $secondary-text;
                    @media screen and (max-width: $md - 1px) {
                        top: 7px
                    }
                }
            }

            .close-search {
                width: 100px;
                margin-right: 0;
                margin-left: 12px;
                @media screen and (min-width: $md) {
                    display: none;
                }
            }
        }

        .autocomplete-results {
            position: absolute;
            font-size: 14px;
            background-color: white;
            z-index: 110;
            width: 360px;
            border-bottom: 1px solid #dbdbdb;
            border-right: 1px solid #dbdbdb;
            border-left: 1px solid #dbdbdb;
            border-radius: 4px;
            @media screen and (max-width: $md) {
                width: 100%;
                margin-right: 116px;
                margin-left: 0;
            }

            .autocomplete-result {
                cursor: pointer;
                width: 360px;
                padding: 7px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                color: $secondary-text;
                @media screen and (max-width: $md) {
                    width: 100%;
                    margin-right: 116px;
                }
            }

            :hover.autocomplete-result {
                background: #E0F2F1;
            }

            .selected-autocomplete-result {
                background: #E0F2F1;
            }
        }

    }
</style>
