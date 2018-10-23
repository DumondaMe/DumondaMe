<template>
    <div id="toolbar-search">
        <div class="search-content">
            <div class="search-input">
                <input type="text" v-model="searchText" placeholder="Hier kann bald gesucht werden">
                <v-icon class="search-icon" @click="search">mdi-magnify</v-icon>
            </div>
            <v-btn flat class="close-search" @click="$emit('close-search')">Abbrechen</v-btn>
        </div>
        <div class="autocomplete-results" v-if="showResults">
            <div class="autocomplete-result">
                Das ist ein Test Resultat
            </div>
            <div class="autocomplete-result">
                Das ist ein Test Resultat
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: [],
        data() {
            return {showResults: false, searchText: ''}
        },
        methods: {
            search() {
                if (this.searchText.length >= 2) {
                    this.showResults = true;
                } else {
                    this.showResults = false;
                }
            }
        },
        watch: {
            searchText(newSearchText) {
                if (newSearchText.length >= 2) {
                    this.showResults = true;
                } else {
                    this.showResults = false;
                }
            }
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
            margin-left: 16px;
            margin-right: 16px;
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
            .autocomplete-result {
                cursor: pointer;
                padding: 7px;
            }
            :hover.autocomplete-result {
                background: #E0F2F1;
            }
        }
    }
</style>
