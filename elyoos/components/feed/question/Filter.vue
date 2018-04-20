<template>
    <div id="question-filter" class="ely-card">
        <!--<div id="personalization-container">
            <div class="activated-personalization personalization" @click="personalizationActivated = true"
                 v-if="!personalizationActivated">
                {{$t("common:button.personalizationActivate")}}
            </div>
            <div class="deactivated-personalization personalization" @click="personalizationActivated = false" v-else>
                {{$t("common:button.personalizationDeactivate")}}
            </div>
        </div>-->
        <div id="search-question-container">
            <v-text-field name="searchQuestion" id="search-question-text" clearable append-icon="search"
                          :placeholder="$t('pages:feeds.question.yourQuestion')">
            </v-text-field>
        </div>
        <div id="type-filter-container">
            <div id="type-filter-inner-container">
                <div class="filter-element active-filter">
                    Alle
                </div>
                <div class="filter-element">
                    Fragen
                </div>
                <div class="filter-element">
                    Antworten
                </div>
                <div class="filter-element">
                    Up Votes
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
            }
        },
        data: function () {
            return {
                dialog: false, searchQuestion: true, personalizationActivated: false
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #question-filter {
        #personalization-container {
            font-size: 14px;
            cursor: pointer;
            .activated-personalization {
                color: $primary-color;
            }
            .deactivated-personalization {
                color: $secondary-text;
            }
            :hover.personalization {
                text-decoration: underline;
            }
        }
        #search-question-container {
            padding: 0;
            .input-group {
                padding-top: 0;
                #search-question-text {
                }
            }
        }
        .personalization-button {
            margin-top: 0;
            margin-left: 0;
        }
        .activated-personalization-button {
            color: #43A047;
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
