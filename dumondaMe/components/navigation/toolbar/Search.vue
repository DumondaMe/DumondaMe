<template>
    <div id="toolbar-search">
        <div class="search-content">
            <div class="search-input">
                <input type="text" v-model="searchText" placeholder="Hier kann bald gesucht werden"
                       @focus="inputFocus" @blur="closeAutocomplete" @keydown.down="keySelectDown"
                       @keydown.up="keySelectUp" @keydown.enter="selectItemKey">
                <v-icon class="search-icon" @click="search">mdi-magnify</v-icon>
            </div>
            <v-btn flat class="close-search" @click="$emit('close-search')">Abbrechen</v-btn>
        </div>
        <div class="autocomplete-results" v-show="showResults">
            <div class="autocomplete-result" v-for="(result, index) of results"
                 :class="{'selected-autocomplete-result': keySelected === index}"
                 @click="selectItem(index)">
                {{result}}
            </div>
        </div>
        <v-snackbar bottom v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </div>
</template>

<script>
    import debounce from 'debounce';
    import Vue from 'vue';

    export default {
        props: [],
        data() {
            return {
                showResults: false, searchText: '', results: [], keySelected: null, ignoreSearchTextChange: false,
                showError: false
            }
        },
        methods: {
            async autocomplete() {
                if (this.searchText.trim().length >= 2) {
                    const response = await this.$axios.get('search/autocomplete', {params: {query: this.searchText}});
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
                    this.$router.push({name: 'search', query: {query: this.searchText}});
                    if (routeName === 'search') {
                        try {
                            await this.$store.dispatch(`search/search`, this.searchText)
                        } catch (e) {
                            this.showError = true;
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
                    await Vue.nextTick();
                }
                this.search();
            },
            async selectItem(index) {
                this.searchText = this.results[index];
                this.ignoreSearchTextChange = true;
                this.keySelected === null;
                this.results = [];
                await Vue.nextTick();
                this.search();
            }
        },
        watch: {
            searchText: debounce(async function () {
                if (!this.ignoreSearchTextChange) {
                    await this.autocomplete();
                } else {
                    this.ignoreSearchTextChange = false;
                }
            }, 500)
        }
    }
</script>

<style lang="scss">
    #toolbar-search {
        margin-left: 70px;
        margin-right: 30px;
        width: 350px;
        @media screen and (max-width: 750px) {
            margin-left: 30px;
        }
        @media screen and (max-width: $xs) {
            width: 100%;
            margin-left: 12px;
            margin-right: 12px;
        }
        .search-content {
            width: 100%;
            display: flex;
            .search-input {
                position: relative;
                width: 100%;
                input {
                    padding: 0 36px 0 7px;
                    margin-top: 13px;
                    height: 32px;
                    width: 100%;
                    background: #fafafa;
                    border: 1px solid #dbdbdb;
                    border-radius: 2px;
                    font-size: 14px;

                    @media screen and (max-width: $xs) {
                        font-size: 16px;
                        margin-top: 3px;
                        height: 42px;
                    }
                }
                input:focus {
                    outline: none;
                }
                .search-icon {
                    position: absolute;
                    right: 0;
                    top: 17px;
                    padding: 0 6px;
                    @media screen and (max-width: $xs) {
                        top: 13px
                    }
                }
            }
            .close-search {
                width: 100px;
                margin-right: 0;
                margin-left: 0;
                @media screen and (min-width: $xs) {
                    display: none;
                }
            }
        }
        .autocomplete-results {
            font-size: 14px;
            background-color: white;
            z-index: 110;
            border-bottom: 1px solid #dbdbdb;
            border-right: 1px solid #dbdbdb;
            border-left: 1px solid #dbdbdb;
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
            @media screen and (max-width: $xs) {
                margin-right: 116px;
            }
            .autocomplete-result {
                cursor: pointer;
                padding: 7px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            :hover.autocomplete-result {
                background: #E0F2F1;
            }
            .selected-autocomplete-result {
                background: #E0F2F1;
            }
        }
        .autocomplete-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 105;
        }
    }
</style>
