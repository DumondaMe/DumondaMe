<template>
    <div id="question-filter" class="ely-card">
        <div id="search-question-container">
            <v-text-field name="searchQuestion" id="search-question-text" clearable append-icon="search"
                          :placeholder="$t('pages:feeds.question.yourQuestion')">
            </v-text-field>
        </div>
        <div id="type-filter-container">
            <div id="type-filter-inner-container">
                <div class="filter-element"
                     :class="{'active-filter': activeTypeFilter === null}" @click="setFilter(null)">
                    {{$t('pages:feeds.question.filter.all')}}
                </div>
                <div class="filter-element"
                     :class="{'active-filter': activeTypeFilter === 'question'}" @click="setFilter('question')">
                    {{$t('pages:feeds.question.filter.question')}}
                </div>
                <div class="filter-element"
                     :class="{'active-filter': activeTypeFilter === 'answer'}" @click="setFilter('answer')">
                    {{$t('pages:feeds.question.filter.answer')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            activeTypeFilter() {
                return this.$store.state.feedQuestion.typeFilter;
            }
        },
        data: function () {
            return {
                dialog: false, searchQuestion: true, personalizationActivated: false
            }
        },
        methods: {
            async setFilter(filter) {
                await this.$store.dispatch('feedQuestion/setTypeFilter',
                    {filter, isAuthenticated: this.isAuthenticated});
            }
        }
    }
</script>

<style lang="scss">
    #question-filter {
        #search-question-container {
            padding: 0;
            .input-group {
                padding-top: 0;
                #search-question-text {
                }
            }
        }
        #type-filter-container {
            #type-filter-inner-container {
                display: inline-block;
                .filter-element {
                    cursor: pointer;
                    font-size: 14px;
                    display: inline-block;
                    padding: 0 12px 2px 12px;
                    color: $secondary-text;
                }
                .filter-element.filter-element-first {
                    padding-left: 0;
                }
                .filter-element.active-filter {
                    font-weight: 500;
                    color: $primary-color;
                    border-bottom: 3px solid $primary-color;
                }
            }
        }
    }
</style>
