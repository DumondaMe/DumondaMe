<template>
    <div class="public-scalability explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Skalierbarkeit</h2>
            <div class="description">
                Wir stehen noch am Anfang, haben aber Grosses vor. Das Ziel ist es, dass diese Plattform Millionen von
                Menschen in der ganzen Welt nutzen können.
            </div>
        </div>
        <div class="public-scalability-statistic">
            <div class="statistic-title">Aktuelle Zahlen:</div>
            <div class="statistic-element">
                <div class="statistic-description">Anzahl Benutzer:</div>
                <v-spacer></v-spacer>
                <div class="statistic-number">{{statistic.numberOfUsers}}</div>
            </div>
            <div class="statistic-element">
                <div class="statistic-description">Anzahl Engagements:</div>
                <v-spacer></v-spacer>
                <div class="statistic-number">{{statistic.numberOfCommitments}}</div>
            </div>
            <div class="statistic-element">
                <div class="statistic-description">Anzahl Fragen:</div>
                <v-spacer></v-spacer>
                <div class="statistic-number">{{statistic.numberOfQuestions}}</div>
            </div>
            <div class="statistic-element">
                <div class="statistic-description">Anzahl Antworten:</div>
                <v-spacer></v-spacer>
                <div class="statistic-number">{{statistic.numberOfAnswers}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {statistic: {}}
        },
        async mounted() {
            this.statistic = await this.$axios.$get('statistic');
        }
    }
</script>

<style lang="scss">
    .public-scalability {
        .public-scalability-statistic {
            min-width: 350px;
            border: 1px solid $divider;
            border-radius: 4px;
            padding: 16px;
            background-color: $background-normal;

            .statistic-title {
                font-weight: 500;
                font-size: 20px;
                text-decoration: underline;
                margin-bottom: 12px;
                color: $secondary-text;
            }

            .statistic-element {
                display: flex;
                font-size: 18px;

                .statistic-description {
                    color: $secondary-text;
                }


                .statistic-number {
                    color: $primary-color;
                    font-weight: 500;
                }
            }
        }
    }
</style>
