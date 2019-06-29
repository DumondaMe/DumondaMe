<template>
    <div id="public-donation" class="explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">Wir benötigen deine Unterstützung!</h2>
            <div class="description">
                Um die Weiterentwicklung finanzieren zu können, benötigen wir dringend die entsprechenden finanziellen
                Mittel. Mit deiner finanziellen Unterstützung werden die nächsten Schritte erst möglich und du trägst
                aktiv dazu bei, das DumondaMe sein volles Potenzial entfalten kann.
            </div>
            <v-btn color="secondary" class="action-button">
                Spenden
            </v-btn>
        </div>
        <div class="donation-state-container">
            <v-progress-linear
                    color="success lighten-2"
                    height="12"
                    value="60">
            </v-progress-linear>
            <div class="donation-state-info"><span class="state-number actual-state">8'000 CHF </span>von
                <span class="state-number">13'000 CHF</span>
            </div>
            <div class="donation-description">
                Wir benötigen mindestens 13’000 CHF um die laufenden Kosten für das Projekt zu decken. Dazu gehören der
                Aufbau der Community und die Erweiterung der Funktionalität für die Engagements.
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {}
    }
</script>

<style lang="scss">
    #public-donation {
        .donation-state-container {
            min-width: 350px;
            border: 1px solid $divider;
            border-radius: 4px;
            padding: 16px;
            background-color: $background-normal;

            .donation-state-info {
                font-size: 14px;
                color: $secondary-text;

                .state-number {
                    font-weight: 500;
                }

                .actual-state {
                    color: $primary-color;
                }
            }

            .donation-description {
                margin-top: 18px;
                font-size: 16px;
                color: $secondary-text;
                max-width: 320px;
            }
        }
    }
</style>
