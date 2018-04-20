<template>
    <div id="personalization-question-feed-filter" class="ely-card">
        <div id="personalization-activation-container">
            <div class="activated-personalization personalization" @click="personalizationActivated = false"
                 v-if="personalizationActivated">
                {{$t("common:personalizationActivated")}}
            </div>
            <div class="deactivated-personalization personalization" @click="personalizationActivated = true" v-else>
                {{$t("common:personalizationDeactivated")}}
            </div>
        </div>
        <div id="personalization-filter-container" v-if="personalizationActivated">
            <div>
                <div class="filter-type-description">
                    Filtern nach:
                </div>
                <div class="filter-type filter-type-activated">Trust Circle,</div>
                <div class="filter-type">Beobachtete Fragen,</div>
                <div class="filter-type">Beobachtete Engagements</div>
            </div>
            <div>
                <div class="filter-type-description">
                    Sortiert nach:
                </div>
                <div class="filter-type filter-type-activated">Neuste</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        data: function () {
            return {
                dialog: false, searchQuestion: true, personalizationActivated: false
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    #personalization-question-feed-filter {
        margin-top: 8px;
        #personalization-activation-container {
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
        #personalization-filter-container {
            margin-top: 8px;
            font-size: 14px;
            font-weight: 300;
            .filter-type-description {
                min-width: 90px;
                display: inline-block;
                margin-right: 8px;
            }
            .filter-type {
                display: inline-block;
                margin-right: 4px;
                cursor: pointer;
            }
            :hover.filter-type {
                text-decoration: underline;
            }
            .filter-type-activated {
                font-weight: 400;
                color: $primary-color;
            }
        }
    }
</style>
